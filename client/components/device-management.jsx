/**
 * Component quản lý thiết bị
 * Cho phép thêm, xem, chỉnh sửa và xóa các thiết bị trong hệ thống
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDevices } from "@/hooks/use-devices"
import { Edit, Trash2, Save, X, Monitor, Plus, Search, RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function DeviceManagement() {
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

  // State cho thêm thiết bị mới
  const [newDevice, setNewDevice] = useState({
    deviceId: "",
    nameDevice: "",
  })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState("")

  // State cho chỉnh sửa
  const [editingDevice, setEditingDevice] = useState(null)
  const [editValue, setEditValue] = useState({
    nameDevice: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [editError, setEditError] = useState("")

  // State cho tìm kiếm
  const [localSearchInput, setLocalSearchInput] = useState("")

  // Filter devices based on search
  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      !searchKeyword ||
      device.deviceId?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      device.nameDevice?.toLowerCase().includes(searchKeyword.toLowerCase())

    return matchesSearch
  })

  // Reset form thêm mới
  const resetAddForm = () => {
    setNewDevice({
      deviceId: "",
      nameDevice: "",
    })
    setAddError("")
  }

  // Validate device data
  const validateDeviceData = (data, isEdit = false) => {
    if (!isEdit && !data.deviceId?.trim()) {
      return "Mã thiết bị không được để trống"
    }
    if (!data.nameDevice?.trim()) {
      return "Tên thiết bị không được để trống"
    }
    return null
  }

  // Xử lý thêm thiết bị mới
  const handleAddDevice = async () => {
    const validationError = validateDeviceData(newDevice)
    if (validationError) {
      setAddError(validationError)
      return
    }

    setIsAdding(true)
    setAddError("")

    try {
      const deviceData = {
        deviceId: newDevice.deviceId.trim(),
        nameDevice: newDevice.nameDevice.trim(),
      }

      await addDevice(deviceData)
      resetAddForm()
      setShowAddDialog(false)
    } catch (err) {
      setAddError(err.message)
      console.error("Error adding device:", err)
    } finally {
      setIsAdding(false)
    }
  }

  // Xử lý bắt đầu chỉnh sửa thiết bị
  const startEditDevice = (device) => {
    setEditingDevice(device.deviceId)
    setEditValue({
      nameDevice: device.nameDevice || "",
    })
    setEditError("")
  }

  // Xử lý hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingDevice(null)
    setEditValue({
      nameDevice: "",
    })
    setEditError("")
  }

  // Xử lý lưu chỉnh sửa thiết bị
  const saveEditDevice = async () => {
    const validationError = validateDeviceData(editValue, true)
    if (validationError) {
      setEditError(validationError)
      return
    }

    setIsUpdating(true)
    setEditError("")

    try {
      const updateData = {
        nameDevice: editValue.nameDevice.trim(),
      }

      const success = await updateDevice(editingDevice, updateData)
      if (success) {
        setEditingDevice(null)
        setEditValue({
          nameDevice: "",
        })
      }
    } catch (err) {
      setEditError(err.message)
      console.error("Error updating device:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Xử lý xóa thiết bị
  const handleDeleteDevice = async (deviceId) => {
    try {
      await deleteDevice(deviceId)
    } catch (err) {
      console.error("Error deleting device:", err)
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = () => {
    searchDevices(localSearchInput)
  }

  // Xử lý xóa tìm kiếm
  const handleClearSearch = () => {
    setLocalSearchInput("")
    clearSearch()
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleDateString("vi-VN")
    } catch {
      return "-"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" onClick={refetch} className="ml-2 bg-transparent">
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header với tìm kiếm và nút thêm */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm thiết bị..."
            value={localSearchInput}
            onChange={(e) => setLocalSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
            className="pl-10"
          />
          <div className="absolute right-2 top-1.5 flex gap-1">
            <Button size="sm" variant="ghost" onClick={handleSearch} className="h-7 px-2">
              Tìm
            </Button>
            {searchKeyword && (
              <Button size="sm" variant="ghost" onClick={handleClearSearch} className="h-7 px-2">
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </Button>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Thiết Bị
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Thiết Bị Mới</DialogTitle>
                <DialogDescription>Nhập thông tin thiết bị mới để thêm vào hệ thống.</DialogDescription>
              </DialogHeader>

              {addError && (
                <Alert variant="destructive">
                  <AlertDescription>{addError}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deviceId" className="text-right">
                    Mã Thiết Bị *
                  </Label>
                  <Input
                    id="deviceId"
                    value={newDevice.deviceId}
                    onChange={(e) => {
                      setNewDevice((prev) => ({ ...prev, deviceId: e.target.value }))
                      setAddError("")
                    }}
                    className="col-span-3"
                    placeholder="Nhập mã thiết bị"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nameDevice" className="text-right">
                    Tên Thiết Bị *
                  </Label>
                  <Input
                    id="nameDevice"
                    value={newDevice.nameDevice}
                    onChange={(e) => {
                      setNewDevice((prev) => ({ ...prev, nameDevice: e.target.value }))
                      setAddError("")
                    }}
                    className="col-span-3"
                    placeholder="Nhập tên thiết bị"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddDevice()
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddDialog(false)
                    resetAddForm()
                  }}
                  disabled={isAdding}
                >
                  Hủy
                </Button>
                <Button onClick={handleAddDevice} disabled={isAdding || !newDevice.deviceId.trim()}>
                  {isAdding ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm Thiết Bị"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tổng thiết bị</p>
                <p className="text-2xl font-bold">{filteredDevices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {searchKeyword ? `Tìm kiếm: "${searchKeyword}"` : "Tổng kết quả"}
                </p>
                <p className="text-2xl font-bold">{filteredDevices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng thiết bị */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="mr-2 h-5 w-5" />
            Danh Sách Thiết Bị
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Mã Thiết Bị</TableHead>
                  <TableHead>Tên Thiết Bị</TableHead>
                  <TableHead>Ngày Tạo</TableHead>
                  <TableHead className="text-right w-[150px]">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      {searchKeyword ? "Không tìm thấy thiết bị nào" : "Chưa có thiết bị nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDevices.map((device) => (
                    <TableRow key={device.deviceId}>
                      <TableCell className="font-mono text-sm">{device.deviceId}</TableCell>
                      <TableCell className="font-medium">
                        {editingDevice === device.deviceId ? (
                          <div className="space-y-2">
                            {editError && (
                              <Alert variant="destructive">
                                <AlertDescription className="text-xs">{editError}</AlertDescription>
                              </Alert>
                            )}
                            <Input
                              value={editValue.nameDevice}
                              onChange={(e) => {
                                setEditValue((prev) => ({ ...prev, nameDevice: e.target.value }))
                                setEditError("")
                              }}
                              className="h-8"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEditDevice()
                                } else if (e.key === "Escape") {
                                  cancelEdit()
                                }
                              }}
                            />
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={saveEditDevice}
                                className="h-8 w-8"
                                disabled={isUpdating}
                              >
                                {isUpdating ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={cancelEdit}
                                className="h-8 w-8"
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Monitor className="mr-2 h-4 w-4 text-muted-foreground" />
                            {device.nameDevice}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(device.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditDevice(device)}
                            disabled={editingDevice !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                                disabled={editingDevice !== null}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa thiết bị "{device.nameDevice}" (ID: {device.deviceId})? Hành
                                  động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDevice(device.deviceId)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </div>
  )
}
