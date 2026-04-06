import type { Meta, StoryObj } from "@storybook/nextjs"
import { SongRegisterSheet } from "@/components/song-register-sheet"

const meta: Meta<typeof SongRegisterSheet> = {
  title: "Components/SongRegisterSheet",
  component: SongRegisterSheet,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta
type Story = StoryObj<typeof SongRegisterSheet>

export const Open: Story = {
  args: {
    open: true,
    onOpenChange: () => {},
    songTitle: "Foggy Mountain Breakdown",
    songKey: "G",
  },
}
