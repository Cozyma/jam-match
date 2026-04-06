import type { Meta, StoryObj } from "@storybook/nextjs"
import { JamRoomScreen } from "@/components/jam-room-screen"

const meta: Meta<typeof JamRoomScreen> = {
  title: "Components/JamRoomScreen",
  component: JamRoomScreen,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta
type Story = StoryObj<typeof JamRoomScreen>

export const Default: Story = {}
