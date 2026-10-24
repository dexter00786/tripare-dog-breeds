import {activeFilterCount, createDefaultFilters} from '../src/utils/filters';
import {getSizeBand} from '../src/utils/sizeBand';

test('default filters have no active count', () => {
  expect(activeFilterCount(createDefaultFilters())).toBe(0);
});

test('size band helper is wired for app smoke', () => {
  expect(
    getSizeBand({
      id: '1',
      type: 'breed',
      groupId: null,
      attributes: {
        name: 'Test',
        description: '',
        life: {min: 1, max: 2},
        male_weight: {min: 1, max: 12},
        female_weight: {min: 1, max: 12},
        hypoallergenic: false,
        male_height: {min: 1, max: 2},
        female_height: {min: 1, max: 2},
        origin: {era: null, region: null, country: null},
        coat: {type: null, colors: [], length: 'short'},
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
    }),
  ).toBe('medium');
});
