import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {FilterState, SizeBand, TraitKey} from '../types/dog';
import {createDefaultFilters} from '../utils/filters';

function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter(item => item !== value)
    : [...list, value];
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState: createDefaultFilters() as FilterState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    toggleGroup(state, action: PayloadAction<string>) {
      state.groupIds = toggleInList(state.groupIds, action.payload);
    },
    toggleSizeBand(state, action: PayloadAction<SizeBand>) {
      state.sizeBands = toggleInList(state.sizeBands, action.payload);
    },
    toggleCoatLength(state, action: PayloadAction<string>) {
      state.coatLengths = toggleInList(state.coatLengths, action.payload);
    },
    setHypoallergenic(
      state,
      action: PayloadAction<FilterState['hypoallergenic']>,
    ) {
      state.hypoallergenic = action.payload;
    },
    setTraitKey(state, action: PayloadAction<TraitKey | null>) {
      state.traitKey = action.payload;
    },
    setTraitThreshold(state, action: PayloadAction<number>) {
      state.traitThreshold = action.payload;
    },
    resetFilters() {
      return createDefaultFilters();
    },
  },
});

export const {
  setQuery,
  toggleGroup,
  toggleSizeBand,
  toggleCoatLength,
  setHypoallergenic,
  setTraitKey,
  setTraitThreshold,
  resetFilters,
} = filtersSlice.actions;

export const filtersReducer = filtersSlice.reducer;
