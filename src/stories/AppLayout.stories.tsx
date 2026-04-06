import type { Meta, StoryObj } from "@storybook/nextjs"
import { AppLayout } from "@/components/app-layout"

const meta: Meta<typeof AppLayout> = {
  title: "Components/AppLayout",
  component: AppLayout,
  parameters: {
    layout: "fullscreen",
  },
}
export default meta
type Story = StoryObj<typeof AppLayout>

export const HomeActive: Story = {
  args: {
    activeTab: "home",
    children: (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Home Content Area
      </div>
    ),
  },
}

export const RepertoireActive: Story = {
  args: {
    activeTab: "repertoire",
    children: (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Repertoire Content Area
      </div>
    ),
  },
}

export const ProfileActive: Story = {
  args: {
    activeTab: "profile",
    children: (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        Profile Content Area
      </div>
    ),
  },
}
