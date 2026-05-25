import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius } from '../theme';

interface ScaleDiagramProps {
  intervals: number[];        // e.g. [0,2,3,5,7,9,10] for Dorian
  colorNoteInterval: string;  // e.g. '6'
  avoidNoteInterval?: string; // e.g. 'b2'
  rootName?: string;          // e.g. 'D'
  brightness: 'bright' | 'neutral' | 'dark';
}

const BRIGHTNESS_COLOR: Record<string, string> = {
  bright: colors.bright,
  neutral: colors.neutral,
  dark: colors.dark,
};

// Degree labels from semitone intervals
const DEGREE_LABELS: Record<number, string> = {
  0:  '1',
  1:  'b2',
  2:  '2',
  3:  'b3',
  4:  '3',
  5:  '4',
  6:  '#4',
  7:  '5',
  8:  'b6',
  9:  '6',
  10: 'b7',
  11: '7',
  12: '8',
};

// Note names from C for a given root offset
const NOTE_NAMES_FROM_C = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// Default roots per mode for display
const MODE_ROOTS: Record<number, number> = {
  0: 0,  // Ionian → C
  2: 2,  // Dorian → D
  4: 4,  // Phrygian → E
  5: 5,  // Lydian → F
  7: 7,  // Mixolydian → G
  9: 9,  // Aeolian → A
  11: 11, // Locrian → B
};

function getNoteNames(intervals: number[]): string[] {
  // Find root from first interval (always 0)
  const rootSemitone = intervals[0];
  const root = MODE_ROOTS[rootSemitone] ?? 0;
  return intervals.map((interval) => {
    const semitone = (root + interval) % 12;
    return NOTE_NAMES_FROM_C[semitone];
  });
}

function getStepType(current: number, next: number): 'W' | 'H' {
  const diff = next - current;
  return diff === 2 ? 'W' : 'H';
}

export default function ScaleDiagram({
  intervals,
  colorNoteInterval,
  avoidNoteInterval,
  brightness,
}: ScaleDiagramProps) {
  const accentColor = BRIGHTNESS_COLOR[brightness];
  const noteNames = getNoteNames(intervals);

  // Build steps between each degree
  const steps: ('W' | 'H')[] = [];
  for (let i = 0; i < intervals.length - 1; i++) {
    steps.push(getStepType(intervals[i], intervals[i + 1]));
  }

  // Map degree label to interval index for color note matching
  const degreeLabels = intervals.map(i => DEGREE_LABELS[i] ?? '?');

  const isColorNote = (index: number) => {
    const label = degreeLabels[index];
    return label === colorNoteInterval || label === colorNoteInterval.replace('b', '♭').replace('#', '♯');
  };

  const isAvoidNote = (index: number) => {
    if (!avoidNoteInterval) return false;
    const label = degreeLabels[index];
    return label === avoidNoteInterval;
  };

  return (
    <View style={styles.container}>

      {/* Step blocks */}
      <View style={styles.blocksRow}>
        {intervals.slice(0, -1).map((_, i) => {
          const step = steps[i];
          const isWhole = step === 'W';
          const colorNote = isColorNote(i);
          const avoidNote = isAvoidNote(i);

          let blockColor = colors.bgElevated;
          let borderColor = colors.border;
          if (colorNote) {
            blockColor = accentColor + '33';
            borderColor = accentColor;
          } else if (avoidNote) {
            blockColor = colors.warning + '22';
            borderColor = colors.warning;
          }

          return (
            <View key={i} style={styles.degreeCol}>
              {/* Block — wider for whole step */}
              <View style={[
                styles.block,
                isWhole ? styles.blockWhole : styles.blockHalf,
                { backgroundColor: blockColor, borderColor },
                colorNote && styles.blockGlow,
              ]}>
                <Text style={[
                  styles.degreeLabel,
                  colorNote && { color: accentColor, fontWeight: '700' },
                  avoidNote && { color: colors.warning },
                ]}>
                  {degreeLabels[i]}
                </Text>
              </View>

              {/* Step label below block */}
              <Text style={[styles.stepLabel, colorNote && { color: accentColor }]}>
                {step}
              </Text>
            </View>
          );
        })}

        {/* Last degree (octave) */}
        <View style={styles.degreeCol}>
          <View style={[styles.block, styles.blockOctave, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
            <Text style={styles.degreeLabel}>8</Text>
          </View>
          <Text style={styles.stepLabel}> </Text>
        </View>
      </View>

      {/* Note names row */}
      <View style={styles.noteNamesRow}>
        {noteNames.map((note, i) => {
          const colorNote = isColorNote(i);
          const avoidNote = isAvoidNote(i);
          return (
            <View
              key={i}
              style={[
                styles.noteNameCol,
                i < noteNames.length - 1
                  ? (steps[i] === 'W' ? styles.noteNameWhole : styles.noteNameHalf)
                  : styles.noteNameOctave,
              ]}
            >
              <Text style={[
                styles.noteName,
                colorNote && { color: accentColor, fontWeight: '700' },
                avoidNote && { color: colors.warning },
                !colorNote && !avoidNote && { color: colors.textSecondary },
              ]}>
                {note}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBlock, styles.legendWhole]} />
          <Text style={styles.legendText}>W = whole step</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBlock, styles.legendHalf]} />
          <Text style={styles.legendText}>H = half step</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBlock, { backgroundColor: accentColor + '33', borderColor: accentColor, borderWidth: 1 }]} />
          <Text style={[styles.legendText, { color: accentColor }]}>color note</Text>
        </View>
      </View>
    </View>
  );
}

const WHOLE_WIDTH = 44;
const HALF_WIDTH = 28;
const BLOCK_HEIGHT = 40;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  blocksRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  degreeCol: {
    alignItems: 'center',
  },
  block: {
    height: BLOCK_HEIGHT,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 1,
  },
  blockWhole: { width: WHOLE_WIDTH },
  blockHalf: { width: HALF_WIDTH },
  blockOctave: { width: HALF_WIDTH },
  blockGlow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  degreeLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  stepLabel: {
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 4,
    fontWeight: '500',
  },
  noteNamesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  noteNameCol: {
    alignItems: 'center',
    marginHorizontal: 1,
  },
  noteNameWhole: { width: WHOLE_WIDTH },
  noteNameHalf: { width: HALF_WIDTH },
  noteNameOctave: { width: HALF_WIDTH },
  noteName: {
    fontSize: 12,
    fontWeight: '500',
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendBlock: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendWhole: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    width: 20,
  },
  legendHalf: {
    backgroundColor: colors.bgElevated,
    borderWidth: 1,
    borderColor: colors.border,
    width: 14,
  },
  legendText: {
    fontSize: 11,
    color: colors.textTertiary,
  },
});
