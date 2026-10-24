import type {Range} from '../types/dog';

export function formatRange(
  range: Range | null | undefined,
  unit: string,
): string {
  if (range == null) {
    return '—';
  }
  if (range.min === range.max) {
    return `${range.min} ${unit}`;
  }
  return `${range.min}–${range.max} ${unit}`;
}

export function formatRelativeTime(iso: string | null): string {
  if (iso == null) {
    return 'Never synced';
  }
  const then = Date.parse(iso);
  if (Number.isNaN(then)) {
    return 'Unknown sync time';
  }
  const diffMs = Date.now() - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return 'Last synced just now';
  }
  if (minutes < 60) {
    return `Last synced ${minutes} min ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `Last synced ${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(hours / 24);
  return `Last synced ${days} day${days === 1 ? '' : 's'} ago`;
}

export function titleCase(value: string): string {
  return value
    .split(/[_\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
