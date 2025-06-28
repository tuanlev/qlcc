"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import axiosInstance from "@/lib/axiosInstance"
const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Kiểm tra authentication khi component mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    try {
      // Kiểm tra từ localStorage
      const userData = localStorage.getItem("user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
  try {
    // Gọi API login
    const response = await axiosInstance.post('/auth/login', {
      username,
      password
    })
    // Lấy token từ header Authorization
    const authHeader = response.headers['Authorization'] || response.headers['authorization']
    const token = authHeader;
    if (!token) {
      throw new Error('Không nhận được token từ server')
    }
    // Lưu token
    localStorage.setItem('token', token)
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`

    // Lưu thông tin user
    const userData = response.data.data

    localStorage.setItem('user', JSON.stringify(userData))
    document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`

    // Cập nhật state
    setUser(userData)

    // Điều hướng theo role
    if (userData.role === 'superadmin') {
      router.push('/superadmin/dashboard')
    } else {
      router.push('/dashboard/realtime')
    }

    return { success: true, user: userData }
  } catch (error) {
    console.log('Login error:', error.message)
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng')
  }
}

  const logout = () => {
    // Xóa từ localStorage
    localStorage.removeItem("user")

    // Xóa cookie
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    // Cập nhật state
    setUser(null)

    // Chuyển hướng về trang login
    router.push("/")

    toast({
      title: "Đăng xuất thành công",
      description: "Bạn đã đăng xuất khỏi hệ thống",
    })
  }

  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === "superadmin") return true
    return user.permissions?.includes(permission) || false
  }

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAdmin: user?.role === "admin",
    isSuperAdmin: user?.role === "superadmin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
