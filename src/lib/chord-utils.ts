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
  // Only match chords that are standalone tokens (preceded by space, start, -, |, :)
  // Avoid matching words like "Chorus", "Chords", "Verse", etc.
  return chordsStr.replace(/(^|[\s\-|:,])([A-G][#b]?)(m?(?:aj|in|aug|dim|sus|add)?[0-9]*)(?=[\s\-|:,]|$)/g, (match, prefix, root, quality) => {
    return prefix + chordToDegree(root + quality, keyRoot, keyIsMinor)
  })
}

export type ChordSection = {
  label: string | null
  lines: string[][]
}

const SECTION_LABEL_RE = /^(A|B|C|D|Verse|Chorus|Bridge|Intro|Outro|Tag)\s*:\s*/i

export function parseChordSections(raw: string, barGroup: number = 4): ChordSection[] {
  if (!raw.trim()) return []

  const segments = raw.split('|').map(s => s.trim()).filter(Boolean)
  const sections: ChordSection[] = []

  for (const segment of segments) {
    const labelMatch = segment.match(SECTION_LABEL_RE)
    const label = labelMatch ? labelMatch[1] : null
    const chordsStr = labelMatch ? segment.slice(labelMatch[0].length).trim() : segment
    const chords = chordsStr.split(/\s+/).filter(Boolean)

    if (chords.length === 0) continue

    const lines: string[][] = []
    for (let i = 0; i < chords.length; i += barGroup) {
      lines.push(chords.slice(i, i + barGroup))
    }

    // Merge with previous section if both have no label
    if (label === null && sections.length > 0 && sections[sections.length - 1].label === null) {
      sections[sections.length - 1].lines.push(...lines)
    } else {
      sections.push({ label, lines })
    }
  }

  return sections
}
