import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius } from '../theme';
import { strings } from '../i18n/strings';

const { width } = Dimensions.get('window');
const STORAGE_KEY = '@modality/onboarding_v1';

const slides = [
  {
    key: 'sound',
    eyebrow: 'JAZZ MODES',
    title: strings.onboarding.slide1Title,
    body: strings.onboarding.slide1Body,
    accent: colors.accent,
    isLast: false,
  },
  {
    key: 'seven',
    eyebrow: 'SEVEN SOUNDS',
    title: strings.onboarding.slide2Title,
    body: strings.onboarding.slide2Body,
    accent: colors.bright,
    isLast: false,
  },
  {
    key: 'jazz',
    eyebrow: 'REAL MUSIC',
    title: strings.onboarding.slide3Title,
    body: strings.onboarding.slide3Body,
    accent: colors.neutral,
    isLast: true,
  },
];

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEY)) === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
  } catch {}
}

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleNext = () => {
    const next = currentIndex + 1;
    scrollRef.current?.scrollTo({ x: next * width, animated: true });
    setCurrentIndex(next);
  };

  const handleComplete = async () => {
    await markOnboardingSeen();
    onComplete();
  };

  const slide = slides[currentIndex];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      >
        {slides.map((s) => (
          <View key={s.key} style={styles.slide}>
            <View style={styles.content}>
              <Text style={[styles.eyebrow, { color: s.accent }]}>{s.eyebrow}</Text>
              <Text style={[styles.title, { color: s.accent }]}>{s.title}</Text>
              <View style={[styles.divider, { backgroundColor: s.accent }]} />
              <Text style={styles.body}>{s.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && { width: 20, backgroundColor: slide.accent },
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {!slide.isLast ? (
          <>
            <TouchableOpacity onPress={handleComplete} style={styles.skipButton}>
              <Text style={styles.skipText}>{strings.onboarding.skip}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.nextButton, { backgroundColor: slide.accent }]}
            >
              <Text style={styles.nextText}>{strings.onboarding.next}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={handleComplete}
            style={[styles.startButton, { backgroundColor: slide.accent }]}
          >
            <Text style={styles.nextText}>{strings.onboarding.getStarted}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: colors.bg,
    zIndex: 999,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
  },
  content: { gap: spacing.lg },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 38,
    fontWeight: '200',
    letterSpacing: -1,
    lineHeight: 44,
  },
  divider: {
    width: 40,
    height: 2,
    borderRadius: radius.full,
  },
  body: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 26,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: 48,
  },
  skipButton: { padding: spacing.md },
  skipText: { fontSize: 14, color: colors.textTertiary },
  nextButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: radius.full,
  },
  startButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: radius.full,
  },
  nextText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.bg,
  },
});
