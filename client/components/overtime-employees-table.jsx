/**
 * Component bảng nhân viên làm thêm giờ (OT)
 * Hiển thị danh sách nhân viên làm thêm giờ và thông tin chi tiết
 */
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEmployees } from "@/hooks/use-employees"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ExportExcelButton } from "@/components/export-excel-button"

export function OvertimeEmployeesTable() {
  const { employees } = useEmployees()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [date, setDate] = useState(new Date())

  // Lấy danh sách phòng ban duy nhất từ dữ liệu nhân viên
  const departments = [...new Set(employees.map((emp) => emp.department).filter(Boolean))]

  // Tạo dữ liệu nhân viên làm thêm giờ cho ngày được chọn
  const generateOvertimeEmployees = () => {
    // Trong ứng dụng thực tế, bạn sẽ lấy dữ liệu từ API
    // Ở đây chúng ta lọc nhân viên có overtimeHours > 0 và tạo dữ liệu mẫu
    return employees
      .filter((emp) => emp.overtimeHours && emp.overtimeHours !== "0" && emp.overtimeHours !== "-")
      .map((emp) => {
        // Chuyển đổi overtimeHours từ chuỗi sang số
        const overtimeHours = Number.parseFloat(emp.overtimeHours)

        // Tạo tổng số giờ OT trong tháng ngẫu nhiên từ overtimeHours đến overtimeHours * 10
        const totalOvertimeInMonth = (overtimeHours + Math.random() * overtimeHours * 9).toFixed(1)

        return {
          id: emp.id,
          name: emp.name || "Nhân viên mới",
          department: emp.department || "-",
          position: emp.position || "-",
          image: emp.image || "/placeholder.svg?height=80&width=80",
          overtimeHours,
          totalOvertimeInMonth,
          checkIn: emp.checkIn || "-",
          checkOut: emp.checkOut || "-",
        }
      })
  }

  const overtimeEmployees = generateOvertimeEmployees()

  // Lọc nhân viên làm thêm giờ theo tìm kiếm và phòng ban
  const filteredOvertimeEmployees = overtimeEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.id.toString().includes(searchTerm)
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter
    return matchesSearch && matchesDepartment
  })

  // Chuẩn bị dữ liệu để xuất Excel
  const prepareExcelData = () => {
    return filteredOvertimeEmployees.map((emp) => ({
      ID: emp.id,
      "Họ Tên": emp.name,
      "Bộ Phận": emp.department,
      "Vị Trí": emp.position,
      "Giờ Check-in": emp.checkIn,
      "Giờ Check-out": emp.checkOut,
      "Số Giờ OT": emp.overtimeHours,
      "Tổng Giờ OT Trong Tháng": emp.totalOvertimeInMonth,
    }))
  }

  // Format ngày hiện tại
  const formattedDate = format(date, "dd-MM-yyyy", { locale: vi })

  return (
    <div className="space-y-4">
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
        {/* Bộ chọn ngày */}
        <div className="w-full md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full justify-start text-left font-normal md:w-[240px]">
                <Calendar className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: vi })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                locale={vi}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bảng nhân viên làm thêm giờ */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Danh Sách Nhân Viên Làm Thêm Giờ - {format(date, "PPP", { locale: vi })}</CardTitle>
          <ExportExcelButton
            data={prepareExcelData()}
            filename={`Nhan-Vien-OT-${formattedDate}`}
            sheetName="Làm Thêm Giờ"
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Bộ Phận</TableHead>
                  <TableHead>Vị Trí</TableHead>
                  <TableHead>Giờ Check-in</TableHead>
                  <TableHead>Giờ Check-out</TableHead>
                  <TableHead>Số Giờ OT</TableHead>
                  <TableHead>Tổng Giờ OT Trong Tháng</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOvertimeEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Không có nhân viên nào làm thêm giờ
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOvertimeEmployees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell>{emp.id}</TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={emp.image || "/placeholder.svg"} alt={emp.name} />
                            <AvatarFallback>{emp.name ? emp.name.substring(0, 2).toUpperCase() : "NV"}</AvatarFallback>
                          </Avatar>
                          {emp.name}
                        </div>
                      </TableCell>
                      <TableCell>{emp.department}</TableCell>
                      <TableCell>{emp.position}</TableCell>
                      <TableCell>{emp.checkIn}</TableCell>
                      <TableCell>{emp.checkOut}</TableCell>
                      <TableCell>
                        <Badge className="bg-purple-500">{emp.overtimeHours} giờ</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                          {emp.totalOvertimeInMonth} giờ
                        </Badge>
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
