"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Search, Shield, Edit, Save } from "lucide-react"

export default function PermissionManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState(null)
  const [permissions, setPermissions] = useState({})

  // Dữ liệu mẫu cho admin và quyền
  const admins = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "admin1@example.com",
      devices: 5,
      permissions: {
        viewReports: true,
        manageEmployees: true,
        exportData: false,
        systemSettings: false,
        deviceControl: true,
      },
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "admin2@example.com",
      devices: 3,
      permissions: {
        viewReports: true,
        manageEmployees: false,
        exportData: true,
        systemSettings: false,
        deviceControl: true,
      },
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "admin3@example.com",
      devices: 0,
      permissions: {
        viewReports: false,
        manageEmployees: false,
        exportData: false,
        systemSettings: false,
        deviceControl: false,
      },
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "admin4@example.com",
      devices: 8,
      permissions: {
        viewReports: true,
        manageEmployees: true,
        exportData: true,
        systemSettings: true,
        deviceControl: true,
      },
    },
  ]

  // Định nghĩa các quyền
  const permissionDefinitions = {
    viewReports: {
      name: "Xem báo cáo",
      description: "Quyền xem các báo cáo chấm công và thống kê",
    },
    manageEmployees: {
      name: "Quản lý nhân viên",
      description: "Quyền thêm, sửa, xóa thông tin nhân viên",
    },
    exportData: {
      name: "Xuất dữ liệu",
      description: "Quyền xuất dữ liệu ra file Excel, PDF",
    },
    systemSettings: {
      name: "Cài đặt hệ thống",
      description: "Quyền thay đổi cài đặt hệ thống",
    },
    deviceControl: {
      name: "Điều khiển thiết bị",
      description: "Quyền điều khiển và cấu hình thiết bị",
    },
  }

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleEditPermissions = (admin) => {
    setSelectedAdmin(admin)
    setPermissions(admin.permissions)
    setIsEditDialogOpen(true)
  }

  const handleSavePermissions = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: `Đã cập nhật quyền cho ${selectedAdmin.name}`,
      })
      setIsEditDialogOpen(false)
      setSelectedAdmin(null)
      setPermissions({})
    }, 1000)
  }

  const handlePermissionChange = (permission, value) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }))
  }

  const getPermissionCount = (adminPermissions) => {
    return Object.values(adminPermissions).filter(Boolean).length
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Phân quyền Admin</h1>
        <p className="text-muted-foreground">Quản lý quyền truy cập và chức năng cho từng admin</p>
      </div>

      <Tabs defaultValue="permissions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="permissions">Phân quyền Admin</TabsTrigger>
          <TabsTrigger value="roles">Vai trò hệ thống</TabsTrigger>
        </TabsList>

        <TabsContent value="permissions" className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tìm kiếm Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Admin Permissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách quyền Admin ({filteredAdmins.length})</CardTitle>
              <CardDescription>Quản lý quyền truy cập cho từng admin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Admin</th>
                      <th className="text-left py-3 px-4">Thiết bị</th>
                      <th className="text-left py-3 px-4">Quyền hiện tại</th>
                      <th className="text-left py-3 px-4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-gray-500">{admin.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{admin.devices} thiết bị</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            <Badge className="bg-green-500">
                              {getPermissionCount(admin.permissions)}/{Object.keys(permissionDefinitions).length} quyền
                            </Badge>
                            {Object.entries(admin.permissions).map(([key, value]) => {
                              if (value) {
                                return (
                                  <Badge key={key} variant="outline" className="text-xs">
                                    {permissionDefinitions[key]?.name}
                                  </Badge>
                                )
                              }
                              return null
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Button variant="ghost" size="icon" onClick={() => handleEditPermissions(admin)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vai trò hệ thống</CardTitle>
              <CardDescription>Cấu hình các vai trò và quyền mặc định</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Admin Cơ bản</h3>
                    <Badge variant="outline">Mặc định</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Quyền cơ bản để quản lý chấm công và xem báo cáo</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Xem báo cáo</Badge>
                    <Badge variant="outline">Điều khiển thiết bị</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Admin Nâng cao</h3>
                    <Badge className="bg-blue-500">Tùy chỉnh</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Quyền mở rộng để quản lý nhân viên và xuất dữ liệu
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Xem báo cáo</Badge>
                    <Badge variant="outline">Quản lý nhân viên</Badge>
                    <Badge variant="outline">Xuất dữ liệu</Badge>
                    <Badge variant="outline">Điều khiển thiết bị</Badge>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Admin Toàn quyền</h3>
                    <Badge className="bg-red-500">Cao cấp</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Toàn bộ quyền trong hệ thống</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(permissionDefinitions).map((perm) => (
                      <Badge key={perm.name} variant="outline">
                        {perm.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Permissions Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Chỉnh sửa quyền - {selectedAdmin?.name}
            </DialogTitle>
            <DialogDescription>Cấu hình quyền truy cập cho admin này</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="bg-slate-50 p-3 rounded-md">
              <p className="font-medium">{selectedAdmin?.name}</p>
              <p className="text-sm text-muted-foreground">{selectedAdmin?.email}</p>
              <p className="text-sm text-muted-foreground">Quản lý {selectedAdmin?.devices} thiết bị</p>
            </div>
            <div className="space-y-4">
              {Object.entries(permissionDefinitions).map(([key, definition]) => (
                <div key={key} className="flex items-center justify-between space-x-2">
                  <div className="flex-1">
                    <Label htmlFor={key} className="text-sm font-medium">
                      {definition.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">{definition.description}</p>
                  </div>
                  <Switch
                    id={key}
                    checked={permissions[key] || false}
                    onCheckedChange={(checked) => handlePermissionChange(key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSavePermissions}>
              <Save className="mr-2 h-4 w-4" />
              Lưu quyền
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
