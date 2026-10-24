import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {TraitBar} from '../../components/TraitBar';
import type {Breed, BreedTraits} from '../../types/dog';
import {colors, spacing} from '../../theme';

type Props = {
  breed: Breed;
};

const SCORE_KEYS: Array<Exclude<keyof BreedTraits, 'temperament' | 'exercise_minutes'>> = [
  'energy',
  'barking',
  'drooling',
  'grooming',
  'shedding',
  'trainability',
  'good_with_dogs',
  'apartment_friendly',
  'good_with_children',
  'good_with_strangers',
];

export function TraitsTab({breed}: Props): React.JSX.Element {
  const traits = breed.attributes.traits;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.section}>Temperament</Text>
      <View style={styles.tags}>
        {traits.temperament.map(tag => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.exercise}>
        Exercise: ~{traits.exercise_minutes} minutes / day
      </Text>
      <Text style={styles.section}>Trait scores</Text>
      {SCORE_KEYS.map(key => (
        <TraitBar key={key} label={key} value={traits[key]} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  section: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.muted,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
  },
  tagText: {
    color: colors.accent,
    fontWeight: '600',
    fontSize: 13,
  },
  exercise: {
    color: colors.text,
    marginBottom: spacing.lg,
    fontSize: 15,
  },
});
