import type { Meta, StoryObj } from "@storybook/nextjs"
import { HomeScreen } from "@/components/home-screen"

const meta: Meta<typeof HomeScreen> = {
  title: "Components/HomeScreen",
  component: HomeScreen,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta
type Story = StoryObj<typeof HomeScreen>

export const Default: Story = {}
