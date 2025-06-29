"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUsers } from "@/hooks/use-users"
import { useDevices } from "@/hooks/use-devices"
import { Plus, Search, Edit, Trash2, Eye, Key, ShieldAlert, RefreshCw, User, Monitor, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function AdminManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    users,
    loading: usersLoading,
    error: usersError,
    searchKeyword,
    addUser,
    updateUser,
    deleteUser,
    resetPassword,
    searchUsers,
    clearSearch,
    refetch: refetchUsers,
  } = useUsers()

  const { devices, loading: devicesLoading, error: devicesError } = useDevices()

  const loading = usersLoading || devicesLoading
  const error = usersError || devicesError

  const [localSearchInput, setLocalSearchInput] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    deviceId: "",
    imageAvatar: "",
  })

  const [editUser, setEditUser] = useState({
    username: "",
    role: "admin",
    deviceId: "",
    imageAvatar: "",
  })

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchKeyword ||
      user.username?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.userId?.toLowerCase().includes(searchKeyword.toLowerCase())

    const matchesStatus = statusFilter === "all" || user.role === statusFilter

    return matchesSearch && matchesStatus
  })

  // Reset form data
  const resetNewUserForm = () => {
    setNewUser({
      username: "",
      password: "",
      confirmPassword: "",
      role: "admin",
      deviceId: "",
      imageAvatar: "",
    })
  }

  const resetEditUserForm = () => {
    setEditUser({
      username: "",
      role: "admin",
      deviceId: "",
      imageAvatar: "",
    })
  }

  // Handle search
  const handleSearch = () => {
    searchUsers(localSearchInput)
  }

  const handleClearSearch = () => {
    setLocalSearchInput("")
    clearSearch()
  }

  // Handle create user
  const handleCreateUser = async () => {
    // Validate form
    if (!newUser.username || !newUser.password) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      })
      return
    }

    if (newUser.password !== newUser.confirmPassword) {
      toast({
        title: "Lỗi",
        description: "Mật khẩu xác nhận không khớp",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const userData = {
        username: newUser.username.trim(),
        password: newUser.password,
        role: newUser.role,
      }

      // Add optional fields - only if not empty
      if (newUser.deviceId && newUser.deviceId !== "") userData.deviceId = newUser.deviceId
      if (newUser.imageAvatar && newUser.imageAvatar !== "") userData.imageAvatar = newUser.imageAvatar

      await addUser(userData)

      toast({
        title: "Thành công",
        description: `Đã tạo tài khoản admin cho ${newUser.username}`,
      })

      setIsCreateDialogOpen(false)
      resetNewUserForm()
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle edit user
  const handleEditUser = async () => {
    if (!editUser.username) {
      toast({
        title: "Lỗi",
        description: "Tên đăng nhập không được để trống",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const updateData = {
        username: editUser.username.trim(),
        role: editUser.role,
      }

      // Handle deviceId - send empty string to unassign device
      updateData.deviceId = editUser.deviceId || ""

      // Handle imageAvatar - send empty string to remove avatar
      updateData.imageAvatar = editUser.imageAvatar || ""

      await updateUser(selectedUser.userId, updateData)

      toast({
        title: "Thành công",
        description: `Đã cập nhật thông tin cho ${editUser.username}`,
      })
refetchUsers()
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      resetEditUserForm()
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle reset password
  const handleResetPassword = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)

    try {
      const result = await resetPassword(selectedUser.userId)

      toast({
        title: "Thành công",
        description: `Đã đặt lại mật khẩu cho ${selectedUser.username}`,
      })

      // If API returns new password, show it to user
      if (result.data?.newPassword) {
        toast({
          title: "Mật khẩu mới",
          description: `Mật khẩu mới: ${result.data.newPassword}`,
          duration: 10000, // Show for 10 seconds
        })
      }

      setIsResetPasswordDialogOpen(false)
      setSelectedUser(null)
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle delete user
  const handleDeleteUser = async (user) => {
    try {
      await deleteUser(user.userId)

      toast({
        title: "Thành công",
        description: `Đã xóa tài khoản ${user.username}`,
      })
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  // Handle view user
  const handleViewUser = (user) => {
    router.push(`/superadmin/admins/${user.userId}`)
  }

  // Handle edit button click
  const handleEditClick = (user) => {
    setSelectedUser(user)
    setEditUser({
      username: user.username || "",
      role: user.role || "admin",
      deviceId: user.device?.deviceId || "",
      imageAvatar: user.imageAvatar || "",
    })
    setIsEditDialogOpen(true)
  }

  // Format device display
  const getDeviceDisplay = (deviceId) => {
    if (!deviceId) return "Không chọn"
    const device = devices.find((d) => d.deviceId === deviceId)
    return device ? device.deviceName || device.deviceId : deviceId
  }

  // Format last login (placeholder since not in API response)
  const formatLastLogin = (user) => {
    // Since lastLogin is not in the API response, we'll show a placeholder
    return "Chưa có dữ liệu"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button variant="outline" size="sm" onClick={refetchUsers} className="ml-2 bg-transparent">
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Admin</h1>
          <p className="text-muted-foreground">Quản lý tài khoản admin và phân quyền thiết bị</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm Admin
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Tìm kiếm và Lọc</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm theo username..."
                  value={localSearchInput}
                  onChange={(e) => setLocalSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch()
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch}>Tìm kiếm</Button>
            {searchKeyword && (
              <Button variant="outline" onClick={handleClearSearch}>
                <X className="mr-2 h-4 w-4" />
                Xóa bộ lọc
              </Button>
            )}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="superadmin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refetchUsers} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Tổng Admin</p>
                <p className="text-2xl font-bold">{filteredUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Admin thường</p>
                <p className="text-2xl font-bold">{filteredUsers.filter((u) => u.role === "admin").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Super Admin</p>
                <p className="text-2xl font-bold">{filteredUsers.filter((u) => u.role === "superadmin").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Có thiết bị</p>
                <p className="text-2xl font-bold">{filteredUsers.filter((u) => u.device).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Admin ({filteredUsers.length})</CardTitle>
          <CardDescription>Quản lý tất cả tài khoản admin trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Người dùng</th>
                  <th className="text-left py-3 px-4">Username</th>
                  <th className="text-left py-3 px-4">Vai trò</th>
                  <th className="text-left py-3 px-4">Thiết bị</th>
                  <th className="text-left py-3 px-4">Đăng nhập cuối</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground">
                      {searchKeyword || statusFilter !== "all" ? "Không tìm thấy admin nào" : "Chưa có admin nào"}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.userId} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Avatar className="mr-3 h-10 w-10">
                            {user.imageAvatar ? (
                              <AvatarImage src={user.imageAvatar || "/placeholder.svg"} alt={user.username} />
                            ) : (
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.username}</p>
                            <p className="text-sm text-gray-500">ID: {user.userId.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">{user.username}</td>
                      <td className="py-3 px-4">
                        <Badge variant={user.role === "superadmin" ? "default" : "secondary"}>
                          {user.role === "superadmin" ? "Super Admin" : "Admin"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {user.device ? (
                          <Badge variant="outline" className="flex items-center w-fit">
                            <Monitor className="mr-1 h-3 w-3" />
                            {user.device.deviceName || user.device.deviceId}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Chưa có thiết bị</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{formatLastLogin(user)}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleViewUser(user)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsResetPasswordDialogOpen(true)
                            }}
                          >
                            <Key className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bạn có chắc chắn muốn xóa tài khoản "{user.username}"? Hành động này không thể hoàn
                                  tác.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user)}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Xóa
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Admin Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tạo tài khoản Admin mới</DialogTitle>
            <DialogDescription>Nhập thông tin để tạo tài khoản admin mới</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username *
              </Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="col-span-3"
                placeholder="Nhập username"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Mật khẩu *
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="col-span-3"
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirmPassword" className="text-right">
                Xác nhận mật khẩu *
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                className="col-span-3"
                placeholder="Nhập lại mật khẩu"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Vai trò
              </Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deviceId" className="text-right">
                Thiết bị
              </Label>
              <Select value={newUser.deviceId} onValueChange={(value) => setNewUser({ ...newUser, deviceId: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn thiết bị (tùy chọn)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không chọn</SelectItem>
                  {devices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.deviceName || device.deviceId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageAvatar" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="imageAvatar"
                value={newUser.imageAvatar}
                onChange={(e) => setNewUser({ ...newUser, imageAvatar: e.target.value })}
                className="col-span-3"
                placeholder="URL ảnh đại diện (tùy chọn)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                resetNewUserForm()
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button onClick={handleCreateUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                "Tạo Admin"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin Admin</DialogTitle>
            <DialogDescription>Cập nhật thông tin cho {selectedUser?.username}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                Username *
              </Label>
              <Input
                id="edit-username"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                className="col-span-3"
                placeholder="Nhập username"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Vai trò
              </Label>
              <Select value={editUser.role} onValueChange={(value) => setEditUser({ ...editUser, role: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="superadmin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-deviceId" className="text-right">
                Thiết bị
              </Label>
              <Select
                value={editUser.deviceId}
                onValueChange={(value) => setEditUser({ ...editUser, deviceId: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn thiết bị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Bỏ chọn thiết bị</SelectItem>
                  {devices.map((device) => (
                    <SelectItem key={device.deviceId} value={device.deviceId}>
                      {device.deviceName || device.deviceId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-imageAvatar" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="edit-imageAvatar"
                value={editUser.imageAvatar}
                onChange={(e) => setEditUser({ ...editUser, imageAvatar: e.target.value })}
                className="col-span-3"
                placeholder="URL ảnh đại diện (để trống để xóa)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setSelectedUser(null)
                resetEditUserForm()
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button onClick={handleEditUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              Đặt lại mật khẩu
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đặt lại mật khẩu cho admin {selectedUser?.username}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Mật khẩu mới sẽ được tạo tự động và hiển thị sau khi đặt lại thành công.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsResetPasswordDialogOpen(false)
                setSelectedUser(null)
              }}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button onClick={handleResetPassword} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang đặt lại...
                </>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
