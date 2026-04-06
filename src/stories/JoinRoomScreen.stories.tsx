import type { Meta, StoryObj } from "@storybook/nextjs"
import { JoinRoomScreen } from "@/components/join-room-screen"

const meta: Meta<typeof JoinRoomScreen> = {
  title: "Components/JoinRoomScreen",
  component: JoinRoomScreen,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta
type Story = StoryObj<typeof JoinRoomScreen>

export const Default: Story = {}
