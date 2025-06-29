/**
 * Component quản lý bộ phận
 * Cho phép thêm, xem, chỉnh sửa và xóa các bộ phận trong hệ thống
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDepartments } from "@/hooks/use-departments"
import { Edit, Trash2, Save, X, Building, Plus, Search, RefreshCw } from "lucide-react"
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

export function DepartmentManagement() {
  const {
    departments,
    loading,
    error,
    searchKeyword,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    searchDepartments,
    clearSearch,
    refetch,
    setError,
  } = useDepartments()

  // State cho thêm bộ phận mới
  const [newDepartment, setNewDepartment] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  // State cho chỉnh sửa
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [editValue, setEditValue] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  // State cho tìm kiếm
  const [localSearchInput, setLocalSearchInput] = useState("")

  // Xử lý thêm bộ phận mới
  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) return

    setIsAdding(true)
    try {
      await addDepartment(newDepartment.trim())
      setNewDepartment("")
      setShowAddDialog(false)
    } catch (err) {
      console.error("Error adding department:", err)
    } finally {
      setIsAdding(false)
    }
  }

  // Xử lý bắt đầu chỉnh sửa bộ phận
  const startEditDepartment = (department) => {
    setEditingDepartment(department.departmentId)
    setEditValue(department.departmentName)
  }

  // Xử lý hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingDepartment(null)
    setEditValue("")
  }

  // Xử lý lưu chỉnh sửa bộ phận
  const saveEditDepartment = async () => {
    if (!editValue.trim() || !editingDepartment) return

    setIsUpdating(true)
    try {
      const success = await updateDepartment(editingDepartment, editValue.trim())
      if (success) {
        setEditingDepartment(null)
        setEditValue("")
      }
    } catch (err) {
      console.error("Error updating department:", err)
      // Keep the editing state so user can try again or cancel
      // The error will be displayed via the error state from the hook
    } finally {
      setIsUpdating(false)
    }
  }

  // Xử lý xóa bộ phận
  const handleDeleteDepartment = async (departmentId) => {
    try {
      await deleteDepartment(departmentId)
    } catch (err) {
      console.error("Error deleting department:", err)
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = () => {
    searchDepartments(localSearchInput)
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

      {error && editingDepartment && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Lỗi cập nhật: {error}
            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setError(null)
                  cancelEdit()
                }}
                className="bg-transparent"
              >
                Hủy chỉnh sửa
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={saveEditDepartment}
                disabled={isUpdating}
                className="bg-transparent"
              >
                Thử lại
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Header với tìm kiếm và nút thêm */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm bộ phận..."
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
                Thêm Bộ Phận
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Bộ Phận Mới</DialogTitle>
                <DialogDescription>Nhập tên bộ phận mới để thêm vào hệ thống.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Tên Bộ Phận
                  </Label>
                  <Input
                    id="name"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="col-span-3"
                    placeholder="Nhập tên bộ phận"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddDepartment()
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)} disabled={isAdding}>
                  Hủy
                </Button>
                <Button onClick={handleAddDepartment} disabled={isAdding || !newDepartment.trim()}>
                  {isAdding ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm Bộ Phận"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tổng số bộ phận</p>
                <p className="text-2xl font-bold">{departments.length}</p>
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
                <p className="text-2xl font-bold">{departments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Badge className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                <p className="text-2xl font-bold text-green-600">Hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng bộ phận */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-5 w-5" />
            Danh Sách Bộ Phận
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Tên Bộ Phận</TableHead>
                  <TableHead className="text-right w-[150px]">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                      {searchKeyword
                        ? `Không tìm thấy bộ phận nào với từ khóa "${searchKeyword}"`
                        : "Chưa có bộ phận nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((department) => (
                    <TableRow key={department.departmentId}>
                      <TableCell className="font-mono text-sm">{department.departmentId.slice(-8)}</TableCell>
                      <TableCell className="font-medium">
                        {editingDepartment === department.departmentId ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  saveEditDepartment()
                                } else if (e.key === "Escape") {
                                  cancelEdit()
                                }
                              }}
                            />
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={saveEditDepartment}
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
                        ) : (
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                            {department.departmentName}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditDepartment(department)}
                            disabled={editingDepartment !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-700"
                                disabled={editingDepartment !== null}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa bộ phận "{department.departmentName}"? Hành động này không
                                  thể hoàn tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteDepartment(department.departmentId)}
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
