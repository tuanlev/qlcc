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
import { useShifts } from "@/hooks/use-shifts"
import { Clock, Search, Plus, Edit, Trash2, RefreshCw, X } from "lucide-react"

export default function ShiftsPage() {
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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedShift, setSelectedShift] = useState(null)
  const [searchInput, setSearchInput] = useState(searchKeyword)

  const [formData, setFormData] = useState({
    shiftName: "",
    checkInHour: "",
    checkOutHour: "",
  })

  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    searchShifts(searchInput.trim())
  }

  const handleClearSearch = () => {
    setSearchInput("")
    clearSearch()
  }

  const validateShiftData = (data) => {
    const { shiftName, checkInHour, checkOutHour } = data

    if (!shiftName.trim()) {
      return "Tên ca làm không được để trống"
    }

    if (checkInHour === "" || checkOutHour === "") {
      return "Vui lòng nhập đầy đủ giờ vào và giờ ra"
    }

    const checkIn = Number.parseInt(checkInHour)
    const checkOut = Number.parseInt(checkOutHour)

    if (isNaN(checkIn) || isNaN(checkOut)) {
      return "Giờ vào và giờ ra phải là số"
    }

    if (checkIn < 0 || checkIn > 23 || checkOut < 0 || checkOut > 23) {
      return "Giờ phải nằm trong khoảng 0-23"
    }

    if (checkIn >= checkOut) {
      return "Giờ vào phải nhỏ hơn giờ ra"
    }

    return null
  }

  const handleAddShift = async (e) => {
    e.preventDefault()

    const validationError = validateShiftData(formData)
    if (validationError) {
      setActionError(validationError)
      return
    }

    setActionLoading(true)
    setActionError("")

    try {
      const shiftData = {
        shiftName: formData.shiftName.trim(),
        checkInHour: Number.parseInt(formData.checkInHour),
        checkOutHour: Number.parseInt(formData.checkOutHour),
      }
      await addShift(shiftData)
      setIsAddDialogOpen(false)
      resetFormData()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditShift = async (e) => {
    e.preventDefault()
    if (!selectedShift) return

    const validationError = validateShiftData(formData)
    if (validationError) {
      setActionError(validationError)
      return
    }

    setActionLoading(true)
    setActionError("")

    try {
      const shiftData = {
        shiftName: formData.shiftName.trim(),
        checkInHour: Number.parseInt(formData.checkInHour),
        checkOutHour: Number.parseInt(formData.checkOutHour),
      }
      await updateShift(selectedShift.shiftId, shiftData)
      setIsEditDialogOpen(false)
      setSelectedShift(null)
      resetFormData()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteShift = async (shift) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa ca làm "${shift.shiftName}"?`)) {
      return
    }

    try {
      await deleteShift(shift.shiftId)
    } catch (err) {
      alert(`Lỗi khi xóa ca làm: ${err.message}`)
    }
  }

  const resetFormData = () => {
    setFormData({
      shiftName: "",
      checkInHour: "",
      checkOutHour: "",
    })
  }

  const openEditDialog = (shift) => {
    setSelectedShift(shift)
    setFormData({
      shiftName: shift.shiftName || "",
      checkInHour: shift.checkInHour?.toString() || "",
      checkOutHour: shift.checkOutHour?.toString() || "",
    })
    setActionError("")
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    resetFormData()
    setActionError("")
    setIsAddDialogOpen(true)
  }

  const formatHour = (hour) => {
    if (hour === null || hour === undefined) return "N/A"
    return `${hour.toString().padStart(2, "0")}:00`
  }

  const formatShiftTime = (checkInHour, checkOutHour) => {
    return `${formatHour(checkInHour)} - ${formatHour(checkOutHour)}`
  }

  const calculateShiftDuration = (checkInHour, checkOutHour) => {
    if (checkInHour === null || checkInHour === undefined || checkOutHour === null || checkOutHour === undefined) {
      return "N/A"
    }
    const duration = checkOutHour - checkInHour
    return `${duration} giờ`
  }

  const getShiftTypeBadge = (checkInHour, checkOutHour) => {
    if (checkInHour === null || checkInHour === undefined) return <Badge variant="secondary">N/A</Badge>

    if (checkInHour >= 22 || checkInHour <= 6) {
      return <Badge className="bg-purple-100 text-purple-800">Ca đêm</Badge>
    } else if (checkInHour >= 6 && checkInHour < 12) {
      return <Badge className="bg-blue-100 text-blue-800">Ca sáng</Badge>
    } else if (checkInHour >= 12 && checkInHour < 18) {
      return <Badge className="bg-orange-100 text-orange-800">Ca chiều</Badge>
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Ca tối</Badge>
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải danh sách ca làm...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quản lý ca làm việc
          </CardTitle>
          <CardDescription>Thêm, sửa, xóa và quản lý thông tin ca làm việc</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm ca làm việc..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="outline">
                Tìm kiếm
              </Button>
              <Button type="button" variant="outline" onClick={refetch}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              {searchKeyword && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  <X className="h-4 w-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              )}
            </form>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm ca làm
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm ca làm việc mới</DialogTitle>
                  <DialogDescription>Nhập thông tin ca làm việc mới</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddShift}>
                  <div className="space-y-4 py-4">
                    {actionError && (
                      <Alert variant="destructive">
                        <AlertDescription>{actionError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="shiftName">Tên ca làm</Label>
                      <Input
                        id="shiftName"
                        value={formData.shiftName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, shiftName: e.target.value }))}
                        placeholder="Nhập tên ca làm (VD: Ca sáng, Ca chiều)"
                        required
                        maxLength={50}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkInHour">Giờ vào (0-23)</Label>
                        <Input
                          id="checkInHour"
                          type="number"
                          min="0"
                          max="23"
                          value={formData.checkInHour}
                          onChange={(e) => setFormData((prev) => ({ ...prev, checkInHour: e.target.value }))}
                          placeholder="8"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOutHour">Giờ ra (0-23)</Label>
                        <Input
                          id="checkOutHour"
                          type="number"
                          min="0"
                          max="23"
                          value={formData.checkOutHour}
                          onChange={(e) => setFormData((prev) => ({ ...prev, checkOutHour: e.target.value }))}
                          placeholder="17"
                          required
                        />
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        <strong>Lưu ý:</strong> Giờ vào phải nhỏ hơn giờ ra và cả hai phải nằm trong khoảng 0-23
                      </p>
                      {formData.checkInHour && formData.checkOutHour && (
                        <p className="mt-1">
                          <strong>Xem trước:</strong>{" "}
                          {formatShiftTime(
                            Number.parseInt(formData.checkInHour),
                            Number.parseInt(formData.checkOutHour),
                          )}
                          (
                          {calculateShiftDuration(
                            Number.parseInt(formData.checkInHour),
                            Number.parseInt(formData.checkOutHour),
                          )}
                          )
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading ? "Đang thêm..." : "Thêm ca làm"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Results Info */}
          {searchKeyword && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Kết quả tìm kiếm cho:</span>
              <Badge variant="secondary">"{searchKeyword}"</Badge>
              <span>({shifts.length} kết quả)</span>
            </div>
          )}

          {/* Shifts Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">STT</TableHead>
                  <TableHead>Mã ca làm</TableHead>
                  <TableHead>Tên ca làm</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Thời lượng</TableHead>
                  <TableHead>Loại ca</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shifts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchKeyword ? "Không tìm thấy ca làm nào" : "Chưa có ca làm nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  shifts.map((shift, index) => (
                    <TableRow key={shift.shiftId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">{shift.shiftId}</TableCell>
                      <TableCell className="font-medium">{shift.shiftName}</TableCell>
                      <TableCell className="font-mono">
                        {formatShiftTime(shift.checkInHour, shift.checkOutHour)}
                      </TableCell>
                      <TableCell>{calculateShiftDuration(shift.checkInHour, shift.checkOutHour)}</TableCell>
                      <TableCell>{getShiftTypeBadge(shift.checkInHour, shift.checkOutHour)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(shift)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteShift(shift)}
                            className="text-red-600 hover:text-red-700"
                          >
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

          {/* Summary */}
          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <span>
              Tổng cộng: <strong>{shifts.length}</strong> ca làm việc
            </span>
            <span>
              Ca sáng: <strong>{shifts.filter((s) => s.checkInHour >= 6 && s.checkInHour < 12).length}</strong>
            </span>
            <span>
              Ca chiều: <strong>{shifts.filter((s) => s.checkInHour >= 12 && s.checkInHour < 18).length}</strong>
            </span>
            <span>
              Ca đêm: <strong>{shifts.filter((s) => s.checkInHour >= 22 || s.checkInHour <= 6).length}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa ca làm việc</DialogTitle>
            <DialogDescription>Cập nhật thông tin ca làm việc {selectedShift?.shiftName}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditShift}>
            <div className="space-y-4 py-4">
              {actionError && (
                <Alert variant="destructive">
                  <AlertDescription>{actionError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label>Mã ca làm</Label>
                <Input value={selectedShift?.shiftId || ""} disabled className="bg-gray-50" />
                <p className="text-sm text-muted-foreground">Mã ca làm không thể thay đổi</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-shiftName">Tên ca làm</Label>
                <Input
                  id="edit-shiftName"
                  value={formData.shiftName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shiftName: e.target.value }))}
                  placeholder="Nhập tên ca làm"
                  required
                  maxLength={50}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-checkInHour">Giờ vào (0-23)</Label>
                  <Input
                    id="edit-checkInHour"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.checkInHour}
                    onChange={(e) => setFormData((prev) => ({ ...prev, checkInHour: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-checkOutHour">Giờ ra (0-23)</Label>
                  <Input
                    id="edit-checkOutHour"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.checkOutHour}
                    onChange={(e) => setFormData((prev) => ({ ...prev, checkOutHour: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Lưu ý:</strong> Giờ vào phải nhỏ hơn giờ ra và cả hai phải nằm trong khoảng 0-23
                </p>
                {formData.checkInHour && formData.checkOutHour && (
                  <p className="mt-1">
                    <strong>Xem trước:</strong>{" "}
                    {formatShiftTime(Number.parseInt(formData.checkInHour), Number.parseInt(formData.checkOutHour))}(
                    {calculateShiftDuration(
                      Number.parseInt(formData.checkInHour),
                      Number.parseInt(formData.checkOutHour),
                    )}
                    )
                  </p>
                )}
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
