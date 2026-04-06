import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProfileScreen } from "@/components/profile-screen"

const meta: Meta<typeof ProfileScreen> = {
  title: "Components/ProfileScreen",
  component: ProfileScreen,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta
type Story = StoryObj<typeof ProfileScreen>

export const Default: Story = {}
