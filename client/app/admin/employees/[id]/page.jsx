"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useEmployees } from "@/hooks/use-employees"
import {
  User,
  Mail,
  Phone,
  Building2,
  UserCheck,
  Clock,
  Calendar,
  Search,
  RefreshCw,
  FileSpreadsheet,
  ArrowLeft,
} from "lucide-react"

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const employeeId = params.id 

  const { getEmployeeById, getEmployeeShiftRecords, loading: employeesLoading,getEmployeeInfoById } = useEmployees()

  const [employee, setEmployee] = useState(null)
  const [shiftRecords, setShiftRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isExporting, setIsExporting] = useState(false)

  const [filterType, setFilterType] = useState("month") // "today", "month", "year", "custom"
  const [dateFilter, setDateFilter] = useState({
    day: "",
    month: "",
    year: "",
  })
  const [currentQuery, setCurrentQuery] = useState({
    day: null,
    month: null,
    year: null,
  })

  // Fetch employee data and shift records
  const fetchData = async (day = null, month = null, year = null) => {
    try {
      setLoading(true)
      setError(null)

      // Get employee info
     

      // Get shift records
      const records = await getEmployeeShiftRecords(employeeId, day, month, year)
      setShiftRecords(records)
      setCurrentQuery({ day, month, year })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Quick filter functions
  const getTodayRecords = () => {
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    setFilterType("today")
    fetchData(day, month, year)
  }

  const getCurrentMonthRecords = () => {
    const today = new Date()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    setFilterType("month")
    fetchData(null, month, year)
  }

  const getCurrentYearRecords = () => {
    const today = new Date()
    const year = today.getFullYear()
    setFilterType("year")
    fetchData(null, null, year)
  }

  const handleCustomSearch = (e) => {
    e.preventDefault()
    const { day, month, year } = dateFilter

    // Validation
    if (day && (!month || !year)) {
      alert("Khi chọn ngày, bạn phải chọn cả tháng và năm")
      return
    }
    if (month && !year) {
      alert("Khi chọn tháng, bạn phải chọn năm")
      return
    }
    if (!day && !month && !year) {
      alert("Vui lòng chọn ít nhất một tiêu chí lọc")
      return
    }

    setFilterType("custom")
    fetchData(
      day ? Number.parseInt(day) : null,
      month ? Number.parseInt(month) : null,
      year ? Number.parseInt(year) : null,
    )
  }

  // Format functions
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A"
    const date = new Date(timestamp)
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (checkInTime, checkOutTime) => {
    if (!checkInTime || !checkOutTime) return "N/A"

    const checkIn = new Date(checkInTime)
    const checkOut = new Date(checkOutTime)
    const diffMs = checkOut - checkIn
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    if (diffMinutes <= 0) return "0 phút"

    const hours = Math.floor(diffMinutes / 60)
    const mins = diffMinutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getStatusBadge = (status) => {
    if (!status) return <Badge variant="secondary">N/A</Badge>

    const statusConfig = {
      absent: { label: "Vắng mặt", className: "bg-red-100 text-red-800" },
      "on-time": { label: "Đúng giờ", className: "bg-green-100 text-green-800" },
      Unassigned: { label: "Chưa cấp ca", className: "bg-gray-100 text-gray-800" },
      late: { label: "Muộn", className: "bg-orange-100 text-orange-800" },
      "early-leave": { label: "Về sớm", className: "bg-yellow-100 text-yellow-800" },
    }

    const config = statusConfig[status] || { label: status, className: "bg-gray-100 text-gray-800" }
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getStatusText = (status) => {
    const statusConfig = {
      absent: "Vắng mặt",
      "on-time": "Đúng giờ",
      Unassigned: "Chưa cấp ca",
      late: "Muộn",
      "early-leave": "Về sớm",
    }
    return statusConfig[status] || status || "N/A"
  }

  // Export to Excel
  const exportToExcel = async () => {
    if (shiftRecords.length === 0) {
      alert("Không có dữ liệu để xuất")
      return
    }

    setIsExporting(true)

    try {
      const exportData = shiftRecords.map((record, index) => ({
        STT: index + 1,
        "Mã NV": employee?.employeeId || "N/A",
        "Họ tên": employee?.fullName || "N/A",
        "Phòng ban": employee?.department?.departmentName || "N/A",
        Ngày: record.checkInTime ? new Date(record.checkInTime).toLocaleDateString("vi-VN") : "N/A",
        "Giờ vào": formatTime(record.checkInTime),
        "Trạng thái vào": getStatusText(record.checkInStatus),
        "Giờ ra": formatTime(record.checkOutTime),
        "Trạng thái ra": getStatusText(record.checkOutStatus),
        "Tổng thời gian": calculateDuration(record.checkInTime, record.checkOutTime),
        "Ngày xuất": new Date().toLocaleDateString("vi-VN"),
      }))

      // Convert to CSV
      const headers = Object.keys(exportData[0])
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) => headers.map((header) => `"${row[header] || ""}"`).join(",")),
      ].join("\n")

      // Create and download file
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)

      // Generate filename
      let filename = `bang-cong-${employee?.employeeId || "employee"}`
      if (currentQuery.day) filename += `-ngay-${currentQuery.day}`
      if (currentQuery.month) filename += `-thang-${currentQuery.month}`
      if (currentQuery.year) filename += `-nam-${currentQuery.year}`
      filename += `-${new Date().toISOString().split("T")[0]}.csv`

      link.setAttribute("download", filename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Export error:", error)
      alert("Có lỗi xảy ra khi xuất file")
    } finally {
      setIsExporting(false)
    }
  }

  const getEmployeeInitials = (employee) => {
    if (!employee?.fullName) return "?"
    return employee.fullName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Initialize data
  useEffect(() => {
    const getEM = async () => {
const employeeData = await getEmployeeInfoById(employeeId)
      if (!employeeData) {
        throw new Error("Không tìm thấy nhân viên")
      }
      console.log(employeeData[0])
      setEmployee(employeeData[0])
  }
    getEM()
    if (employeeId) {
      getCurrentMonthRecords()
    }
  }, [employeeId])

  if (loading || employeesLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải thông tin nhân viên...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-8">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4">
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-2xl font-bold">Chi tiết nhân viên</h1>
      </div>

      {/* Employee Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin nhân viên
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee?.faceBase64 || "/placeholder.svg"} alt={employee?.fullName || "Unknown"} />
                <AvatarFallback className="bg-gray-100 text-lg">
                  {employee ? getEmployeeInitials(employee) : <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <Badge variant="outline" className="text-sm">
                {employee?.employeeId}
              </Badge>
            </div>

            {/* Employee Info */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Họ tên</p>
                    <p className="font-medium">{employee?.fullName || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{employee?.email || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{employee?.phone || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phòng ban</p>
                    <p className="font-medium">{employee?.department?.departmentName || "Chưa phân"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Chức vụ</p>
                    <p className="font-medium">{employee?.position?.positionName || "Chưa phân"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày vào làm</p>
                    <p className="font-medium">
                      {employee?.registrationDate
                        ? new Date(employee.registrationDate).toLocaleDateString("vi-VN")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shift Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Bảng công cá nhân
          </CardTitle>
          <CardDescription>Lịch sử chấm công của nhân viên {employee?.fullName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Controls */}
          <div className="space-y-4">
            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2">
              <Button variant={filterType === "today" ? "default" : "outline"} onClick={getTodayRecords}>
                Hôm nay
              </Button>
              <Button variant={filterType === "month" ? "default" : "outline"} onClick={getCurrentMonthRecords}>
                Tháng này
              </Button>
              <Button variant={filterType === "year" ? "default" : "outline"} onClick={getCurrentYearRecords}>
                Năm này
              </Button>
              <Button variant={filterType === "custom" ? "default" : "outline"} onClick={() => setFilterType("custom")}>
                Tùy chỉnh
              </Button>
            </div>

            {/* Custom Date Filter */}
            {filterType === "custom" && (
              <form onSubmit={handleCustomSearch} className="flex flex-wrap gap-4 items-end">
                <div className="space-y-2">
                  <Label htmlFor="day">Ngày</Label>
                  <Input
                    id="day"
                    type="number"
                    min="1"
                    max="31"
                    placeholder="DD"
                    value={dateFilter.day}
                    onChange={(e) => setDateFilter((prev) => ({ ...prev, day: e.target.value }))}
                    className="w-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Tháng</Label>
                  <Input
                    id="month"
                    type="number"
                    min="1"
                    max="12"
                    placeholder="MM"
                    value={dateFilter.month}
                    onChange={(e) => setDateFilter((prev) => ({ ...prev, month: e.target.value }))}
                    className="w-20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Năm</Label>
                  <Input
                    id="year"
                    type="number"
                    min="2020"
                    max="2030"
                    placeholder="YYYY"
                    value={dateFilter.year}
                    onChange={(e) => setDateFilter((prev) => ({ ...prev, year: e.target.value }))}
                    className="w-24"
                  />
                </div>
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
              </form>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Hiển thị {shiftRecords.length} bản ghi
                {currentQuery.day && ` - Ngày ${currentQuery.day}`}
                {currentQuery.month && ` - Tháng ${currentQuery.month}`}
                {currentQuery.year && ` - Năm ${currentQuery.year}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportToExcel} disabled={isExporting || shiftRecords.length === 0}>
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Xuất Excel
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => fetchData(currentQuery.day, currentQuery.month, currentQuery.year)}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>

          {/* Shift Records Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Giờ vào</TableHead>
                  <TableHead>Trạng thái vào</TableHead>
                  <TableHead>Giờ ra</TableHead>
                  <TableHead>Trạng thái ra</TableHead>
                  <TableHead>Tổng thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shiftRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu bảng công
                    </TableCell>
                  </TableRow>
                ) : (
                  shiftRecords.map((record, index) => (
                    <TableRow key={record.shiftRecordId || index}>
                      <TableCell>
                        {record.checkInTime ? new Date(record.checkInTime).toLocaleDateString("vi-VN") : "N/A"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{formatTime(record.checkInTime)}</TableCell>
                      <TableCell>{getStatusBadge(record.checkInStatus)}</TableCell>
                      <TableCell className="font-mono text-sm">{formatTime(record.checkOutTime)}</TableCell>
                      <TableCell>{getStatusBadge(record.checkOutStatus)}</TableCell>
                      <TableCell className="font-medium">
                        {calculateDuration(record.checkInTime, record.checkOutTime)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Summary */}
          {shiftRecords.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">Tổng ngày làm</p>
                <p className="font-bold text-lg">{shiftRecords.length}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-muted-foreground">Đúng giờ</p>
                <p className="font-bold text-lg text-green-600">
                  {shiftRecords.filter((r) => r.checkInStatus === "on-time").length}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-muted-foreground">Muộn</p>
                <p className="font-bold text-lg text-orange-600">
                  {shiftRecords.filter((r) => r.checkInStatus === "late").length}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <p className="text-muted-foreground">Vắng mặt</p>
                <p className="font-bold text-lg text-red-600">
                  {shiftRecords.filter((r) => r.checkInStatus === "absent").length}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
