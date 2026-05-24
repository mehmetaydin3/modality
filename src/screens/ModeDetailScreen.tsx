import React, { useEffect } from 'react';
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
import { getModeById, getRelatedModes } from '../data/modes';
import { markModeExplored } from '../data/progress';
import { colors, spacing, radius } from '../theme';

const BRIGHTNESS_COLOR: Record<string, string> = {
  bright: colors.bright,
  neutral: colors.neutral,
  dark: colors.dark,
};

// YouTube IDs for every classic tune
const YOUTUBE_IDS: Record<string, string> = {
  // Ionian
  'Misty': 'b3DtKAEBNKI',
  // Dorian
  'So What': 'ylXk1LBvIqU',
  'Maiden Voyage': 'dCHEe2BXEQY',
  // Phrygian
  'Impressions': 'wqofNDFSKXk',
  'Spain': 'XfQJMhMRUcw',
  // Lydian
  'Flying (E.T. Theme)': 'M2cknGHuEo8',
  // Mixolydian
  'Norwegian Wood': 'Y_V7C7V37K0',
  // Aeolian
  'My Funny Valentine': 'dLxhFPCYKcI',
  'Summertime': 'XeOCEYMFEFk',
  // Locrian
  'Autumn Leaves (minor ii-V)': 'r-Z8KuwI7Gc',
};

function openYouTube(tuneTitle: string, youtubeId?: string) {
  const id = youtubeId || YOUTUBE_IDS[tuneTitle];
  if (!id) return;
  const url = `https://www.youtube.com/watch?v=${id}`;
  Linking.openURL(url);
}

