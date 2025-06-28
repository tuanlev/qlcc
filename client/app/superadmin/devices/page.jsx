"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Search, Edit, Trash2, Link2, AlertCircle } from "lucide-react"

export default function DeviceManagement() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [selectedAdmin, setSelectedAdmin] = useState("")

  // Dữ liệu mẫu cho danh sách thiết bị
  const devices = [
    {
      id: "D001",
      name: "Máy chấm công A1",
      type: "Máy chấm công khuôn mặt",
      location: "Tầng 1, Tòa nhà A",
      status: "active",
      assignedTo: "Nguyễn Văn A",
      lastActive: "2024-01-15 09:30",
    },
    {
      id: "D002",
      name: "Máy chấm công A2",
      type: "Máy chấm công vân tay",
      location: "Tầng 2, Tòa nhà A",
      status: "active",
      assignedTo: "Trần Thị B",
      lastActive: "2024-01-15 08:45",
    },
    {
      id: "D003",
      name: "Máy chấm công B1",
      type: "Máy chấm công khuôn mặt",
      location: "Tầng 1, Tòa nhà B",
      status: "inactive",
      assignedTo: null,
      lastActive: "2024-01-10 14:20",
    },
    {
      id: "D004",
      name: "Máy chấm công B2",
      type: "Máy chấm công vân tay",
      location: "Tầng 2, Tòa nhà B",
      status: "active",
      assignedTo: "Phạm Thị D",
      lastActive: "2024-01-14 11:15",
    },
    {
      id: "D005",
      name: "Máy chấm công C1",
      type: "Máy chấm công khuôn mặt",
      location: "Tầng 1, Tòa nhà C",
      status: "maintenance",
      assignedTo: null,
      lastActive: "2024-01-05 16:40",
    },
  ]

  // Dữ liệu mẫu cho danh sách admin
  const admins = [
    { id: 1, name: "Nguyễn Văn A", email: "admin1@example.com" },
    { id: 2, name: "Trần Thị B", email: "admin2@example.com" },
    { id: 3, name: "Lê Văn C", email: "admin3@example.com" },
    { id: 4, name: "Phạm Thị D", email: "admin4@example.com" },
    { id: 5, name: "Hoàng Văn E", email: "admin5@example.com" },
  ]

  const filteredDevices = devices.filter(
    (device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.assignedTo && device.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAssignDevice = () => {
    if (!selectedDevice || !selectedAdmin) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn admin để phân công",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Thành công",
        description: `Đã phân công thiết bị ${selectedDevice.name} cho ${
          admins.find((a) => a.id.toString() === selectedAdmin)?.name
        }`,
      })
      setIsAssignDialogOpen(false)
      setSelectedDevice(null)
      setSelectedAdmin("")
    }, 1000)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Hoạt động</Badge>
      case "inactive":
        return <Badge variant="secondary">Không hoạt động</Badge>
      case "maintenance":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Bảo trì
          </Badge>
        )
      default:
        return <Badge variant="outline">Không xác định</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Thiết Bị</h1>
          <p className="text-muted-foreground">Quản lý và phân công thiết bị cho admin</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Thiết Bị
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tìm kiếm và Lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo tên, ID, vị trí hoặc admin..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Không hoạt động</SelectItem>
                <SelectItem value="maintenance">Đang bảo trì</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Phân công" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="assigned">Đã phân công</SelectItem>
                <SelectItem value="unassigned">Chưa phân công</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Device List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Thiết bị ({filteredDevices.length})</CardTitle>
          <CardDescription>Quản lý tất cả thiết bị trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">ID</th>
                  <th className="text-left py-3 px-4">Tên thiết bị</th>
                  <th className="text-left py-3 px-4">Loại</th>
                  <th className="text-left py-3 px-4">Vị trí</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Phân công cho</th>
                  <th className="text-left py-3 px-4">Hoạt động cuối</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{device.id}</td>
                    <td className="py-3 px-4">{device.name}</td>
                    <td className="py-3 px-4 text-sm">{device.type}</td>
                    <td className="py-3 px-4 text-sm">{device.location}</td>
                    <td className="py-3 px-4">{getStatusBadge(device.status)}</td>
                    <td className="py-3 px-4">
                      {device.assignedTo ? (
                        <span className="text-sm">{device.assignedTo}</span>
                      ) : (
                        <Badge variant="outline" className="text-amber-500">
                          Chưa phân công
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{device.lastActive}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedDevice(device)
                            setIsAssignDialogOpen(true)
                          }}
                        >
                          <Link2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Assign Device Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Phân công thiết bị</DialogTitle>
            <DialogDescription>Chọn admin để phân công quản lý thiết bị này</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Thông tin thiết bị</Label>
              <div className="bg-slate-50 p-3 rounded-md">
                <p className="font-medium">{selectedDevice?.name}</p>
                <p className="text-sm text-muted-foreground">ID: {selectedDevice?.id}</p>
                <p className="text-sm text-muted-foreground">Vị trí: {selectedDevice?.location}</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin">Chọn Admin</Label>
              <Select value={selectedAdmin} onValueChange={setSelectedAdmin}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn admin để phân công" />
                </SelectTrigger>
                <SelectContent>
                  {admins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id.toString()}>
                      {admin.name} ({admin.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedDevice?.assignedTo && (
              <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-md">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Thiết bị đã được phân công</p>
                  <p className="text-sm text-amber-700">
                    Thiết bị này hiện đang được phân công cho {selectedDevice.assignedTo}. Việc phân công lại sẽ gỡ bỏ
                    quyền quản lý của admin hiện tại.
                  </p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAssignDevice}>Phân công</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
