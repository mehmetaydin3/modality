import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
  loadProgress,
  resetAllProgress,
  countExploredModes,
  countCompletedLessons,
  averageQuizScore,
  UserProgress,
} from '../data/progress';
import { MODES } from '../data/modes';
import { LESSONS } from '../data/lessons';
import { colors, spacing, radius } from '../theme';
import { strings } from '../i18n/strings';

export default function ProfileScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadProgress().then(setProgress);
    }, [])
  );

  const handleReset = () => {
    Alert.alert(
      strings.profile.resetAllProgress,
      strings.profile.resetConfirm,
      [
        { text: strings.profile.resetNo, style: 'cancel' },
        {
          text: strings.profile.resetYes,
          style: 'destructive',
          onPress: async () => {
            await resetAllProgress();
            const fresh = await loadProgress();
            setProgress(fresh);
          },
        },
      ]
    );
  };

  if (!progress) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>{strings.common.loading}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const exploredCount = countExploredModes(progress);
  const completedLessons = countCompletedLessons(progress);
  const avgScore = averageQuizScore(progress);
  const totalModes = MODES.length;
  const totalLessons = LESSONS.length;
  const quizCount = progress.quizSessions.length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>{strings.profile.heading}</Text>
          {progress.streak.current > 0 && (
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={14} color={colors.warning} />
              <Text style={styles.streakText}>
                {strings.practice.streakDays(progress.streak.current)}
              </Text>
            </View>
          )}
        </View>

        {/* Main stats */}
        <View style={styles.statsGrid}>
          <StatCard
            label={strings.profile.modesExplored}
            value={`${exploredCount} / ${totalModes}`}
            icon="grid-outline"
            color={colors.accent}
            fill={exploredCount / totalModes}
          />
          <StatCard
            label={strings.profile.lessonsCompleted}
            value={`${completedLessons} / ${totalLessons}`}
            icon="book-outline"
            color={colors.bright}
            fill={completedLessons / totalLessons}
          />
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label={strings.profile.quizzesTaken}
            value={String(quizCount)}
            icon="ear-outline"
            color={colors.neutral}
          />
          <StatCard
            label="Avg quiz score"
            value={quizCount > 0 ? `${avgScore}%` : '—'}
            icon="checkmark-circle-outline"
            color={colors.success}
          />
        </View>

        {/* Streak */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Streak</Text>
          <View style={styles.streakCard}>
            <View style={styles.streakItem}>
              <Ionicons name="flame" size={24} color={colors.warning} />
              <Text style={styles.streakNumber}>{progress.streak.current}</Text>
              <Text style={styles.streakItemLabel}>current</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakItem}>
              <Ionicons name="trophy-outline" size={24} color={colors.accent} />
              <Text style={styles.streakNumber}>{progress.streak.best}</Text>
              <Text style={styles.streakItemLabel}>best</Text>
            </View>
          </View>
        </View>

        {/* Modes explored */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Modes explored</Text>
          <View style={styles.modesGrid}>
            {MODES.map((mode) => {
              const explored = progress.modes[mode.id]?.explored ?? false;
              const brightColor =
                mode.brightness === 'bright'
                  ? colors.bright
                  : mode.brightness === 'neutral'
                  ? colors.neutral
                  : colors.dark;
              return (
                <View
                  key={mode.id}
                  style={[
                    styles.modePill,
                    explored
                      ? { backgroundColor: brightColor + '22', borderColor: brightColor }
                      : styles.modePillLocked,
                  ]}
                >
                  <Text
                    style={[
                      styles.modePillText,
                      { color: explored ? brightColor : colors.textTertiary },
                    ]}
                  >
                    {mode.name}
                  </Text>
                  {explored && (
                    <Ionicons name="checkmark" size={11} color={brightColor} />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Recent quiz sessions */}
        {progress.quizSessions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Recent quizzes</Text>
            <View style={styles.sessionsCard}>
              {progress.quizSessions.slice(0, 5).map((session, i) => {
                const pct = Math.round((session.score / session.total) * 100);
                const date = new Date(session.completedAt);
                const dateStr = date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <View
                    key={session.id}
                    style={[
                      styles.sessionRow,
                      i < Math.min(progress.quizSessions.length, 5) - 1 &&
                        styles.sessionRowBorder,
                    ]}
                  >
                    <Text style={styles.sessionDate}>{dateStr}</Text>
                    <View style={styles.sessionBar}>
                      <View
                        style={[
                          styles.sessionFill,
                          {
                            width: `${pct}%`,
                            backgroundColor:
                              pct === 100
                                ? colors.success
                                : pct >= 70
                                ? colors.accent
                                : colors.warning,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.sessionScore}>
                      {session.score}/{session.total}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Reset */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="trash-outline" size={16} color={colors.warning} />
            <Text style={styles.resetText}>{strings.profile.resetProgress}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  fill,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  fill?: number;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statCardTop}>
        <View style={[styles.statIcon, { backgroundColor: color + '22' }]}>
          <Ionicons name={icon as any} size={16} color={color} />
        </View>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      {fill !== undefined && (
        <View style={styles.statTrack}>
          <View
            style={[
              styles.statFill,
              { width: `${Math.min(fill * 100, 100)}%`, backgroundColor: color },
            ]}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.textTertiary },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  heading: {
    fontSize: 32,
    fontWeight: '300',
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.warning + '22',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.warning + '44',
  },
  streakText: { fontSize: 12, color: colors.warning, fontWeight: '600' },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  statCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statIcon: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '500' },
  statLabel: { fontSize: 11, color: colors.textTertiary, marginBottom: spacing.sm },
  statTrack: {
    height: 2,
    backgroundColor: colors.border,
    borderRadius: 1,
    overflow: 'hidden',
  },
  statFill: { height: 2, borderRadius: 1 },
  section: { marginTop: spacing.lg },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
  streakCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  streakItem: { flex: 1, alignItems: 'center', gap: 4 },
  streakDivider: { width: 1, height: 40, backgroundColor: colors.border },
  streakNumber: { fontSize: 32, fontWeight: '200', color: colors.textPrimary },
  streakItemLabel: { fontSize: 11, color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 1 },
  modesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  modePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  modePillLocked: {
    backgroundColor: colors.bgCard,
    borderColor: colors.border,
  },
  modePillText: { fontSize: 13 },
  sessionsCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    gap: spacing.md,
  },
  sessionRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  sessionDate: { fontSize: 12, color: colors.textTertiary, width: 44 },
  sessionBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  sessionFill: { height: 4, borderRadius: 2 },
  sessionScore: { fontSize: 13, color: colors.textSecondary, width: 32, textAlign: 'right' },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.warning + '44',
    backgroundColor: colors.warning + '11',
  },
  resetText: { fontSize: 14, color: colors.warning },
});
