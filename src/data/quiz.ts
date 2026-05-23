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
      'The #4 (raised 4th) is the tritone above the root — ' +
      'it gives Lydian its floating, suspended quality. ' +
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
      'The flat 7th is what makes Mixolydian sound bluesy instead of major. ' +
      'It is also the note that defines every dominant 7th chord — ' +
      'the chord and the mode share the same color note.',
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
      'The flat 2nd — just a half step above the root — gives Phrygian its ' +
      'Spanish, ancient quality. It is the most distinctive interval in any mode.',
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
      'That single note is the difference between cool (Dorian) and melancholic (Aeolian).',
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
      'The flat 5th is a tritone from the root — the most destabilizing interval possible. ' +
      'It is why Locrian\'s tonic chord is diminished and why the mode can never truly resolve.',
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
      'The major 7th — one half step below the octave — gives Ionian its luminous, ' +
      'resolved quality. It is the note that says "home."',
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
      'Its natural 6th gives it forward motion and brightness without losing the minor quality. ' +
      '"So What" by Miles Davis is the canonical example.',
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
      'The #11 chord extension IS the raised 4th color note of Lydian written as a chord tone.',
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
      'The flat 7th in the chord and the flat 7th in the mode are the same note. ' +
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
      'The flat 5th of Locrian matches the diminished 5th in the ø7 chord. ' +
      'This is Locrian\'s primary — often only — use in jazz.',
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
      'The b9 extension in the chord directly reflects Phrygian\'s flat 2nd. ' +
      'The Spanish, Moorish quality of the chord and the mode are the same sound.',
    modeId: 'phrygian',
    difficulty: 'intermediate',
  },

  // ── Tune name questions ────────────────────────────────────────────────

  {
    id: 'q-tn-sowhat',
    type: 'tune_name',
    prompt: '"So What" by Miles Davis is the definitive example of which mode?',
    options: ['Aeolian', 'Mixolydian', 'Dorian', 'Lydian'],
    correctAnswer: 'Dorian',
    explanation:
      'The entire A section of "So What" is a D Dorian vamp over Dm7. ' +
      'Miles, Coltrane, and Bill Evans all demonstrate the mode at its most essential on Kind of Blue.',
    modeId: 'dorian',
    difficulty: 'beginner',
  },
  {
    id: 'q-tn-impressions',
    type: 'tune_name',
    prompt: 'In Coltrane\'s "Impressions," the B section uses which mode?',
    options: ['Dorian', 'Aeolian', 'Phrygian', 'Locrian'],
    correctAnswer: 'Phrygian',
    explanation:
      'The B section of "Impressions" moves to Eb Phrygian against the D Dorian of the A section. ' +
      'The contrast between the two minor modes — Dorian lifting, Phrygian pressing down — ' +
      'is one of the most visceral modal moments in jazz.',
    modeId: 'phrygian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-maidenvoyage',
    type: 'tune_name',
    prompt: 'Herbie Hancock\'s "Maiden Voyage" is primarily built on which mode?',
    options: ['Ionian', 'Lydian', 'Mixolydian', 'Dorian'],
    correctAnswer: 'Dorian',
    explanation:
      'Maiden Voyage uses suspended Dorian harmony over slow-moving chords. ' +
      'The spacious, floating quality comes from Dorian\'s natural 6th over m7 suspended chords.',
    modeId: 'dorian',
    difficulty: 'intermediate',
  },
  {
    id: 'q-tn-spain',
    type: 'tune_name',
    prompt: 'Chick Corea\'s "Spain" opens with a melody in which mode?',
    options: ['Aeolian', 'Locrian', 'Dorian', 'Phrygian'],
    correctAnswer: 'Phrygian',
    explanation:
      'The opening melody of Spain draws on Phrygian\'s flat 2nd for its Spanish character. ' +
      'The Moorish/Andalusian sound of the theme is Phrygian at its most recognizable.',
    modeId: 'phrygian',
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
      'Lydian is the brightest mode — it raises the 4th above Ionian, ' +
      'creating a floating quality that goes beyond the resolved brightness of major. ' +
      'George Russell argued it is the most natural organizing sound in tonal music.',
    difficulty: 'beginner',
  },
  {
    id: 'q-br-darkest',
    type: 'brightness',
    prompt: 'Which mode is the most harmonically unstable?',
    options: ['Phrygian', 'Aeolian', 'Dorian', 'Locrian'],
    correctAnswer: 'Locrian',
    explanation:
      'Locrian is the only mode whose tonic chord is diminished. ' +
      'The flat 5th makes it impossible to truly resolve to the tonic, ' +
      'giving it a permanent sense of harmonic instability.',
    modeId: 'locrian',
    difficulty: 'beginner',
  },
  {
    id: 'q-br-neutral-minor',
    type: 'brightness',
    prompt: 'Which minor mode is considered the most balanced — neither especially dark nor light?',
    options: ['Aeolian', 'Phrygian', 'Locrian', 'Dorian'],
    correctAnswer: 'Dorian',
    explanation:
      'Dorian sits in the middle of the minor spectrum. ' +
      'Its natural 6th lifts it above Aeolian and Phrygian, ' +
      'making it the most versatile and commonly used minor mode in jazz.',
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
      'Used intentionally it defines the mode; used carelessly it clashes hard ' +
      'against the tonic. It rewards deliberate placement.',
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
      'The flat 5th forms a tritone with the root — the most harmonically tense interval. ' +
      'Because the tonic chord is diminished (not perfect), ' +
      'Locrian cannot create a stable tonal center. It is always passing through.',
    modeId: 'locrian',
    difficulty: 'advanced',
  },

  // ── Confusion pair questions ───────────────────────────────────────────

  {
    id: 'q-cp-dorian-aeolian',
    type: 'color_note',
    prompt: 'Dorian and Aeolian are both minor modes. What is the only note that differs between them?',
    options: ['The 3rd', 'The 5th', 'The 7th', 'The 6th'],
    correctAnswer: 'The 6th',
    explanation:
      'Dorian has a natural 6th. Aeolian has a flat 6th. ' +
      'That single note is the entire difference between cool (Dorian) and melancholic (Aeolian). ' +
      'Train your ear on that one interval.',
    difficulty: 'intermediate',
  },
  {
    id: 'q-cp-ionian-lydian',
    type: 'color_note',
    prompt: 'Ionian and Lydian are both major modes. What is the only note that differs?',
    options: ['The 2nd', 'The 7th', 'The 3rd', 'The 4th'],
    correctAnswer: 'The 4th',
    explanation:
      'Ionian has a natural 4th. Lydian has a raised 4th (#4). ' +
      'That raised 4th lifts Lydian above Ionian — from grounded to floating.',
    difficulty: 'intermediate',
  },

];

// ── Utilities ──────────────────────────────────────────────────────────────

export function getQuestionsByType(type: QuestionType): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.type === type);
}

export function getQuestionsByDifficulty(
  difficulty: QuizQuestion['difficulty']
): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

export function getQuestionsByMode(modeId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter((q) => q.modeId === modeId);
}

export function getRandomQuestions(count: number, modeId?: string): QuizQuestion[] {
  const pool = modeId ? getQuestionsByMode(modeId) : QUIZ_QUESTIONS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function buildQuizSession(questionCount = 10): QuizQuestion[] {
  // Balanced session: mix of types and difficulties
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
