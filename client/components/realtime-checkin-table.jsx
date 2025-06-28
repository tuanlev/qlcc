/**
 * Component bảng check-in real-time
 * Hiển thị thông tin check-in real-time của nhân viên qua WebSocket
 * Chỉ hiển thị check-in từ thiết bị của user hiện tại
 */
"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useCheckins } from "@/hooks/use-checkins"
import { Search, RefreshCw, Wifi, WifiOff, Clock, Building, Briefcase, Monitor, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RealtimeCheckinTable() {
  const { checkins, loading, error, isConnected, user, refetch } = useCheckins()
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  // Extract unique departments from checkins
  const departments = useMemo(() => {
    const deptSet = new Set()
    checkins.forEach((checkin) => {
      if (checkin.employee?.department?.nameDepartment) {
        deptSet.add(checkin.employee.department.nameDepartment)
      }
    })
    return Array.from(deptSet)
  }, [checkins])

  // Filter checkins based on search and department
  const filteredCheckins = useMemo(() => {
    return checkins.filter((checkin) => {
      const employee = checkin.employee
      if (!employee) return false

      const matchesSearch =
        employee.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || employee.department?.nameDepartment === departmentFilter

      return matchesSearch && matchesDepartment
    })
  }, [checkins, searchTerm, departmentFilter])

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return "-"
    try {
      const date = new Date(timestamp)
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    } catch {
      return "-"
    }
  }

  // Format relative time
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "-"
    try {
      const now = new Date()
      const date = new Date(timestamp)
      const diffInSeconds = Math.floor((now - date) / 1000)

      if (diffInSeconds < 60) {
        return `${diffInSeconds} giây trước`
      }
      const diffInMinutes = Math.floor(diffInSeconds / 60)
      if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`
      }
      const diffInHours = Math.floor(diffInMinutes / 60)
      if (diffInHours < 24) {
        return `${diffInHours} giờ trước`
      }
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} ngày trước`
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
        {shift.nameShift}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu check-in...</span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* User Device Info */}
      {user && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Người dùng:</span>
                <span className="text-blue-700">{user.username || user.name || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Thiết bị:</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  {user.device?.nameDevice || user.device?.deviceId || "Chưa có thiết bị"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Kết nối real-time</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-600">Mất kết nối real-time</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50">
            {checkins.length} check-in
          </Badge>
          {user?.device?.deviceId && (
            <Badge variant="outline" className="bg-green-50 text-green-700">
              Thiết bị: {user.device.deviceId}
            </Badge>
          )}
        </div>
      </div>

      {/* No Device Warning */}
      {!user?.device?.deviceId && (
        <Alert>
          <Monitor className="h-4 w-4" />
          <AlertDescription>
            Bạn chưa được gán thiết bị nào. Liên hệ quản trị viên để được cấp quyền truy cập thiết bị check-in.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
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

      {/* Filters */}
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

        <div className="w-full md:w-48">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger>
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
        </div>

        <Button variant="outline" onClick={refetch} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* Checkins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Check-in Real-time
            {user?.device?.deviceId && (
              <Badge variant="outline" className="ml-2 bg-blue-50">
                Thiết bị: {user.device.nameDevice || user.device.deviceId}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Mã NV</TableHead>
                  <TableHead>Nhân Viên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phòng Ban</TableHead>
                  <TableHead>Chức Vụ</TableHead>
                  <TableHead>Ca Làm</TableHead>
                  <TableHead>Thiết Bị</TableHead>
                  <TableHead>Khuôn Mặt</TableHead>
                  <TableHead>Thời Gian</TableHead>
                  <TableHead>Cách Đây</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                      {!user?.device?.deviceId
                        ? "Chưa có thiết bị được gán"
                        : searchTerm || departmentFilter !== "all"
                          ? "Không tìm thấy check-in nào"
                          : "Chưa có check-in nào từ thiết bị này"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCheckins.map((checkin, index) => {
                    const employee = checkin.employee
                    return (
                      <TableRow key={`${employee?.employeeId}-${checkin.timestamp}-${index}`}>
                        <TableCell className="font-mono text-sm">{employee?.employeeId?.slice(-8) || "-"}</TableCell>

                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarFallback>
                                {employee?.fullName ? employee.fullName.substring(0, 2).toUpperCase() : "NV"}
                              </AvatarFallback>
                            </Avatar>
                            {employee?.fullName || "-"}
                          </div>
                        </TableCell>

                        <TableCell>{employee?.email || "-"}</TableCell>

                        <TableCell>
                          {employee?.department ? (
                            <Badge variant="outline" className="flex items-center w-fit">
                              <Building className="mr-1 h-3 w-3" />
                              {employee.department.nameDepartment}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Chưa có</Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {employee?.position ? (
                            <Badge variant="outline" className="flex items-center w-fit">
                              <Briefcase className="mr-1 h-3 w-3" />
                              {employee.position.namePosition}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Chưa có</Badge>
                          )}
                        </TableCell>

                        <TableCell>{getShiftBadge(employee?.shift)}</TableCell>

                        <TableCell>
                          {checkin.devide || checkin.device ? (
                            <Badge variant="outline" className="flex items-center w-fit">
                              <Monitor className="mr-1 h-3 w-3" />
                              {checkin.devide?.nameDevice ||
                                checkin.device?.nameDevice ||
                                checkin.devide?.deviceId ||
                                checkin.device?.deviceId ||
                                "Thiết bị"}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Chưa có</Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          <Avatar className="h-10 w-10">
                            {checkin.faceBase64 ? (
                              <AvatarImage src={checkin.faceBase64 || "/placeholder.svg"} alt="Khuôn mặt check-in" />
                            ) : (
                              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Placeholder" />
                            )}
                            <AvatarFallback>KM</AvatarFallback>
                          </Avatar>
                        </TableCell>

                        <TableCell className="font-mono text-sm">{formatTime(checkin.timestamp)}</TableCell>

                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {getRelativeTime(checkin.timestamp)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
