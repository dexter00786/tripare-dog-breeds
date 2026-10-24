import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {useAppSelector} from '../store/hooks';
import {colors, spacing} from '../theme';
import {formatRelativeTime} from '../utils/format';

export function SyncBanner(): React.JSX.Element | null {
  const syncedAt = useAppSelector(s => s.breeds.syncedAt);
  const isSyncing = useAppSelector(s => s.breeds.isSyncing);
  const isOffline = useAppSelector(s => s.breeds.isOffline);
  const lastError = useAppSelector(s => s.breeds.lastError);
  const hasData = useAppSelector(s => s.breeds.breedIds.length > 0);

  if (lastError != null && hasData) {
    return (
      <View style={[styles.banner, styles.error]}>
        <Text style={styles.errorText}>
          Sync failed — showing cached data. {lastError}
        </Text>
      </View>
    );
  }

  if (isOffline) {
    return (
      <View style={[styles.banner, styles.warn]}>
        <Text style={styles.warnText}>
          Offline · {formatRelativeTime(syncedAt)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.banner}>
      {isSyncing ? (
        <View style={styles.row}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.text}> Syncing breeds…</Text>
        </View>
      ) : (
        <Text style={styles.text}>{formatRelativeTime(syncedAt)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.accentSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '500',
  },
  warn: {
    backgroundColor: colors.warningSoft,
  },
  warnText: {
    color: colors.warning,
    fontSize: 13,
    fontWeight: '600',
  },
  error: {
    backgroundColor: colors.dangerSoft,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '500',
  },
});
