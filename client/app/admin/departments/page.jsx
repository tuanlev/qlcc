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
import { useDepartments } from "@/hooks/use-departments"
import { Building2, Search, Plus, Edit, Trash2, RefreshCw, X } from "lucide-react"

export default function DepartmentsPage() {
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
  } = useDepartments()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [searchInput, setSearchInput] = useState(searchKeyword)

  const [formData, setFormData] = useState({
    departmentName: "",
  })

  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    searchDepartments(searchInput.trim())
  }

  const handleClearSearch = () => {
    setSearchInput("")
    clearSearch()
  }

  const handleAddDepartment = async (e) => {
    e.preventDefault()
    if (!formData.departmentName.trim()) {
      setActionError("Tên phòng ban không được để trống")
      return
    }

    setActionLoading(true)
    setActionError("")

    try {
      await addDepartment(formData.departmentName.trim())
      setIsAddDialogOpen(false)
      resetFormData()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditDepartment = async (e) => {
    e.preventDefault()
    if (!selectedDepartment || !formData.departmentName.trim()) {
      setActionError("Tên phòng ban không được để trống")
      return
    }

    setActionLoading(true)
    setActionError("")

    try {
      await updateDepartment(selectedDepartment.departmentId, formData.departmentName.trim())
      setIsEditDialogOpen(false)
      setSelectedDepartment(null)
      resetFormData()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteDepartment = async (department) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa phòng ban "${department.departmentName}"?`)) {
      return
    }

    try {
      await deleteDepartment(department.departmentId)
    } catch (err) {
      alert(`Lỗi khi xóa phòng ban: ${err.message}`)
    }
  }

  const resetFormData = () => {
    setFormData({
      departmentName: "",
    })
  }

  const openEditDialog = (department) => {
    setSelectedDepartment(department)
    setFormData({
      departmentName: department.departmentName || "",
    })
    setActionError("")
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    resetFormData()
    setActionError("")
    setIsAddDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải danh sách phòng ban...</p>
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
            <Building2 className="h-5 w-5" />
            Quản lý phòng ban
          </CardTitle>
          <CardDescription>Thêm, sửa, xóa và quản lý thông tin phòng ban</CardDescription>
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
                  placeholder="Tìm kiếm phòng ban..."
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
                  Thêm phòng ban
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm phòng ban mới</DialogTitle>
                  <DialogDescription>Nhập thông tin phòng ban mới</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddDepartment}>
                  <div className="space-y-4 py-4">
                    {actionError && (
                      <Alert variant="destructive">
                        <AlertDescription>{actionError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="departmentName">Tên phòng ban</Label>
                      <Input
                        id="departmentName"
                        value={formData.departmentName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, departmentName: e.target.value }))}
                        placeholder="Nhập tên phòng ban"
                        required
                        maxLength={100}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading ? "Đang thêm..." : "Thêm phòng ban"}
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
              <span>({departments.length} kết quả)</span>
            </div>
          )}

          {/* Departments Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">STT</TableHead>
                  <TableHead>Mã phòng ban</TableHead>
                  <TableHead>Tên phòng ban</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      {searchKeyword ? "Không tìm thấy phòng ban nào" : "Chưa có phòng ban nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  departments.map((department, index) => (
                    <TableRow key={department.departmentId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">{department.departmentId}</TableCell>
                      <TableCell className="font-medium">{department.departmentName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(department)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDepartment(department)}
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
          <div className="text-sm text-muted-foreground">
            Tổng cộng: <strong>{departments.length}</strong> phòng ban
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phòng ban</DialogTitle>
            <DialogDescription>Cập nhật thông tin phòng ban {selectedDepartment?.departmentName}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditDepartment}>
            <div className="space-y-4 py-4">
              {actionError && (
                <Alert variant="destructive">
                  <AlertDescription>{actionError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label>Mã phòng ban</Label>
                <Input value={selectedDepartment?.departmentId || ""} disabled className="bg-gray-50" />
                <p className="text-sm text-muted-foreground">Mã phòng ban không thể thay đổi</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-departmentName">Tên phòng ban</Label>
                <Input
                  id="edit-departmentName"
                  value={formData.departmentName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, departmentName: e.target.value }))}
                  placeholder="Nhập tên phòng ban"
                  required
                  maxLength={100}
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
