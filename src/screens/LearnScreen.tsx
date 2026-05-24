import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LESSONS, Lesson, isLessonUnlocked } from '../data/lessons';
import { loadProgress, getCompletedLessonIds } from '../data/progress';
import { colors, spacing, radius } from '../theme';
import { strings } from '../i18n/strings';

export default function LearnScreen({ navigation, route }: any) {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const refresh = useCallback(() => {
    loadProgress().then((p) => {
      setCompletedIds(getCompletedLessonIds(p));
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  useEffect(() => {
    if (route.params?.completedLessonId) {
      refresh();
      navigation.setParams({ completedLessonId: undefined });
    }
  }, [route.params?.completedLessonId]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>{strings.learn.heading}</Text>
          <Text style={styles.subheading}>{strings.learn.subheading}</Text>
        </View>

        <FlatList
          data={LESSONS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          extraData={completedIds}
          renderItem={({ item, index }) => {
            const completed = completedIds.includes(item.id);
            const unlocked = isLessonUnlocked(item.id, completedIds);
            return (
              <LessonCard
                lesson={item}
                index={index}
                completed={completed}
                unlocked={unlocked}
                onPress={() =>
                  unlocked && navigation.navigate('Lesson', { lessonId: item.id })
                }
              />
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

function LessonCard({
  lesson, index, completed, unlocked, onPress,
}: {
  lesson: Lesson; index: number; completed: boolean; unlocked: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.card, !unlocked && styles.cardLocked]}
      onPress={onPress}
      activeOpacity={unlocked ? 0.8 : 1}
    >
      <View style={styles.numberCol}>
        {completed ? (
          <View style={styles.completedDot}>
            <Ionicons name="checkmark" size={14} color={colors.bg} />
          </View>
        ) : unlocked ? (
          <Text style={styles.number}>{lesson.number}</Text>
        ) : (
          <Ionicons name="lock-closed" size={16} color={colors.textTertiary} />
        )}
        {index < LESSONS.length - 1 && (
          <View style={[styles.connector, completed && styles.connectorDone]} />
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={[styles.title, !unlocked && styles.titleLocked]}>
            {lesson.title}
          </Text>
          <Text style={styles.duration}>
            {strings.learn.minutesShort(lesson.durationMinutes)}
          </Text>
        </View>
        <Text style={styles.subtitle}>{lesson.subtitle}</Text>
        <View style={styles.statusRow}>
          {completed ? (
            <View style={[styles.statusPill, styles.statusCompleted]}>
              <Text style={[styles.statusText, styles.statusTextCompleted]}>{strings.learn.completed}</Text>
            </View>
          ) : unlocked ? (
            <View style={[styles.statusPill, styles.statusReady]}>
              <Text style={[styles.statusText, styles.statusTextReady]}>{strings.learn.startLesson}</Text>
            </View>
          ) : (
            <View style={[styles.statusPill, styles.statusLocked]}>
              <Text style={[styles.statusText, styles.statusTextLocked]}>{strings.learn.locked}</Text>
            </View>
          )}
        </View>
      </View>

      {unlocked && !completed && (
        <Ionicons name="arrow-forward" size={16} color={colors.textTertiary} style={styles.arrow} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  heading: { fontSize: 32, fontWeight: '300', color: colors.textPrimary, letterSpacing: 1.5 },
  subheading: { fontSize: 14, color: colors.textSecondary, marginTop: 4, lineHeight: 20 },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  card: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.md },
  cardLocked: { opacity: 0.5 },
  numberCol: { width: 40, alignItems: 'center', paddingTop: 2 },
  number: { fontSize: 18, fontWeight: '300', color: colors.accent, letterSpacing: 0.5 },
  completedDot: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center',
  },
  connector: { width: 1, flex: 1, minHeight: 24, backgroundColor: colors.border, marginTop: 6 },
  connectorDone: { backgroundColor: colors.success },
  cardContent: { flex: 1, paddingLeft: spacing.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  title: { fontSize: 17, fontWeight: '500', color: colors.textPrimary, flex: 1 },
  titleLocked: { color: colors.textTertiary },
  duration: { fontSize: 12, color: colors.textTertiary, marginLeft: spacing.sm, marginTop: 2 },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
  statusRow: { flexDirection: 'row' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full, borderWidth: 1 },
  statusCompleted: { backgroundColor: colors.success + '22', borderColor: colors.success },
  statusReady: { backgroundColor: colors.accentMuted, borderColor: colors.accent },
  statusLocked: { backgroundColor: 'transparent', borderColor: colors.border },
  statusText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  statusTextCompleted: { color: colors.success },
  statusTextReady: { color: colors.accent },
  statusTextLocked: { color: colors.textTertiary },
  arrow: { alignSelf: 'center', marginLeft: spacing.sm },
});
