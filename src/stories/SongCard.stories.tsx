import type { Meta, StoryObj } from "@storybook/nextjs"
import { SongCard } from "@/components/song-card"

const sampleSong = {
  title: "Foggy Mountain Breakdown",
  songKey: "G",
  instruments: [
    { icon: "🎸", count: 2 },
    { icon: "🪕", count: 1 },
    { icon: "🎻", count: 1 },
  ],
  vocalSummary: "Lead+Har",
  proficiencies: ["ready", "ready", "practice", "ready", "learning"] as const,
  coverage: "5/5人",
  members: [
    {
      name: "田中",
      instrument: "guitar",
      proficiency: "ready" as const,
      vocalRole: "Lead",
      preferredKeys: ["G", "A"],
    },
    {
      name: "鈴木",
      instrument: "banjo",
      proficiency: "ready" as const,
      vocalRole: "Harmony (High)",
      preferredKeys: ["G"],
    },
    {
      name: "佐藤",
      instrument: "fiddle",
      proficiency: "practice" as const,
      vocalRole: null,
      preferredKeys: ["G", "D"],
    },
    {
      name: "高橋",
      instrument: "guitar",
      proficiency: "ready" as const,
      vocalRole: "Harmony (Low)",
      preferredKeys: ["G", "A", "D"],
    },
    {
      name: "伊藤",
      instrument: "bass",
      proficiency: "learning" as const,
      vocalRole: null,
      preferredKeys: ["G"],
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

export const Collapsed: Story = {
  args: {
    song: sampleSong,
  },
}

export const Expanded: Story = {
  args: {
    song: sampleSong,
    defaultOpen: true,
  },
}
