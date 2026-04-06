import type { Meta, StoryObj } from "@storybook/nextjs"
import { SongSearchScreen } from "@/components/song-search-screen"

const meta: Meta<typeof SongSearchScreen> = {
  title: "Components/SongSearchScreen",
  component: SongSearchScreen,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta
type Story = StoryObj<typeof SongSearchScreen>

export const Default: Story = {}
