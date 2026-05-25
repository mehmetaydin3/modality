import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius } from '../theme';

interface ScaleDiagramProps {
  intervals: number[];
  colorNoteInterval: string;
  avoidNoteInterval?: string;
  brightness: 'bright' | 'neutral' | 'dark';
  rootSemitone: number;
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

const NOTE_NAMES_FLAT  = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
const NOTE_NAMES_SHARP = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

const WHOLE_WIDTH = 48;
const HALF_WIDTH = 24;
const BLOCK_HEIGHT = 44;

function getNoteNames(intervals: number[], rootSemitone: number, brightness: string): string[] {
  const names = brightness === 'bright' ? NOTE_NAMES_SHARP : NOTE_NAMES_FLAT;
  return intervals.map(interval => names[(rootSemitone + interval) % 12]);
}

function getStepType(current: number, next: number): 'W' | 'H' {
  return (next - current) === 2 ? 'W' : 'H';
}

export default function ScaleDiagram({
  intervals, colorNoteInterval, avoidNoteInterval, brightness, rootSemitone,
}: ScaleDiagramProps) {
  const accentColor = BRIGHTNESS_COLOR[brightness];
  const noteNames = getNoteNames(intervals, rootSemitone, brightness);

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

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
        <View>
          {/* Blocks row */}
          <View style={styles.blocksRow}>
            {intervals.map((_, i) => {
              const w = getBlockWidth(i);
              const colorNote = isColorNote(i);
              const avoidNote = isAvoidNote(i);
              let bgColor = colors.bgElevated;
              let borderColor = colors.border;
              if (colorNote) { bgColor = accentColor + '33'; borderColor = accentColor; }
              else if (avoidNote) { bgColor = colors.warning + '22'; borderColor = colors.warning; }

              return (
                <View key={i} style={[styles.degreeCol, { width: w }]}>
                  <View style={[
                    styles.block,
                    { width: w - 4, backgroundColor: bgColor, borderColor },
                    colorNote && styles.blockGlow,
                  ]}>
                    <Text style={[
                      styles.degreeLabel,
                      colorNote && { color: accentColor, fontWeight: '700' },
                      avoidNote && { color: colors.warning },
                    ]}>
                      {degreeNumbers[i]}
                    </Text>
                  </View>
                  <Text style={[styles.stepLabel, colorNote && { color: accentColor }]}>
                    {i < steps.length ? steps[i] : ' '}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Note names row */}
          <View style={styles.noteNamesRow}>
            {noteNames.map((note, i) => {
              const w = getBlockWidth(i);
              const colorNote = isColorNote(i);
              const avoidNote = isAvoidNote(i);
              return (
                <View key={i} style={[styles.noteNameCol, { width: w }]}>
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
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendWhole]} />
          <Text style={styles.legendText}>W = whole step</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendHalf]} />
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
  blocksRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2 },
  degreeCol: { alignItems: 'center' },
  block: {
    height: BLOCK_HEIGHT,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  blockGlow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  degreeLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  stepLabel: { fontSize: 10, color: colors.textTertiary, marginTop: 4, fontWeight: '500' },
  noteNamesRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  noteNameCol: { alignItems: 'center' },
  noteName: { fontSize: 13, fontWeight: '500' },
  legend: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendWhole: { width: 20, height: 14, borderRadius: 3, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  legendHalf: { width: 12, height: 14, borderRadius: 3, backgroundColor: colors.bgElevated, borderWidth: 1, borderColor: colors.border },
  legendColor: { width: 14, height: 14, borderRadius: 3, borderWidth: 1 },
  legendText: { fontSize: 11, color: colors.textTertiary },
});
