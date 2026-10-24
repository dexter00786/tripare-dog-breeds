import type {Breed} from '../types/dog';
import {getSizeBand} from '../utils/sizeBand';

function breedWithWeight(max: number): Breed {
  return {
    id: 'x',
    type: 'breed',
    groupId: null,
    attributes: {
      name: 'X',
      description: '',
      life: {min: 1, max: 2},
      male_weight: {min: 1, max},
      female_weight: {min: 1, max},
      hypoallergenic: false,
      male_height: {min: 1, max: 2},
      female_height: {min: 1, max: 2},
      origin: {era: null, region: null, country: null},
      coat: {type: null, colors: [], length: null},
      traits: {
        energy: 1,
        barking: 1,
        drooling: 1,
        grooming: 1,
        shedding: 1,
        temperament: [],
        trainability: 1,
        good_with_dogs: 1,
        exercise_minutes: 10,
        apartment_friendly: 1,
        good_with_children: 1,
        good_with_strangers: 1,
      },
      other_names: [],
      recognized_by: [],
      sources: [],
      images: [],
    },
  };
}

describe('getSizeBand', () => {
  it('maps weight ranges to bands', () => {
    expect(getSizeBand(breedWithWeight(8))).toBe('small');
    expect(getSizeBand(breedWithWeight(20))).toBe('medium');
    expect(getSizeBand(breedWithWeight(40))).toBe('large');
    expect(getSizeBand(breedWithWeight(60))).toBe('giant');
  });
});
