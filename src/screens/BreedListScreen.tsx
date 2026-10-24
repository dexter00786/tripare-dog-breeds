import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BreedRow} from '../components/BreedRow';
import {FilterSheet} from '../components/FilterSheet';
import {SyncBanner} from '../components/SyncBanner';
import {useBreedSync} from '../hooks/useBreedSync';
import {setQuery} from '../store/filtersSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import type {RootStackParamList} from '../navigation/types';
import {colors, spacing} from '../theme';
import {
  activeFilterCount,
  filterBreeds,
  groupBreedsForList,
  type ListRow,
} from '../utils/filters';

type Props = NativeStackScreenProps<RootStackParamList, 'BreedList'>;

export function BreedListScreen({navigation}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const isHydrated = useAppSelector(s => s.breeds.isHydrated);
  const groupsById = useAppSelector(s => s.breeds.groupsById);
  const breedIds = useAppSelector(s => s.breeds.breedIds);
  const breedsById = useAppSelector(s => s.breeds.breedsById);

  const filters = useAppSelector(s => s.filters);
  const query = filters.query;

  const {refresh, isFetching, hasCache, isError, error} = useBreedSync();

  useEffect(() => {
    const handle = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(handle);
  }, [query]);

  const breeds = useMemo(
    () => breedIds.map(id => breedsById[id]).filter(Boolean),
    [breedIds, breedsById],
  );

  const rows = useMemo(() => {
    const filtered = filterBreeds(breeds, {
      ...filters,
      query: debouncedQuery,
    });
    return groupBreedsForList(filtered, groupsById);
  }, [breeds, debouncedQuery, filters, groupsById]);

  const breedCount = useMemo(
    () => rows.reduce((n, row) => (row.type === 'breed' ? n + 1 : n), 0),
    [rows],
  );

  const filterCount = activeFilterCount({
    ...filters,
    query: debouncedQuery,
  });

  const bg = isDark ? colors.bgDark : colors.bg;
  const surface = isDark ? colors.surfaceDark : colors.surface;
  const textColor = isDark ? colors.textDark : colors.text;

  if (!isHydrated) {
    return (
      <View style={[styles.centered, {backgroundColor: bg}]}>
        <ActivityIndicator color={colors.accent} />
        <Text style={[styles.muted, {color: textColor}]}>Loading cache…</Text>
      </View>
    );
  }

  if (!hasCache && isFetching) {
    return (
      <View style={[styles.centered, {backgroundColor: bg}]}>
        <ActivityIndicator color={colors.accent} />
        <Text style={[styles.muted, {color: textColor}]}>
          Fetching 283 breeds…
        </Text>
      </View>
    );
  }

  if (!hasCache && isError) {
    return (
      <View style={[styles.centered, {backgroundColor: bg}]}>
        <Text style={[styles.errorTitle, {color: textColor}]}>
          Couldn’t load breeds
        </Text>
        <Text style={styles.muted}>
          {error instanceof Error ? error.message : 'Network error'}
        </Text>
        <Pressable style={styles.retry} onPress={() => refresh()}>
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: bg}]}>
      <SyncBanner />
      <View style={[styles.searchRow, {backgroundColor: surface}]}>
        <TextInput
          value={query}
          onChangeText={text => dispatch(setQuery(text))}
          placeholder="Search breed or other names"
          placeholderTextColor={colors.muted}
          style={[styles.input, {color: textColor, backgroundColor: bg}]}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        <Pressable style={styles.filterBtn} onPress={() => setFiltersOpen(true)}>
          <Text style={styles.filterText}>
            Filters{filterCount > 0 ? ` (${filterCount})` : ''}
          </Text>
        </Pressable>
      </View>
      <Text
        style={[
          styles.count,
          {color: isDark ? colors.mutedDark : colors.muted},
        ]}>
        {breedCount} breeds
      </Text>
      <FlashList
        data={rows}
        estimatedItemSize={72}
        keyExtractor={(item: ListRow) => item.key}
        getItemType={(item: ListRow) => item.type}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refresh} />
        }
        renderItem={({item}) => {
          if (item.type === 'header') {
            return (
              <View style={[styles.header, {backgroundColor: bg}]}>
                <Text style={[styles.headerText, {color: textColor}]}>
                  {item.title}
                </Text>
              </View>
            );
          }
          return (
            <BreedRow
              breed={item.breed}
              groupName={
                item.breed.groupId != null
                  ? groupsById[item.breed.groupId]?.name ?? null
                  : null
              }
              onPress={id => navigation.navigate('BreedDetail', {breedId: id})}
            />
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{color: textColor}}>No breeds match your filters.</Text>
          </View>
        }
      />
      <FilterSheet visible={filtersOpen} onClose={() => setFiltersOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
  },
  muted: {color: colors.muted, textAlign: 'center'},
  errorTitle: {fontSize: 18, fontWeight: '700'},
  retry: {
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  retryText: {color: '#fff', fontWeight: '600'},
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontSize: 15,
  },
  filterBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: 10,
  },
  filterText: {color: '#fff', fontWeight: '600', fontSize: 13},
  count: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    fontSize: 12,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  headerText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  empty: {padding: spacing.xl, alignItems: 'center'},
});
