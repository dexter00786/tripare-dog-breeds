export type Range = {
  min: number;
  max: number;
};

export type BreedOrigin = {
  era: string | null;
  region: string | null;
  country: string | null;
};

export type BreedCoat = {
  type: string | null;
  colors: string[];
  length: string | null;
};

export type BreedTraits = {
  energy: number;
  barking: number;
  drooling: number;
  grooming: number;
  shedding: number;
  temperament: string[];
  trainability: number;
  good_with_dogs: number;
  exercise_minutes: number;
  apartment_friendly: number;
  good_with_children: number;
  good_with_strangers: number;
};

export type ImageAttribution = {
  author: string | null;
  license: string | null;
  license_url: string | null;
  source: string | null;
  source_url: string | null;
};

export type BreedImage = {
  id: string;
  url: string;
  thumb: string;
  medium: string;
  large: string;
  attribution: ImageAttribution;
};

export type BreedAttributes = {
  name: string;
  description: string;
  life: Range;
  male_weight: Range;
  female_weight: Range;
  hypoallergenic: boolean;
  male_height: Range;
  female_height: Range;
  origin: BreedOrigin;
  coat: BreedCoat;
  traits: BreedTraits;
  other_names: string[];
  recognized_by: string[];
  sources: Array<{url: string; title: string}>;
  images: BreedImage[];
};

export type Breed = {
  id: string;
  type: 'breed';
  attributes: BreedAttributes;
  groupId: string | null;
};

export type Group = {
  id: string;
  type: 'group';
  name: string;
};

export type SizeBand = 'small' | 'medium' | 'large' | 'giant';

export type TraitKey = Exclude<keyof BreedTraits, 'temperament' | 'exercise_minutes'>;

export type FilterState = {
  query: string;
  groupIds: string[];
  sizeBands: SizeBand[];
  coatLengths: string[];
  hypoallergenic: 'any' | 'yes' | 'no';
  traitKey: TraitKey | null;
  traitThreshold: number;
};

export type BreedSnapshot = {
  version: 1;
  syncedAt: string;
  breeds: Breed[];
  groups: Group[];
};

export type JsonApiResource<TAttrs, TType extends string> = {
  id: string;
  type: TType;
  attributes: TAttrs;
  relationships?: {
    group?: {data: {id: string; type: string} | null};
    breeds?: {data: Array<{id: string; type: string}>};
  };
};

export type PaginatedResponse<T> = {
  data: T[];
  meta?: {
    pagination?: {
      current: number;
      next: number | null;
      last: number;
      records: number;
    };
  };
};
