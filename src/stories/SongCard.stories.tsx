import type { Meta, StoryObj } from "@storybook/nextjs"
import { SongCard } from "@/components/song-card"
import type { SongCardData } from "@/components/song-card"

const sampleSong: SongCardData = {
  id: "1",
  title: "Foggy Mountain Breakdown",
  songKey: "G",
  instruments: [
    { icon: "🎸", count: 2 },
    { icon: "🪕", count: 1 },
    { icon: "🎻", count: 1 },
  ],
  vocalSummary: "Lead+Har(H)",
  proficiencies: ["ready", "ready", "practice", "ready", "learning"],
  coverage: "5/5人",
  favoriteCount: 3,
  members: [
    {
      name: "田中",
      instrument: "guitar",
      subParts: ["mandolin"],
      proficiency: "ready",
      vocalRole: "Lead",
      preferredKeys: ["G", "A"],
    },
    {
      name: "鈴木",
      instrument: "banjo",
      subParts: [],
      proficiency: "ready",
      vocalRole: "Har(H)",
      preferredKeys: ["G"],
    },
    {
      name: "佐藤",
      instrument: "fiddle",
      subParts: [],
      proficiency: "practice",
      vocalRole: null,
      preferredKeys: [],
    },
    {
      name: "高橋",
      instrument: "guitar",
      subParts: ["bass"],
      proficiency: "ready",
      vocalRole: "Har(L)",
      preferredKeys: ["G", "A", "D"],
    },
    {
      name: "伊藤",
      instrument: "bass",
      subParts: [],
      proficiency: "learning",
      vocalRole: null,
      preferredKeys: [],
    },
  ],
}

const meta: Meta<typeof SongCard> = {
  title: "Components/SongCard",
  component: SongCard,
  parameters: {
    layout: "padded",
  },
}
export default meta
type Story = StoryObj<typeof SongCard>

export const Default: Story = {
  args: {
    song: sampleSong,
  },
}
