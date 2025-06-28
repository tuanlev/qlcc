"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Key, Trash2, TabletIcon as DeviceTablet } from "lucide-react"

export default function AdminDetails({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Dữ liệu mẫu cho admin
  const admin = {
    id: Number.parseInt(params.id),
    name: "Nguyễn Văn A",
    email: "admin1@example.com",
    role: "Admin",
    status: "active",
    devices: 5,
    lastLogin: "2024-01-15 09:30",
    createdAt: "2023-12-01",
    phone: "0987654321",
    address: "123 Đường ABC, Quận 1, TP.HCM",
  }

  // Dữ liệu mẫu cho thiết bị được phân công
  const assignedDevices = [
    {
      id: "D001",
      name: "Máy chấm công A1",
      type: "Máy chấm công khuôn mặt",
      location: "Tầng 1, Tòa nhà A",
      status: "active",
      lastActive: "2024-01-15 09:30",
    },
    {
      id: "D002",
      name: "Máy chấm công A2",
      type: "Máy chấm công vân tay",
      location: "Tầng 2, Tòa nhà A",
      status: "active",
      lastActive: "2024-01-15 08:45",
    },
    {
      id: "D007",
      name: "Máy chấm công D1",
      type: "Máy chấm công khuôn mặt",
      location: "Tầng 1, Tòa nhà D",
      status: "active",
      lastActive: "2024-01-14 10:15",
    },
    {
      id: "D008",
      name: "Máy chấm công D2",
      type: "Máy chấm công vân tay",
      location: "Tầng 2, Tòa nhà D",
      status: "inactive",
      lastActive: "2024-01-13 16:20",
    },
    {
      id: "D012",
      name: "Máy chấm công F1",
      type: "Máy chấm công khuôn mặt",
      location: "Tầng 1, Tòa nhà F",
      status: "active",
      lastActive: "2024-01-15 07:50",
    },
  ]

  // Dữ liệu mẫu cho lịch sử hoạt động
  const activityLogs = [
    {
      id: 1,
      action: "Đăng nhập",
      timestamp: "2024-01-15 09:30",
      details: "Đăng nhập từ IP 192.168.1.100",
    },
    {
      id: 2,
      action: "Cập nhật thiết bị",
      timestamp: "2024-01-15 09:45",
      details: "Cập nhật cấu hình cho thiết bị D001",
    },
    {
      id: 3,
      action: "Xem báo cáo",
      timestamp: "2024-01-15 10:15",
      details: "Xem báo cáo chấm công tháng 1/2024",
    },
    {
      id: 4,
      action: "Đăng xuất",
      timestamp: "2024-01-15 11:30",
      details: "Đăng xuất khỏi hệ thống",
    },
    {
      id: 5,
      action: "Đăng nhập",
      timestamp: "2024-01-14 08:45",
      details: "Đăng nhập từ IP 192.168.1.100",
    },
  ]

  const handleResetPassword = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: `Đã đặt lại mật khẩu cho ${admin.name}`,
      })
      setIsResetPasswordDialogOpen(false)
    }, 1000)
  }

  const handleEditAdmin = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: `Đã cập nhật thông tin cho ${admin.name}`,
      })
      setIsEditDialogOpen(false)
    }, 1000)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Hoạt động</Badge>
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Chi tiết Admin</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Thông tin Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-3xl font-bold">
                {admin.name.charAt(0)}
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold">{admin.name}</h3>
              <p className="text-muted-foreground">{admin.email}</p>
              <div className="mt-2">{getStatusBadge(admin.status)}</div>
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số điện thoại:</span>
                <span>{admin.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thiết bị quản lý:</span>
                <span>{admin.devices}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Đăng nhập cuối:</span>
                <span>{admin.lastLogin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày tạo:</span>
                <span>{admin.createdAt}</span>
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <Button className="w-full" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setIsResetPasswordDialogOpen(true)}>
                <Key className="mr-2 h-4 w-4" />
                Đặt lại mật khẩu
              </Button>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa tài khoản
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="devices">Thiết bị ({assignedDevices.length})</TabsTrigger>
              <TabsTrigger value="activity">Hoạt động</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin chi tiết</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Họ tên</Label>
                      <p className="font-medium">{admin.name}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium">{admin.email}</p>
                    </div>
                    <div>
                      <Label>Số điện thoại</Label>
                      <p className="font-medium">{admin.phone}</p>
                    </div>
                    <div>
                      <Label>Vai trò</Label>
                      <p className="font-medium">{admin.role}</p>
                    </div>
                    <div>
                      <Label>Địa chỉ</Label>
                      <p className="font-medium">{admin.address}</p>
                    </div>
                    <div>
                      <Label>Ngày tạo</Label>
                      <p className="font-medium">{admin.createdAt}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tổng quan thiết bị</CardTitle>
                  <CardDescription>Thiết bị được phân công cho admin này</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-md text-center">
                      <DeviceTablet className="h-8 w-8 mx-auto text-purple-500 mb-2" />
                      <p className="text-2xl font-bold">{assignedDevices.length}</p>
                      <p className="text-sm text-muted-foreground">Tổng số thiết bị</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-md text-center">
                      <div className="h-8 w-8 mx-auto text-green-500 mb-2 flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <p className="text-2xl font-bold">
                        {assignedDevices.filter((d) => d.status === "active").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-md text-center">
                      <div className="h-8 w-8 mx-auto text-gray-400 mb-2 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      </div>
                      <p className="text-2xl font-bold">
                        {assignedDevices.filter((d) => d.status !== "active").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
