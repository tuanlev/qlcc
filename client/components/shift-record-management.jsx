/**
 * Component quản lý chấm công
 * Hiển thị bảng chấm công với các bộ lọc theo ngày/tháng/năm
 * Có chức năng xuất Excel
 */
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useShiftRecords } from "@/hooks/use-shift-records"
import { Calendar, RefreshCw, Building, Briefcase, Monitor, User, Clock, Download, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import * as XLSX from "xlsx"

export function ShiftRecordManagement() {
  const {
    shiftRecords,
    loading,
    error,
    currentQuery,
    searchByDate,
    getTodayRecords,
    getCurrentMonthRecords,
    getCurrentYearRecords,
    refetch,
  } = useShiftRecords()

  // State cho bộ lọc ngày
  const [dateFilter, setDateFilter] = useState({
    day: "",
    month: "",
    year: "",
  })

  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Extract unique departments from records
  const departments = useMemo(() => {
    const deptSet = new Set()
    shiftRecords.forEach((record) => {
      if (record.employee?.department?.nameDepartment) {
        deptSet.add(record.employee.department.nameDepartment)
      }
    })
    return Array.from(deptSet)
  }, [shiftRecords])

  // Filter records based on search and filters
  const filteredRecords = useMemo(() => {
    return shiftRecords.filter((record) => {
      const employee = record.employee

      // Search filter
      const matchesSearch =
        !searchTerm ||
        employee?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee?.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee?.email?.toLowerCase().includes(searchTerm.toLowerCase())

      // Department filter
      const matchesDepartment = departmentFilter === "all" || employee?.department?.nameDepartment === departmentFilter

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "present" && record.checkInTime && record.checkOutTime) ||
        (statusFilter === "late" && record.checkInStatus === "late") ||
        (statusFilter === "absent" && (record.checkInStatus === "absent" || record.checkOutStatus === "absent")) ||
        (statusFilter === "incomplete" && record.checkInTime && !record.checkOutTime)

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [shiftRecords, searchTerm, departmentFilter, statusFilter])

  // Format date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "-"
    }
  }

  const formatTime = (dateString) => {
    if (!dateString) return "-"
    try {
      return new Date(dateString).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "-"
    }
  }

  // Get status badge
  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">-</Badge>

    const statusConfig = {
      present: { variant: "default", className: "bg-green-500", label: "Có mặt" },
      late: { variant: "destructive", className: "bg-yellow-500", label: "Muộn" },
      absent: { variant: "destructive", className: "bg-red-500", label: "Vắng" },
      Unassigned: { variant: "secondary", className: "bg-gray-500", label: "Chưa xác định" },
    }

    const config = statusConfig[status] || statusConfig.Unassigned

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  // Handle date search
  const handleDateSearch = () => {
    const { day, month, year } = dateFilter

    // Convert to numbers and validate
    const dayNum = day ? Number.parseInt(day) : null
    const monthNum = month ? Number.parseInt(month) : null
    const yearNum = year ? Number.parseInt(year) : null

    searchByDate(dayNum, monthNum, yearNum)
  }

  // Quick date filters
  const handleTodayFilter = () => {
    getTodayRecords()
    setDateFilter({ day: "", month: "", year: "" })
  }

  const handleMonthFilter = () => {
    getCurrentMonthRecords()
    setDateFilter({ day: "", month: "", year: "" })
  }

  const handleYearFilter = () => {
    getCurrentYearRecords()
    setDateFilter({ day: "", month: "", year: "" })
  }

  // Export to Excel
  const exportToExcel = () => {
    try {
      const exportData = filteredRecords.map((record, index) => ({
        STT: index + 1,
        "Mã NV": record.employee?.employeeId || "-",
        "Họ Tên": record.employee?.fullName || "-",
        Email: record.employee?.email || "-",
        "Phòng Ban": record.employee?.department?.nameDepartment || "-",
        "Chức Vụ": record.employee?.position?.namePosition || "-",
        "Thiết Bị": record.employee?.device?.nameDevice || record.employee?.device?.deviceId || "-",
        "Giờ Vào": formatTime(record.checkInTime),
        "Trạng Thái Vào": record.checkInStatus || "-",
        "Giờ Ra": formatTime(record.checkOutTime),
        "Trạng Thái Ra": record.checkOutStatus || "-",
        "Ngày Chấm Công": record.checkInTime ? new Date(record.checkInTime).toLocaleDateString("vi-VN") : "-",
      }))

      const worksheet = XLSX.utils.json_to_sheet(exportData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Chấm Công")

      // Generate filename with current date
      const now = new Date()
      const filename = `cham-cong-${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}.xlsx`

      XLSX.writeFile(workbook, filename)
    } catch (error) {
      console.error("Error exporting to Excel:", error)
      alert("Có lỗi xảy ra khi xuất file Excel")
    }
  }

  // Get current query description
  const getQueryDescription = () => {
    const { day, month, year } = currentQuery
    if (day && month && year) {
      return `Ngày ${day}/${month}/${year}`
    } else if (month && year) {
      return `Tháng ${month}/${year}`
    } else if (year) {
      return `Năm ${year}`
    }
    return "Hôm nay"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu chấm công...</span>
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

      {/* Date Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Bộ Lọc Thời Gian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Custom Date Filter */}
            <div className="space-y-2">
              <Label>Tìm kiếm theo ngày</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Ngày"
                  min="1"
                  max="31"
                  value={dateFilter.day}
                  onChange={(e) => setDateFilter((prev) => ({ ...prev, day: e.target.value }))}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Tháng"
                  min="1"
                  max="12"
                  value={dateFilter.month}
                  onChange={(e) => setDateFilter((prev) => ({ ...prev, month: e.target.value }))}
                  className="w-20"
                />
                <Input
                  type="number"
                  placeholder="Năm"
                  min="2020"
                  max="2030"
                  value={dateFilter.year}
                  onChange={(e) => setDateFilter((prev) => ({ ...prev, year: e.target.value }))}
                  className="w-24"
                />
                <Button onClick={handleDateSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-2">
              <Label>Bộ lọc nhanh</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleTodayFilter}>
                  Hôm nay
                </Button>
                <Button variant="outline" size="sm" onClick={handleMonthFilter}>
                  Tháng này
                </Button>
                <Button variant="outline" size="sm" onClick={handleYearFilter}>
                  Năm này
                </Button>
              </div>
            </div>

            {/* Current Query Info */}
            <div className="space-y-2">
              <Label>Đang xem</Label>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {getQueryDescription()}
              </Badge>
            </div>

            {/* Export Button */}
            <div className="space-y-2">
              <Label>Xuất dữ liệu</Label>
              <Button onClick={exportToExcel} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, mã NV, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Tất cả phòng ban" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phòng ban</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="present">Có mặt</SelectItem>
            <SelectItem value="late">Muộn</SelectItem>
            <SelectItem value="absent">Vắng</SelectItem>
            <SelectItem value="incomplete">Chưa ra</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={refetch} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tổng số bản ghi</p>
                <p className="text-2xl font-bold">{filteredRecords.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Có mặt</p>
                <p className="text-2xl font-bold">
                  {filteredRecords.filter((r) => r.checkInTime && r.checkOutTime).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Chưa ra</p>
                <p className="text-2xl font-bold">
                  {filteredRecords.filter((r) => r.checkInTime && !r.checkOutTime).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Vắng mặt</p>
                <p className="text-2xl font-bold">
                  {filteredRecords.filter((r) => r.checkInStatus === "absent" || r.checkOutStatus === "absent").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shift Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Bảng Chấm Công - {getQueryDescription()}
            </div>
            <Badge variant="outline">{filteredRecords.length} bản ghi</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">STT</TableHead>
                  <TableHead className="w-[100px]">Mã NV</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Chức Vụ</TableHead>
                  <TableHead>Thiết Bị</TableHead>
                  <TableHead>Giờ Vào</TableHead>
                  <TableHead>TT Vào</TableHead>
                  <TableHead>Giờ Ra</TableHead>
                  <TableHead>TT Ra</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                      {searchTerm || departmentFilter !== "all" || statusFilter !== "all"
                        ? "Không tìm thấy bản ghi chấm công nào"
                        : "Chưa có bản ghi chấm công nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record, index) => (
                    <TableRow key={record.shiftRecordId}>
                      <TableCell className="text-center">{index + 1}</TableCell>
                      <TableCell className="font-mono text-sm">{record.employee?.employeeId || "-"}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="mr-2 h-8 w-8">
                            <AvatarFallback>
                              {record.employee?.fullName
                                ? record.employee.fullName.substring(0, 2).toUpperCase()
                                : "NV"}
                            </AvatarFallback>
                          </Avatar>
                          {record.employee?.fullName || "-"}
                        </div>
                      </TableCell>
                      <TableCell>{record.employee?.email || "-"}</TableCell>
                      <TableCell>
                        {record.employee?.department ? (
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Building className="mr-1 h-3 w-3" />
                            {record.employee.department.nameDepartment}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa có</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.employee?.position ? (
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Briefcase className="mr-1 h-3 w-3" />
                            {record.employee.position.namePosition}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa có</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {record.employee?.device ? (
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Monitor className="mr-1 h-3 w-3" />
                            {record.employee.device.nameDevice || record.employee.device.deviceId}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa có</Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{formatTime(record.checkInTime)}</TableCell>
                      <TableCell>{getStatusBadge(record.checkInStatus)}</TableCell>
                      <TableCell className="font-mono text-sm">{formatTime(record.checkOutTime)}</TableCell>
                      <TableCell>{getStatusBadge(record.checkOutStatus)}</TableCell>
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
