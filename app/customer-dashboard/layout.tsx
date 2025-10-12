import type React from "react"
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar"
import { CustomerHeader } from "@/components/dashboard/customer-header"

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <CustomerSidebar />
      <div className="flex flex-col flex-1 overflow-hidden lg:pl-64">
        <CustomerHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pt-6 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  )
}