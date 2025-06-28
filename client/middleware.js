import { NextResponse } from "next/server"

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Kiểm tra các route cần bảo vệ
  const protectedRoutes = ["/dashboard", "/superadmin"]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Bỏ qua middleware cho các static assets
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next()
  }

  if (isProtectedRoute) {
    // Kiểm tra cookie user
    const userCookie = request.cookies.get("user")

    if (!userCookie?.value) {
      // Chuyển hướng về trang login nếu chưa đăng nhập
      return NextResponse.redirect(new URL("/", request.url))
    }

    try {
      const user = JSON.parse(userCookie.value)

      // Kiểm tra quyền truy cập Super Admin routes
      if (pathname.startsWith("/superadmin") && user.role !== "superadmin") {
        return NextResponse.redirect(new URL("/dashboard/realtime", request.url))
      }

      // Kiểm tra quyền truy cập Admin routes
      if (pathname.startsWith("/dashboard") && !["admin", "superadmin"].includes(user.role)) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    } catch (error) {
      console.error("Middleware error:", error)
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
