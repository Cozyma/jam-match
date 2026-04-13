const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTE_ALIASES: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Fb': 'E', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#', 'Cb': 'B',
}
const MAJOR_DEGREES = ['I', 'bII', 'II', 'bIII', 'III', 'IV', 'bV', 'V', 'bVI', 'VI', 'bVII', 'VII']

function noteToIndex(note: string): number {
  const normalized = NOTE_ALIASES[note] || note
  return NOTE_NAMES.indexOf(normalized)
}

function chordToDegree(chord: string, keyRoot: string, keyIsMinor: boolean): string {
  // Parse chord: root + quality (e.g., "Am7" → root="A", quality="m7")
  const match = chord.match(/^([A-G][#b]?)(.*)$/)
  if (!match) return chord

  const [, root, quality] = match
  const rootIdx = noteToIndex(root)
  const keyIdx = noteToIndex(keyRoot)
  if (rootIdx === -1 || keyIdx === -1) return chord

  let interval = (rootIdx - keyIdx + 12) % 12
  // For minor keys, shift to relative major (minor = 9 semitones from major root)
  if (keyIsMinor) {
    interval = (interval + 3) % 12
  }

  let degree = MAJOR_DEGREES[interval]

  // Determine if degree should be uppercase (major) or lowercase (minor)
  const isMinor = quality.startsWith('m') && !quality.startsWith('maj')
  const suffix = isMinor ? quality.slice(1) : quality // remove 'm' prefix for display

  if (isMinor) {
    degree = degree.toLowerCase()
  }

  return degree + suffix
}

export function chordsToNashville(chordsStr: string, songKey: string | null): string {
  if (!songKey) return chordsStr

  // Detect minor key
  const keyIsMinor = songKey.endsWith('m')
  const keyRoot = keyIsMinor ? songKey.slice(0, -1) : songKey

  // Replace chord names with degrees, preserving separators
  return chordsStr.replace(/\b([A-G][#b]?)(m?[a-z0-9]*)\b/g, (match) => {
    return chordToDegree(match, keyRoot, keyIsMinor)
  })
}
