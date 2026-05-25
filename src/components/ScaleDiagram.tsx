import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '../theme';
import RhodesEngine, { RhodesEngineRef } from '../audio/RhodesEngine';

interface ScaleDiagramProps {
  intervals: number[];
  colorNoteInterval: string;
  avoidNoteInterval?: string;
  brightness: 'bright' | 'neutral' | 'dark';
  defaultRootSemitone: number;
}

const BRIGHTNESS_COLOR: Record<string, string> = {
  bright: colors.bright,
  neutral: colors.neutral,
  dark: colors.dark,
};

const DEGREE_NUMBERS: Record<number, string> = {
  0: '1', 1: '2', 2: '2', 3: '3', 4: '3',
  5: '4', 6: '4', 7: '5', 8: '6', 9: '6',
  10: '7', 11: '7', 12: '8',
};

const DEGREE_LABELS: Record<number, string> = {
  0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3',
  5: '4', 6: '#4', 7: '5', 8: 'b6', 9: '6',
  10: 'b7', 11: '7', 12: '8',
};

const CHROMATIC_NOTES = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
const NOTE_NAMES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const NOTE_NAMES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const FLAT_KEYS = new Set([1, 3, 5, 8, 10]);

// Middle C = MIDI 60. Each mode's natural root offset from C.
const ROOT_MIDI: Record<number, number> = {
  0: 60,  // C
  1: 61,  // C#
  2: 62,  // D
  3: 63,  // Eb
  4: 64,  // E
  5: 65,  // F
  6: 66,  // F#
  7: 67,  // G
  8: 68,  // Ab
  9: 69,  // A
  10: 70, // Bb
  11: 71, // B
};

const WHOLE_WIDTH = 48;
const HALF_WIDTH = 28;
const BLOCK_HEIGHT = 44;

function getNoteNames(intervals: number[], rootSemitone: number): string[] {
  const useFlats = FLAT_KEYS.has(rootSemitone);
  const names = useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES_SHARP;
  return intervals.map(interval => names[(rootSemitone + interval) % 12]);
}

function getStepType(current: number, next: number): 'W' | 'H' {
  return (next - current) === 2 ? 'W' : 'H';
}

function getMidiNotes(intervals: number[], rootSemitone: number): number[] {
  const rootMidi = ROOT_MIDI[rootSemitone] ?? 60;
  return intervals.map(interval => rootMidi + interval);
}

