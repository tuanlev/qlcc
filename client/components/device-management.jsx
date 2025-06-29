"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useDevices } from "@/hooks/use-devices"
import { Plus, Search, Edit, Trash2, Monitor } from "lucide-react"

export default function DeviceManagement() {
  const {
    devices,
    loading,
    error,
    searchKeyword,
    addDevice,
    updateDevice,
    deleteDevice,
    searchDevices,
    clearSearch,
    refetch,
  } = useDevices()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [searchInput, setSearchInput] = useState(searchKeyword)
  const [formData, setFormData] = useState({
    nameDevice: "",
    deviceStatus: "active",
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    searchDevices(searchInput)
  }

  const handleClearSearch = () => {
    setSearchInput("")
    clearSearch()
  }

  const handleAddDevice = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    setActionError("")

    try {
      await addDevice(formData)
      await refetch()
      setIsAddDialogOpen(false)
      setFormData({ nameDevice: "", deviceStatus: "active" })
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditDevice = async (e) => {
    e.preventDefault()
    if (!selectedDevice) return

    setActionLoading(true)
    setActionError("")

    try {
      await updateDevice(selectedDevice.deviceId, formData)
      await refetch()
      setIsEditDialogOpen(false)
      setSelectedDevice(null)
      setFormData({ nameDevice: "", deviceStatus: "active" })
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteDevice = async (device) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thiết bị "${device.nameDevice}"?`)) {
      return
    }

    try {
      await deleteDevice(device.deviceId)
      await refetch()
    } catch (err) {
      alert(`Lỗi khi xóa thiết bị: ${err.message}`)
    }
  }

  const openEditDialog = (device) => {
    setSelectedDevice(device)
    setFormData({
      nameDevice: device.nameDevice || "",
      deviceStatus: device.deviceStatus || "active",
    })
    setActionError("")
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({ nameDevice: "", deviceStatus: "active" })
    setActionError("")
    setIsAddDialogOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Đang tải danh sách thiết bị...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Quản lý thiết bị
          </CardTitle>
          <CardDescription>Thêm, sửa, xóa và quản lý các thiết bị chấm công trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <Input
                placeholder="Tìm kiếm thiết bị..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              {searchKeyword && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  Xóa bộ lọc
                </Button>
              )}
            </form>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thiết bị
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm thiết bị mới</DialogTitle>
                  <DialogDescription>Nhập thông tin thiết bị chấm công mới</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDevice}>
                  <div className="space-y-4 py-4">
                    {actionError && (
                      <Alert variant="destructive">
                        <AlertDescription>{actionError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="nameDevice">Tên thiết bị</Label>
                      <Input
                        id="nameDevice"
                        value={formData.nameDevice}
                        onChange={(e) => setFormData((prev) => ({ ...prev, nameDevice: e.target.value }))}
                        placeholder="Nhập tên thiết bị"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading ? "Đang thêm..." : "Thêm thiết bị"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Devices Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên thiết bị</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchKeyword ? "Không tìm thấy thiết bị nào" : "Chưa có thiết bị nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  devices.map((device) => (
                    <TableRow key={device.deviceId}>
                      <TableCell className="font-mono text-sm">{device.deviceId}</TableCell>
                      <TableCell className="font-medium">{device.nameDevice}</TableCell>
                    
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(device)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteDevice(device)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thiết bị</DialogTitle>
            <DialogDescription>Cập nhật thông tin thiết bị {selectedDevice?.nameDevice}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditDevice}>
            <div className="space-y-4 py-4">
              {actionError && (
                <Alert variant="destructive">
                  <AlertDescription>{actionError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-nameDevice">Tên thiết bị</Label>
                <Input
                  id="edit-nameDevice"
                  value={formData.nameDevice}
                  onChange={(e) => setFormData((prev) => ({ ...prev, nameDevice: e.target.value }))}
                  placeholder="Nhập tên thiết bị"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
