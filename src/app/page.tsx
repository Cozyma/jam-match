"use client"

import { AppLayout } from "@/components/app-layout"
import { HomeScreen } from "@/components/home-screen"

export default function Home() {
  return (
    <AppLayout activeTab="home">
      <HomeScreen />
    </AppLayout>
  )
}
