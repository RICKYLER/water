import type React from "react"
import { CustomerSidebar } from "@/components/dashboard/customer-sidebar"

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <CustomerSidebar />
      <div className="lg:pl-64 pt-16">
        {children}
      </div>
    </div>
  )
}