export default function ModeDetailScreen({ route, navigation }: any) {
  const { modeId } = route.params;
  const mode = getModeById(modeId);

  useEffect(() => {
    if (modeId) markModeExplored(modeId);
  }, [modeId]);

  if (!mode) {
    return (
      <View style={styles.errorContainer}>
        <Text style={{ color: colors.textSecondary }}>Mode not found.</Text>
      </View>
    );
  }

  const accentColor = BRIGHTNESS_COLOR[mode.brightness];
  const related = getRelatedModes(mode.id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          <Text style={styles.backLabel}>Modes</Text>
        </TouchableOpacity>
        <View style={[styles.brightnessBadge, { backgroundColor: accentColor + '22' }]}>
          <Text style={[styles.brightnessText, { color: accentColor }]}>{mode.brightness}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <Text style={[styles.degree, { color: accentColor }]}>{mode.degree}</Text>
            <Text style={styles.name}>{mode.name}</Text>
          </View>
          <Text style={styles.oneWord}>{mode.oneWord}</Text>
          <Text style={styles.character}>{mode.character}</Text>
        </View>

        <Divider />

        {/* Color note */}
        <Section label="Color note">
          <View style={[styles.colorNoteCard, { borderLeftColor: accentColor }]}>
            <Text style={[styles.colorNoteValue, { color: accentColor }]}>{mode.colorNote}</Text>
            <Text style={styles.colorNoteInterval}>Interval: {mode.colorNoteInterval}</Text>
          </View>
          {mode.avoidNote && (
            <View style={styles.avoidNoteCard}>
              <Text style={styles.avoidLabel}>Avoid note</Text>
              <Text style={styles.avoidValue}>{mode.avoidNote}</Text>
            </View>
          )}
        </Section>

        <Divider />

        {/* Chord context */}
        <Section label="Chord context">
          {mode.chordContexts.map((ctx, i) => (
            <View key={i} style={styles.chordCard}>
              <View style={styles.chordCardTop}>
                <Text style={styles.chordSymbol}>{ctx.chordSymbol}</Text>
                <Text style={styles.chordType}>{ctx.chordType}</Text>
              </View>
              <Text style={styles.chordDescription}>{ctx.description}</Text>
              <View style={styles.progressionsRow}>
                {ctx.commonProgressions.map((p, j) => (
                  <View key={j} style={styles.progressionPill}>
                    <Text style={styles.progressionText}>{p}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Section>

        <Divider />

        {/* Classic tunes */}
        <Section label="Classic tunes">
          {mode.classicTunes.map((tune, i) => {
            const hasVideo = !!(tune.youtubeId || YOUTUBE_IDS[tune.title]);
            return (
              <View key={i} style={styles.tuneCard}>
                <View style={styles.tuneTop}>
                  <Text style={styles.tuneTitle}>{tune.title}</Text>
                  <Text style={styles.tuneYear}>{tune.year}</Text>
                </View>
                <Text style={styles.tuneArtist}>{tune.artist}</Text>
                <Text style={styles.tuneWhy}>{tune.whyThisTune}</Text>
                {hasVideo && (
                  <TouchableOpacity
                    style={styles.youtubeButton}
                    onPress={() => openYouTube(tune.title, tune.youtubeId)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="logo-youtube" size={16} color="#FF0000" />
                    <Text style={styles.youtubeButtonText}>Listen on YouTube</Text>
                    <Ionicons name="open-outline" size={14} color={colors.textTertiary} />
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </Section>

        <Divider />

        {/* Notable players */}
        <Section label="Notable players">
          <View style={styles.playersRow}>
            {mode.notablePlayers.map((p, i) => (
              <View key={i} style={styles.playerPill}>
                <Text style={styles.playerText}>{p}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Divider />

        {/* Theory */}
        <Section label="Theory">
          <View style={styles.theoryGrid}>
            <TheoryRow label="Formula" value={mode.formula} />
            <TheoryRow label="Relative key" value={mode.relativeKey} />
            <TheoryRow label="Intervals" value={mode.intervals.join('  ')} mono />
          </View>
        </Section>

        {/* Related modes */}
        {related.length > 0 && (
          <>
            <Divider />
            <Section label="Often confused with">
              {related.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={styles.relatedCard}
                  onPress={() => navigation.replace('ModeDetail', { modeId: r.id })}
                  activeOpacity={0.8}
                >
                  <View>
                    <Text style={styles.relatedName}>{r.name}</Text>
                    <Text style={styles.relatedOneWord}>{r.oneWord}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color={colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </Section>
          </>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function TheoryRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={styles.theoryRow}>
      <Text style={styles.theoryLabel}>{label}</Text>
      <Text style={[styles.theoryValue, mono && styles.theoryMono]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  errorContainer: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  backLabel: { fontSize: 15, color: colors.textPrimary },
  brightnessBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  brightnessText: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg },
  hero: { paddingTop: spacing.md, paddingBottom: spacing.lg },
  heroTop: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md, marginBottom: 4 },
  degree: { fontSize: 48, fontWeight: '200', letterSpacing: -1 },
  name: { fontSize: 36, fontWeight: '300', color: colors.textPrimary, letterSpacing: 1 },
  oneWord: { fontSize: 11, fontWeight: '600', color: colors.textTertiary, letterSpacing: 2, textTransform: 'uppercase', marginBottom: spacing.md },
  character: { fontSize: 16, color: colors.textSecondary, lineHeight: 26 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  section: { marginBottom: spacing.sm },
  sectionLabel: { fontSize: 11, fontWeight: '600', color: colors.textTertiary, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.md },
  colorNoteCard: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderLeftWidth: 3, padding: spacing.md, marginBottom: spacing.sm },
  colorNoteValue: { fontSize: 18, fontWeight: '500', marginBottom: 4 },
  colorNoteInterval: { fontSize: 13, color: colors.textTertiary },
  avoidNoteCard: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderLeftWidth: 3, borderLeftColor: colors.warning, padding: spacing.md },
  avoidLabel: { fontSize: 11, color: colors.warning, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  avoidValue: { fontSize: 15, color: colors.textSecondary },
  chordCard: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  chordCardTop: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.sm },
  chordSymbol: { fontSize: 22, fontWeight: '500', color: colors.textPrimary },
  chordType: { fontSize: 13, color: colors.textTertiary },
  chordDescription: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.sm },
  progressionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  progressionPill: { backgroundColor: colors.bgElevated, borderRadius: radius.full, paddingHorizontal: 10, paddingVertical: 3 },
  progressionText: { fontSize: 11, color: colors.accent, fontFamily: 'Courier' },
  tuneCard: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, marginBottom: spacing.sm },
  tuneTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 },
  tuneTitle: { fontSize: 16, fontWeight: '500', color: colors.textPrimary, flex: 1 },
  tuneYear: { fontSize: 12, color: colors.textTertiary, marginLeft: spacing.sm },
  tuneArtist: { fontSize: 13, color: colors.accent, marginBottom: spacing.sm },
  tuneWhy: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  youtubeButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.bgElevated, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: 8,
    borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start',
    marginTop: 4,
  },
  youtubeButtonText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  playersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  playerPill: { backgroundColor: colors.bgCard, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 6 },
  playerText: { fontSize: 13, color: colors.textSecondary },
  theoryGrid: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  theoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  theoryLabel: { fontSize: 13, color: colors.textTertiary },
  theoryValue: { fontSize: 13, color: colors.textPrimary, textAlign: 'right', flex: 1, marginLeft: spacing.md },
  theoryMono: { fontFamily: 'Courier', color: colors.accent, letterSpacing: 2 },
  relatedCard: { backgroundColor: colors.bgCard, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  relatedName: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },
  relatedOneWord: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
});
