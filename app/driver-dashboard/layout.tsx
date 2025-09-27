import React from "react"
import { DriverSidebar } from "@/components/dashboard/driver-sidebar"
import { DriverHeader } from "@/components/dashboard/driver-header"

export default function DriverDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <DriverSidebar />
      <div className="lg:pl-64">
        <DriverHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}