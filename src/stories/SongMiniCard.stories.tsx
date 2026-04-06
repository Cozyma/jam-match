import type { Meta, StoryObj } from "@storybook/nextjs"
import { SongMiniCard } from "@/components/song-mini-card"

const meta: Meta<typeof SongMiniCard> = {
  title: "Components/SongMiniCard",
  component: SongMiniCard,
  parameters: {
    layout: "padded",
  },
}
export default meta
type Story = StoryObj<typeof SongMiniCard>

export const Default: Story = {
  args: {
    song: {
      id: "1",
      title: "Foggy Mountain Breakdown",
      songKey: "G",
      instruments: [
        { icon: "🎸", count: 2 },
        { icon: "🪕", count: 1 },
        { icon: "🎻", count: 1 },
      ],
      vocalSummary: "Lead+Har",
      proficiencies: ["ready", "ready", "practice", "ready", "learning"],
      coverage: "5/5人",
    },
  },
}

export const AllReady: Story = {
  args: {
    song: {
      id: "2",
      title: "Blue Moon of Kentucky",
      songKey: "A",
      instruments: [
        { icon: "🎸", count: 1 },
        { icon: "🪕", count: 1 },
      ],
      vocalSummary: "Lead",
      proficiencies: ["ready", "ready"],
      coverage: "2/2人",
    },
  },
}

export const Instrumental: Story = {
  args: {
    song: {
      id: "3",
      title: "Orange Blossom Special",
      songKey: "E",
      instruments: [
        { icon: "🎻", count: 2 },
        { icon: "🎸", count: 1 },
      ],
      vocalSummary: "Inst.",
      proficiencies: ["ready", "practice", "learning"],
      coverage: "3/5人",
    },
  },
}
