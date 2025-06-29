"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useShiftRecords } from "@/hooks/use-shift-records"
import { Calendar, Search, RefreshCw, Clock, FileSpreadsheet } from "lucide-react"

export default function ShiftRecordsPage() {
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

  const [filterType, setFilterType] = useState("custom") // "today", "month", "year", "custom"
  const [dateFilter, setDateFilter] = useState({
    day: "",
    month: "",
    year: "",
  })

  const [validationError, setValidationError] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  const handleDateSearch = (e) => {
    e.preventDefault()
    const { day, month, year } = dateFilter

    // Reset validation error
    setValidationError("")

    // Validation logic
    if (day && (!month || !year)) {
      setValidationError("Khi chọn ngày, bạn phải chọn cả tháng và năm")
      return
    }

    if (month && !year) {
      setValidationError("Khi chọn tháng, bạn phải chọn năm")
      return
    }

    if (!day && !month && !year) {
      setValidationError("Vui lòng chọn ít nhất một tiêu chí lọc")
      return
    }

    searchByDate(
      day ? Number.parseInt(day) : null,
      month ? Number.parseInt(month) : null,
      year ? Number.parseInt(year) : null,
    )
  }

  const handleQuickFilter = (type) => {
    setFilterType(type)
    setDateFilter({ day: "", month: "", year: "" })

    switch (type) {
      case "today":
        getTodayRecords()
        break
      case "month":
        getCurrentMonthRecords()
        break
      case "year":
        getCurrentYearRecords()
        break
      default:
        break
    }
  }

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A"
    const date = new Date(timestamp)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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

  const getStatusBadge = (status, type) => {
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

  const getCurrentDate = () => {
    const now = new Date()
    return {
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
    }
  }

  const resetFilters = () => {
    setFilterType("custom")
    setDateFilter({ day: "", month: "", year: "" })
  }

  const exportToExcel = async () => {
    if (shiftRecords.length === 0) {
      alert("Không có dữ liệu để xuất")
      return
    }

    setIsExporting(true)

    try {
      // Prepare data for export
      const exportData = shiftRecords.map((record, index) => ({
        STT: index + 1,
        "Mã NV": record.employee?.employeeId || "N/A",
        "Họ tên": record.employee?.fullName || "Không xác định",
        Email: record.employee?.email || "N/A",
        "Phòng ban": record.employee?.department?.departmentName || "Chưa phân",
        Ngày: record.checkInTime ? new Date(record.checkInTime).toLocaleDateString("vi-VN") : "N/A",
        "Giờ vào": formatTime(record.checkInTime),
        "Trạng thái vào": getStatusText(record.checkInStatus),
        "Giờ ra": formatTime(record.checkOutTime),
        "Trạng thái ra": getStatusText(record.checkOutStatus),
        "Tổng thời gian": calculateDuration(record.checkInTime, record.checkOutTime),
        "Ngày xuất": new Date().toLocaleDateString("vi-VN"),
      }))

      // Convert to CSV format
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

      // Generate filename with current filter info
      let filename = "bang-cong"
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

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải bảng công...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Bộ lọc thời gian
          </CardTitle>
          <CardDescription>Tìm kiếm bảng công theo ngày, tháng hoặc năm</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Button variant={filterType === "today" ? "default" : "outline"} onClick={() => handleQuickFilter("today")}>
              Hôm nay
            </Button>
            <Button variant={filterType === "month" ? "default" : "outline"} onClick={() => handleQuickFilter("month")}>
              Tháng này
            </Button>
            <Button variant={filterType === "year" ? "default" : "outline"} onClick={() => handleQuickFilter("year")}>
              Năm này
            </Button>
            <Button variant={filterType === "custom" ? "default" : "outline"} onClick={() => setFilterType("custom")}>
              Tùy chỉnh
            </Button>
          </div>

          {/* Custom Date Filter */}
          {filterType === "custom" && (
            <div className="space-y-4">
              {validationError && (
                <Alert variant="destructive">
                  <AlertDescription>{validationError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleDateSearch} className="flex flex-wrap gap-4 items-end">
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
                  <p className="text-xs text-muted-foreground">Tùy chọn</p>
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
                  <p className="text-xs text-muted-foreground">{dateFilter.day ? "Bắt buộc" : "Tùy chọn"}</p>
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
                  <p className="text-xs text-muted-foreground">
                    {dateFilter.day || dateFilter.month ? "Bắt buộc" : "Tùy chọn"}
                  </p>
                </div>
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Xóa bộ lọc
                </Button>
              </form>
            </div>
          )}

          {/* Filter Description */}
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Quy tắc lọc:</strong>
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {filterType === "custom" && (
                <>
                  <li>
                    Chọn <strong>ngày</strong>: phải chọn cả tháng và năm
                  </li>
                  <li>
                    Chọn <strong>tháng</strong>: phải chọn năm (không cần ngày)
                  </li>
                  <li>
                    Chọn <strong>năm</strong>: có thể chọn riêng năm
                  </li>
                </>
              )}
              {filterType === "today" && <li>Hiển thị bảng công hôm nay</li>}
              {filterType === "month" && <li>Hiển thị bảng công tháng hiện tại</li>}
              {filterType === "year" && <li>Hiển thị bảng công năm hiện tại</li>}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Shift Records Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Bảng công
              </CardTitle>
              <CardDescription>
                Hiển thị {shiftRecords.length} bản ghi
                {currentQuery.day && ` - Ngày ${currentQuery.day}`}
                {currentQuery.month && ` - Tháng ${currentQuery.month}`}
                {currentQuery.year && ` - Năm ${currentQuery.year}`}
              </CardDescription>
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
              <Button variant="outline" onClick={refetch}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Mã NV</TableHead>
                  <TableHead>Phòng ban</TableHead>
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
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      Không có dữ liệu bảng công
                    </TableCell>
                  </TableRow>
                ) : (
                  shiftRecords.map((record, index) => (
                    <TableRow key={record.shiftRecordId || index}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{record.employee?.fullName || "Không xác định"}</span>
                          {record.employee?.email && (
                            <span className="text-xs text-muted-foreground">{record.employee.email}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{record.employee?.employeeId || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.employee?.department?.departmentName || "Chưa phân"}</Badge>
                      </TableCell>
                      <TableCell>
                        {record.checkInTime ? new Date(record.checkInTime).toLocaleDateString("vi-VN") : "N/A"}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{formatTime(record.checkInTime)}</TableCell>
                      <TableCell>{getStatusBadge(record.checkInStatus, "checkin")}</TableCell>
                      <TableCell className="font-mono text-sm">{formatTime(record.checkOutTime)}</TableCell>
                      <TableCell>{getStatusBadge(record.checkOutStatus, "checkout")}</TableCell>
                      <TableCell className="font-medium">
                        {calculateDuration(record.checkInTime, record.checkOutTime)}
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
