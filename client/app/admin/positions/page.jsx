"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { usePositions } from "@/hooks/use-positions"
import { UserCheck, Search, Plus, Edit, Trash2, RefreshCw, X } from "lucide-react"

export default function PositionsPage() {
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

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [searchInput, setSearchInput] = useState(searchKeyword)

  const [formData, setFormData] = useState({
    positionName: "",
    departmentId: null, // Updated default value to null
  })

  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    searchPositions(searchInput.trim())
  }

  const handleClearSearch = () => {
    setSearchInput("")
    clearSearch()
  }

  const handleAddPosition = async (e) => {
    e.preventDefault()
    if (!formData.positionName.trim()) {
      setActionError("Tên chức vụ không được để trống")
      return
    }

    setActionLoading(true)
    setActionError("")

    try {
      const positionData = {
        positionName: formData.positionName.trim(),
        departmentId: formData.departmentId, // Use null if no department selected
      }
      await addPosition(positionData)
      setIsAddDialogOpen(false)
      resetFormData()
      refetch()

    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditPosition = async (e) => {
    e.preventDefault()
    if (!selectedPosition || !formData.positionName.trim()) {
      setActionError("Tên chức vụ không được để trống")
      return
    }

    setActionLoading(true)
    setActionError("")

    try {
      const updateData = {
        positionName: formData.positionName.trim(),
        departmentId: formData.departmentId, // Use null to unassign department
      }
      await updatePosition(selectedPosition.positionId, updateData)
      setIsEditDialogOpen(false)
      setSelectedPosition(null)
      resetFormData()
      refetch()

    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeletePosition = async (position) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa chức vụ "${position.positionName}"?`)) {
      return
    }

    try {
      await deletePosition(position.positionId)
      refetch()

    } catch (err) {
      alert(`Lỗi khi xóa chức vụ: ${err.message}`)
    }

  }

  const resetFormData = () => {
    setFormData({
      positionName: "",
      departmentId: null, // Updated default value to null
    })
  }

  const openEditDialog = (position) => {
    setSelectedPosition(position)
    setFormData({
      positionName: position.positionName || "",
      departmentId: position.department?.departmentId || null, // Updated default value to null
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
              <p className="mt-2 text-muted-foreground">Đang tải danh sách chức vụ...</p>
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
            <UserCheck className="h-5 w-5" />
            Quản lý chức vụ
          </CardTitle>
          <CardDescription>Thêm, sửa, xóa và quản lý thông tin chức vụ</CardDescription>
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
                  placeholder="Tìm kiếm chức vụ..."
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
                  Thêm chức vụ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm chức vụ mới</DialogTitle>
                  <DialogDescription>Nhập thông tin chức vụ mới</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPosition}>
                  <div className="space-y-4 py-4">
                    {actionError && (
                      <Alert variant="destructive">
                        <AlertDescription>{actionError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="positionName">Tên chức vụ</Label>
                      <Input
                        id="positionName"
                        value={formData.positionName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, positionName: e.target.value }))}
                        placeholder="Nhập tên chức vụ"
                        required
                        maxLength={100}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departmentId">Phòng ban</Label>
                      <Select
                        value={formData.departmentId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng ban (tùy chọn)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>Không chọn phòng ban</SelectItem> {/* Updated value prop */}
                          {departments.map((dept) => (
                            <SelectItem key={dept.departmentId} value={dept.departmentId}>
                              {dept.departmentName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading ? "Đang thêm..." : "Thêm chức vụ"}
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
              <span>({positions.length} kết quả)</span>
            </div>
          )}

          {/* Positions Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">STT</TableHead>
                  <TableHead>Mã chức vụ</TableHead>
                  <TableHead>Tên chức vụ</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchKeyword ? "Không tìm thấy chức vụ nào" : "Chưa có chức vụ nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  positions.map((position, index) => (
                    <TableRow key={position.positionId}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">{position.positionId}</TableCell>
                      <TableCell className="font-medium">{position.positionName}</TableCell>
                      <TableCell>
                        {position.department ? (
                          <Badge variant="outline">{position.department.departmentName}</Badge>
                        ) : (
                          <Badge variant="secondary">Chưa phân phòng ban</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(position)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePosition(position)}
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
              Tổng cộng: <strong>{positions.length}</strong> chức vụ
            </span>
            <span>
              Đã phân phòng ban: <strong>{positions.filter((pos) => pos.department).length}</strong>
            </span>
            <span>
              Chưa phân phòng ban: <strong>{positions.filter((pos) => !pos.department).length}</strong>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa chức vụ</DialogTitle>
            <DialogDescription>Cập nhật thông tin chức vụ {selectedPosition?.positionName}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditPosition}>
            <div className="space-y-4 py-4">
              {actionError && (
                <Alert variant="destructive">
                  <AlertDescription>{actionError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label>Mã chức vụ</Label>
                <Input value={selectedPosition?.positionId || ""} disabled className="bg-gray-50" />
                <p className="text-sm text-muted-foreground">Mã chức vụ không thể thay đổi</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-positionName">Tên chức vụ</Label>
                <Input
                  id="edit-positionName"
                  value={formData.positionName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, positionName: e.target.value }))}
                  placeholder="Nhập tên chức vụ"
                  required
                  maxLength={100}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-departmentId">Phòng ban</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban (tùy chọn)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Không chọn phòng ban</SelectItem> {/* Updated value prop */}
                    {departments.map((dept) => (
                      <SelectItem key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Chọn "Không chọn phòng ban" để bỏ phân công phòng ban</p>
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
