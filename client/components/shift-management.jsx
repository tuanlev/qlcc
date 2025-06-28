/**
 * Component quản lý ca làm việc
 * Cho phép thêm, xem, chỉnh sửa và xóa các ca làm việc trong hệ thống
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useShifts } from "@/hooks/use-shifts"
import { Edit, Trash2, Save, X, Clock, Plus, Search, RefreshCw } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ShiftManagement() {
  const {
    shifts,
    loading,
    error,
    searchKeyword,
    addShift,
    updateShift,
    deleteShift,
    searchShifts,
    clearSearch,
    refetch,
  } = useShifts()

  // State cho thêm ca mới
  const [newShift, setNewShift] = useState({
    nameShift: "",
    checkInHour: 8,
    checkOutHour: 17,
  })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState("")

  // State cho chỉnh sửa
  const [editingShift, setEditingShift] = useState(null)
  const [editValue, setEditValue] = useState({
    nameShift: "",
    checkInHour: 8,
    checkOutHour: 17,
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [editError, setEditError] = useState("")

  // State cho tìm kiếm
  const [localSearchInput, setLocalSearchInput] = useState("")

  // Reset form thêm mới
  const resetAddForm = () => {
    setNewShift({
      nameShift: "",
      checkInHour: 8,
      checkOutHour: 17,
    })
    setAddError("")
  }

  // Tính số giờ làm việc
  const calculateWorkingHours = (checkInHour, checkOutHour) => {
    return checkOutHour - checkInHour
  }

  // Format giờ hiển thị
  const formatHour = (hour) => {
    return `${hour.toString().padStart(2, "0")}:00`
  }

  // Validate shift data
  const validateShiftData = (data) => {
    if (!data.nameShift.trim()) {
      return "Tên ca không được để trống"
    }
    if (data.checkInHour >= data.checkOutHour) {
      return "Giờ kết thúc phải sau giờ bắt đầu"
    }
    if (data.checkInHour < 0 || data.checkInHour > 23) {
      return "Giờ vào phải từ 0 đến 23"
    }
    if (data.checkOutHour < 0 || data.checkOutHour > 23) {
      return "Giờ ra phải từ 0 đến 23"
    }
    return null
  }

  // Xử lý thêm ca mới
  const handleAddShift = async () => {
    const validationError = validateShiftData(newShift)
    if (validationError) {
      setAddError(validationError)
      return
    }

    setIsAdding(true)
    setAddError("")

    try {
      await addShift({
        nameShift: newShift.nameShift.trim(),
        checkInHour: Number.parseInt(newShift.checkInHour),
        checkOutHour: Number.parseInt(newShift.checkOutHour),
      })
      resetAddForm()
      setShowAddDialog(false)
    } catch (err) {
      setAddError(err.message)
      console.error("Error adding shift:", err)
    } finally {
      setIsAdding(false)
    }
  }

  // Xử lý bắt đầu chỉnh sửa ca
  const startEditShift = (shift) => {
    setEditingShift(shift.shiftId)
    setEditValue({
      nameShift: shift.nameShift,
      checkInHour: shift.checkInHour,
      checkOutHour: shift.checkOutHour,
    })
    setEditError("")
  }

  // Xử lý hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingShift(null)
    setEditValue({
      nameShift: "",
      checkInHour: 8,
      checkOutHour: 17,
    })
    setEditError("")
  }

  // Xử lý lưu chỉnh sửa ca
  const saveEditShift = async () => {
    const validationError = validateShiftData(editValue)
    if (validationError) {
      setEditError(validationError)
      return
    }

    setIsUpdating(true)
    setEditError("")

    try {
      const success = await updateShift(editingShift, {
        nameShift: editValue.nameShift.trim(),
        checkInHour: Number.parseInt(editValue.checkInHour),
        checkOutHour: Number.parseInt(editValue.checkOutHour),
      })
      if (success) {
        setEditingShift(null)
        setEditValue({
          nameShift: "",
          checkInHour: 8,
          checkOutHour: 17,
        })
      }
    } catch (err) {
      setEditError(err.message)
      console.error("Error updating shift:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Xử lý xóa ca
  const handleDeleteShift = async (shiftId) => {
    try {
      await deleteShift(shiftId)
    } catch (err) {
      console.error("Error deleting shift:", err)
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = () => {
    searchShifts(localSearchInput)
  }

  // Xử lý xóa tìm kiếm
  const handleClearSearch = () => {
    setLocalSearchInput("")
    clearSearch()
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
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ca làm..."
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
                Thêm Ca Mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Ca Làm Mới</DialogTitle>
                <DialogDescription>Nhập thông tin ca làm mới để thêm vào hệ thống.</DialogDescription>
              </DialogHeader>

              {addError && (
                <Alert variant="destructive">
                  <AlertDescription>{addError}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nameShift" className="text-right">
                    Tên Ca
                  </Label>
                  <Input
                    id="nameShift"
                    value={newShift.nameShift}
                    onChange={(e) => {
                      setNewShift((prev) => ({ ...prev, nameShift: e.target.value }))
                      setAddError("")
                    }}
                    className="col-span-3"
                    placeholder="Ví dụ: Ca Sáng"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddShift()
                      }
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkInHour" className="text-right">
                    Giờ Vào
                  </Label>
                  <Input
                    id="checkInHour"
                    type="number"
                    min="0"
                    max="23"
                    value={newShift.checkInHour}
                    onChange={(e) => {
                      setNewShift((prev) => ({ ...prev, checkInHour: Number.parseInt(e.target.value) || 0 }))
                      setAddError("")
                    }}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="checkOutHour" className="text-right">
                    Giờ Ra
                  </Label>
                  <Input
                    id="checkOutHour"
                    type="number"
                    min="0"
                    max="23"
                    value={newShift.checkOutHour}
                    onChange={(e) => {
                      setNewShift((prev) => ({ ...prev, checkOutHour: Number.parseInt(e.target.value) || 0 }))
                      setAddError("")
                    }}
                    className="col-span-3"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Số giờ làm việc: {calculateWorkingHours(newShift.checkInHour, newShift.checkOutHour)} giờ
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
                <Button onClick={handleAddShift} disabled={isAdding || !newShift.nameShift.trim()}>
                  {isAdding ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm Ca"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tổng số ca</p>
                <p className="text-2xl font-bold">{shifts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ca sáng (6-12h)</p>
                <p className="text-2xl font-bold">
                  {shifts.filter((shift) => shift.checkInHour >= 6 && shift.checkInHour < 12).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Ca chiều (12-18h)</p>
                <p className="text-2xl font-bold">
                  {shifts.filter((shift) => shift.checkInHour >= 12 && shift.checkInHour < 18).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Trung bình giờ/ca</p>
                <p className="text-2xl font-bold">
                  {shifts.length > 0
                    ? (
                        shifts.reduce(
                          (acc, shift) => acc + calculateWorkingHours(shift.checkInHour, shift.checkOutHour),
                          0,
                        ) / shifts.length
                      ).toFixed(1)
                    : "0"}
                  h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng ca làm */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Danh Sách Ca Làm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Tên Ca</TableHead>
                  <TableHead>Giờ Vào</TableHead>
                  <TableHead>Giờ Ra</TableHead>
                  <TableHead>Số Giờ</TableHead>
                  <TableHead>Loại Ca</TableHead>
                  <TableHead className="text-right w-[150px]">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      {searchKeyword ? `Không tìm thấy ca nào với từ khóa "${searchKeyword}"` : "Chưa có ca làm nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((shift) => (
                    <TableRow key={shift.shiftId}>
                      <TableCell className="font-mono text-sm">{shift.shiftId.slice(-8)}</TableCell>
                      <TableCell className="font-medium">
                        {editingShift === shift.shiftId ? (
                          <div className="space-y-2">
                            {editError && (
                              <Alert variant="destructive">
                                <AlertDescription className="text-xs">{editError}</AlertDescription>
                              </Alert>
                            )}
                            <Input
                              value={editValue.nameShift}
                              onChange={(e) => {
                                setEditValue((prev) => ({ ...prev, nameShift: e.target.value }))
                                setEditError("")
                              }}
                              className="h-8"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEditShift()
                                } else if (e.key === "Escape") {
                                  cancelEdit()
                                }
                              }}
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label className="text-xs">Giờ vào</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="23"
                                  value={editValue.checkInHour}
                                  onChange={(e) => {
                                    setEditValue((prev) => ({
                                      ...prev,
                                      checkInHour: Number.parseInt(e.target.value) || 0,
                                    }))
                                    setEditError("")
                                  }}
                                  className="h-8"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Giờ ra</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="23"
                                  value={editValue.checkOutHour}
                                  onChange={(e) => {
                                    setEditValue((prev) => ({
                                      ...prev,
                                      checkOutHour: Number.parseInt(e.target.value) || 0,
                                    }))
                                    setEditError("")
                                  }}
                                  className="h-8"
                                />
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Số giờ: {calculateWorkingHours(editValue.checkInHour, editValue.checkOutHour)} giờ
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={saveEditShift}
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
                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                            {shift.nameShift}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{formatHour(shift.checkInHour)}</TableCell>
                      <TableCell>{formatHour(shift.checkOutHour)}</TableCell>
                      <TableCell>{calculateWorkingHours(shift.checkInHour, shift.checkOutHour)}h</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            shift.checkInHour >= 6 && shift.checkInHour < 12
                              ? "border-green-500 text-green-700"
                              : shift.checkInHour >= 12 && shift.checkInHour < 18
                                ? "border-orange-500 text-orange-700"
                                : "border-purple-500 text-purple-700"
                          }
                        >
                          {shift.checkInHour >= 6 && shift.checkInHour < 12
                            ? "Ca Sáng"
                            : shift.checkInHour >= 12 && shift.checkInHour < 18
                              ? "Ca Chiều"
                              : "Ca Tối"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditShift(shift)}
                            disabled={editingShift !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                                disabled={editingShift !== null}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa ca "{shift.nameShift}"? Hành động này không thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteShift(shift.shiftId)}
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
