import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {fetchBreedById} from '../api/dogApi';
import type {RootStackParamList} from '../navigation/types';
import {upsertBreed} from '../store/breedsSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {colors, spacing} from '../theme';
import {GalleryTab} from './detail/GalleryTab';
import {OverviewTab} from './detail/OverviewTab';
import {TraitsTab} from './detail/TraitsTab';

type Props = NativeStackScreenProps<RootStackParamList, 'BreedDetail'>;
type TabKey = 'overview' | 'traits' | 'gallery';

const TABS: Array<{key: TabKey; label: string}> = [
  {key: 'overview', label: 'Overview'},
  {key: 'traits', label: 'Traits'},
  {key: 'gallery', label: 'Gallery'},
];

export function BreedDetailScreen({route}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const {breedId} = route.params;
  const breed = useAppSelector(s => s.breeds.breedsById[breedId]);
  const groupsById = useAppSelector(s => s.breeds.groupsById);
  const group =
    breed?.groupId != null ? groupsById[breed.groupId] ?? null : null;
  const [tab, setTab] = useState<TabKey>('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setRefreshing(true);
      try {
        const fresh = await fetchBreedById(breedId);
        if (!cancelled) {
          dispatch(upsertBreed(fresh));
        }
      } catch {
        // Keep cached breed on refresh failure
      } finally {
        if (!cancelled) {
          setRefreshing(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [breedId, dispatch]);

  if (breed == null) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.muted}>Loading breed…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>{breed.attributes.name}</Text>
        {refreshing ? (
          <Text style={styles.refresh}>Refreshing details…</Text>
        ) : null}
      </View>
      <View style={styles.tabs}>
        {TABS.map(item => (
          <Pressable
            key={item.key}
            style={[styles.tab, tab === item.key && styles.tabOn]}
            onPress={() => setTab(item.key)}>
            <Text style={[styles.tabText, tab === item.key && styles.tabTextOn]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.body}>
        {tab === 'overview' ? (
          <OverviewTab breed={breed} group={group} />
        ) : null}
        {tab === 'traits' ? <TraitsTab breed={breed} /> : null}
        {tab === 'gallery' ? <GalleryTab breed={breed} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: colors.bg},
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  muted: {color: colors.muted},
  titleBlock: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  refresh: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  tabOn: {
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  tabText: {
    color: colors.muted,
    fontWeight: '600',
  },
  tabTextOn: {
    color: colors.accent,
  },
  body: {flex: 1},
});
