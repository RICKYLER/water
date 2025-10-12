"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  Receipt,
  BarChart3,
  LogOut,
  Settings,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const adminNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleToggleSidebar = () => setMobileMenuOpen(prev => !prev)
    window.addEventListener('toggle-sidebar', handleToggleSidebar)
    return () => window.removeEventListener('toggle-sidebar', handleToggleSidebar)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <>
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
              Admin Portal
            </p>
          </div>
          <ul className="space-y-1">
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer select-none",
                      "hover:bg-[#009BB3] active:bg-[#007A8C] focus:outline-none focus:ring-2 focus:ring-white/20",
                      isActive
                        ? "bg-white/20 text-white"
                        : "text-white",
                    )}
                  >
                    <item.icon className="h-4 w-4 pointer-events-none" />
                    <span className="pointer-events-none">{item.name}</span>
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
            className="w-full justify-start text-white hover:bg-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            <LogOut className="h-4 w-4 mr-3 pointer-events-none" />
            <span className="pointer-events-none">Sign Out</span>
          </Button>
        </div>
      </div>
    </div>

    {mobileMenuOpen && (
      <div className="fixed inset-0 z-[200] lg:hidden">
        <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-72 bg-[#00B8D4] text-white overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out z-[200]">
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-white p-1 flex items-center justify-center w-12 h-12 overflow-hidden border-2 border-white">
                <img src="/AF.png" alt="AquaFlow Logo" className="h-9 w-auto" />
              </div>
              <span className="text-xl font-bold text-white flex items-center">AquaFlow</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-white hover:bg-[#009BB3]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="mt-4 px-3">
            <ul className="space-y-1">
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        "hover:bg-[#009BB3] active:bg-[#007A8C] focus:outline-none focus:ring-2 focus:ring-white/20",
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-white",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-3 border-t border-white/10">
            <Button
              onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
              variant="ghost"
              className="w-full justify-start text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-3" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}