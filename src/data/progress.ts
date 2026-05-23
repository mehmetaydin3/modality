import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ModeProgress {
  modeId: string;
  explored: boolean;       // visited detail screen at least once
  exploredAt?: string;     // ISO date string
  listenCount: number;     // number of times audio played
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: string;    // ISO date string
  currentPage: number;     // last page index reached
}

export interface QuizSession {
  id: string;
  completedAt: string;     // ISO date string
  score: number;           // correct answers
  total: number;           // total questions
  questionIds: string[];   // which questions appeared
}

export interface StreakData {
  current: number;         // current streak in days
  best: number;            // all-time best streak
  lastActiveDate?: string; // ISO date string — last day app was used
}

export interface UserProgress {
  modes: Record<string, ModeProgress>;
  lessons: Record<string, LessonProgress>;
  quizSessions: QuizSession[];
  streak: StreakData;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Storage key ────────────────────────────────────────────────────────────

const STORAGE_KEY = '@modality/progress';

// ── Default state ──────────────────────────────────────────────────────────

export function defaultProgress(): UserProgress {
  const now = new Date().toISOString();
  return {
    modes: {},
    lessons: {},
    quizSessions: [],
    streak: { current: 0, best: 0 },
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

// ── Load & save ────────────────────────────────────────────────────────────

export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress();
    return JSON.parse(raw) as UserProgress;
  } catch {
    return defaultProgress();
  }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  try {
    progress.updatedAt = new Date().toISOString();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // fail silently — progress is a nice-to-have, not critical
  }
}

export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}

// ── Mode actions ───────────────────────────────────────────────────────────

export async function markModeExplored(modeId: string): Promise<void> {
  const progress = await loadProgress();
  const existing = progress.modes[modeId];
  if (existing?.explored) return; // already marked, no-op
  progress.modes[modeId] = {
    modeId,
    explored: true,
    exploredAt: new Date().toISOString(),
    listenCount: existing?.listenCount ?? 0,
  };
  await saveProgress(progress);
}

export async function incrementListenCount(modeId: string): Promise<void> {
  const progress = await loadProgress();
  const existing = progress.modes[modeId] ?? {
    modeId,
    explored: false,
    listenCount: 0,
  };
  progress.modes[modeId] = {
    ...existing,
    listenCount: existing.listenCount + 1,
  };
  await saveProgress(progress);
}

// ── Lesson actions ─────────────────────────────────────────────────────────

export async function updateLessonProgress(
  lessonId: string,
  currentPage: number,
  completed: boolean
): Promise<void> {
  const progress = await loadProgress();
  const existing = progress.lessons[lessonId];
  progress.lessons[lessonId] = {
    lessonId,
    completed: completed || existing?.completed || false,
    completedAt:
      completed && !existing?.completed
        ? new Date().toISOString()
        : existing?.completedAt,
    currentPage,
  };
  await saveProgress(progress);
}

// ── Quiz actions ───────────────────────────────────────────────────────────

export async function recordQuizSession(
  score: number,
  total: number,
  questionIds: string[]
): Promise<void> {
  const progress = await loadProgress();
  const session: QuizSession = {
    id: `quiz-${Date.now()}`,
    completedAt: new Date().toISOString(),
    score,
    total,
    questionIds,
  };
  progress.quizSessions = [session, ...progress.quizSessions].slice(0, 50); // keep last 50
  await saveProgress(progress);
}

// ── Streak actions ─────────────────────────────────────────────────────────

export async function updateStreak(): Promise<StreakData> {
  const progress = await loadProgress();
  const today = toDateString(new Date());
  const last = progress.streak.lastActiveDate;

  if (last === today) {
    // Already active today — no change
    return progress.streak;
  }

  const yesterday = toDateString(
    new Date(Date.now() - 24 * 60 * 60 * 1000)
  );

  let current: number;
  if (last === yesterday) {
    // Consecutive day — increment
    current = progress.streak.current + 1;
  } else {
    // Streak broken — reset to 1
    current = 1;
  }

  const best = Math.max(current, progress.streak.best);
  const streak: StreakData = { current, best, lastActiveDate: today };
  progress.streak = streak;
  await saveProgress(progress);
  return streak;
}

// ── Onboarding ─────────────────────────────────────────────────────────────

export async function completeOnboarding(): Promise<void> {
  const progress = await loadProgress();
  progress.onboardingCompleted = true;
  await saveProgress(progress);
}

// ── Derived stats ──────────────────────────────────────────────────────────

export function countExploredModes(progress: UserProgress): number {
  return Object.values(progress.modes).filter((m) => m.explored).length;
}

export function countCompletedLessons(progress: UserProgress): number {
  return Object.values(progress.lessons).filter((l) => l.completed).length;
}

export function averageQuizScore(progress: UserProgress): number {
  if (progress.quizSessions.length === 0) return 0;
  const total = progress.quizSessions.reduce(
    (sum, s) => sum + s.score / s.total,
    0
  );
  return Math.round((total / progress.quizSessions.length) * 100);
}

export function getCompletedLessonIds(progress: UserProgress): string[] {
  return Object.values(progress.lessons)
    .filter((l) => l.completed)
    .map((l) => l.lessonId);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
