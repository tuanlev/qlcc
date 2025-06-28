/**
 * Component quản lý chấm công
 * Hiển thị thông tin chấm công của nhân viên và cho phép xem chi tiết
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEmployees, SHIFTS } from "@/hooks/use-employees"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

/**
 * Component quản lý chấm công
 */
export function AttendanceManagement() {
  // Lấy dữ liệu nhân viên
  const { employees } = useEmployees()
  
  // State quản lý bộ lọc và hiển thị
  const [month, setMonth] = useState(new Date().getMonth() + 1) // Tháng hiện tại
  const [year, setYear] = useState(new Date().getFullYear()) // Năm hiện tại
  const [searchTerm, setSearchTerm] = useState("") // Từ khóa tìm kiếm
  const [departmentFilter, setDepartmentFilter] = useState("all") // Bộ lọc phòng ban
  const [shiftFilter, setShiftFilter] = useState("all") // Bộ lọc ca làm việc
  const [selectedEmployee, setSelectedEmployee] = useState(null) // Nhân viên được chọn
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false) // Hiển thị dialog chi tiết

  // Lấy danh sách phòng ban duy nhất từ dữ liệu nhân viên
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  // Lọc nhân viên theo tìm kiếm, phòng ban và ca làm việc
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) || employee.id.toString().includes(searchTerm)
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
    const matchesShift = shiftFilter === "all" || employee.shift === shiftFilter
    return matchesSearch && matchesDepartment && matchesShift
  })

  /**
   * Tạo dữ liệu mẫu cho chấm công
   * @param {number} employeeId - ID của nhân viên
   * @returns {Object} Dữ liệu chấm công
   */
  const getAttendanceData = (employeeId) => {
    // Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu từ API
    // Ở đây chúng ta tạo dữ liệu ngẫu nhiên
    const totalHours = 160 + Math.floor(Math.random() * 20)
    const lateHours = Math.floor(Math.random() * 10)
    const overtimeHours = Math.floor(Math.random() * 20)

    // Tính toán giờ làm trước ca (nếu có)
    const employee = employees.find((emp) => emp.id === employeeId)
    let preShiftHours = 0

    if (employee && employee.shift && employee.checkIn && employee.checkIn !== "-") {
      const checkInTime = employee.checkIn.split(":")
      const checkInHour = Number.parseInt(checkInTime[0])
      const checkInMinute = Number.parseInt(checkInTime[1])

      let shiftStartHour = 8 // Mặc định

      if (employee.shift === "morning") {
        shiftStartHour = Number.parseInt(SHIFTS.morning.startTime.split(":")[0])
      } else if (employee.shift === "afternoon") {
        shiftStartHour = Number.parseInt(SHIFTS.afternoon.startTime.split(":")[0])
      } else if (employee.shift === "fullday") {
        shiftStartHour = Number.parseInt(SHIFTS.fullday.startTime.split(":")[0])
      }

      if (checkInHour < shiftStartHour) {
        preShiftHours =
          shiftStartHour -
          checkInHour -
          (checkInMinute > 0 ? 0 : 1) +
          (checkInMinute > 0 ? (60 - checkInMinute) / 60 : 0)
      }
    }

    return { totalHours, lateHours, overtimeHours, preShiftHours }
  }

  /**
   * Tạo dữ liệu mẫu cho lịch sử chấm công
   * @param {number} employeeId - ID của nhân viên
   * @returns {Array} Mảng dữ liệu chấm công
   */
  const generateAttendanceHistory = (employeeId) => {
    const currentDate = new Date()
    const daysInMonth = new Date(year, month, 0).getDate()
    const employee = employees.find((emp) => emp.id === employeeId)
    const employeeShift = employee?.shift || "fullday"

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1
      const date = new Date(year, month - 1, day)
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const isPast = date <= currentDate

      // Xử lý ngày cuối tuần
      if (isWeekend) {
        return {
          date: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
          checkIn: "-",
          checkOut: "-",
          status: "weekend",
          checkInFace: null,
          checkOutFace: null,
          preShift: false,
        }
      }

      // Xử lý ngày trong tương lai
      if (!isPast) {
        return {
          date: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
          checkIn: "-",
          checkOut: "-",
          status: "upcoming",
          checkInFace: null,
          checkOutFace: null,
          preShift: false,
        }
      }

      // Tạo dữ liệu ngẫu nhiên cho ngày trong quá khứ
      const statuses = ["present", "late", "absent"]
      const randomStatus = statuses[Math.floor(Math.random() * 3)]

      // Xử lý trường hợp vắng mặt
      if (randomStatus === "absent") {
        return {
          date: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
          checkIn: "-",
          checkOut: "-",
          status: "absent",
          checkInFace: null,
          checkOutFace: null,
          preShift: false,
        }
      }

      const isLate = randomStatus === "late"

      // Xác định giờ bắt đầu ca làm việc
      let shiftStartHour = 8
      if (employeeShift === "morning") {
        shiftStartHour = Number.parseInt(SHIFTS.morning.startTime.split(":")[0])
      } else if (employeeShift === "afternoon") {
        shiftStartHour = Number.parseInt(SHIFTS.afternoon.startTime.split(":")[0])
      } else if (employeeShift === "fullday") {
        shiftStartHour = Number.parseInt(SHIFTS.fullday.startTime.split(":")[0])
      }

      // Xác định giờ kết thúc ca làm việc
      let shiftEndHour = 17
      if (employeeShift === "morning") {
        shiftEndHour = Number.parseInt(SHIFTS.morning.endTime.split(":")[0])
      } else if (employeeShift === "afternoon") {
        shiftEndHour = Number.parseInt(SHIFTS.afternoon.endTime.split(":")[0])
      } else if (employeeShift === "fullday") {
        shiftEndHour = Number.parseInt(SHIFTS.fullday.endTime.split(":")[0])
      }

      // Tạo ngẫu nhiên giờ check-in
      let checkInHour
      let isPreShift = false

      if (Math.random() < 0.2) {
        // 20% cơ hội đi làm trước ca
        checkInHour = shiftStartHour - 1 - Math.floor(Math.random() * 2)
        isPreShift = true
      } else if (isLate) {
        checkInHour = shiftStartHour + Math.floor(Math.random() * 2)
      } else {
        checkInHour = shiftStartHour
      }

      const checkInMinute = Math.floor(Math.random() * 60)
      const checkIn = `${checkInHour.toString().padStart(2, "0")}:${checkInMinute.toString().padStart(2, "0")}`

      // Tạo ngẫu nhiên giờ check-out
      const workHours = 8 + Math.floor(Math.random() * 3)
      const checkOutHour = Math.max(checkInHour + workHours, shiftEndHour)
      const checkOutMinute = Math.floor(Math.random() * 60)
      const checkOut = `${checkOutHour.toString().padStart(2, "0")}:${checkOutMinute.toString().padStart(2, "0")}`

      return {
        date: `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`,
        checkIn,
        checkOut,
        status: randomStatus,
        checkInFace: "/placeholder.svg?height=80&width=80",
        checkOutFace: "/placeholder.svg?height=80&width=80",
        preShift: isPreShift,
      }
    })
  }

  /**
   * Mở dialog xem chi tiết chấm công của nhân viên
   * @param {number} employeeId - ID của nhân viên
   */
  const viewAttendanceHistory = (employeeId) => {
    setSelectedEmployee(employeeId)
    setShowAttendanceDialog(true)
  }

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

  /**
   * Hiển thị badge tương ứng với ca làm việc
   * @param {string} shift - Loại ca làm việc
   * @returns {JSX.Element|null} Badge component hoặc null
   */
  const getShiftBadge = (shift) => {
    if (!shift) return null

    switch (shift) {
      case "morning":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
            Ca Sáng
          </Badge>
        )
      case "afternoon":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
            Ca Chiều
          </Badge>
        )
      case "fullday":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
            Cả Ngày
          </Badge>
        )
      default:
        return null
    }
  }

  // Danh sách tên các tháng
  const months = [
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

  // Danh sách năm (5 năm gần đây)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  // Lấy thông tin nhân viên được chọn
  const selectedEmployeeData = employees.find((emp) => emp.id === selectedEmployee)
  const attendanceHistory = selectedEmployee ? generateAttendanceHistory(selectedEmployee) : []

  return (
    <div className="space-y-6">
      {/* Phần bộ lọc */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Ô tìm kiếm */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhân viên theo tên hoặc ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        {/* Bộ lọc phòng ban */}
        <div className="w-full md:w-48">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tất Cả Phòng Ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Phòng Ban</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Bộ lọc ca làm việc */}
        <div className="w-full md:w-48">
          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Ca Làm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất Cả Ca Làm</SelectItem>
              <SelectItem value="morning">Ca Sáng</SelectItem>
              <SelectItem value="afternoon">Ca Chiều</SelectItem>
              <SelectItem value="fullday">Cả Ngày</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Bộ chọn tháng */}
        <div className="w-full md:w-36">
          <Select value={month.toString()} onValueChange={(value) => setMonth(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Bộ chọn năm */}
        <div className="w-full md:w-32">
          <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
            <SelectTrigger>
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bảng thống kê chấm công */}
      <Card>
        <CardHeader>
          <CardTitle>
            Thống Kê Chấm Công - {months[month - 1]} {year}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Ca Làm</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Giờ Làm</TableHead>
                  <TableHead>Chi Tiết</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{getShiftBadge(employee.shift)}</TableCell>
                    <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    <TableCell>{getAttendanceData(employee.id).totalHours} giờ</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => viewAttendanceHistory(employee.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
