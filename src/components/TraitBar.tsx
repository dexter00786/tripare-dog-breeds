import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, spacing} from '../theme';
import {titleCase} from '../utils/format';

type Props = {
  label: string;
  value: number;
  max?: number;
};

export function TraitBar({label, value, max = 5}: Props): React.JSX.Element {
  const clamped = Math.max(0, Math.min(value, max));
  const pct = (clamped / max) * 100;

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{titleCase(label)}</Text>
        <Text style={styles.value}>
          {value}/{max}
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, {width: `${pct}%`}]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    color: colors.muted,
    fontSize: 13,
  },
  track: {
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.chip,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 999,
  },
});
