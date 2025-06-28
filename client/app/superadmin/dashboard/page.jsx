"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Users, TabletIcon as DeviceTablet, Shield, Activity } from "lucide-react"

export default function SuperAdminDashboard() {
  const { user } = useAuth()

  // Dữ liệu thống kê
  const stats = {
    totalAdmins: 8,
    activeAdmins: 6,
    totalDevices: 24,
    assignedDevices: 20,
    activeDevices: 18,
    unassignedDevices: 4,
  }

  // Hoạt động gần đây
  const recentActivities = [
    {
      id: 1,
      action: "Tạo admin mới",
      target: "Nguyễn Văn A",
      time: "10 phút trước",
      type: "admin",
    },
    {
      id: 2,
      action: "Phân công thiết bị",
      target: "Thiết bị D012 → Admin Trần B",
      time: "25 phút trước",
      type: "device",
    },
    {
      id: 3,
      action: "Cập nhật quyền",
      target: "Admin Lê C",
      time: "1 giờ trước",
      type: "permission",
    },
    {
      id: 4,
      action: "Đặt lại mật khẩu",
      target: "Admin Phạm D",
      time: "2 giờ trước",
      type: "admin",
    },
    {
      id: 5,
      action: "Vô hiệu hóa thiết bị",
      target: "Thiết bị D005",
      time: "3 giờ trước",
      type: "device",
    },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case "admin":
        return <Users className="h-4 w-4 text-blue-500" />
      case "device":
        return <DeviceTablet className="h-4 w-4 text-green-500" />
      case "permission":
        return <Shield className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Super Admin</h1>
        <p className="text-muted-foreground">
          Xin chào, {user?.name || "Super Admin"}! Tổng quan hệ thống quản lý chấm công.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAdmins} hoạt động, {stats.totalAdmins - stats.activeAdmins} không hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thiết bị</CardTitle>
            <DeviceTablet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground">
              {stats.assignedDevices} đã phân công, {stats.unassignedDevices} chưa phân công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thiết bị hoạt động</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDevices}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.activeDevices / stats.totalDevices) * 100)}% tổng số thiết bị
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ phân công</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((stats.assignedDevices / stats.totalDevices) * 100)}%</div>
            <p className="text-xs text-muted-foreground">{stats.unassignedDevices} thiết bị chưa được phân công</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
            <CardDescription>Các chức năng thường dùng</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">Quản lý Admin</p>
                    <p className="text-sm text-muted-foreground">Tạo, sửa, xóa tài khoản admin</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-500">{stats.totalAdmins}</p>
                  <p className="text-xs text-muted-foreground">admin</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <DeviceTablet className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">Quản lý Thiết bị</p>
                    <p className="text-sm text-muted-foreground">Phân công thiết bị cho admin</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-500">{stats.totalDevices}</p>
                  <p className="text-xs text-muted-foreground">thiết bị</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-medium">Phân quyền Admin</p>
                    <p className="text-sm text-muted-foreground">Cấu hình quyền truy cập</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-500">{stats.activeAdmins}</p>
                  <p className="text-xs text-muted-foreground">có quyền</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các thao tác mới nhất trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-md bg-slate-50">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.target}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>Trạng thái hệ thống</CardTitle>
          <CardDescription>Tình trạng hoạt động của các thành phần chính</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium">Admin System</span>
              </div>
              <p className="text-sm text-muted-foreground">Hoạt động bình thường</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium">Device Network</span>
              </div>
              <p className="text-sm text-muted-foreground">Kết nối ổn định</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="font-medium">Permission Service</span>
              </div>
              <p className="text-sm text-muted-foreground">Đang cập nhật</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
