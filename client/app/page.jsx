/**
 * Trang chủ của ứng dụng - hiển thị form đăng nhập
 * Đây là trang đầu tiên người dùng thấy khi truy cập vào hệ thống
 */
import { LoginForm } from "@/components/login-form"

/**
 * Component trang chủ hiển thị form đăng nhập
 * Trong ứng dụng thực tế, sẽ kiểm tra trạng thái đăng nhập và chuyển hướng nếu cần
 */
export default function Home() {
  // Trong ứng dụng thực tế, bạn sẽ kiểm tra xem người dùng đã đăng nhập chưa
  // và chuyển hướng đến trang check-in gần đây nếu họ đã đăng nhập
  // Hiện tại, chúng ta chỉ hiển thị form đăng nhập

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Hệ Thống Chấm Công Nhân Viên</h1>
          <p className="text-muted-foreground mt-2">Đăng nhập để quản lý chấm công nhân viên</p>
        </div>
        {/* Form đăng nhập */}
        <LoginForm />
      </div>
    </main>
  )
}
