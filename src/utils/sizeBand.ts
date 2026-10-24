import type {Breed, SizeBand} from '../types/dog';

export function getSizeBand(breed: Breed): SizeBand {
  const maxKg = breed.attributes.male_weight?.max ?? 0;
  if (maxKg < 10) {
    return 'small';
  }
  if (maxKg < 25) {
    return 'medium';
  }
  if (maxKg < 45) {
    return 'large';
  }
  return 'giant';
}

export const SIZE_BAND_LABELS: Record<SizeBand, string> = {
  small: 'Small (<10 kg)',
  medium: 'Medium (10–25 kg)',
  large: 'Large (25–45 kg)',
  giant: 'Giant (>45 kg)',
};
