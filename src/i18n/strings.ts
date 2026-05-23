export const strings = {

  // ── App ──────────────────────────────────────────────────────────────
  app: {
    name: 'Modality',
    tagline: 'Learn to hear jazz modes',
  },

  // ── Tabs ─────────────────────────────────────────────────────────────
  tabs: {
    browse: 'Browse',
    learn: 'Learn',
    practice: 'Practice',
    profile: 'Profile',
  },

  // ── Browse ────────────────────────────────────────────────────────────
  browse: {
    heading: 'Modes',
    subheading: 'The 7 diatonic modes',
    searchPlaceholder: 'Search modes...',
    filterAll: 'All',
    filterBright: 'Bright',
    filterNeutral: 'Neutral',
    filterDark: 'Dark',
    degreeLabel: 'Degree',
    parentScaleLabel: 'Parent scale',
    emptySearch: 'No modes match that search.',
  },

  // ── Mode detail ───────────────────────────────────────────────────────
  modeDetail: {
    sectionSound: 'The sound',
    sectionColorNote: 'Color note',
    sectionAvoidNote: 'Avoid note',
    sectionChordContext: 'Chord context',
    sectionClassicTunes: 'Classic tunes',
    sectionNotablePlayers: 'Notable players',
    sectionTheory: 'Theory',
    sectionRelatedModes: 'Often confused with',
    formulaLabel: 'Formula',
    intervalsLabel: 'Intervals',
    relativeKeyLabel: 'Relative key',
    listenLabel: 'Listen',
    listenOnYouTube: 'Listen on YouTube',
    playDemo: 'Play demo',
    stopDemo: 'Stop',
    degreeFormat: (degree: number) => `${degree}${ordinal(degree)} degree of the major scale`,
  },

  // ── Chord context ─────────────────────────────────────────────────────
  chordContext: {
    heading: 'Chord context',
    subheading: 'What to play it over',
    commonProgressions: 'Common progressions',
    playOver: 'Play over',
  },

  // ── Learn ─────────────────────────────────────────────────────────────
  learn: {
    heading: 'Learn',
    subheading: 'Six lessons. From sound to fluency.',
    lessonLabel: 'Lesson',
    startLesson: 'Start',
    continueLesson: 'Continue',
    reviewLesson: 'Review',
    completed: 'Completed',
    locked: 'Locked',
    minutesShort: (n: number) => `${n} min`,
    nextLesson: 'Next lesson',
    previousLesson: 'Previous',
    finishLesson: 'Finish',
  },

  // ── Lessons content ───────────────────────────────────────────────────
  lessons: {
    l1: {
      title: 'What is a mode?',
      subtitle: 'Not a scale shape — a sound',
      duration: 8,
      intro:
        'You already know the major scale. A mode is what happens when you ' +
        'treat a different note of that scale as home. Same notes, different gravity.',
    },
    l2: {
      title: 'Ionian & Dorian',
      subtitle: 'The anchor pair',
      duration: 10,
      intro:
        'Start with the two most important modes. Ionian is where you already live. ' +
        'Dorian is where jazz lives. Learn to hear the difference.',
    },
    l3: {
      title: 'The bright modes',
      subtitle: 'Lydian and Mixolydian',
      duration: 10,
      intro:
        'Lydian floats above Ionian. Mixolydian sits just below it. ' +
        'Both are bright — but each has a different relationship with tension.',
    },
    l4: {
      title: 'The dark modes',
      subtitle: 'Phrygian, Aeolian, Locrian',
      duration: 12,
      intro:
        'Three shades of minor. Aeolian grieves. Phrygian broods. ' +
        'Locrian refuses to resolve. Learn what separates them.',
    },
    l5: {
      title: 'Chord context',
      subtitle: 'When to use what',
      duration: 12,
      intro:
        'A mode without its chord is useless. This lesson connects each mode ' +
        'to the chords it belongs over — and why it fits.',
    },
    l6: {
      title: 'Modes by ear',
      subtitle: 'Telling similar modes apart',
      duration: 15,
      intro:
        'Dorian vs Aeolian. Lydian vs Ionian. Phrygian vs Locrian. ' +
        'The hardest skill in modal playing is hearing the difference. ' +
        'This lesson trains exactly that.',
    },
  },

  // ── Practice / Quiz ───────────────────────────────────────────────────
  practice: {
    heading: 'Practice',
    subheading: 'Train your ear',
    quizTitle: 'Mode quiz',
    quizSubtitle: 'Four question types',
    startQuiz: 'Start quiz',
    nextQuestion: 'Next',
    seeResult: 'See result',
    correct: 'Correct',
    incorrect: 'Not quite',
    explanation: 'Why?',
    score: (correct: number, total: number) => `${correct} of ${total}`,
    perfectScore: 'Perfect. Your ear is developing.',
    goodScore: 'Good. Keep listening.',
    lowScore: 'Keep practicing. The ear takes time.',
    questionTypes: {
      idByEar: 'Which mode is this?',
      colorNote: 'What is the color note of',
      chordFit: 'Which mode fits over this chord?',
      tuneName: 'Which mode does this tune use?',
    },
    streakLabel: 'Streak',
    streakDays: (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`,
  },

  // ── Profile ───────────────────────────────────────────────────────────
  profile: {
    heading: 'Profile',
    modesExplored: 'Modes explored',
    modesExploredOf: (explored: number, total: number) => `${explored} of ${total}`,
    lessonsCompleted: 'Lessons completed',
    quizzesTaken: 'Quizzes taken',
    currentStreak: 'Current streak',
    bestStreak: 'Best streak',
    resetProgress: 'Reset progress',
    resetConfirm: 'This will clear all your progress. Are you sure?',
    resetYes: 'Reset',
    resetNo: 'Cancel',
  },

  // ── Onboarding ────────────────────────────────────────────────────────
  onboarding: {
    slide1Title: 'Sound before theory',
    slide1Body:
      'Most apps teach you scale patterns. Modality teaches you sounds. ' +
      'You will learn to hear a mode before you learn its name.',
    slide2Title: 'Seven modes',
    slide2Body:
      'Ionian. Dorian. Phrygian. Lydian. Mixolydian. Aeolian. Locrian. ' +
      'Each has a distinct emotional character. Each belongs over specific chords.',
    slide3Title: 'Real jazz',
    slide3Body:
      'Every mode is anchored to a canonical recording and a real chord context. ' +
      'No exercises in isolation — only music that actually sounds like jazz.',
    getStarted: 'Get started',
    next: 'Next',
    skip: 'Skip',
  },

  // ── Common ────────────────────────────────────────────────────────────
  common: {
    back: 'Back',
    close: 'Close',
    done: 'Done',
    loading: 'Loading...',
    error: 'Something went wrong.',
    retry: 'Try again',
    comingSoon: 'Coming soon',
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────
function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
