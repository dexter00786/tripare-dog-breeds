export const API_BASE_URL =
  'https://dogapi.dog/api/v2' as const;

export const BREEDS_PAGE_SIZE = 48;
export const EXPECTED_BREED_PAGES = 6;
export const EXPECTED_BREED_COUNT = 283;

export const STORAGE_KEYS = {
  snapshot: '@tripare/breeds_snapshot_v1',
} as const;

/** Size bands derived from male_weight.max (kg). */
export const SIZE_BANDS = {
  small: {label: 'Small', maxKg: 10},
  medium: {label: 'Medium', maxKg: 25},
  large: {label: 'Large', maxKg: 45},
  giant: {label: 'Giant', maxKg: Number.POSITIVE_INFINITY},
} as const;

export const DEFAULT_TRAIT_THRESHOLD = 4;
