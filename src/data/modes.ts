export interface ChordContext {
  chordType: string;
  chordSymbol: string;
  description: string;
  commonProgressions: string[];
}

export interface Tune {
  title: string;
  artist: string;
  year: number;
  whyThisTune: string;
  youtubeId?: string;
}

export interface Mode {
  id: string;
  name: string;
  degree: number;
  parentScale: string;
  oneWord: string;
  character: string;
  colorNote: string;
  colorNoteInterval: string;
  avoidNote?: string;
  avoidNoteInterval?: string;
  intervals: number[];
  formula: string;
  relativeKey: string;
  chordContexts: ChordContext[];
  classicTunes: Tune[];
  notablePlayers: string[];
  audioUrl?: string;
  demoChordUrl?: string;
  brightness: 'bright' | 'neutral' | 'dark';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relatedModes: string[];
}

export const MODES: Mode[] = [
  {
    id: 'ionian',
    name: 'Ionian',
    degree: 1,
    parentScale: 'major',
    oneWord: 'Resolved',
    character:
      'Ionian is the sound of arrival — bright, stable, at peace with itself. ' +
      'It carries no tension it needs to resolve, no shadow it needs to escape. ' +
      'When a melody wants to feel complete and at home, it reaches for Ionian.',
    colorNote: 'the major 7th',
    colorNoteInterval: '7',
    intervals: [0, 2, 4, 5, 7, 9, 11, 12],
    formula: 'W W H W W W H',
    relativeKey: 'C Ionian = C major',
    chordContexts: [
      {
        chordType: 'maj7',
        chordSymbol: 'Cmaj7',
        description:
          'Ionian is the natural home of the major 7 chord. The maj7 interval is the ' +
          'defining color — it lifts the sound from ordinary major to luminous.',
        commonProgressions: ['Imaj7–IVmaj7', 'Imaj7–V7–Imaj7'],
      },
    ],
    classicTunes: [
      {
        title: 'Misty',
        artist: 'Erroll Garner',
        year: 1954,
        whyThisTune:
          'The A section lives squarely in Ionian — the maj7 color note appears in the ' +
          'opening melodic phrase.',
      },
    ],
    notablePlayers: ['Bill Evans', 'Oscar Peterson', 'McCoy Tyner'],
    brightness: 'bright',
    difficulty: 'beginner',
    relatedModes: ['lydian', 'mixolydian'],
  },
  {
    id: 'dorian',
    name: 'Dorian',
    degree: 2,
    parentScale: 'major',
    oneWord: 'Cool',
    character:
      'Dorian is the most balanced of the minor modes — dark enough to feel blue, ' +
      'but with a raised 6th that keeps it from sounding tragic. ' +
      'It is the sound of Miles Davis on a Tuesday night: effortlessly cool, emotionally present, unhurried.',
    colorNote: 'the natural 6th',
    colorNoteInterval: '6',
    intervals: [0, 2, 3, 5, 7, 9, 10, 12],
    formula: 'W H W W W H W',
    relativeKey: 'D Dorian = C major starting on D',
    chordContexts: [
      {
        chordType: 'min7',
        chordSymbol: 'Dm7',
        description:
          'The m7 chord is Dorian\'s home. That natural 6th over Dm7 is ' +
          'what separates Dorian from Aeolian.',
        commonProgressions: ['im7–IV7', 'im7–bVII7–IV7'],
      },
    ],
    classicTunes: [
      {
        title: 'So What',
        artist: 'Miles Davis',
        year: 1959,
        whyThisTune:
          'The definitive Dorian tune. The entire A section is a D Dorian vamp.',
        youtubeId: 'ylXk1LBvIqU',
      },
    ],
    notablePlayers: ['Miles Davis', 'John Coltrane', 'Herbie Hancock'],
    brightness: 'neutral',
    difficulty: 'beginner',
    relatedModes: ['aeolian', 'phrygian'],
  },
  {
    id: 'phrygian',
    name: 'Phrygian',
    degree: 3,
    parentScale: 'major',
    oneWord: 'Dark',
    character:
      'Phrygian carries the weight of something ancient and unresolved. ' +
      'That lowered 2nd gives it a Spanish gravity, a flamenco darkness. ' +
      'It does not resolve so much as brood.',
    colorNote: 'the flat 2nd',
    colorNoteInterval: 'b2',
    avoidNote: 'the flat 2nd (use with intention)',
    avoidNoteInterval: 'b2',
    intervals: [0, 1, 3, 5, 7, 8, 10, 12],
    formula: 'H W W W H W W',
    relativeKey: 'E Phrygian = C major starting on E',
    chordContexts: [
      {
        chordType: 'min7b9',
        chordSymbol: 'Em7(b9)',
        description:
          'Phrygian\'s natural home. The b9 extension directly reflects the flat 2nd color note.',
        commonProgressions: ['im–bII', 'im7–bII7'],
      },
    ],
    classicTunes: [
      {
        title: 'Impressions',
        artist: 'John Coltrane',
        year: 1963,
        whyThisTune:
          'The B section moves to Eb Phrygian against D Dorian in the A section.',
      },
    ],
    notablePlayers: ['John Coltrane', 'Chick Corea', 'Wayne Shorter'],
    brightness: 'dark',
    difficulty: 'intermediate',
    relatedModes: ['aeolian', 'locrian'],
  },
  {
    id: 'lydian',
    name: 'Lydian',
    degree: 4,
    parentScale: 'major',
    oneWord: 'Floating',
    character:
      'Lydian is the sound of suspension — bright like Ionian but with a raised 4th ' +
      'that lifts it off the ground. It floats, never quite landing.',
    colorNote: 'the raised 4th (#4)',
    colorNoteInterval: '#4',
    intervals: [0, 2, 4, 6, 7, 9, 11, 12],
    formula: 'W W W H W W H',
    relativeKey: 'F Lydian = C major starting on F',
    chordContexts: [
      {
        chordType: 'maj7#11',
        chordSymbol: 'Fmaj7#11',
        description:
          'The #11 extension IS the Lydian color note as a chord tone. ' +
          'This voicing is Lydian at its most direct.',
        commonProgressions: ['Imaj7#11 vamp', 'Imaj7#11–IIm7'],
      },
    ],
    classicTunes: [
      {
        title: 'Flying (E.T. Theme)',
        artist: 'John Williams',
        year: 1982,
        whyThisTune:
          'Pure Lydian — the lifted, weightless quality made it perfect for a scene about defying gravity.',
      },
    ],
    notablePlayers: ['Stevie Wonder', 'Joe Satriani', 'Herbie Hancock'],
    brightness: 'bright',
    difficulty: 'intermediate',
    relatedModes: ['ionian'],
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian',
    degree: 5,
    parentScale: 'major',
    oneWord: 'Bluesy',
    character:
      'Mixolydian sits at the crossroads of major and blues. ' +
      'Bright like a major scale but that flat 7th pulls it earthward, ' +
      'keeps it from being too clean, too resolved.',
    colorNote: 'the flat 7th',
    colorNoteInterval: 'b7',
    intervals: [0, 2, 4, 5, 7, 9, 10, 12],
    formula: 'W W H W W H W',
    relativeKey: 'G Mixolydian = C major starting on G',
    chordContexts: [
      {
        chordType: 'dom7',
        chordSymbol: 'G7',
        description:
          'Mixolydian is the natural language for any dominant 7th chord.',
        commonProgressions: ['V7 vamp', 'I7–IV7 (blues)'],
      },
    ],
    classicTunes: [
      {
        title: 'Norwegian Wood',
        artist: 'The Beatles',
        year: 1965,
        whyThisTune:
          'The verse is pure Mixolydian — the flat 7th gives it that folk-modal quality.',
      },
    ],
    notablePlayers: ['Miles Davis', 'Wes Montgomery', 'Stevie Ray Vaughan'],
    brightness: 'neutral',
    difficulty: 'beginner',
    relatedModes: ['ionian', 'dorian'],
  },
  {
    id: 'aeolian',
    name: 'Aeolian',
    degree: 6,
    parentScale: 'major',
    oneWord: 'Melancholic',
    character:
      'Aeolian is the natural minor scale — the one that sounds like sadness ' +
      'when sadness wants to be understood. ' +
      'Unlike Dorian\'s cool composure, Aeolian allows itself to grieve.',
    colorNote: 'the flat 6th',
    colorNoteInterval: 'b6',
    intervals: [0, 2, 3, 5, 7, 8, 10, 12],
    formula: 'W H W W H W W',
    relativeKey: 'A Aeolian = C major starting on A',
    chordContexts: [
      {
        chordType: 'min7',
        chordSymbol: 'Am7',
        description:
          'Aeolian and Dorian share the m7 chord. The difference is the 6th: ' +
          'Aeolian\'s b6 darkens the sound.',
        commonProgressions: ['im–bVI–bVII–im', 'im7–iv7'],
      },
    ],
    classicTunes: [
      {
        title: 'My Funny Valentine',
        artist: 'Chet Baker',
        year: 1954,
        whyThisTune:
          'The A section descends through Aeolian harmony. ' +
          'The descending chromatic bass line is an Aeolian signature.',
      },
    ],
    notablePlayers: ['Chet Baker', 'Bill Evans', 'Keith Jarrett'],
    brightness: 'dark',
    difficulty: 'beginner',
    relatedModes: ['dorian', 'phrygian'],
  },
  {
    id: 'locrian',
    name: 'Locrian',
    degree: 7,
    parentScale: 'major',
    oneWord: 'Unstable',
    character:
      'Locrian is the outlier — the only mode whose tonic chord is diminished. ' +
      'It lives in permanent harmonic suspension. ' +
      'Jazz uses it carefully: over the half-diminished chord, briefly, before moving on.',
    colorNote: 'the flat 5th (tritone)',
    colorNoteInterval: 'b5',
    avoidNote: 'the flat 5th (handle with care)',
    avoidNoteInterval: 'b5',
    intervals: [0, 1, 3, 5, 6, 8, 10, 12],
    formula: 'H W W H W W W',
    relativeKey: 'B Locrian = C major starting on B',
    chordContexts: [
      {
        chordType: 'min7b5',
        chordSymbol: 'Bø7',
        description:
          'The half-diminished chord is Locrian\'s only natural home — ' +
          'the ii chord in minor ii-V-i progressions.',
        commonProgressions: ['iiø7–V7alt–im'],
      },
    ],
    classicTunes: [
      {
        title: 'Autumn Leaves (minor ii-V)',
        artist: 'Bill Evans',
        year: 1959,
        whyThisTune:
          'Every minor ii-V-i contains a moment of Locrian over the ø7 chord.',
      },
    ],
    notablePlayers: ['John Coltrane', 'Wayne Shorter', 'Eric Dolphy'],
    brightness: 'dark',
    difficulty: 'advanced',
    relatedModes: ['phrygian', 'aeolian'],
  },
];

export function getModeById(id: string): Mode | undefined {
  return MODES.find((m) => m.id === id);
}

export function getModesByBrightness(brightness: Mode['brightness']): Mode[] {
  return MODES.filter((m) => m.brightness === brightness);
}

export function getRelatedModes(modeId: string): Mode[] {
  const mode = getModeById(modeId);
  if (!mode) return [];
  return mode.relatedModes.map((id) => getModeById(id)).filter(Boolean) as Mode[];
}