export default function ScaleDiagram({
  intervals, colorNoteInterval, avoidNoteInterval, brightness, defaultRootSemitone,
}: ScaleDiagramProps) {
  const [rootSemitone, setRootSemitone] = useState(defaultRootSemitone);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeDegree, setActiveDegree] = useState<number | null>(null);
  const engineRef = useRef<RhodesEngineRef>(null);
  const accentColor = BRIGHTNESS_COLOR[brightness];
  const noteNames = getNoteNames(intervals, rootSemitone);

  const steps: ('W' | 'H')[] = [];
  for (let i = 0; i < intervals.length - 1; i++) {
    steps.push(getStepType(intervals[i], intervals[i + 1]));
  }

  const degreeLabels = intervals.map(i => DEGREE_LABELS[i] ?? '?');
  const degreeNumbers = intervals.map(i => DEGREE_NUMBERS[i] ?? '?');

  const isColorNote = (i: number) => degreeLabels[i] === colorNoteInterval;
  const isAvoidNote = (i: number) => !!avoidNoteInterval && degreeLabels[i] === avoidNoteInterval;

  const getBlockWidth = (i: number) => {
    if (i === intervals.length - 1) return HALF_WIDTH;
    return steps[i] === 'W' ? WHOLE_WIDTH : HALF_WIDTH;
  };

  const handlePlayStop = () => {
    if (isPlaying) {
      engineRef.current?.stop();
      setIsPlaying(false);
      setActiveDegree(null);
      return;
    }
    const midiNotes = getMidiNotes(intervals, rootSemitone);
    setIsPlaying(true);
    setActiveDegree(0);
    engineRef.current?.playScale(
      midiNotes,
      (index) => setActiveDegree(index),
      () => {
        setIsPlaying(false);
        setActiveDegree(null);
      }
    );
  };

  return (
    <View style={styles.container}>
      <RhodesEngine ref={engineRef} />

      {/* Root picker */}
      <View style={styles.rootPickerSection}>
        <Text style={styles.rootPickerLabel}>Root</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.rootPicker}>
          {CHROMATIC_NOTES.map((note, semitone) => {
            const isSelected = semitone === rootSemitone;
            return (
              <TouchableOpacity
                key={semitone}
                style={[styles.rootNote, isSelected && { backgroundColor: accentColor + '33', borderColor: accentColor }]}
                onPress={() => { setActiveDegree(null);
                  setRootSemitone(semitone);
                  if (isPlaying) { engineRef.current?.stop(); setIsPlaying(false); setActiveDegree(null); }
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.rootNoteText, isSelected && { color: accentColor, fontWeight: '700' }]}>
                  {note}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Scale diagram */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
        <View>
          <View style={styles.blocksRow}>
            {intervals.map((_, i) => {
              const w = getBlockWidth(i);
              const colorNote = isColorNote(i);
              const avoidNote = isAvoidNote(i);
              const isActive = activeDegree === i;

              let bgColor = colors.bgElevated;
              let borderColor = colors.border;
              if (isActive) { bgColor = accentColor + '55'; borderColor = accentColor; }
              else if (colorNote) { bgColor = accentColor + '33'; borderColor = accentColor; }
              else if (avoidNote) { bgColor = colors.warning + '22'; borderColor = colors.warning; }

              return (
                <View key={i} style={[styles.degreeCol, { width: w }]}>
                  <View style={[
                    styles.block,
                    { width: w - 4, backgroundColor: bgColor, borderColor },
                    (colorNote || isActive) && styles.blockGlow,
                  ]}>
                    <Text style={[
                      styles.degreeLabel,
                      (colorNote || isActive) && { color: accentColor, fontWeight: '700' },
                      avoidNote && !isActive && { color: colors.warning },
                    ]}>
                      {degreeNumbers[i]}
                    </Text>
                  </View>
                  <Text style={[styles.stepLabel, (colorNote || isActive) && { color: accentColor }]}>
                    {i < steps.length ? steps[i] : ' '}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.noteNamesRow}>
            {noteNames.map((note, i) => {
              const w = getBlockWidth(i);
              const colorNote = isColorNote(i);
              const avoidNote = isAvoidNote(i);
              const isActive = activeDegree === i;
              return (
                <View key={i} style={[styles.noteNameCol, { width: w }]}>
                  <Text style={[
                    styles.noteName,
                    (colorNote || isActive) && { color: accentColor, fontWeight: '700' },
                    avoidNote && !isActive && { color: colors.warning },
                    !colorNote && !avoidNote && !isActive && { color: colors.textSecondary },
                  ]}>
                    {note}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Play button */}
      <TouchableOpacity
        style={[styles.playButton, isPlaying && { backgroundColor: accentColor + '22', borderColor: accentColor }]}
        onPress={handlePlayStop}
        activeOpacity={0.8}
      >
        <Ionicons
          name={isPlaying ? 'stop' : 'play'}
          size={14}
          color={isPlaying ? accentColor : colors.textSecondary}
        />
        <Text style={[styles.playButtonText, isPlaying && { color: accentColor }]}>
          {isPlaying ? 'Stop' : 'Play scale'}
        </Text>
      </TouchableOpacity>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendWhole} />
          <Text style={styles.legendText}>W = whole step</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendHalf} />
          <Text style={styles.legendText}>H = half step</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: accentColor + '33', borderColor: accentColor }]} />
          <Text style={[styles.legendText, { color: accentColor }]}>color note</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rootPickerSection: { marginBottom: spacing.md },
  rootPickerLabel: {
    fontSize: 10, fontWeight: '600', color: colors.textTertiary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.sm,
  },
  rootPicker: { flexDirection: 'row' },
  rootNote: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: radius.full, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.bgElevated, marginRight: 6,
  },
  rootNoteText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  blocksRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2 },
  degreeCol: { alignItems: 'center' },
  block: {
    height: BLOCK_HEIGHT, borderRadius: radius.sm, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 2,
  },
  blockGlow: {
    shadowColor: colors.accent, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 6, elevation: 4,
  },
  degreeLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  stepLabel: { fontSize: 10, color: colors.textTertiary, marginTop: 4, fontWeight: '500' },
  noteNamesRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  noteNameCol: { alignItems: 'center' },
  noteName: { fontSize: 13, fontWeight: '500' },
  playButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, marginTop: spacing.md, paddingVertical: 10,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.bgElevated,
  },
  playButtonText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  legend: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendWhole: { width: 20, height: 14, borderRadius: 3, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  legendHalf: { width: 12, height: 14, borderRadius: 3, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  legendColor: { width: 14, height: 14, borderRadius: 3, borderWidth: 1 },
  legendText: { fontSize: 11, color: colors.textTertiary },
});
