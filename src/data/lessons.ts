import { strings } from '../i18n/strings';

export interface LessonPage {
  id: string;
  type: 'intro' | 'concept' | 'listen' | 'compare' | 'chord' | 'summary';
  heading: string;
  body: string;
  modeId?: string;
  audioUrl?: string;
  tip?: string;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  durationMinutes: number;
  pages: LessonPage[];
  unlockedBy?: string;
}

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    number: 1,
    title: strings.lessons.l1.title,
    subtitle: strings.lessons.l1.subtitle,
    durationMinutes: strings.lessons.l1.duration,
    pages: [
      {
        id: 'l1-p1',
        type: 'intro',
        heading: 'Forget the scale shapes',
        body:
          'If you learned modes as "start the major scale on a different note," ' +
          'you learned the least useful version of the truth. ' +
          'That definition tells you the notes. It tells you nothing about the sound.',
      },
      {
        id: 'l1-p2',
        type: 'concept',
        heading: 'A mode is a center of gravity',
        body:
          'Every mode has a tonic — a note that feels like home. ' +
          'When you play C major starting on D and treat D as home, ' +
          'something shifts. The same seven notes create a completely different emotional atmosphere. ' +
          'That atmosphere is the mode. The scale is just the raw material.',
        tip: 'Same notes. Different gravity. That is the entire idea.',
      },
      {
        id: 'l1-p3',
        type: 'concept',
        heading: 'Why modes matter in jazz',
        body:
          'Jazz harmony often sits on one chord for a long time. ' +
          'When that happens, you need a sound. ' +
          'Modes give you seven distinct sounds to reach for, ' +
          'each with its own emotional color and relationship to the chord underneath.',
      },
      {
        id: 'l1-p4',
        type: 'concept',
        heading: 'The color note',
        body:
          'Every mode has one note that defines it — the note that, ' +
          'if you removed it, the mode would lose its identity. ' +
          'We call this the color note. ' +
          'Learning a mode means learning to hear that note and use it intentionally.',
        tip: 'Each lesson introduces the color note of each mode before the scale.',
      },
      {
        id: 'l1-p5',
        type: 'summary',
        heading: 'What you now know',
        body:
          'A mode is not a scale shape — it is a sound with a center of gravity. ' +
          'Each mode has a color note that defines its character. ' +
          'In the next lesson you will hear Ionian and Dorian side by side.',
      },
    ],
  },
  {
    id: 'l2',
    number: 2,
    title: strings.lessons.l2.title,
    subtitle: strings.lessons.l2.subtitle,
    durationMinutes: strings.lessons.l2.duration,
    unlockedBy: 'l1',
    pages: [
      {
        id: 'l2-p1',
        type: 'intro',
        heading: 'Start with Ionian',
        body:
          'Ionian is the major scale. You already know it — ' +
          'it is the sound of resolution, of brightness, of coming home. ' +
          'Every other mode is understood in relation to this one.',
        modeId: 'ionian',
      },
      {
        id: 'l2-p2',
        type: 'listen',
        heading: 'Hear Ionian',
        body:
          'Listen to the characteristic phrase. Notice how it settles. ' +
          'Notice the major 7th — that lift just before the octave. ' +
          'That is the color note: bright, resolved, final.',
        modeId: 'ionian',
        tip: 'The major 7th is one half step below the octave. It gives Ionian its luminous quality.',
      },
      {
        id: 'l2-p3',
        type: 'intro',
        heading: 'Now hear Dorian',
        body:
          'Dorian is a minor mode — but not a sad one. ' +
          'It has a raised 6th compared to natural minor, ' +
          'and that one note changes everything. ' +
          'It is the sound of cool, of forward motion, of blue without despair.',
        modeId: 'dorian',
      },
      {
        id: 'l2-p4',
        type: 'listen',
        heading: 'Hear Dorian',
        body:
          'Listen to the characteristic phrase. Notice how it moves — ' +
          'never quite settling, but never anxious either. ' +
          'The natural 6th is the color note: it lifts the minor sound just enough.',
        modeId: 'dorian',
        tip: 'Miles Davis built Kind of Blue around D Dorian. "So What" is the purest example.',
      },
      {
        id: 'l2-p5',
        type: 'compare',
        heading: 'Ionian vs Dorian',
        body:
          'Ionian resolves — it wants to be where it is. ' +
          'Dorian moves — comfortable but not finished. ' +
          'Ionian is arriving. Dorian is traveling.',
        tip: 'The difference is two notes: the 3rd and 7th (major vs minor). But the feeling difference is much larger.',
      },
      {
        id: 'l2-p6',
        type: 'chord',
        heading: 'What chords they live over',
        body:
          'Ionian belongs over major 7 chords — Cmaj7, Fmaj7. ' +
          'Dorian belongs over minor 7 chords — Dm7, Am7. ' +
          'When you see a minor 7 chord sitting for more than a bar, ' +
          'Dorian is almost always the right first choice.',
        tip: '"So What": D Dorian over Dm7 for 16 bars. Listen to how long it sustains.',
      },
      {
        id: 'l2-p7',
        type: 'summary',
        heading: 'What you now know',
        body:
          'Ionian: major sound, major 7th color note, lives over maj7 chords. ' +
          'Dorian: minor sound, natural 6th color note, lives over m7 chords. ' +
          'Next: the bright modes — Lydian and Mixolydian.',
      },
    ],
  },
  {
    id: 'l3',
    number: 3,
    title: strings.lessons.l3.title,
    subtitle: strings.lessons.l3.subtitle,
    durationMinutes: strings.lessons.l3.duration,
    unlockedBy: 'l2',
    pages: [
      {
        id: 'l3-p1',
        type: 'intro',
        heading: 'Two modes brighter than major',
        body:
          'Ionian is bright. Lydian is brighter — raised 4th lifts it off the ground. ' +
          'Mixolydian is almost as bright, but that flat 7th pulls it toward the blues.',
      },
      {
        id: 'l3-p2',
        type: 'listen',
        heading: 'Lydian: the floating mode',
        body:
          'The raised 4th — the #4 — is the color note. ' +
          'It creates suspension, weightlessness. ' +
          'Film composers reach for Lydian for wonder and magic. ' +
          'Jazz players use it over maj7#11 chords.',
        modeId: 'lydian',
        tip: 'The #4 is a tritone above the root. In Lydian that tension is left unresolved — exactly what creates the floating feeling.',
      },
      {
        id: 'l3-p3',
        type: 'chord',
        heading: 'Lydian chord context',
        body:
          'Lydian lives over maj7#11 chords. ' +
          'When you see Fmaj7#11, Lydian is being requested. ' +
          'The #11 in the chord symbol IS the color note written as an extension.',
        modeId: 'lydian',
        tip: 'George Russell\'s Lydian Chromatic Concept (1953) argued that Lydian is the natural organizing sound of tonal music.',
      },
      {
        id: 'l3-p4',
        type: 'listen',
        heading: 'Mixolydian: the bluesy mode',
        body:
          'Mixolydian is a major scale with a flat 7th. ' +
          'That one alteration changes everything — from resolved to unresolved, ' +
          'from classical to blues.',
        modeId: 'mixolydian',
        tip: 'Every dominant 7th chord implies Mixolydian. The flat 7th in the chord and the mode are the same note.',
      },
      {
        id: 'l3-p5',
        type: 'chord',
        heading: 'Mixolydian chord context',
        body:
          'Mixolydian is the natural language for dominant 7th chords. ' +
          'In a blues in G: G Mixolydian over G7, C Mixolydian over C7. ' +
          'Default choice for any unaltered dominant chord.',
        modeId: 'mixolydian',
      },
      {
        id: 'l3-p6',
        type: 'compare',
        heading: 'Lydian vs Mixolydian vs Ionian',
        body:
          'Ionian: natural 4th, major 7th — resolved, at home. ' +
          'Lydian: raised 4th, major 7th — floats above home. ' +
          'Mixolydian: natural 4th, flat 7th — reaches toward the blues.',
        tip: 'Maj7 chord → Ionian or Lydian. Dominant 7 chord → Mixolydian.',
      },
      {
        id: 'l3-p7',
        type: 'summary',
        heading: 'What you now know',
        body:
          'Lydian: #4 color note, floats over maj7#11. ' +
          'Mixolydian: b7 color note, bluesy over dominant 7. ' +
          'Next: the three dark modes.',
      },
    ],
  },
  {
    id: 'l4',
    number: 4,
    title: strings.lessons.l4.title,
    subtitle: strings.lessons.l4.subtitle,
    durationMinutes: strings.lessons.l4.duration,
    unlockedBy: 'l3',
    pages: [
      {
        id: 'l4-p1',
        type: 'intro',
        heading: 'Three shades of minor',
        body:
          'Dorian is neutral minor. Beyond it: Aeolian, which grieves; ' +
          'Phrygian, which broods; and Locrian, which refuses to resolve.',
      },
      {
        id: 'l4-p2',
        type: 'listen',
        heading: 'Aeolian: natural minor',
        body:
          'Aeolian is the natural minor scale. ' +
          'Its color note is the flat 6th, which darkens it compared to Dorian. ' +
          'It allows itself to feel sad in a way Dorian does not.',
        modeId: 'aeolian',
        tip: 'Dorian vs Aeolian: the only difference is the 6th. Natural = Dorian (cool). Flat = Aeolian (melancholic).',
      },
      {
        id: 'l4-p3',
        type: 'listen',
        heading: 'Phrygian: the Spanish mode',
        body:
          'Phrygian has a flat 2nd — a half step above the root. ' +
          'That interval gives it a Spanish, Moorish gravity. ' +
          'The flat 2nd is both the color note and the avoid note — use it with intention.',
        modeId: 'phrygian',
        tip: 'Coltrane\'s "Impressions" moves from D Dorian to Eb Phrygian. The tension increase is visceral.',
      },
      {
        id: 'l4-p4',
        type: 'listen',
        heading: 'Locrian: the unstable mode',
        body:
          'Locrian\'s tonic chord is diminished — it can never truly resolve to itself. ' +
          'Jazz uses it over half-diminished chords in minor ii-V-i progressions. ' +
          'You pass through it; you do not live there.',
        modeId: 'locrian',
        tip: 'Play B Locrian over Bø7 in a minor ii-V-i. That is the correct use of Locrian.',
      },
      {
        id: 'l4-p5',
        type: 'compare',
        heading: 'The minor modes compared',
        body:
          'Dorian: natural 6th, cool, m7 chords. ' +
          'Aeolian: flat 6th, melancholic, m7 chords. ' +
          'Phrygian: flat 2nd, dark and Spanish, m7b9 chords. ' +
          'Locrian: flat 2nd and flat 5th, unstable, ø7 chords only.',
        tip: 'The minor modes form a spectrum: Dorian (neutral) → Aeolian → Phrygian → Locrian (darkest).',
      },
      {
        id: 'l4-p6',
        type: 'summary',
        heading: 'What you now know',
        body:
          'All seven diatonic modes, their color notes, and their chord contexts. ' +
          'Next: chord context in depth.',
      },
    ],
  },
  {
    id: 'l5',
    number: 5,
    title: strings.lessons.l5.title,
    subtitle: strings.lessons.l5.subtitle,
    durationMinutes: strings.lessons.l5.duration,
    unlockedBy: 'l4',
    pages: [
      {
        id: 'l5-p1',
        type: 'intro',
        heading: 'A mode without context is useless',
        body:
          'Knowing that Dorian has a natural 6th means nothing until you hear it ' +
          'over a minor 7th chord and feel how it sits. ' +
          'This lesson connects every mode to its harmonic home.',
      },
      {
        id: 'l5-p2',
        type: 'chord',
        heading: 'The major chord family',
        body:
          'Major 7 chord → Ionian (resolved) or Lydian (floating). ' +
          'If the chart says maj7, default to Ionian. ' +
          'If it says maj7#11, use Lydian.',
        tip: 'The #11 marking in a chord symbol is a direct instruction to use Lydian.',
      },
      {
        id: 'l5-p3',
        type: 'chord',
        heading: 'The dominant chord family',
        body:
          'Dominant 7 chord → Mixolydian. ' +
          'This is the most common modal situation in jazz. ' +
          'When in doubt over a dominant 7, play Mixolydian.',
        tip: 'Altered dominants use the Altered scale — a melodic minor mode. Release 2 material.',
      },
      {
        id: 'l5-p4',
        type: 'chord',
        heading: 'The minor chord family',
        body:
          'Minor 7 chord → Dorian (default) or Aeolian (darker). ' +
          'Use Phrygian over m7b9 chords or Spanish-feeling harmony.',
      },
      {
        id: 'l5-p5',
        type: 'chord',
        heading: 'The half-diminished chord',
        body:
          'Half-diminished (ø7) → Locrian. ' +
          'Brief, transitional, tense by design. ' +
          'The ii chord in a minor ii-V-i.',
      },
      {
        id: 'l5-p6',
        type: 'concept',
        heading: 'Reading a lead sheet modally',
        body:
          'Major family → Ionian or Lydian. ' +
          'Dominant family → Mixolydian. ' +
          'Minor family → Dorian first, Aeolian or Phrygian for color. ' +
          'Half-diminished → Locrian. ' +
          'This covers 90% of standard jazz repertoire.',
        tip: 'This is the practical payoff: look at a chord symbol and immediately know which sound to reach for.',
      },
      {
        id: 'l5-p7',
        type: 'summary',
        heading: 'What you now know',
        body:
          'Every mode has a chord family. ' +
          'You now have a decision tree for choosing a mode from any chord symbol. ' +
          'Final lesson: training your ear to tell similar modes apart.',
      },
    ],
  },
  {
    id: 'l6',
    number: 6,
    title: strings.lessons.l6.title,
    subtitle: strings.lessons.l6.subtitle,
    durationMinutes: strings.lessons.l6.duration,
    unlockedBy: 'l5',
    pages: [
      {
        id: 'l6-p1',
        type: 'intro',
        heading: 'The hardest skill',
        body:
          'You can know every mode intellectually and still fail to identify them by ear. ' +
          'The ear learns differently — through repetition, comparison, and time. ' +
          'This lesson covers the three confusion pairs.',
      },
      {
        id: 'l6-p2',
        type: 'compare',
        heading: 'Confusion pair 1: Dorian vs Aeolian',
        body:
          'Same tonic chord (m7), almost the same notes. ' +
          'The only difference: the 6th. ' +
          'Natural 6th = Dorian (lighter). Flat 6th = Aeolian (heavier). ' +
          'Train on that one note.',
        tip: 'Sing the 6th degree over a minor chord. Does it want to go somewhere? Dorian. Does it feel like it arrived at sadness? Aeolian.',
      },
      {
        id: 'l6-p3',
        type: 'compare',
        heading: 'Confusion pair 2: Ionian vs Lydian',
        body:
          'Both bright major modes. The difference is the 4th: ' +
          'natural 4th = Ionian (grounded). Raised 4th = Lydian (floating). ' +
          'Lydian never quite lands. Ionian always does.',
        tip: 'Play the 4th degree. Does it feel stable? Ionian. Does it want to rise? Lydian.',
      },
      {
        id: 'l6-p4',
        type: 'compare',
        heading: 'Confusion pair 3: Phrygian vs Locrian',
        body:
          'Both very dark. Key difference is the 5th: ' +
          'Phrygian has a natural 5th — stable enough to sit on. ' +
          'Locrian has a flat 5th — completely destabilized. ' +
          'Phrygian broods. Locrian dissolves.',
        tip: 'Locrian is the only mode where the tonic chord is diminished. That instability is immediate once you know to listen for it.',
      },
      {
        id: 'l6-p5',
        type: 'concept',
        heading: 'How to practice this',
        body:
          'Pick two modes from a confusion pair. Set a drone on the tonic. ' +
          'Play each mode slowly and focus entirely on the color note. ' +
          'Sing it. Land on it. Hear how it changes the feeling of the drone. ' +
          'Repeat until the difference is physical, not intellectual.',
        tip: 'The Practice tab has ear training quizzes. Use them after every lesson.',
      },
      {
        id: 'l6-p6',
        type: 'summary',
        heading: 'You have completed the lessons',
        body:
          'You now know all seven modes, their color notes, their chord contexts, ' +
          'and how to tell similar modes apart. ' +
          'The next step is the ear — use the Practice tab daily. ' +
          'The difference between knowing modes and hearing them is measured in weeks, not minutes.',
        tip: 'Return to any mode in Browse and listen again. It will sound different now.',
      },
    ],
  },
];

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id);
}

export function isLessonUnlocked(lessonId: string, completedLessonIds: string[]): boolean {
  const lesson = getLessonById(lessonId);
  if (!lesson || !lesson.unlockedBy) return true;
  return completedLessonIds.includes(lesson.unlockedBy);
}

export function nextLesson(currentId: string): Lesson | undefined {
  const index = LESSONS.findIndex((l) => l.id === currentId);
  return LESSONS[index + 1];
}
