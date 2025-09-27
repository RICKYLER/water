import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { MobileNavigation } from "@/components/dashboard/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar />
      <div className="flex flex-col flex-1 overflow-hidden lg:pl-72">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pt-16 pb-20 md:pb-6">{children}</main>
        <MobileNavigation />
      </div>
    </div>
  )
}
