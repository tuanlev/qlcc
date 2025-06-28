/**
 * Component quản lý chức vụ
 * Cho phép thêm, xem, chỉnh sửa và xóa các chức vụ trong hệ thống
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePositions } from "@/hooks/use-positions"
import { Edit, Trash2, Save, X, Briefcase, Plus, Search, RefreshCw, Building } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PositionManagement() {
  const {
    positions,
    departments,
    loading,
    error,
    searchKeyword,
    addPosition,
    updatePosition,
    deletePosition,
    searchPositions,
    clearSearch,
    refetch,
  } = usePositions()

  // State cho thêm chức vụ mới
  const [newPosition, setNewPosition] = useState({
    namePosition: "",
    departmentId: null,
  })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // State cho chỉnh sửa
  const [editingPosition, setEditingPosition] = useState(null)
  const [editValue, setEditValue] = useState({
    namePosition: "",
    departmentId: null,
  })
  const [isUpdating, setIsUpdating] = useState(false)

  // State cho tìm kiếm
  const [localSearchInput, setLocalSearchInput] = useState("")

  // Reset form thêm mới
  const resetAddForm = () => {
    setNewPosition({
      namePosition: "",
      departmentId: null,
    })
  }

  // Xử lý thêm chức vụ mới
  const handleAddPosition = async () => {
    if (!newPosition.namePosition.trim()) return

    setIsAdding(true)
    try {
      const positionData = {
        namePosition: newPosition.namePosition.trim(),
      }
      if (newPosition.departmentId !== null) {
        positionData.departmentId = newPosition.departmentId
      }

      await addPosition(positionData)
      resetAddForm()
      setShowAddDialog(false)
    } catch (err) {
      console.error("Error adding position:", err)
    } finally {
      setIsAdding(false)
    }
  }

  // Xử lý bắt đầu chỉnh sửa chức vụ
  const startEditPosition = (position) => {
    setEditingPosition(position.positionId)
    setEditValue({
      namePosition: position.namePosition,
      departmentId: position.department?.departmentId || null,
    })
  }

  // Xử lý hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingPosition(null)
    setEditValue({
      namePosition: "",
      departmentId: null,
    })
  }

  // Xử lý lưu chỉnh sửa chức vụ
  const saveEditPosition = async () => {
    if (!editValue.namePosition.trim() || !editingPosition) return

    setIsUpdating(true)
    try {
      const updateData = {
        namePosition: editValue.namePosition.trim(),
      }
    updateData.departmentId = editValue.departmentId
      

      const success = await updatePosition(editingPosition, updateData)
      if (success) {
        refetch()
        setEditingPosition(null)
        setEditValue({
          namePosition: "",
          departmentId: null,
        })
      }
    } catch (err) {
      console.error("Error updating position:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Xử lý xóa chức vụ
  const handleDeletePosition = async (positionId) => {
    try {
      await deletePosition(positionId)
    } catch (err) {
      console.error("Error deleting position:", err)
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = () => {
    searchPositions(localSearchInput)
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
            placeholder="Tìm kiếm chức vụ..."
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
                Thêm Chức Vụ
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Chức Vụ Mới</DialogTitle>
                <DialogDescription>Nhập thông tin chức vụ mới để thêm vào hệ thống.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="namePosition" className="text-right">
                    Tên Chức Vụ
                  </Label>
                  <Input
                    id="namePosition"
                    value={newPosition.namePosition}
                    onChange={(e) => setNewPosition((prev) => ({ ...prev, namePosition: e.target.value }))}
                    className="col-span-3"
                    placeholder="Nhập tên chức vụ"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddPosition()
                      }
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departmentId" className="text-right">
                    Bộ Phận
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newPosition.departmentId}
                      onValueChange={(value) => setNewPosition((prev) => ({ ...prev, departmentId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bộ phận (tùy chọn)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={null}>Không thuộc bộ phận nào</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.departmentId} value={dept.departmentId}>
                            {dept.nameDepartment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isAdding}>
                  Hủy
                </Button>
                <Button onClick={handleAddPosition} disabled={isAdding || !newPosition.namePosition.trim()}>
                  {isAdding ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm Chức Vụ"
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
              <Briefcase className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tổng số chức vụ</p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Có bộ phận</p>
                <p className="text-2xl font-bold">{positions.filter((pos) => pos.department).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Không có bộ phận</p>
                <p className="text-2xl font-bold">{positions.filter((pos) => !pos.department).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Search className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">
                  {searchKeyword ? `Tìm kiếm: "${searchKeyword}"` : "Tổng kết quả"}
                </p>
                <p className="text-2xl font-bold">{positions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng chức vụ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            Danh Sách Chức Vụ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Tên Chức Vụ</TableHead>
                  <TableHead>Bộ Phận</TableHead>
                  <TableHead className="text-right w-[150px]">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                      {searchKeyword
                        ? `Không tìm thấy chức vụ nào với từ khóa "${searchKeyword}"`
                        : "Chưa có chức vụ nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  positions.map((position) => (
                    <TableRow key={position.positionId}>
                      <TableCell className="font-mono text-sm">{position.positionId.slice(-8)}</TableCell>
                      <TableCell className="font-medium">
                        {editingPosition === position.positionId ? (
                          <div className="space-y-2">
                            <Input
                              value={editValue.namePosition}
                              onChange={(e) => setEditValue((prev) => ({ ...prev, namePosition: e.target.value }))}
                              className="h-8"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEditPosition()
                                } else if (e.key === "Escape") {
                                  cancelEdit()
                                }
                              }}
                            />
                            <Select
                              value={editValue.departmentId}
                              onValueChange={(value) => setEditValue((prev) => ({ ...prev, departmentId: value }))}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Chọn bộ phận" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={null}>Không thuộc bộ phận nào</SelectItem>
                                {departments.map((dept) => (
                                  <SelectItem key={dept.departmentId} value={dept.departmentId}>
                                    {dept.nameDepartment}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={saveEditPosition}
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
                            <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                            {position.namePosition}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {position.department ? (
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Building className="mr-1 h-3 w-3" />
                            {position.department.nameDepartment}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Không có bộ phận</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditPosition(position)}
                            disabled={editingPosition !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                                disabled={editingPosition !== null}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa chức vụ "{position.namePosition}"? Hành động này không thể
                                  hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePosition(position.positionId)}
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
