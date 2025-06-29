"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useCheckins } from "@/hooks/use-checkins"
import { Clock, Wifi, WifiOff, RefreshCw, Search, User, Eye } from "lucide-react"

export default function CheckinsPage() {
  const { checkins, loading, error, isConnected, user, refetch } = useCheckins()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)

  const filteredCheckins = checkins.filter((checkin) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      checkin.employee?.fullName?.toLowerCase().includes(searchLower) ||
      checkin.employee?.employeeId?.toLowerCase().includes(searchLower) ||
      checkin.employee?.email?.toLowerCase().includes(searchLower) ||
      checkin.devide?.deviceId?.toLowerCase().includes(searchLower) ||
      checkin.device?.deviceId?.toLowerCase().includes(searchLower) ||
      checkin.devide?.nameDevice?.toLowerCase().includes(searchLower)
    )
  })

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A"
    const date = new Date(timestamp)
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "checkin":
        return <Badge className="bg-green-100 text-green-800">Vào ca</Badge>
      case "checkout":
        return <Badge className="bg-red-100 text-red-800">Tan ca</Badge>
      default:
        return <Badge variant="secondary">{status || "N/A"}</Badge>
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

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Đang tải dữ liệu chấm công...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Chấm công thời gian thực
            {isConnected ? (
              <Badge className="bg-green-100 text-green-800 ml-2">
                <Wifi className="h-3 w-3 mr-1" />
                Đã kết nối
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 ml-2">
                <WifiOff className="h-3 w-3 mr-1" />
                Mất kết nối
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Theo dõi chấm công của nhân viên theo thời gian thực
            {user?.device && (
              <span className="block mt-1">
                Thiết bị: <strong>{user.device.deviceName}</strong> ({user.device.deviceId})
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Danh sách chấm công</CardTitle>
              <CardDescription>Hiển thị {filteredCheckins.length} bản ghi chấm công</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm nhân viên, email, thiết bị..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
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
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Mã NV</TableHead>
                  <TableHead>Chức vụ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thiết bị</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCheckins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "Không tìm thấy bản ghi nào" : "Chưa có dữ liệu chấm công"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCheckins.map((checkin, index) => (
                    <TableRow
                      key={`${checkin.checkinId || checkin.employee?.employeeId || "unknown"}-${checkin.timestamp || index}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={checkin.faceBase64 || "/placeholder.svg"}
                              alt={checkin.employee?.fullName || "Unknown"}
                            />
                            <AvatarFallback className="bg-gray-100">
                              {checkin.employee ? getEmployeeInitials(checkin.employee) : <User className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          {checkin.faceBase64 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Hình ảnh chấm công</DialogTitle>
                                </DialogHeader>
                                <div className="flex justify-center">
                                  <img
                                    src={checkin.faceBase64 || "/placeholder.svg"}
                                    alt="Face capture"
                                    className="max-w-full h-auto rounded-lg"
                                  />
                                </div>
                                <div className="text-sm text-muted-foreground text-center">
                                  <p>
                                    <strong>Nhân viên:</strong> {checkin.employee?.fullName || "Không xác định"}
                                  </p>
                                  <p>
                                    <strong>Thời gian:</strong> {formatDateTime(checkin.timestamp)}
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{formatDateTime(checkin.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{checkin.employee?.fullName || "Không xác định"}</span>
                          {checkin.employee?.email && (
                            <span className="text-xs text-muted-foreground">{checkin.employee.email}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{checkin.employee?.employeeId || "N/A"}</TableCell>
                      <TableCell className="text-sm">{checkin.employee?.position?.positionName || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(checkin.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {checkin.devide?.nameDevice || checkin.device?.nameDevice || "N/A"}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono">
                            {checkin.devide?.deviceId || checkin.device?.deviceId || "N/A"}
                          </span>
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
    </div>
  )
}
