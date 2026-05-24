import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MODES, Mode } from '../data/modes';
import { colors, spacing, radius } from '../theme';
import { strings } from '../i18n/strings';

type BrightnessFilter = 'all' | 'bright' | 'neutral' | 'dark';

const FILTERS: { label: string; value: BrightnessFilter }[] = [
  { label: strings.browse.filterAll, value: 'all' },
  { label: strings.browse.filterBright, value: 'bright' },
  { label: strings.browse.filterNeutral, value: 'neutral' },
  { label: strings.browse.filterDark, value: 'dark' },
];

const BRIGHTNESS_COLOR: Record<string, string> = {
  bright: colors.bright,
  neutral: colors.neutral,
  dark: colors.dark,
};

export default function BrowseScreen({ navigation }: any) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<BrightnessFilter>('all');
  const searchBarAnim = useRef(new Animated.Value(1)).current;
  const lastScrollY = useRef(0);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: searchBarAnim } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const currentY = event.nativeEvent.contentOffset.y;
        const diff = currentY - lastScrollY.current;
        if (diff > 5 && currentY > 60) {
          Animated.timing(searchBarAnim, { toValue: 0, duration: 120, useNativeDriver: false }).start();
        } else if (diff < -5) {
          Animated.timing(searchBarAnim, { toValue: 1, duration: 120, useNativeDriver: false }).start();
        }
        lastScrollY.current = currentY;
      },
    }
  );

  const filtered = useMemo(() => {
    return MODES.filter((m) => {
      const matchesSearch =
        search.trim() === '' ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.oneWord.toLowerCase().includes(search.toLowerCase()) ||
        m.character.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || m.brightness === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>{strings.browse.heading}</Text>
          <Text style={styles.subheading}>{strings.browse.subheading}</Text>
        </View>

        {/* Animated search bar */}
        <Animated.View style={[styles.searchRow, {
          opacity: searchBarAnim,
          maxHeight: searchBarAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] }),
          overflow: 'hidden',
        }]}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={16} color={colors.textTertiary} style={{ marginRight: 6 }} />
            <TextInput
              style={styles.searchInput}
              placeholder={strings.browse.searchPlaceholder}
              placeholderTextColor={colors.textTertiary}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons name="close-circle" size={16} color={colors.accent} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Brightness filters */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.filterPill, filter === f.value && styles.filterPillActive]}
              onPress={() => setFilter(f.value)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterLabel, filter === f.value && styles.filterLabelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Mode list */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          ListEmptyComponent={
            <Text style={styles.empty}>{strings.browse.emptySearch}</Text>
          }
          renderItem={({ item }) => (
            <ModeCard
              mode={item}
              onPress={() => navigation.navigate('ModeDetail', { modeId: item.id })}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function ModeCard({ mode, onPress }: { mode: Mode; onPress: () => void }) {
  const accentColor = BRIGHTNESS_COLOR[mode.brightness];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.degreeBadge, { borderColor: accentColor }]}>
        <Text style={[styles.degreeText, { color: accentColor }]}>{mode.degree}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <Text style={styles.modeName}>{mode.name}</Text>
          <View style={[styles.brightnessPill, { backgroundColor: accentColor + '22' }]}>
            <Text style={[styles.brightnessLabel, { color: accentColor }]}>{mode.brightness}</Text>
          </View>
        </View>
        <Text style={styles.oneWord}>{mode.oneWord}</Text>
        <Text style={styles.character} numberOfLines={2}>{mode.character}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.colorNoteLabel}>Color note</Text>
          <Text style={styles.colorNoteValue}>{mode.colorNote}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  heading: { fontSize: 32, fontWeight: '300', color: colors.textPrimary, letterSpacing: 1.5 },
  subheading: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.lg, marginVertical: spacing.sm,
  },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.bgCard, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.textPrimary, paddingVertical: 12 },
  filterRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.sm },
  filterPill: {
    paddingHorizontal: spacing.md, paddingVertical: 6,
    borderRadius: radius.full, borderWidth: 1,
    borderColor: colors.border, backgroundColor: colors.bgCard,
  },
  filterPillActive: { backgroundColor: colors.accentMuted, borderColor: colors.accent },
  filterLabel: { fontSize: 12, fontWeight: '500', color: colors.textTertiary },
  filterLabelActive: { color: colors.accent },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  empty: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xxl },
  card: {
    backgroundColor: colors.bgCard, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: spacing.md, flexDirection: 'row', overflow: 'hidden',
  },
  degreeBadge: {
    width: 44, alignItems: 'center', justifyContent: 'center',
    borderRightWidth: 1, borderRightColor: colors.border,
  },
  degreeText: { fontSize: 18, fontWeight: '300', letterSpacing: 1 },
  cardContent: { flex: 1, padding: spacing.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  modeName: { fontSize: 18, fontWeight: '500', color: colors.textPrimary, letterSpacing: 0.5 },
  brightnessPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.full },
  brightnessLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  oneWord: {
    fontSize: 12, fontWeight: '600', color: colors.textTertiary,
    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.sm,
  },
  character: { fontSize: 13, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.sm },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  colorNoteLabel: { fontSize: 11, color: colors.textTertiary, fontWeight: '500' },
  colorNoteValue: { fontSize: 11, color: colors.accent, fontWeight: '500' },
});
