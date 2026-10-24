export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
  options?: {retries?: number; baseDelayMs?: number},
): Promise<T> {
  const retries = options?.retries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 400;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          Accept: 'application/json',
          ...(init?.headers ?? {}),
        },
      });

      if (!response.ok) {
        throw new HttpError(
          response.status,
          `Request failed (${response.status}) for ${url}`,
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      const delay = baseDelayMs * 2 ** attempt;
      await sleep(delay);
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Unknown network error');
}
