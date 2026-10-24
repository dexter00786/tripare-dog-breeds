import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  resetFilters,
  setHypoallergenic,
  setTraitKey,
  setTraitThreshold,
  toggleCoatLength,
  toggleGroup,
  toggleSizeBand,
} from '../store/filtersSlice';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import type {SizeBand, TraitKey} from '../types/dog';
import {colors, spacing} from '../theme';
import {SIZE_BAND_LABELS} from '../utils/sizeBand';

const COAT_LENGTHS = ['short', 'medium', 'long', 'wire'];

const TRAIT_OPTIONS: Array<{key: TraitKey; label: string}> = [
  {key: 'good_with_children', label: 'Good with children'},
  {key: 'good_with_dogs', label: 'Good with dogs'},
  {key: 'good_with_strangers', label: 'Good with strangers'},
  {key: 'energy', label: 'Energy'},
  {key: 'trainability', label: 'Trainability'},
  {key: 'apartment_friendly', label: 'Apartment friendly'},
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipOn]}>
      <Text style={[styles.chipText, selected && styles.chipTextOn]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function FilterSheet({visible, onClose}: Props): React.JSX.Element {
  const dispatch = useAppDispatch();
  const groupsById = useAppSelector(s => s.breeds.groupsById);
  const groupIds = useAppSelector(s => s.breeds.groupIds);
  const filters = useAppSelector(s => s.filters);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <Pressable onPress={onClose}>
            <Text style={styles.done}>Done</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.section}>Breed group</Text>
          <View style={styles.wrap}>
            {groupIds.map(id => (
              <Chip
                key={id}
                label={groupsById[id]?.name ?? id}
                selected={filters.groupIds.includes(id)}
                onPress={() => dispatch(toggleGroup(id))}
              />
            ))}
          </View>

          <Text style={styles.section}>Size band</Text>
          <View style={styles.wrap}>
            {(Object.keys(SIZE_BAND_LABELS) as SizeBand[]).map(band => (
              <Chip
                key={band}
                label={SIZE_BAND_LABELS[band]}
                selected={filters.sizeBands.includes(band)}
                onPress={() => dispatch(toggleSizeBand(band))}
              />
            ))}
          </View>

          <Text style={styles.section}>Coat length</Text>
          <View style={styles.wrap}>
            {COAT_LENGTHS.map(length => (
              <Chip
                key={length}
                label={length}
                selected={filters.coatLengths.includes(length)}
                onPress={() => dispatch(toggleCoatLength(length))}
              />
            ))}
          </View>

          <Text style={styles.section}>Hypoallergenic</Text>
          <View style={styles.wrap}>
            {(['any', 'yes', 'no'] as const).map(value => (
              <Chip
                key={value}
                label={value}
                selected={filters.hypoallergenic === value}
                onPress={() => dispatch(setHypoallergenic(value))}
              />
            ))}
          </View>

          <Text style={styles.section}>
            Trait threshold (≥ {filters.traitThreshold})
          </Text>
          <View style={styles.wrap}>
            <Chip
              label="Any trait"
              selected={filters.traitKey == null}
              onPress={() => dispatch(setTraitKey(null))}
            />
            {TRAIT_OPTIONS.map(option => (
              <Chip
                key={option.key}
                label={option.label}
                selected={filters.traitKey === option.key}
                onPress={() => dispatch(setTraitKey(option.key))}
              />
            ))}
          </View>
          <View style={styles.wrap}>
            {[3, 4, 5].map(n => (
              <Chip
                key={n}
                label={`≥ ${n}`}
                selected={filters.traitThreshold === n}
                onPress={() => dispatch(setTraitThreshold(n))}
              />
            ))}
          </View>
        </ScrollView>
        <Pressable
          style={styles.reset}
          onPress={() => dispatch(resetFilters())}>
          <Text style={styles.resetText}>Reset filters</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  done: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 16,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: 14,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: colors.chip,
  },
  chipOn: {
    backgroundColor: colors.chipOn,
  },
  chipText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  chipTextOn: {
    color: '#fff',
  },
  reset: {
    margin: spacing.lg,
    padding: spacing.md,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
  },
  resetText: {
    color: colors.danger,
    fontWeight: '600',
  },
});
