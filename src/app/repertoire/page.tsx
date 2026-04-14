"use client"

import { AppLayout } from "@/components/app-layout"
import { MyRepertoireScreen } from "@/components/my-repertoire-screen"

export default function RepertoirePage() {
  return (
    <AppLayout activeTab="repertoire">
      <MyRepertoireScreen />
    </AppLayout>
  )
}
