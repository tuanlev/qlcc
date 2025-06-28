"use client"

import { useState } from "react"
import { Bell, Search, Menu, X } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SuperAdminSidebar } from "./sidebar"

export function SuperAdminHeader() {
  const { user } = useAuth()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [notifications] = useState([
    {
      id: 1,
      title: "Admin mới được tạo",
      message: "Tài khoản admin cho Nguyễn Văn A đã được tạo thành công",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      title: "Thiết bị mới được phân công",
      message: "Thiết bị D001 đã được phân công cho Admin Trần B",
      time: "30 phút trước",
      read: false,
    },
    {
      id: 3,
      title: "Cảnh báo hệ thống",
      message: "Thiết bị D005 đã ngắt kết nối",
      time: "2 giờ trước",
      read: true,
    },
  ])

  return (
    <>
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 md:px-6">
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(true)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div className="hidden md:flex md:w-60 lg:w-72">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Tìm kiếm..." className="pl-10" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.some((n) => !n.read) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0) || "S"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name || "Super Admin"}</p>
                <p className="text-xs text-gray-500">Super Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden">
          <div className="fixed inset-y-0 left-0 w-64 bg-purple-900 text-white">
            <div className="flex justify-between items-center p-4 border-b border-purple-800">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">Super Admin</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)}>
                <X className="h-6 w-6 text-white" />
              </Button>
            </div>
            <SuperAdminSidebar />
          </div>
        </div>
      )}
    </>
  )
}
