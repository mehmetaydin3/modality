import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getLessonById, nextLesson, LessonPage } from '../data/lessons';
import { getModeById } from '../data/modes';
import { updateLessonProgress } from '../data/progress';
import { colors, spacing, radius } from '../theme';
import { strings } from '../i18n/strings';

const YOUTUBE_IDS: Record<string, string> = {
  ionian:     'b3DtKAEBNKI',
  dorian:     'ylXk1LBvIqU',
  phrygian:   'wqofNDFSKXk',
  lydian:     'M2cknGHuEo8',
  mixolydian: 'Y_V7C7V37K0',
  aeolian:    'dLxhFPCYKcI',
  locrian:    'r-Z8KuwI7Rc',
};

const PAGE_TYPE_ICON: Record<string, string> = {
  intro:   'musical-notes-outline',
  concept: 'bulb-outline',
  listen:  'ear-outline',
  compare: 'git-compare-outline',
  chord:   'layers-outline',
  summary: 'checkmark-circle-outline',
};

const PAGE_TYPE_COLOR: Record<string, string> = {
  intro:   colors.accent,
  concept: colors.bright,
  listen:  colors.neutral,
  compare: colors.warning,
  chord:   colors.dark,
  summary: colors.success,
};

export default function LessonScreen({ route, navigation }: any) {
  const { lessonId } = route.params;
  const lesson = getLessonById(lessonId);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const page = lesson.pages[currentPage];
  const isLast = currentPage === lesson.pages.length - 1;
  const progress = (currentPage + 1) / lesson.pages.length;
  const typeColor = PAGE_TYPE_COLOR[page.type] || colors.accent;
  const typeIcon = PAGE_TYPE_ICON[page.type] || 'document-outline';

  const goTo = (index: number) => {
    setCurrentPage(index);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    updateLessonProgress(lessonId, index, false);
  };

  const handleFinish = async () => {
    await updateLessonProgress(lessonId, lesson.pages.length - 1, true);
    const next = nextLesson(lessonId);
    if (next) {
      navigation.replace('Lesson', { lessonId: next.id });
    } else {
      navigation.goBack();
    }
  };

  const handleListen = () => {
    if (!page.modeId) return;
    const youtubeId = YOUTUBE_IDS[page.modeId];
    if (!youtubeId) return;
    Linking.openURL(`https://www.youtube.com/watch?v=${youtubeId}`);
  };

  const hasAudio = page.type === 'listen' && page.modeId && YOUTUBE_IDS[page.modeId];
  const mode = page.modeId ? getModeById(page.modeId) : null;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Nav */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.lessonLabel}>
          {strings.learn.lessonLabel} {lesson.number}
        </Text>
        <Text style={styles.pageCount}>
          {currentPage + 1} / {lesson.pages.length}
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page type indicator */}
        <View style={styles.typeRow}>
          <View style={[styles.typeIcon, { backgroundColor: typeColor + '22' }]}>
            <Ionicons name={typeIcon as any} size={16} color={typeColor} />
          </View>
          <Text style={[styles.typeLabel, { color: typeColor }]}>{page.type}</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>{page.heading}</Text>

        {/* Body */}
        <Text style={styles.body}>{page.body}</Text>

        {/* Listen button for listen pages */}
        {hasAudio && (
          <TouchableOpacity style={styles.listenButton} onPress={handleListen} activeOpacity={0.8}>
            <Ionicons name="logo-youtube" size={18} color="#FF0000" />
            <View style={styles.listenButtonText}>
              <Text style={styles.listenLabel}>Listen on YouTube</Text>
              {mode && (
                <Text style={styles.listenSublabel}>
                  {mode.classicTunes[0]?.title} · {mode.classicTunes[0]?.artist}
                </Text>
              )}
            </View>
            <Ionicons name="open-outline" size={14} color={colors.textTertiary} />
          </TouchableOpacity>
        )}

        {/* Tip callout */}
        {page.tip && (
          <View style={styles.tipCard}>
            <View style={styles.tipIconRow}>
              <Ionicons name="information-circle" size={16} color={colors.accent} />
              <Text style={styles.tipLabel}>Note</Text>
            </View>
            <Text style={styles.tipText}>{page.tip}</Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Dot navigation */}
      <View style={styles.dotsRow}>
        {lesson.pages.map((_, i) => (
          <TouchableOpacity key={i} onPress={() => i < currentPage && goTo(i)}>
            <View style={[
              styles.dot,
              i === currentPage && styles.dotActive,
              i < currentPage && styles.dotDone,
            ]} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonSecondary, currentPage === 0 && styles.navButtonDisabled]}
          onPress={() => currentPage > 0 && goTo(currentPage - 1)}
          activeOpacity={currentPage === 0 ? 1 : 0.8}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color={currentPage === 0 ? colors.textTertiary : colors.textPrimary}
          />
        </TouchableOpacity>

        {isLast ? (
          <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={handleFinish}>
            <Text style={styles.navButtonPrimaryText}>{strings.learn.finishLesson}</Text>
            <Ionicons name="checkmark" size={16} color={colors.bg} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={() => goTo(currentPage + 1)}
          >
            <Text style={styles.navButtonPrimaryText}>{strings.learn.nextLesson}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.bg} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  errorText: { color: colors.textSecondary, textAlign: 'center', marginTop: 40 },
  navBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
  },
  closeButton: { padding: 4 },
  lessonLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  pageCount: { fontSize: 13, color: colors.textTertiary },
  progressTrack: {
    height: 2, backgroundColor: colors.border,
    marginHorizontal: spacing.lg, borderRadius: 1, marginBottom: spacing.md,
  },
  progressFill: { height: 2, backgroundColor: colors.accent, borderRadius: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  typeIcon: { width: 28, height: 28, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center' },
  typeLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  heading: {
    fontSize: 26, fontWeight: '300', color: colors.textPrimary,
    letterSpacing: 0.5, marginBottom: spacing.lg, lineHeight: 34,
  },
  body: { fontSize: 16, color: colors.textSecondary, lineHeight: 28, marginBottom: spacing.lg },
  listenButton: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginBottom: spacing.lg,
  },
  listenButtonText: { flex: 1 },
  listenLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  listenSublabel: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
  tipCard: {
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderLeftWidth: 3, borderLeftColor: colors.accent, padding: spacing.md,
  },
  tipIconRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  tipLabel: { fontSize: 11, fontWeight: '600', color: colors.accent, letterSpacing: 1, textTransform: 'uppercase' },
  tipText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: spacing.sm },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 20, backgroundColor: colors.accent },
  dotDone: { backgroundColor: colors.success },
  footer: {
    flexDirection: 'row', paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm,
  },
  navButton: { height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  navButtonSecondary: { width: 48, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border },
  navButtonDisabled: { opacity: 0.3 },
  navButtonPrimary: { flex: 1, backgroundColor: colors.accent },
  navButtonPrimaryText: { fontSize: 15, fontWeight: '600', color: colors.bg },
});
