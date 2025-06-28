/**
 * Trang chỉnh sửa thông tin nhân viên
 * Cho phép cập nhật thông tin cá nhân và lương của nhân viên
 */
"use client"

// Thêm memo để tránh re-render không cần thiết
import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import { useEmployees, SHIFTS } from "@/hooks/use-employees"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Component trang chỉnh sửa thông tin nhân viên
 * @param {Object} props - Props của component
 * @param {Object} props.params - Tham số từ URL
 * @param {string} props.params.id - ID của nhân viên
 */
// Trong component, sử dụng useMemo để tính toán employeeId
export default function EditEmployeePage({ params }) {
  const router = useRouter()
  const { getEmployeeById, updateEmployee, departments, positions, addDepartment, addPosition } = useEmployees()

  // Sử dụng useMemo để tính toán employeeId
  const employeeId = useMemo(() => Number.parseInt(params.id, 10), [params.id])

  const [employee, setEmployee] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    joinDate: "",
    shift: "fullday",
  })
  const [newDepartment, setNewDepartment] = useState("")
  const [newPosition, setNewPosition] = useState("")
  const [salaryData, setSalaryData] = useState({
    baseSalary: 0,
    hourlyRate: 0,
    overtimeRate: 0,
    bonus: 0,
  })
  const [profileImage, setProfileImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Lấy thông tin nhân viên khi component được tải
  useEffect(() => {
    try {
      setIsLoading(true)
      // Lấy dữ liệu nhân viên từ danh sách employees
      const emp = getEmployeeById(employeeId)

      if (emp) {
        setEmployee(emp)
        setFormData({
          name: emp.name || "",
          position: emp.position || "",
          department: emp.department || "",
          email: emp.email || "",
          phone: emp.phone || "",
          joinDate: emp.joinDate || "",
          shift: emp.shift || "fullday",
        })

        setSalaryData({
          baseSalary: emp.salary?.baseSalary || 0,
          hourlyRate: emp.salary?.hourlyRate || 0,
          overtimeRate: emp.salary?.overtimeRate || 0,
          bonus: emp.salary?.bonus || 0,
        })
      } else {
        setError("Không tìm thấy thông tin nhân viên")
      }
    } catch (err) {
      console.error("Error loading employee:", err)
      setError("Có lỗi xảy ra khi tải thông tin nhân viên")
    } finally {
      setIsLoading(false)
    }
  }, [employeeId]) // Chỉ chạy lại khi employeeId thay đổi, loại bỏ getEmployeeById từ dependencies

  /**
   * Xử lý sự kiện thay đổi input
   * @param {Event} e - Sự kiện thay đổi input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Xử lý sự kiện thay đổi select
   * @param {string} name - Tên trường
   * @param {string} value - Giá trị mới
   */
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * Xử lý sự kiện thay đổi input lương
   * @param {Event} e - Sự kiện thay đổi input
   */
  const handleSalaryChange = (e) => {
    const { name, value } = e.target
    setSalaryData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  /**
   * Xử lý thêm phòng ban mới
   */
  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      addDepartment(newDepartment.trim())
      setFormData((prev) => ({ ...prev, department: newDepartment.trim() }))
      setNewDepartment("")
    }
  }

  /**
   * Xử lý thêm vị trí mới
   */
  const handleAddPosition = (e) => {
    if (newPosition.trim()) {
      addPosition(newPosition.trim())
      setFormData((prev) => ({ ...prev, position: newPosition.trim() }))
      setNewPosition("")
    }
  }

  /**
   * Xử lý sự kiện tải lên ảnh đại diện mới
   * @param {Event} e - Sự kiện thay đổi input file
   */
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

  /**
   * Xử lý sự kiện submit form
   * @param {Event} e - Sự kiện submit form
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      // Cập nhật thông tin nhân viên
      const updatedData = {
        ...formData,
        salary: salaryData,
      }

      // Nếu có ảnh mới, cập nhật ảnh
      if (profileImage) {
        updatedData.image = profileImage
      }

      console.log("Updating employee with data:", updatedData)
      updateEmployee(employeeId, updatedData)

      // Chuyển hướng đến trang chi tiết nhân viên
      router.push(`/dashboard/employees/${employeeId}`)
    } catch (err) {
      console.error("Error updating employee:", err)
      setError("Có lỗi xảy ra khi cập nhật thông tin nhân viên")
    }
  }

  // Hiển thị trạng thái đang tải
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Đang tải thông tin nhân viên...</p>
        </div>
      </div>
    )
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
        <Link href="/dashboard/employees">
          <Button>Quay lại danh sách nhân viên</Button>
        </Link>
      </div>
    )
  }

  // Nếu không tìm thấy nhân viên
  if (!employee) {
    return (
      <div className="p-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>Không tìm thấy thông tin nhân viên với ID: {employeeId}</p>
        </div>
        <Link href="/dashboard/employees">
          <Button>Quay lại danh sách nhân viên</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/employees/${employeeId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Cập Nhật Thông Tin Nhân Viên</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Thông Tin Cơ Bản</TabsTrigger>
            <TabsTrigger value="salary">Thông Tin Lương</TabsTrigger>
            <TabsTrigger value="image">Ảnh Đại Diện</TabsTrigger>
          </TabsList>

          {/* Tab thông tin cơ bản */}
          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Cá Nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trường họ tên */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và Tên</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name || ""}
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

                  {/* Trường số điện thoại */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số Điện Thoại</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  {/* Trường ngày vào làm */}
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Ngày Vào Làm</Label>
                    <Input
                      id="joinDate"
                      name="joinDate"
                      value={formData.joinDate || ""}
                      onChange={handleInputChange}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>

                  {/* Trường ca làm việc */}
                  <div className="space-y-2">
                    <Label htmlFor="shift">Ca Làm Việc</Label>
                    <Select
                      value={formData.shift || "fullday"}
                      onValueChange={(value) => handleSelectChange("shift", value)}
                    >
                      <SelectTrigger id="shift">
                        <SelectValue placeholder="Chọn ca làm việc" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">
                          {SHIFTS.morning.name} ({SHIFTS.morning.startTime} - {SHIFTS.morning.endTime})
                        </SelectItem>
                        <SelectItem value="afternoon">
                          {SHIFTS.afternoon.name} ({SHIFTS.afternoon.startTime} - {SHIFTS.afternoon.endTime})
                        </SelectItem>
                        <SelectItem value="fullday">
                          {SHIFTS.fullday.name} ({SHIFTS.fullday.startTime} - {SHIFTS.fullday.endTime})
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {/* Trường phòng ban */}
                  <div className="space-y-2">
                    <Label>Phòng Ban</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.department || ""}
                        onValueChange={(value) => handleSelectChange("department", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng ban" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("newDeptDialog")?.showModal()}
                      >
                        Thêm Mới
                      </Button>
                    </div>
                  </div>

                  {/* Trường vị trí */}
                  <div className="space-y-2">
                    <Label>Vị Trí</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.position || ""}
                        onValueChange={(value) => handleSelectChange("position", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vị trí" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions.map((pos) => (
                            <SelectItem key={pos} value={pos}>
                              {pos}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("newPosDialog")?.showModal()}
                      >
                        Thêm Mới
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab thông tin lương */}
          <TabsContent value="salary">
            <Card>
              <CardHeader>
                <CardTitle>Thông Tin Lương</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trường lương cơ bản */}
                  <div className="space-y-2">
                    <Label htmlFor="baseSalary">Lương Cơ Bản (VNĐ)</Label>
                    <Input
                      id="baseSalary"
                      name="baseSalary"
                      type="number"
                      value={salaryData.baseSalary}
                      onChange={handleSalaryChange}
                      placeholder="Nhập lương cơ bản"
                    />
                  </div>

                  {/* Trường lương theo giờ */}
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Lương Theo Giờ (VNĐ/giờ)</Label>
                    <Input
                      id="hourlyRate"
                      name="hourlyRate"
                      type="number"
                      value={salaryData.hourlyRate}
                      onChange={handleSalaryChange}
                      placeholder="Nhập lương theo giờ"
                    />
                  </div>

                  {/* Trường lương tăng ca */}
                  <div className="space-y-2">
                    <Label htmlFor="overtimeRate">Lương Tăng Ca (VNĐ/giờ)</Label>
                    <Input
                      id="overtimeRate"
                      name="overtimeRate"
                      type="number"
                      value={salaryData.overtimeRate}
                      onChange={handleSalaryChange}
                      placeholder="Nhập lương tăng ca"
                    />
                  </div>

                  {/* Trường tiền thưởng */}
                  <div className="space-y-2">
                    <Label htmlFor="bonus">Thưởng (VNĐ)</Label>
                    <Input
                      id="bonus"
                      name="bonus"
                      type="number"
                      value={salaryData.bonus}
                      onChange={handleSalaryChange}
                      placeholder="Nhập tiền thưởng"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab ảnh đại diện */}
          <TabsContent value="image">
            <Card>
              <CardHeader>
                <CardTitle>Ảnh Đại Diện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  {/* Hiển thị ảnh hiện tại */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium mb-2">Ảnh Hiện Tại</h3>
                    <Avatar className="h-32 w-32 mx-auto">
                      <AvatarImage
                        src={profileImage || employee.image || "/placeholder.svg?height=128&width=128"}
                        alt={employee.name || "Nhân viên"}
                      />
                      <AvatarFallback>
                        {employee.name ? employee.name.substring(0, 2).toUpperCase() : "NV"}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Nút lưu thay đổi */}
        <div className="mt-6 flex justify-end">
          <Button type="submit" className="w-full md:w-auto" disabled={isUploading}>
            <Save className="mr-2 h-4 w-4" />
            Lưu Thay Đổi
          </Button>
        </div>
      </form>

      {/* Dialog thêm phòng ban mới */}
      <dialog id="newDeptDialog" className="modal p-6 rounded-lg shadow-lg bg-white max-w-md mx-auto mt-24">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Thêm Phòng Ban Mới</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newDepartment">Tên Phòng Ban</Label>
              <Input
                id="newDepartment"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Nhập tên phòng ban mới"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => document.getElementById("newDeptDialog")?.close()}>
                Hủy
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleAddDepartment()
                  document.getElementById("newDeptDialog")?.close()
                }}
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      </dialog>

      {/* Dialog thêm vị trí mới */}
      <dialog id="newPosDialog" className="modal p-6 rounded-lg shadow-lg bg-white max-w-md mx-auto mt-24">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Thêm Vị Trí Mới</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPosition">Tên Vị Trí</Label>
              <Input
                id="newPosition"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Nhập tên vị trí mới"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => document.getElementById("newPosDialog")?.close()}>
                Hủy
              </Button>
              <Button
                type="button"
                onClick={() => {
                  handleAddPosition()
                  document.getElementById("newPosDialog")?.close()
                }}
              >
                Thêm
              </Button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  )
}
