import React, {memo} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import type {Breed} from '../types/dog';
import {colors, spacing} from '../theme';
import {SIZE_BAND_LABELS} from '../utils/sizeBand';
import {getSizeBand} from '../utils/sizeBand';

type Props = {
  breed: Breed;
  groupName: string | null;
  onPress: (id: string) => void;
};

function BreedRowComponent({breed, groupName, onPress}: Props): React.JSX.Element {
  const thumb = breed.attributes.images[0]?.thumb;
  const size = SIZE_BAND_LABELS[getSizeBand(breed)];

  return (
    <Pressable
      style={({pressed}) => [styles.row, pressed && styles.pressed]}
      onPress={() => onPress(breed.id)}>
      {thumb != null ? (
        <Image source={{uri: thumb}} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, styles.thumbPlaceholder]} />
      )}
      <View style={styles.meta}>
        <Text style={styles.name} numberOfLines={1}>
          {breed.attributes.name}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {groupName ?? 'Ungrouped'} · {size}
        </Text>
      </View>
    </Pressable>
  );
}

export const BreedRow = memo(BreedRowComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.85,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.chip,
  },
  thumbPlaceholder: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  meta: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  sub: {
    marginTop: 2,
    fontSize: 13,
    color: colors.muted,
  },
});
