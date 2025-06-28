"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Crown, BarChart3, UserCog, TabletIcon as DeviceTablet, Shield, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function SuperAdminSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const isActive = (path) => pathname === path

  const menuItems = [
    {
      title: "Dashboard",
      href: "/superadmin/dashboard",
      icon: BarChart3,
    },
    {
      title: "Quản lý Admin",
      href: "/superadmin/admins",
      icon: UserCog,
    },
    {
      title: "Quản lý Thiết bị",
      href: "/superadmin/devices",
      icon: DeviceTablet,
    },
    {
      title: "Phân quyền Admin",
      href: "/superadmin/permissions",
      icon: Shield,
    },
  ]

  return (
    <div className="w-64 bg-purple-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 flex items-center space-x-2 border-b border-purple-800">
        <Crown className="h-6 w-6 text-yellow-400" />
        <span className="text-xl font-bold">Super Admin</span>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                    isActive(item.href)
                      ? "bg-purple-800 text-white shadow-md"
                      : "text-purple-100 hover:bg-purple-800 hover:text-white",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.title}
                </div>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-purple-800">
        <button
          onClick={logout}
          className="flex items-center px-4 py-3 text-sm text-purple-100 hover:bg-purple-800 hover:text-white rounded-md w-full transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
