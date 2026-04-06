import { AppLayout } from "@/components/app-layout"
import { ProfileScreen } from "@/components/profile-screen"

export default function ProfilePage() {
  return (
    <AppLayout activeTab="profile">
      <ProfileScreen />
    </AppLayout>
  )
}
