import AsyncStorage from '@react-native-async-storage/async-storage';
import {STORAGE_KEYS} from '../config';
import type {BreedSnapshot} from '../types/dog';

function isBreedSnapshot(value: unknown): value is BreedSnapshot {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return (
    record.version === 1 &&
    typeof record.syncedAt === 'string' &&
    Array.isArray(record.breeds) &&
    Array.isArray(record.groups)
  );
}

export async function loadSnapshot(): Promise<BreedSnapshot | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.snapshot);
  if (raw == null) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isBreedSnapshot(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function saveSnapshot(snapshot: BreedSnapshot): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.snapshot, JSON.stringify(snapshot));
}

export async function clearSnapshot(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEYS.snapshot);
}
