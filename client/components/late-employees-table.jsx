/**
 * Component quản lý nhân viên
 * Cho phép thêm, xem, chỉnh sửa và xóa các nhân viên trong hệ thống
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEmployees } from "@/hooks/use-employees"
import { useDepartments } from "@/hooks/use-departments"
import { usePositions } from "@/hooks/use-positions"
import { useShifts } from "@/hooks/use-shifts"
import { Edit, Trash2, Save, X, User, Plus, Search, RefreshCw, Building, Briefcase, Clock, Monitor } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function EmployeeManagementTable() {
  const {
    employees,
    devices,
    loading: employeesLoading,
    error: employeesError,
    searchKeyword,
    departmentFilter,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    searchEmployees,
    searchByDepartment,
    clearSearch,
    refetch: refetchEmployees,
  } = useEmployees()

  const { departments, loading: departmentsLoading } = useDepartments()
  const { positions, loading: positionsLoading } = usePositions()
  const { shifts, loading: shiftsLoading } = useShifts()

  // Combine loading states
  const loading = employeesLoading || departmentsLoading || positionsLoading || shiftsLoading
  const error = employeesError

  const refetch = () => {
    refetchEmployees()
  }

  // State cho thêm nhân viên mới
  const [newEmployee, setNewEmployee] = useState({
    employeeId: "",
    fullName: "",
    email: "",
    departmentId: "none",
    positionId: "none",
    shiftId: "none",
    deviceId: "none",
  })
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [addError, setAddError] = useState("")

  // State cho chỉnh sửa
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editValue, setEditValue] = useState({
    fullName: "",
    email: "",
    departmentId: "none",
    positionId: "none",
    shiftId: "none",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [editError, setEditError] = useState("")

  // State cho tìm kiếm
  const [localSearchInput, setLocalSearchInput] = useState("")

  // Reset form thêm mới
  const resetAddForm = () => {
    setNewEmployee({
      employeeId: "",
      fullName: "",
      email: "",
      departmentId: "none",
      positionId: "none",
      shiftId: "none",
      deviceId: "none",
    })
    setAddError("")
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

  // Get shift badge
  const getShiftBadge = (shift) => {
    if (!shift) return <Badge variant="secondary">Chưa có ca</Badge>

    let className = ""
    if (shift.checkInHour >= 6 && shift.checkInHour < 12) {
      className = "border-green-500 text-green-700"
    } else if (shift.checkInHour >= 12 && shift.checkInHour < 18) {
      className = "border-orange-500 text-orange-700"
    } else {
      className = "border-purple-500 text-purple-700"
    }

    return (
      <Badge variant="outline" className={className}>
        <Clock className="mr-1 h-3 w-3" />
        {shift.nameShift} ({shift.checkInHour}h-{shift.checkOutHour}h)
      </Badge>
    )
  }

  // Validate employee data
  const validateEmployeeData = (data, isEdit = false) => {
    if (!data.fullName.trim()) {
      return "Họ tên không được để trống"
    }
    if (!data.email.trim()) {
      return "Email không được để trống"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return "Email không hợp lệ"
    }
    if (!isEdit && !data.employeeId.trim()) {
      return "Mã nhân viên không được để trống"
    }
    return null
  }

  // Xử lý thêm nhân viên mới
  const handleAddEmployee = async () => {
    const validationError = validateEmployeeData(newEmployee)
    if (validationError) {
      setAddError(validationError)
      return
    }

    setIsAdding(true)
    setAddError("")

    try {
      const employeeData = {
        employeeId: newEmployee.employeeId.trim(),
        fullName: newEmployee.fullName.trim(),
        email: newEmployee.email.trim(),
      }

      // Add optional fields if selected
      if (newEmployee.departmentId !== "none") employeeData.departmentId = newEmployee.departmentId
      if (newEmployee.positionId !== "none") employeeData.positionId = newEmployee.positionId
      if (newEmployee.shiftId !== "none") employeeData.shiftId = newEmployee.shiftId
      if (newEmployee.deviceId !== "none") employeeData.deviceId = newEmployee.deviceId

      await addEmployee(employeeData)
      resetAddForm()
      setShowAddDialog(false)
    } catch (err) {
      setAddError(err.message)
      console.error("Error adding employee:", err)
    } finally {
      setIsAdding(false)
    }
  }

  // Xử lý bắt đầu chỉnh sửa nhân viên
  const startEditEmployee = (employee) => {
    setEditingEmployee(employee.employeeId)
    setEditValue({
      fullName: employee.fullName || "",
      email: employee.email || "",
      departmentId: employee.department?.departmentId || "none",
      positionId: employee.position?.positionId || "none",
      shiftId: employee.shift?.shiftId || "none",
      // Không bao gồm deviceId trong edit
    })
    setEditError("")
  }

  // Xử lý hủy chỉnh sửa
  const cancelEdit = () => {
    setEditingEmployee(null)
    setEditValue({
      fullName: "",
      email: "",
      departmentId: "none",
      positionId: "none",
      shiftId: "none",
    })
    setEditError("")
  }

  // Xử lý lưu chỉnh sửa nhân viên
  const saveEditEmployee = async () => {
    const validationError = validateEmployeeData(editValue, true)
    if (validationError) {
      setEditError(validationError)
      return
    }

    setIsUpdating(true)
    setEditError("")

    try {
      const updateData = {
        fullName: editValue.fullName.trim(),
        email: editValue.email.trim(),
      }

      // Add optional fields if selected (but NOT deviceId)
      if (editValue.departmentId !== "none") updateData.departmentId = editValue.departmentId
      if (editValue.positionId !== "none") updateData.positionId = editValue.positionId
      if (editValue.shiftId !== "none") updateData.shiftId = editValue.shiftId

      const success = await updateEmployee(editingEmployee, updateData)
      if (success) {
        setEditingEmployee(null)
        setEditValue({
          fullName: "",
          email: "",
          departmentId: "none",
          positionId: "none",
          shiftId: "none",
        })
      }
    } catch (err) {
      setEditError(err.message)
      console.error("Error updating employee:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  // Xử lý xóa nhân viên
  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId)
    } catch (err) {
      console.error("Error deleting employee:", err)
    }
  }

  // Xử lý tìm kiếm
  const handleSearch = () => {
    searchEmployees(localSearchInput, departmentFilter)
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

      {/* Header với tìm kiếm và bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
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

          <Select value={departmentFilter} onValueChange={searchByDepartment}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Tất cả phòng ban" />
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
                Thêm Nhân Viên
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm Nhân Viên Mới</DialogTitle>
                <DialogDescription>Nhập thông tin nhân viên mới để thêm vào hệ thống.</DialogDescription>
              </DialogHeader>

              {addError && (
                <Alert variant="destructive">
                  <AlertDescription>{addError}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employeeId" className="text-right">
                    Mã Nhân Viên
                  </Label>
                  <Input
                    id="employeeId"
                    value={newEmployee.employeeId}
                    onChange={(e) => {
                      setNewEmployee((prev) => ({ ...prev, employeeId: e.target.value }))
                      setAddError("")
                    }}
                    className="col-span-3"
                    placeholder="Nhập mã nhân viên"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fullName" className="text-right">
                    Họ Tên
                  </Label>
                  <Input
                    id="fullName"
                    value={newEmployee.fullName}
                    onChange={(e) => {
                      setNewEmployee((prev) => ({ ...prev, fullName: e.target.value }))
                      setAddError("")
                    }}
                    className="col-span-3"
                    placeholder="Nhập họ tên"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddEmployee()
                      }
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) => {
                      setNewEmployee((prev) => ({ ...prev, email: e.target.value }))
                      setAddError("")
                    }}
                    className="col-span-3"
                    placeholder="Nhập email"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departmentId" className="text-right">
                    Phòng Ban
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newEmployee.departmentId}
                      onValueChange={(value) => setNewEmployee((prev) => ({ ...prev, departmentId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phòng ban (tùy chọn)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không chọn</SelectItem>
                        {departments.map((dept) => (
                          <SelectItem key={dept.departmentId} value={dept.departmentId}>
                            {dept.nameDepartment}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="positionId" className="text-right">
                    Chức Vụ
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newEmployee.positionId}
                      onValueChange={(value) => setNewEmployee((prev) => ({ ...prev, positionId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chức vụ (tùy chọn)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không chọn</SelectItem>
                        {positions.map((pos) => (
                          <SelectItem key={pos.positionId} value={pos.positionId}>
                            {pos.namePosition}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shiftId" className="text-right">
                    Ca Làm Việc
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newEmployee.shiftId}
                      onValueChange={(value) => setNewEmployee((prev) => ({ ...prev, shiftId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ca làm việc (tùy chọn)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không chọn</SelectItem>
                        {shifts.map((shift) => (
                          <SelectItem key={shift.shiftId} value={shift.shiftId}>
                            {shift.nameShift} ({shift.checkInHour}h-{shift.checkOutHour}h)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deviceId" className="text-right">
                    Thiết Bị
                  </Label>
                  <div className="col-span-3">
                    <Select
                      value={newEmployee.deviceId}
                      onValueChange={(value) => setNewEmployee((prev) => ({ ...prev, deviceId: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thiết bị (tùy chọn)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Không chọn</SelectItem>
                        {devices.map((device) => (
                          <SelectItem key={device.deviceId} value={device.deviceId}>
                            {device.nameDevice || device.deviceId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                <Button onClick={handleAddEmployee} disabled={isAdding || !newEmployee.fullName.trim()}>
                  {isAdding ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm Nhân Viên"
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
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tổng nhân viên</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Có phòng ban</p>
                <p className="text-2xl font-bold">{employees.filter((emp) => emp.department).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Có chức vụ</p>
                <p className="text-2xl font-bold">{employees.filter((emp) => emp.position).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Có ca làm việc</p>
                <p className="text-2xl font-bold">{employees.filter((emp) => emp.shift).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng nhân viên */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Danh Sách Nhân Viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Họ Tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Chức Vụ</TableHead>
                  <TableHead>Ca Làm Việc</TableHead>
                  <TableHead>Thiết Bị</TableHead>
                  <TableHead>Ngày Đăng Ký</TableHead>
                  <TableHead className="text-right w-[150px]">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      {searchKeyword || departmentFilter !== "all"
                        ? `Không tìm thấy nhân viên nào`
                        : "Chưa có nhân viên nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  employees.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell className="font-mono text-sm">{employee.employeeId.slice(-8)}</TableCell>

                      {/* Cột Họ Tên */}
                      <TableCell className="font-medium">
                        {editingEmployee === employee.employeeId ? (
                          <Input
                            value={editValue.fullName}
                            onChange={(e) => {
                              setEditValue((prev) => ({ ...prev, fullName: e.target.value }))
                              setEditError("")
                            }}
                            className="h-8"
                            placeholder="Họ tên"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveEditEmployee()
                              } else if (e.key === "Escape") {
                                cancelEdit()
                              }
                            }}
                          />
                        ) : (
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarFallback>
                                {employee.fullName ? employee.fullName.substring(0, 2).toUpperCase() : "NV"}
                              </AvatarFallback>
                            </Avatar>
                            {employee.fullName}
                          </div>
                        )}
                      </TableCell>

                      {/* Cột Email */}
                      <TableCell>
                        {editingEmployee === employee.employeeId ? (
                          <Input
                            value={editValue.email}
                            onChange={(e) => {
                              setEditValue((prev) => ({ ...prev, email: e.target.value }))
                              setEditError("")
                            }}
                            className="h-8"
                            placeholder="Email"
                            type="email"
                          />
                        ) : (
                          employee.email
                        )}
                      </TableCell>

                      {/* Cột Phòng Ban */}
                      <TableCell>
                        {editingEmployee === employee.employeeId ? (
                          <Select
                            value={editValue.departmentId}
                            onValueChange={(value) => setEditValue((prev) => ({ ...prev, departmentId: value }))}
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue placeholder="Chọn phòng ban" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Không chọn</SelectItem>
                              {departments.map((dept) => (
                                <SelectItem key={dept.departmentId} value={dept.departmentId}>
                                  {dept.nameDepartment}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : employee.department ? (
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Building className="mr-1 h-3 w-3" />
                            {employee.department.nameDepartment}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa có</Badge>
                        )}
                      </TableCell>

                      {/* Cột Chức Vụ */}
                      <TableCell>
                        {editingEmployee === employee.employeeId ? (
                          <Select
                            value={editValue.positionId}
                            onValueChange={(value) => setEditValue((prev) => ({ ...prev, positionId: value }))}
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue placeholder="Chọn chức vụ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Không chọn</SelectItem>
                              {positions.map((pos) => (
                                <SelectItem key={pos.positionId} value={pos.positionId}>
                                  {pos.namePosition}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : employee.position ? (
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Briefcase className="mr-1 h-3 w-3" />
                            {employee.position.namePosition}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa có</Badge>
                        )}
                      </TableCell>

                      {/* Cột Ca Làm Việc */}
                      <TableCell>
                        {editingEmployee === employee.employeeId ? (
                          <Select
                            value={editValue.shiftId}
                            onValueChange={(value) => setEditValue((prev) => ({ ...prev, shiftId: value }))}
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue placeholder="Chọn ca làm việc" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Không chọn</SelectItem>
                              {shifts.map((shift) => (
                                <SelectItem key={shift.shiftId} value={shift.shiftId}>
                                  {shift.nameShift}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          getShiftBadge(employee.shift)
                        )}
                      </TableCell>

                      {/* Cột Thiết Bị - Không cho edit */}
                      <TableCell>
                        {employee.device ? (
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Monitor className="mr-1 h-3 w-3" />
                            {employee.device.nameDevice || employee.device.deviceId}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa có</Badge>
                        )}
                      </TableCell>

                      {/* Cột Ngày Đăng Ký */}
                      <TableCell>{formatDate(employee.registrationDate)}</TableCell>

                      {/* Cột Thao Tác */}
                      <TableCell className="text-right">
                        {editingEmployee === employee.employeeId ? (
                          <div className="flex justify-end space-x-2">
                            {editError && (
                              <div className="absolute top-0 right-0 mt-2 mr-2 z-10">
                                <Alert variant="destructive" className="w-64">
                                  <AlertDescription className="text-xs">{editError}</AlertDescription>
                                </Alert>
                              </div>
                            )}
                            <Button size="sm" variant="ghost" onClick={saveEditEmployee} disabled={isUpdating}>
                              {isUpdating ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={isUpdating}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEditEmployee(employee)}
                              disabled={editingEmployee !== null}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-500 hover:text-red-700"
                                  disabled={editingEmployee !== null}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa nhân viên "{employee.fullName}"? Hành động này không thể
                                    hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEmployee(employee.employeeId)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
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
