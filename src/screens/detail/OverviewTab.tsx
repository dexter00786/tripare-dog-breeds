import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import type {Breed, Group} from '../../types/dog';
import {colors, spacing} from '../../theme';
import {formatRange} from '../../utils/format';

type Props = {
  breed: Breed;
  group: Group | null;
};

function Row({label, value}: {label: string; value: string}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function OverviewTab({breed, group}: Props): React.JSX.Element {
  const a = breed.attributes;
  const origin = [a.origin?.era, a.origin?.region, a.origin?.country]
    .filter(Boolean)
    .join(' · ');

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.description}>{a.description}</Text>
      <Row label="Group" value={group?.name ?? '—'} />
      <Row label="Life span" value={formatRange(a.life, 'years')} />
      <Row
        label="Male weight"
        value={formatRange(a.male_weight, 'kg')}
      />
      <Row
        label="Female weight"
        value={formatRange(a.female_weight, 'kg')}
      />
      <Row
        label="Male height"
        value={formatRange(a.male_height, 'cm')}
      />
      <Row
        label="Female height"
        value={formatRange(a.female_height, 'cm')}
      />
      <Row label="Origin" value={origin || '—'} />
      <Row
        label="Other names"
        value={a.other_names.length ? a.other_names.join(', ') : '—'}
      />
      <Row
        label="Recognized by"
        value={a.recognized_by.length ? a.recognized_by.join(', ') : '—'}
      />
      <Row
        label="Coat"
        value={[a.coat?.length, a.coat?.type].filter(Boolean).join(' · ') || '—'}
      />
      <Row
        label="Hypoallergenic"
        value={a.hypoallergenic ? 'Yes' : 'No'}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 2,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 15,
    color: colors.text,
  },
});
