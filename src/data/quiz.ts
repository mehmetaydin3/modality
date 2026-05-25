import { MODES } from './modes';

export type QuestionType =
  | 'id_by_ear'
  | 'color_note'
  | 'chord_fit'
  | 'tune_name'
  | 'avoid_note'
  | 'brightness';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  modeId?: string;
  audioUrl?: string;
  videoIds?: string[];  // multiple IDs — one picked randomly per session
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [

  // ── Color note questions ───────────────────────────────────────────────

  {
    id: 'q-cn-dorian',
    type: 'color_note',
    prompt: 'What is the color note of Dorian?',
    options: ['The flat 3rd', 'The natural 6th', 'The flat 7th', 'The raised 4th'],
    correctAnswer: 'The natural 6th',
    explanation:
      'The natural 6th is what separates Dorian from Aeolian. ' +
      'Over a minor chord, that raised 6th adds brightness and forward motion — ' +
      'the defining sound of Dorian.',
    modeId: 'dorian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-lydian',
    type: 'color_note',
    prompt: 'What is the color note of Lydian?',
    options: ['The major 7th', 'The flat 7th', 'The raised 4th', 'The natural 6th'],
    correctAnswer: 'The raised 4th',
    explanation:
      'The #4 gives Lydian its floating, suspended quality. ' +
      'Without it, Lydian collapses into Ionian.',
    modeId: 'lydian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-mixolydian',
    type: 'color_note',
    prompt: 'What is the color note of Mixolydian?',
    options: ['The raised 4th', 'The flat 6th', 'The flat 2nd', 'The flat 7th'],
    correctAnswer: 'The flat 7th',
    explanation:
      'The flat 7th makes Mixolydian sound bluesy instead of major. ' +
      'It is also the note that defines every dominant 7th chord.',
    modeId: 'mixolydian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-phrygian',
    type: 'color_note',
    prompt: 'What is the color note of Phrygian?',
    options: ['The flat 5th', 'The flat 6th', 'The flat 2nd', 'The flat 7th'],
    correctAnswer: 'The flat 2nd',
    explanation:
      'The flat 2nd — just a half step above the root — gives Phrygian its Spanish, ancient quality.',
    modeId: 'phrygian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-aeolian',
    type: 'color_note',
    prompt: 'What is the color note of Aeolian?',
    options: ['The flat 2nd', 'The flat 5th', 'The natural 6th', 'The flat 6th'],
    correctAnswer: 'The flat 6th',
    explanation:
      'The flat 6th darkens Aeolian compared to Dorian. ' +
      'That single note is the difference between cool and melancholic.',
    modeId: 'aeolian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cn-locrian',
    type: 'color_note',
    prompt: 'What is the color note of Locrian?',
    options: ['The flat 2nd', 'The flat 6th', 'The flat 5th', 'The flat 7th'],
    correctAnswer: 'The flat 5th',
    explanation:
      'The flat 5th is a tritone from the root — the most destabilizing interval. ' +
      'It is why Locrian\'s tonic chord is diminished.',
    modeId: 'locrian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cn-ionian',
    type: 'color_note',
    prompt: 'What is the color note of Ionian?',
    options: ['The flat 7th', 'The raised 4th', 'The major 7th', 'The natural 6th'],
    correctAnswer: 'The major 7th',
    explanation:
      'The major 7th — one half step below the octave — gives Ionian its luminous, resolved quality.',
    modeId: 'ionian',
    difficulty: 'beginner',
  },

  // ── Chord fit questions ────────────────────────────────────────────────

  {
    id: 'q-cf-m7',
    type: 'chord_fit',
    prompt: 'You see a Dm7 chord that sits for 8 bars. Which mode is the best default choice?',
    options: ['Aeolian', 'Phrygian', 'Dorian', 'Locrian'],
    correctAnswer: 'Dorian',
    explanation:
      'Dorian is the jazz default for minor 7 chords. ' +
      'Its natural 6th gives it forward motion without losing the minor quality.',
    modeId: 'dorian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cf-maj7',
    type: 'chord_fit',
    prompt: 'You see a Cmaj7 chord. Which mode is the natural choice?',
    options: ['Mixolydian', 'Lydian', 'Ionian', 'Dorian'],
    correctAnswer: 'Ionian',
    explanation:
      'Ionian is the natural language for major 7 chords. ' +
      'The major 7th in the chord is the same note as the color note of the mode.',
    modeId: 'ionian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cf-maj7sharp11',
    type: 'chord_fit',
    prompt: 'The chart says Fmaj7#11. Which mode is being requested?',
    options: ['Ionian', 'Mixolydian', 'Aeolian', 'Lydian'],
    correctAnswer: 'Lydian',
    explanation:
      'The #11 in a chord symbol is a direct instruction: use Lydian. ' +
      'The #11 extension IS the raised 4th color note of Lydian.',
    modeId: 'lydian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cf-dom7',
    type: 'chord_fit',
    prompt: 'You are playing over a G7 chord in a blues. Which mode fits?',
    options: ['Ionian', 'Dorian', 'Mixolydian', 'Lydian'],
    correctAnswer: 'Mixolydian',
    explanation:
      'Mixolydian is the natural language for dominant 7th chords. ' +
      'G Mixolydian over G7 is the foundation of blues and jazz.',
    modeId: 'mixolydian',
    difficulty: 'beginner',
  },
  {
    id: 'q-cf-halfdim',
    type: 'chord_fit',
    prompt: 'You see a Bø7 (half-diminished) chord in a minor ii-V-i. Which mode fits?',
    options: ['Phrygian', 'Aeolian', 'Dorian', 'Locrian'],
    correctAnswer: 'Locrian',
    explanation:
      'Locrian is the only mode that fits naturally over a half-diminished chord. ' +
      'This is Locrian\'s primary use in jazz.',
    modeId: 'locrian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cf-m7b9',
    type: 'chord_fit',
    prompt: 'The chord is Em7(b9) with a Spanish feel. Which mode fits?',
    options: ['Aeolian', 'Dorian', 'Locrian', 'Phrygian'],
    correctAnswer: 'Phrygian',
    explanation:
      'The b9 extension directly reflects Phrygian\'s flat 2nd. ' +
      'The Spanish quality of the chord and the mode are the same sound.',
    modeId: 'phrygian',
    difficulty: 'intermediate',
  },

  // ── Tune name questions with multiple video IDs ────────────────────────

  {
    id: 'q-tn-sowhat',
    type: 'tune_name',
    prompt: '"So What" by Miles Davis. Which mode is this tune built on?',
    options: ['Aeolian', 'Mixolydian', 'Dorian', 'Lydian'],
    correctAnswer: 'Dorian',
    explanation:
      'This is "So What" by Miles Davis. The entire A section is a D Dorian vamp over Dm7. ' +
      'Miles, Coltrane, and Bill Evans all demonstrate the mode at its most essential.',
    modeId: 'dorian',
    videoIds: [
      'y_hl3w74J2I',  // Michel Petrucciani Montreux 1996 BMG official
      'zqNTltOGh5c',  // Official video
      '6w4FI0Jq0lI',  // Live 1959
    ],
    difficulty: 'beginner',
  },
  {
    id: 'q-tn-impressions',
    type: 'tune_name',
    prompt: `Coltrane's "Impressions" — the B section uses which mode?`,
    options: ['Dorian', 'Aeolian', 'Phrygian', 'Locrian'],
    correctAnswer: 'Phrygian',
    explanation:
      'This is Coltrane\'s "Impressions." The B section moves to Eb Phrygian. ' +
      'The contrast between Dorian lifting and Phrygian pressing down is visceral.',
    modeId: 'phrygian',
    videoIds: [
      'OZZYm6rUsS0',  // Coltrane + Eric Dolphy Village Gate official
      'SK1B_-PBhZk',  // Live enhanced
      'OZZYm6rUsS0',  // Village Gate
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-maidenvoyage',
    type: 'tune_name',
    prompt: `Herbie Hancock's "Maiden Voyage." Which mode is primarily used?`,
    options: ['Ionian', 'Lydian', 'Mixolydian', 'Dorian'],
    correctAnswer: 'Dorian',
    explanation:
      'This is Herbie Hancock\'s "Maiden Voyage" — suspended Dorian harmony over slow-moving chords.',
    modeId: 'dorian',
    videoIds: [
      'hwmRQ0PBtXU',  // Original
      'S9kVjAzNf3s',  // Live Japan 1998
      'IAxVKxGpC18',  // Live Chicago 1977
    ],
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-spain',
    type: 'tune_name',
    prompt: `Chick Corea's "Spain." Which mode does the opening melody draw from?`,
    options: ['Aeolian', 'Locrian', 'Dorian', 'Phrygian'],
    correctAnswer: 'Phrygian',
    explanation:
      'This is Chick Corea\'s "Spain." The opening melody draws on Phrygian\'s flat 2nd for its Spanish character.',
    modeId: 'phrygian',
    videoIds: [
      'XfQJMhMRUcw',  // Main version
    ],
    difficulty: 'intermediate',
  },

  // ── Brightness questions ───────────────────────────────────────────────

  {
    id: 'q-br-brightest',
    type: 'brightness',
    prompt: 'Which mode is considered the brightest of all seven diatonic modes?',
    options: ['Ionian', 'Mixolydian', 'Dorian', 'Lydian'],
    correctAnswer: 'Lydian',
    explanation:
      'Lydian raises the 4th above Ionian, creating a floating quality that goes beyond major.',
    difficulty: 'beginner',
  },
  {
    id: 'q-br-darkest',
    type: 'brightness',
    prompt: 'Which mode is the most harmonically unstable?',
    options: ['Phrygian', 'Aeolian', 'Dorian', 'Locrian'],
    correctAnswer: 'Locrian',
    explanation:
      'Locrian is the only mode whose tonic chord is diminished — it can never truly resolve.',
    modeId: 'locrian',
    difficulty: 'beginner',
  },
  {
    id: 'q-br-neutral-minor',
    type: 'brightness',
    prompt: 'Which minor mode is the most balanced — neither especially dark nor light?',
    options: ['Aeolian', 'Phrygian', 'Locrian', 'Dorian'],
    correctAnswer: 'Dorian',
    explanation:
      'Dorian\'s natural 6th lifts it above Aeolian and Phrygian, making it the most versatile minor mode.',
    modeId: 'dorian',
    difficulty: 'beginner',
  },

  // ── Avoid note questions ───────────────────────────────────────────────

  {
    id: 'q-an-phrygian',
    type: 'avoid_note',
    prompt: 'Phrygian has a note to use with care. Which is it?',
    options: ['The flat 5th', 'The flat 7th', 'The flat 2nd', 'The raised 4th'],
    correctAnswer: 'The flat 2nd',
    explanation:
      'The flat 2nd is both Phrygian\'s color note and its most dangerous note. ' +
      'Used deliberately it defines the mode; carelessly it clashes hard.',
    modeId: 'phrygian',
    difficulty: 'advanced',
  },
  {
    id: 'q-an-locrian',
    type: 'avoid_note',
    prompt: 'Which interval makes Locrian impossible to use as a tonal center?',
    options: ['The flat 2nd', 'The flat 6th', 'The flat 7th', 'The flat 5th'],
    correctAnswer: 'The flat 5th',
    explanation:
      'The flat 5th forms a tritone with the root. ' +
      'Because the tonic chord is diminished, Locrian can never create a stable tonal center.',
    modeId: 'locrian',
    difficulty: 'advanced',
  },

  // ── Confusion pair questions ───────────────────────────────────────────

  {
    id: 'q-cp-dorian-aeolian',
    type: 'color_note',
    prompt: 'Dorian and Aeolian are both minor modes. What is the only note that differs?',
    options: ['The 3rd', 'The 5th', 'The 7th', 'The 6th'],
    correctAnswer: 'The 6th',
    explanation:
      'Dorian has a natural 6th. Aeolian has a flat 6th. ' +
      'That single note is the difference between cool and melancholic.',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cp-ionian-lydian',
    type: 'color_note',
    prompt: 'Ionian and Lydian are both major modes. What is the only note that differs?',
    options: ['The 2nd', 'The 7th', 'The 3rd', 'The 4th'],
    correctAnswer: 'The 4th',
    explanation:
      'Ionian has a natural 4th. Lydian has a raised 4th. ' +
      'That raised 4th lifts Lydian from grounded to floating.',
    difficulty: 'intermediate',
  },
];

// ── Utilities ──────────────────────────────────────────────────────────────

export function getQuestionsByType(type: QuestionType): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.type === type);
}

export function getQuestionsByDifficulty(difficulty: QuizQuestion['difficulty']): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

export function getQuestionsByMode(modeId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.modeId === modeId);
}

export function getRandomVideoId(question: QuizQuestion): string | null {
  if (!question.videoIds || question.videoIds.length === 0) return null;
  const index = Math.floor(Math.random() * question.videoIds.length);
  return question.videoIds[index];
}

export function getRandomQuestions(count: number, modeId?: string): QuizQuestion[] {
  const pool = modeId ? getQuestionsByMode(modeId) : QUIZ_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function buildQuizSession(questionCount = 10): QuizQuestion[] {
  const beginner = getQuestionsByDifficulty('beginner');
  const intermediate = getQuestionsByDifficulty('intermediate');
  const advanced = getQuestionsByDifficulty('advanced');

  const pool = [
    ...beginner.sort(() => Math.random() - 0.5).slice(0, 5),
    ...intermediate.sort(() => Math.random() - 0.5).slice(0, 4),
    ...advanced.sort(() => Math.random() - 0.5).slice(0, 1),
  ];

  return pool.sort(() => Math.random() - 0.5).slice(0, questionCount);
}
