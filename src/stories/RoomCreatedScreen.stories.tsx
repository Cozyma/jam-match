import type { Meta, StoryObj } from "@storybook/nextjs"
import { RoomCreatedScreen } from "@/components/room-created-screen"

const meta: Meta<typeof RoomCreatedScreen> = {
  title: "Components/RoomCreatedScreen",
  component: RoomCreatedScreen,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta
type Story = StoryObj<typeof RoomCreatedScreen>

export const Default: Story = {
  args: {
    roomCode: "JAM-A3F2",
  },
}
