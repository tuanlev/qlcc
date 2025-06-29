/**
 * Component modal chỉnh sửa thông tin nhân viên
 * Cho phép chỉnh sửa thông tin cơ bản của nhân viên ngay trong trang quản lý
 */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEmployees } from "@/hooks/use-employees"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Upload } from "lucide-react"

export function EditEmployeeModal({ isOpen, onClose, employeeId }) {
  const { getEmployeeById, updateEmployee, departments, positions, shifts, devices } = useEmployees()

  // State cho form
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    departmentId: null,
    positionId: null,
    shiftId: null,
    deviceId: null,
  })

  // State cho ảnh đại diện
  const [profileImage, setProfileImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // State cho thông báo
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Lấy thông tin nhân viên khi mở modal hoặc đổi nhân viên
  useEffect(() => {
    if (employeeId && isOpen) {
      const employee = getEmployeeById(employeeId)
      if (employee) {
        setFormData({
          fullName: employee.fullName || "",
          email: employee.email || "",
          departmentId: employee.department?.departmentId || "",
          positionId: employee.position?.positionId || "",
          shiftId: employee.shift?.shiftId || "",
          deviceId: employee.device?.deviceId || "",
        })
        setProfileImage(null) // Reset ảnh đại diện mới
        setError(null) // Reset lỗi
        setSuccess(false) // Reset thành công
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeId, isOpen])

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Xử lý thay đổi select
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Xử lý tải lên ảnh đại diện mới
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)

      // Mô phỏng việc tải lên
      setTimeout(() => {
        // Trong ứng dụng thực tế, bạn sẽ tải lên file và nhận URL từ server
        // Ở đây chúng ta chỉ tạo một URL tạm thời
        const imageUrl = URL.createObjectURL(file)
        setProfileImage(imageUrl)
        setIsUploading(false)
      }, 1000)
    }
  }

  // Xử lý submit form
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Chuẩn bị dữ liệu cập nhật
      const updatedData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
      }

      // Add optional fields if selected
      if (formData.departmentId) updatedData.departmentId = formData.departmentId
      if (formData.positionId) updatedData.positionId = formData.positionId
      if (formData.shiftId) updatedData.shiftId = formData.shiftId
      if (formData.deviceId) updatedData.deviceId = formData.deviceId

      // Nếu có ảnh mới, cập nhật ảnh
      if (profileImage) {
        updatedData.image = profileImage
      }

      // Cập nhật thông tin nhân viên
      await updateEmployee(employeeId, updatedData)

      // Hiển thị thông báo thành công
      setSuccess(true)

      // Đóng modal sau 1.5 giây
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error("Error updating employee:", err)
      setError("Có lỗi xảy ra khi cập nhật thông tin nhân viên")
    } finally {
      setIsLoading(false)
    }
  }

  // Lấy thông tin nhân viên hiện tại
  const employee = employeeId ? getEmployeeById(employeeId) : null

  // Format shift display
  const getShiftDisplay = (shift) => {
    if (!shift) return ""
    return `${shift.shiftName} (${shift.checkInHour}h-${shift.checkOutHour}h)`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh Sửa Thông Tin Nhân Viên</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin cơ bản của nhân viên. Các thay đổi sẽ được lưu ngay lập tức.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông Tin Cơ Bản</TabsTrigger>
            <TabsTrigger value="image">Ảnh Đại Diện</TabsTrigger>
          </TabsList>

          {/* Tab thông tin cơ bản */}
          <TabsContent value="info" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trường họ tên */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và Tên</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Trường email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              {/* Trường phòng ban */}
              <div className="space-y-2">
                <Label htmlFor="departmentId">Phòng Ban</Label>
                <Select
                  value={formData.departmentId || ""}
                  onValueChange={(value) => handleSelectChange("departmentId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không chọn</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.departmentId} value={dept.departmentId}>
                        {dept.departmentName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trường chức vụ */}
              <div className="space-y-2">
                <Label htmlFor="positionId">Chức Vụ</Label>
                <Select
                  value={formData.positionId || ""}
                  onValueChange={(value) => handleSelectChange("positionId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chức vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không chọn</SelectItem>
                    {positions.map((pos) => (
                      <SelectItem key={pos.positionId} value={pos.positionId}>
                        {pos.positionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trường ca làm việc */}
              <div className="space-y-2">
                <Label htmlFor="shiftId">Ca Làm Việc</Label>
                <Select value={formData.shiftId || ""} onValueChange={(value) => handleSelectChange("shiftId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn ca làm việc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không chọn</SelectItem>
                    {shifts.map((shift) => (
                      <SelectItem key={shift.shiftId} value={shift.shiftId}>
                        {getShiftDisplay(shift)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trường thiết bị */}
              <div className="space-y-2">
                <Label htmlFor="deviceId">Thiết Bị</Label>
                <Select
                  value={formData.deviceId || ""}
                  onValueChange={(value) => handleSelectChange("deviceId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thiết bị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Không chọn</SelectItem>
                    {devices.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.deviceName || device.deviceId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Tab ảnh đại diện */}
          <TabsContent value="image" className="space-y-4 py-4">
            <div className="flex flex-col items-center space-y-4">
              {/* Hiển thị ảnh hiện tại */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-medium mb-2">Ảnh Hiện Tại</h3>
                <Avatar className="h-32 w-32 mx-auto">
                  <AvatarImage
                    src={profileImage || employee?.image || "/placeholder.svg?height=128&width=128"}
                    alt={employee?.fullName || "Nhân viên"}
                  />
                  <AvatarFallback>
                    {employee?.fullName ? employee.fullName.substring(0, 2).toUpperCase() : "NV"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Form tải lên ảnh mới */}
              <div className="w-full max-w-md">
                <Label htmlFor="profile-picture" className="block mb-2">
                  Tải lên ảnh mới
                </Label>
                <Label htmlFor="profile-picture" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Nhấp để chọn ảnh hoặc kéo thả vào đây</p>
                    {isUploading && <p className="text-sm text-blue-500 mt-2">Đang tải lên...</p>}
                  </div>
                  <Input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </Label>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Thông báo lỗi hoặc thành công */}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            Cập nhật thông tin nhân viên thành công!
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Lưu Thay Đổi
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
