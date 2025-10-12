"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  ShoppingCart,
  Clock,
  User,
  Package,
  LogOut,
  Droplets,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const customerNavigation = [
  { name: "Dashboard", href: "/customer-dashboard", icon: Package },
  { name: "My Orders", href: "/customer-dashboard/orders", icon: ShoppingCart },
  { name: "Order History", href: "/customer-dashboard/order-history", icon: Clock },
  { name: "My Profile", href: "/customer-dashboard/profile", icon: User },
]

export function CustomerSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-[#00B8D4] text-white border-r border-white/10 lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
            <div className="rounded-full bg-white p-1 flex items-center justify-center w-12 h-12 overflow-hidden border-2 border-white">
              <img src="/AF.png" alt="AquaFlow Logo" className="h-9 w-auto" />
            </div>
            <span className="text-xl font-bold text-white flex items-center">AquaFlow</span>
          </div>
      </div>

      <div className="flex flex-col h-full">
        <nav className="mt-6 px-3 flex-1">
          <div className="mb-4 px-3">
            <p className="text-xs font-semibold text-white uppercase tracking-wider">
              Customer Portal
            </p>
          </div>
          <ul className="space-y-1">
            {customerNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-white hover:bg-[#009BB3]",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-3 border-t border-white/10">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-white hover:bg-white/10"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}