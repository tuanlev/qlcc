/**
 * Component hiển thị lịch sử chấm công của một nhân viên
 * Hiển thị dữ liệu theo tháng với các thông tin như giờ vào, giờ ra, số giờ làm việc, tăng ca...
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Tạo dữ liệu mẫu cho lịch sử chấm công
 * @param {number} employeeId - ID của nhân viên
 * @returns {Array} Mảng dữ liệu chấm công
 */
const generateAttendanceData = (employeeId) => {
  const currentDate = new Date()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    const isPast = day <= currentDate.getDate()

    // Xử lý ngày cuối tuần
    if (isWeekend) {
      return {
        date: `${day.toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`,
        checkIn: "-",
        checkOut: "-",
        hoursWorked: "-",
        overtime: "-",
        status: "weekend",
        lateBy: "-",
      }
    }

    // Xử lý ngày trong tương lai
    if (!isPast) {
      return {
        date: `${day.toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`,
        checkIn: "-",
        checkOut: "-",
        hoursWorked: "-",
        overtime: "-",
        status: "upcoming",
        lateBy: "-",
      }
    }

    // Tạo dữ liệu ngẫu nhiên cho ngày trong quá khứ
    // Trạng thái ngẫu nhiên cho những ngày đã qua
    const statuses = ["present", "late", "absent"]
    const randomStatus = statuses[Math.floor(Math.random() * (employeeId === 3 ? 2 : 3))]

    // Xử lý trường hợp vắng mặt
    if (randomStatus === "absent") {
      return {
        date: `${day.toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`,
        checkIn: "-",
        checkOut: "-",
        hoursWorked: "0",
        overtime: "0",
        status: "absent",
        lateBy: "-",
      }
    }

    const isLate = randomStatus === "late"

    // Tạo giờ check-in ngẫu nhiên
    const checkInHour = isLate ? 9 + Math.floor(Math.random() * 2) : 8
    const checkInMinute = Math.floor(Math.random() * 60)
    const checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMinute.toString().padStart(2, "0")}`

    // Tạo giờ check-out ngẫu nhiên
    const workHours = 8 + Math.floor(Math.random() * 3)
    const checkOutHour = checkInHour + workHours
    const checkOutMinute = Math.floor(Math.random() * 60)
    const checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMinute.toString().padStart(2, "0")}`

    // Tính toán số giờ làm việc và tăng ca
    const hoursWorked = workHours + (checkOutMinute - checkInMinute) / 60
    const overtime = Math.max(0, hoursWorked - 8).toFixed(1)
    const lateBy = isLate ? `${checkInHour - 8}h ${checkInMinute}m` : "0"

    return {
      date: `${day.toString().padStart(2, "0")}/${(currentDate.getMonth() + 1).toString().padStart(2, "0")}/${currentDate.getFullYear()}`,
      checkIn,
      checkOut,
      hoursWorked: hoursWorked.toFixed(1),
      overtime,
      status: randomStatus,
      lateBy: isLate ? lateBy : "-",
    }
  })
}

/**
 * Component hiển thị lịch sử chấm công
 * @param {Object} props - Props của component
 * @param {number} props.employeeId - ID của nhân viên
 */
export function AttendanceHistory({ employeeId }) {
  // State để lưu tháng và năm hiện tại đang xem
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  // Lấy dữ liệu chấm công
  const attendanceData = generateAttendanceData(employeeId)

  /**
   * Hiển thị badge tương ứng với trạng thái chấm công
   * @param {string} status - Trạng thái chấm công
   * @returns {JSX.Element} Badge component
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-500">Có Mặt</Badge>
      case "late":
        return <Badge className="bg-yellow-500">Đi Muộn</Badge>
      case "absent":
        return <Badge className="bg-red-500">Vắng Mặt</Badge>
      case "weekend":
        return <Badge variant="outline">Cuối Tuần</Badge>
      case "upcoming":
        return <Badge variant="outline">Sắp Tới</Badge>
      default:
        return <Badge>Không Xác Định</Badge>
    }
  }

  // Xử lý chuyển đến tháng trước
  const previousMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  // Xử lý chuyển đến tháng sau
  const nextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  // Danh sách tên các tháng
  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Lịch Sử Chấm Công</CardTitle>
          {/* Điều hướng giữa các tháng */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">
              {monthNames[month - 1]} {year}
            </span>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Giờ Vào</TableHead>
                <TableHead>Giờ Ra</TableHead>
                <TableHead>Số Giờ</TableHead>
                <TableHead>Tăng Ca</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead>Đi Muộn</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Hiển thị dữ liệu chấm công */}
              {attendanceData.map((record, index) => (
                <TableRow key={index}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>{record.hoursWorked}</TableCell>
                  <TableCell>{record.overtime}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{record.lateBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
