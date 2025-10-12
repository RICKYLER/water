"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Droplets,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
  { name: "Expenses", href: "/dashboard/expenses", icon: Receipt },
  { name: "Reports", href: "/dashboard/reports", icon: BarChart3 },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleToggleSidebar = () => {
      setMobileMenuOpen(prev => !prev);
    };
    
    window.addEventListener('toggle-sidebar', handleToggleSidebar);
    
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggleSidebar);
    };
  }, []);

  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile menu button - removed as we use X button to close */}

      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-40 w-72 bg-[#00B8D4] dark:bg-[#0b1726] text-white border-r border-white/10 shadow-sm lg:block hidden">
        <div className="flex h-16 items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-white dark:bg-white p-1 flex items-center justify-center w-12 h-12 overflow-hidden border-2 border-white">
              <img src="/AF.png" alt="AquaFlow Logo" className="h-9 w-auto" />
            </div>
            <span className="text-xl font-bold text-white flex items-center">AquaFlow</span>
          </div>
        </div>

        <nav className="mt-4 px-3">
          <ul className="space-y-2">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === '/dashboard' : true)
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-white hover:bg-[#009BB3]",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-[#00B8D4] dark:bg-[#0b1726] text-white overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out">
            <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-white dark:bg-white p-1 flex items-center justify-center w-12 h-12 overflow-hidden border-2 border-white">
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
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const isActive = pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === '/dashboard' : true)
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-white hover:bg-[#009BB3]",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
