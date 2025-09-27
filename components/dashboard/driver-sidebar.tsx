"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  LogOut,
  Droplets,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const driverNavigation = [
  { name: "My Deliveries", href: "/driver-dashboard", icon: Truck },
  { name: "Active Routes", href: "/driver-dashboard/routes", icon: MapPin },
  { name: "Delivery History", href: "/driver-dashboard/history", icon: Clock },
  { name: "Completed Today", href: "/driver-dashboard/completed", icon: CheckCircle },
]

export function DriverSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border lg:block hidden">
      <div className="flex h-16 items-center px-6 border-b border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Droplets className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">AquaFlow</span>
        </div>
      </div>

      <div className="flex flex-col h-full">
        <nav className="mt-6 px-3 flex-1">
          <div className="mb-4 px-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Driver Portal
            </p>
          </div>
          <ul className="space-y-1">
            {driverNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
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

        <div className="p-3 border-t border">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}