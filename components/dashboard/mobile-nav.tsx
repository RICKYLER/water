"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingCart, Users, Settings } from "lucide-react";

export function MobileNavigation() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        <Link href="/dashboard" className="flex flex-col items-center justify-center">
          <div className={`flex items-center justify-center ${isActive('/dashboard') && pathname === '/dashboard' ? 'text-primary' : 'text-gray-500'}`}>
            <Home className="w-6 h-6" />
          </div>
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/dashboard/orders" className="flex flex-col items-center justify-center">
          <div className={`flex items-center justify-center ${isActive('/dashboard/orders') ? 'text-primary' : 'text-gray-500'}`}>
            <ShoppingCart className="w-6 h-6" />
          </div>
          <span className="text-xs mt-1">Orders</span>
        </Link>
        
        <Link href="/dashboard/customers" className="flex flex-col items-center justify-center">
          <div className={`flex items-center justify-center ${isActive('/dashboard/customers') ? 'text-primary' : 'text-gray-500'}`}>
            <Users className="w-6 h-6" />
          </div>
          <span className="text-xs mt-1">Customers</span>
        </Link>
        
        <Link href="/dashboard/settings" className="flex flex-col items-center justify-center">
          <div className={`flex items-center justify-center ${isActive('/dashboard/settings') ? 'text-primary' : 'text-gray-500'}`}>
            <Settings className="w-6 h-6" />
          </div>
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </div>
  );
}