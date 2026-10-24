import type {Breed} from '../types/dog';
import {
  createDefaultFilters,
  filterBreeds,
  groupBreedsForList,
} from '../utils/filters';

function makeBreed(partial: {
  id: string;
  name: string;
  groupId?: string | null;
  other_names?: string[];
  hypoallergenic?: boolean;
  coatLength?: string;
  maleWeightMax?: number;
  good_with_children?: number;
}): Breed {
  return {
    id: partial.id,
    type: 'breed',
    groupId: partial.groupId ?? null,
    attributes: {
      name: partial.name,
      description: 'desc',
      life: {min: 10, max: 12},
      male_weight: {min: 5, max: partial.maleWeightMax ?? 8},
      female_weight: {min: 5, max: 8},
      hypoallergenic: partial.hypoallergenic ?? false,
      male_height: {min: 20, max: 30},
      female_height: {min: 20, max: 30},
      origin: {era: null, region: null, country: null},
      coat: {
        type: 'double',
        colors: ['black'],
        length: partial.coatLength ?? 'short',
      },
      traits: {
        energy: 3,
        barking: 3,
        drooling: 1,
        grooming: 2,
        shedding: 2,
        temperament: ['friendly'],
        trainability: 3,
        good_with_dogs: 3,
        exercise_minutes: 30,
        apartment_friendly: 4,
        good_with_children: partial.good_with_children ?? 3,
        good_with_strangers: 2,
      },
      other_names: partial.other_names ?? [],
      recognized_by: ['AKC'],
      sources: [],
      images: [],
    },
  };
}

describe('filterBreeds', () => {
  const breeds = [
    makeBreed({
      id: '1',
      name: 'Affenpinscher',
      other_names: ['Monkey Terrier'],
      groupId: 'g1',
      hypoallergenic: true,
      coatLength: 'short',
      good_with_children: 5,
    }),
    makeBreed({
      id: '2',
      name: 'Mastiff',
      groupId: 'g2',
      maleWeightMax: 90,
      coatLength: 'short',
      good_with_children: 2,
    }),
  ];

  it('matches name and other_names', () => {
    const filters = {...createDefaultFilters(), query: 'monkey'};
    expect(filterBreeds(breeds, filters).map(b => b.id)).toEqual(['1']);
  });

  it('filters by hypoallergenic and trait threshold', () => {
    const filters = {
      ...createDefaultFilters(),
      hypoallergenic: 'yes' as const,
      traitKey: 'good_with_children' as const,
      traitThreshold: 4,
    };
    expect(filterBreeds(breeds, filters).map(b => b.id)).toEqual(['1']);
  });
});

describe('groupBreedsForList', () => {
  it('inserts section headers', () => {
    const breeds = [
      makeBreed({id: '1', name: 'A', groupId: 'g1'}),
      makeBreed({id: '2', name: 'B', groupId: 'g1'}),
    ];
    const rows = groupBreedsForList(breeds, {
      g1: {id: 'g1', type: 'group', name: 'Toy'},
    });
    expect(rows[0]).toMatchObject({type: 'header', title: 'Toy'});
    expect(rows.filter(r => r.type === 'breed')).toHaveLength(2);
  });
});
