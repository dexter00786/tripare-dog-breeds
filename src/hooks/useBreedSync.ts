import {useCallback, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {fetchCatalog} from '../api/dogApi';
import {loadSnapshot, saveSnapshot} from '../storage/breedStorage';
import {
  replaceCatalog,
  setError,
  setHydrated,
  setOffline,
  setSyncing,
} from '../store/breedsSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';

export function useHydrateCatalog(): void {
  const dispatch = useAppDispatch();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const snapshot = await loadSnapshot();
        if (!cancelled && snapshot != null) {
          dispatch(
            replaceCatalog({
              breeds: snapshot.breeds,
              groups: snapshot.groups,
              syncedAt: snapshot.syncedAt,
            }),
          );
        }
      } finally {
        if (!cancelled) {
          dispatch(setHydrated(true));
        }
      }
    })();

    const unsubscribe = NetInfo.addEventListener(state => {
      dispatch(setOffline(state.isConnected === false));
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [dispatch]);
}

export function useBreedSync() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const isHydrated = useAppSelector(s => s.breeds.isHydrated);
  const breedCount = useAppSelector(s => s.breeds.breedIds.length);

  const query = useQuery({
    queryKey: ['catalog'],
    enabled: isHydrated,
    queryFn: async () => {
      dispatch(setSyncing(true));
      dispatch(setError(null));
      try {
        const catalog = await fetchCatalog();
        const syncedAt = new Date().toISOString();
        dispatch(replaceCatalog({...catalog, syncedAt}));
        await saveSnapshot({
          version: 1,
          syncedAt,
          breeds: catalog.breeds,
          groups: catalog.groups,
        });
        return catalog;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to sync breeds';
        dispatch(setError(message));
        throw error;
      } finally {
        dispatch(setSyncing(false));
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    throwOnError: false,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({queryKey: ['catalog']});
  }, [queryClient]);

  return {
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refresh,
    hasCache: breedCount > 0,
  };
}
