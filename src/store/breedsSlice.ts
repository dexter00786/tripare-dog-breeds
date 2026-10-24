import {createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {Breed, Group} from '../types/dog';

export type BreedsState = {
  breedsById: Record<string, Breed>;
  breedIds: string[];
  groupsById: Record<string, Group>;
  groupIds: string[];
  syncedAt: string | null;
  isHydrated: boolean;
  isSyncing: boolean;
  isOffline: boolean;
  lastError: string | null;
};

const initialState: BreedsState = {
  breedsById: {},
  breedIds: [],
  groupsById: {},
  groupIds: [],
  syncedAt: null,
  isHydrated: false,
  isSyncing: false,
  isOffline: false,
  lastError: null,
};

type ReplaceCatalogPayload = {
  breeds: Breed[];
  groups: Group[];
  syncedAt: string;
};

const breedsSlice = createSlice({
  name: 'breeds',
  initialState,
  reducers: {
    setHydrated(state, action: PayloadAction<boolean>) {
      if (state.isHydrated !== action.payload) {
        state.isHydrated = action.payload;
      }
    },
    setOffline(state, action: PayloadAction<boolean>) {
      if (state.isOffline !== action.payload) {
        state.isOffline = action.payload;
      }
    },
    setSyncing(state, action: PayloadAction<boolean>) {
      if (state.isSyncing !== action.payload) {
        state.isSyncing = action.payload;
      }
    },
    setError(state, action: PayloadAction<string | null>) {
      if (state.lastError !== action.payload) {
        state.lastError = action.payload;
      }
    },
    replaceCatalog(state, action: PayloadAction<ReplaceCatalogPayload>) {
      const {breeds, groups, syncedAt} = action.payload;
      const breedsById: Record<string, Breed> = {};
      const breedIds: string[] = [];
      for (const breed of breeds) {
        breedsById[breed.id] = breed;
        breedIds.push(breed.id);
      }

      const groupsById: Record<string, Group> = {};
      const groupIds: string[] = [];
      for (const group of groups) {
        groupsById[group.id] = group;
        groupIds.push(group.id);
      }

      state.breedsById = breedsById;
      state.breedIds = breedIds;
      state.groupsById = groupsById;
      state.groupIds = groupIds;
      state.syncedAt = syncedAt;
      state.lastError = null;
    },
    upsertBreed(state, action: PayloadAction<Breed>) {
      const breed = action.payload;
      const exists = state.breedsById[breed.id] != null;
      state.breedsById[breed.id] = breed;
      if (!exists) {
        state.breedIds.push(breed.id);
      }
    },
  },
});

export const {
  setHydrated,
  setOffline,
  setSyncing,
  setError,
  replaceCatalog,
  upsertBreed,
} = breedsSlice.actions;

export const breedsReducer = breedsSlice.reducer;
