"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useEmployees } from "@/hooks/use-employees"
import { Plus, Search, Edit, Trash2, Users, Eye } from "lucide-react"

export default function EmployeesPage() {
  const router = useRouter()
  const {
    employees,
    departments,
    positions,
    shifts,
    devices,
    loading,
    error,
    searchKeyword,
    departmentFilter,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    searchByDepartment,
    clearSearch,
  } = useEmployees()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [searchInput, setSearchInput] = useState(searchKeyword)
  const [departmentFilterInput, setDepartmentFilterInput] = useState(departmentFilter)
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    departmentId: "all", // Updated default value
    positionId: "all", // Updated default value
    shiftId: "all", // Updated default value
    deviceId: "",
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    searchEmployees(searchInput, departmentFilterInput)
  }

  const handleDepartmentFilter = (value) => {
    setDepartmentFilterInput(value)
    searchByDepartment(value)
  }

  const handleClearSearch = () => {
    setSearchInput("")
    setDepartmentFilterInput("all")
    clearSearch()
  }

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    setActionError("")

    try {
      await addEmployee(formData)
      setIsAddDialogOpen(false)
      setFormData({
        name: "",
        employeeId: "",
        email: "",
        phone: "",
        departmentId: "all", // Updated default value
        positionId: "all", // Updated default value
        shiftId: "all", // Updated default value
        deviceId: "",
      })
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditEmployee = async (e) => {
    e.preventDefault()
    if (!selectedEmployee) return

    setActionLoading(true)
    setActionError("")

    try {
      await updateEmployee(selectedEmployee.employeeId, formData)
      setIsEditDialogOpen(false)
      setSelectedEmployee(null)
      setFormData({
        name: "",
        employeeId: "",
        email: "",
        phone: "",
        departmentId: "all", // Updated default value
        positionId: "all", // Updated default value
        shiftId: "all", // Updated default value
        deviceId: "",
      })
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteEmployee = async (employee) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa nhân viên "${employee.name}"?`)) {
      return
    }

    try {
      await deleteEmployee(employee.employeeId)
    } catch (err) {
      alert(`Lỗi khi xóa nhân viên: ${err.message}`)
    }
  }

  const openEditDialog = (employee) => {
    setSelectedEmployee(employee)
    setFormData({
      name: employee.name || "",
      employeeId: employee.employeeId || "",
      email: employee.email || "",
      phone: employee.phone || "",
      departmentId: employee.department?.departmentId || "all", // Updated default value
      positionId: employee.position?.positionId || "all", // Updated default value
      shiftId: employee.shift?.shiftId || "all", // Updated default value
      deviceId: employee.device?.deviceId || "",
    })
    setActionError("")
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({
      name: "",
      employeeId: "",
      email: "",
      phone: "",
      departmentId: "all", // Updated default value
      positionId: "all", // Updated default value
      shiftId: "all", // Updated default value
      deviceId: "",
    })
    setActionError("")
    setIsAddDialogOpen(true)
  }

  const viewEmployeeDetail = (employee) => {
    router.push(`/admin/employees/${employee.employeeId}`)
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải danh sách nhân viên...</p>
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
            <Users className="h-5 w-5" />
            Quản lý nhân viên
          </CardTitle>
          <CardDescription>Thêm, sửa, xóa và quản lý thông tin nhân viên</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col lg:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <Input
                placeholder="Tìm kiếm nhân viên..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Select value={departmentFilterInput} onValueChange={handleDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.departmentId} value={dept.departmentId}>
                      {dept.nameDepartment}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              {(searchKeyword || departmentFilter !== "all") && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  Xóa bộ lọc
                </Button>
              )}
            </form>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm nhân viên
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Thêm nhân viên mới</DialogTitle>
                  <DialogDescription>Nhập thông tin nhân viên mới</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddEmployee}>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    {actionError && (
                      <Alert variant="destructive" className="col-span-2">
                        <AlertDescription>{actionError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ tên</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Nhập họ tên"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeId">Mã nhân viên</Label>
                      <Input
                        id="employeeId"
                        value={formData.employeeId}
                        onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                        placeholder="Nhập mã nhân viên"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Nhập email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departmentId">Phòng ban</Label>
                      <Select
                        value={formData.departmentId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng ban" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.departmentId} value={dept.departmentId}>
                              {dept.nameDepartment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="positionId">Chức vụ</Label>
                      <Select
                        value={formData.positionId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, positionId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn chức vụ" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((pos) => (
                            <SelectItem key={pos.positionId} value={pos.positionId}>
                              {pos.namePosition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shiftId">Ca làm</Label>
                      <Select
                        value={formData.shiftId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, shiftId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ca làm" />
                        </SelectTrigger>
                        <SelectContent>
                          {shifts.map((shift) => (
                            <SelectItem key={shift.shiftId} value={shift.shiftId}>
                              {shift.shiftName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deviceId">Thiết bị</Label>
                      <Select
                        value={formData.deviceId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, deviceId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thiết bị" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Không gán thiết bị</SelectItem>
                          {devices.map((device) => (
                            <SelectItem key={device.deviceId} value={device.deviceId}>
                              {device.nameDevice || device.deviceId}
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
                      {actionLoading ? "Đang thêm..." : "Thêm nhân viên"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Employees Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã NV</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Ca làm</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchKeyword || departmentFilter !== "all"
                        ? "Không tìm thấy nhân viên nào"
                        : "Chưa có nhân viên nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell className="font-mono text-sm">{employee.employeeId}</TableCell>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.department?.nameDepartment || "Chưa phân"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{employee.position?.namePosition || "Chưa phân"}</Badge>
                      </TableCell>
                      <TableCell>{employee.shift?.shiftName || "Chưa phân"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => viewEmployeeDetail(employee)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(employee)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteEmployee(employee)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
            <DialogDescription>Cập nhật thông tin nhân viên {selectedEmployee?.name}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditEmployee}>
            <div className="grid grid-cols-2 gap-4 py-4">
              {actionError && (
                <Alert variant="destructive" className="col-span-2">
                  <AlertDescription>{actionError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="edit-name">Họ tên</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập họ tên"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mã nhân viên</Label>
                <Input value={formData.employeeId} disabled />
                <p className="text-sm text-muted-foreground">Mã nhân viên không thể thay đổi</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Nhập email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-departmentId">Phòng ban</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, departmentId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.departmentId} value={dept.departmentId}>
                        {dept.nameDepartment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-positionId">Chức vụ</Label>
                <Select
                  value={formData.positionId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, positionId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.positionId} value={pos.positionId}>
                        {pos.namePosition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-shiftId">Ca làm</Label>
                <Select
                  value={formData.shiftId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, shiftId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ca làm" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map((shift) => (
                      <SelectItem key={shift.shiftId} value={shift.shiftId}>
                        {shift.shiftName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deviceId">Thiết bị</Label>
                <Select
                  value={formData.deviceId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, deviceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thiết bị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không gán thiết bị</SelectItem>
                    {devices.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.nameDevice || device.deviceId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
