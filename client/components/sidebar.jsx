/**
 * Component Sidebar hiển thị menu điều hướng chính của ứng dụng
 * Bao gồm các liên kết đến các trang khác nhau trong hệ thống
 */
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings, LogOut, Clock, AlertTriangle, ArrowDown, Timer, UserCog, Building, Calendar } from "lucide-react"

export function Sidebar() {
  // Lấy đường dẫn hiện tại để xác định menu item nào đang active
  const pathname = usePathname()

  /**
   * Kiểm tra xem đường dẫn hiện tại có khớp với đường dẫn được truyền vào không
   * @param {string} path - Đường dẫn cần kiểm tra
   * @returns {boolean} True nếu đường dẫn hiện tại khớp với đường dẫn được truyền vào
   */
  const isActive = (path) => {
    return pathname === path
  }

  /**
   * Xử lý sự kiện đăng xuất
   * Trong ứng dụng thực tế, sẽ xử lý logic đăng xuất và xóa session
   */
  const handleLogout = () => {
    // Trong ứng dụng thực tế, bạn sẽ xử lý logic đăng xuất ở đây
    window.location.href = "/"
  }

  return (
    <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      {/* Phần tiêu đề sidebar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">Hệ Thống Chấm Công</h2>
      </div>
      {/* Phần menu chính */}
      <div className="flex flex-col flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Liên kết đến trang Real-time */}
        <Link href="/dashboard/realtime">
          <Button variant={isActive("/dashboard/realtime") ? "default" : "ghost"} className="w-full justify-start">
            <Clock className="mr-2 h-4 w-4" />
            Check-in Gần Đây
          </Button>
        </Link>

        {/* Liên kết đến trang Đi Muộn */}
        <Link href="/dashboard/late">
          <Button variant={isActive("/dashboard/late") ? "default" : "ghost"} className="w-full justify-start">
            <AlertTriangle className="mr-2 h-4 w-4" />
            Đi Muộn
          </Button>
        </Link>

        {/* Liên kết đến trang Về Sớm */}
        <Link href="/dashboard/early">
          <Button variant={isActive("/dashboard/early") ? "default" : "ghost"} className="w-full justify-start">
            <ArrowDown className="mr-2 h-4 w-4" />
            Về Sớm
          </Button>
        </Link>

        {/* Liên kết đến trang OT */}
        <Link href="/dashboard/overtime">
          <Button variant={isActive("/dashboard/overtime") ? "default" : "ghost"} className="w-full justify-start">
            <Timer className="mr-2 h-4 w-4" />
            Làm Thêm Giờ (OT)
          </Button>
        </Link>

        {/* Liên kết đến trang Quản Lý Nhân Viên */}
        <Link href="/dashboard/management">
          <Button
            variant={pathname.includes("/dashboard/management") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Quản Lý Nhân Viên
          </Button>
        </Link>

        {/* Liên kết đến trang Quản Lý Ca Làm */}
        <Link href="/dashboard/shifts">
          <Button
            variant={pathname.includes("/dashboard/shifts") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Quản Lý Ca Làm
          </Button>
        </Link>

        {/* Liên kết đến trang Quản Lý Bộ Phận, Vị Trí */}
        <Link href="/dashboard/positions">
          <Button
            variant={pathname.includes("/dashboard/positions") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Building className="mr-2 h-4 w-4" />
            Quản Lý vị trí
          </Button>
        </Link>
        <Link href="/dashboard/departments">
          <Button
            variant={pathname.includes("/dashboard/departments") ? "default" : "ghost"}
            className="w-full justify-start"
          >
            <Building className="mr-2 h-4 w-4" />
            Quản Lý Bộ Phận
          </Button>
        </Link>
        {/* Liên kết đến trang Cài Đặt */}
        <Link href="/dashboard/settings">
          <Button variant={isActive("/dashboard/settings") ? "default" : "ghost"} className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Cài Đặt
          </Button>
        </Link>
      </div>
      {/* Phần footer với nút đăng xuất */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Đăng Xuất
        </Button>
      </div>
    </div>
  )
}
