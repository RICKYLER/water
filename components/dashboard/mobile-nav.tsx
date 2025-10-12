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
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-[#1e40af] border-t border-blue-900 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto">
        <Link href="/dashboard" className="flex flex-col items-center justify-center cursor-pointer touch-manipulation active:bg-blue-800 transition-colors">
          <div className={`flex items-center justify-center ${isActive('/dashboard') && pathname === '/dashboard' ? 'text-white' : 'text-blue-200'}`}>
            <Home className="w-6 h-6 pointer-events-none" />
          </div>
          <span className="text-xs mt-1 text-white pointer-events-none">Home</span>
        </Link>
        
        <Link href="/dashboard/orders" className="flex flex-col items-center justify-center cursor-pointer touch-manipulation active:bg-blue-800 transition-colors">
          <div className={`flex items-center justify-center ${isActive('/dashboard/orders') ? 'text-white' : 'text-blue-200'}`}>
            <ShoppingCart className="w-6 h-6 pointer-events-none" />
          </div>
          <span className="text-xs mt-1 text-white pointer-events-none">Orders</span>
        </Link>
        
        <Link href="/dashboard/customers" className="flex flex-col items-center justify-center cursor-pointer touch-manipulation active:bg-blue-800 transition-colors">
          <div className={`flex items-center justify-center ${isActive('/dashboard/customers') ? 'text-white' : 'text-blue-200'}`}>
            <Users className="w-6 h-6 pointer-events-none" />
          </div>
          <span className="text-xs mt-1 text-white pointer-events-none">Customers</span>
        </Link>
        
        <Link href="/dashboard/settings" className="flex flex-col items-center justify-center cursor-pointer touch-manipulation active:bg-blue-800 transition-colors">
          <div className={`flex items-center justify-center ${isActive('/dashboard/settings') ? 'text-white' : 'text-blue-200'}`}>
            <Settings className="w-6 h-6 pointer-events-none" />
          </div>
          <span className="text-xs mt-1 text-white pointer-events-none">Settings</span>
        </Link>
      </div>
    </div>
  );
}