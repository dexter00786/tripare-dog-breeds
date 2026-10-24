import {configureStore} from '@reduxjs/toolkit';
import {breedsReducer} from './breedsSlice';
import {filtersReducer} from './filtersSlice';

export const store = configureStore({
  reducer: {
    breeds: breedsReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
