"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useUsers } from "@/hooks/use-users"
import { Plus, Search, Edit, Trash2, Users, RotateCcw, Eye, EyeOff } from "lucide-react"

export default function UserManagement() {
  const {
    users,
    devices,
    loading,
    error,
    searchKeyword,
    addUser,
    updateUser,
    deleteUser,
    resetPassword,
    searchUsers,
    clearSearch,
    refetch,
  } = useUsers()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchInput, setSearchInput] = useState(searchKeyword)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "admin",
    deviceId: "",
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState("")

  const handleSearch = (e) => {
    e.preventDefault()
    searchUsers(searchInput)
  }

  const handleClearSearch = () => {
    setSearchInput("")
    clearSearch()
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    setActionError("")

    try {
      await addUser(formData)
      setIsAddDialogOpen(false)
      setFormData({ username: "", password: "", role: "admin", deviceId: "" })
      await refetch()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditUser = async (e) => {
    e.preventDefault()
    if (!selectedUser) return

    setActionLoading(true)
    setActionError("")

    try {
      const updateData = {
        role: formData.role,
        deviceId: formData.deviceId === "none" ? "" : formData.deviceId,
      }
      await updateUser(selectedUser.userId, updateData)
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setFormData({ username: "", password: "", role: "admin", deviceId: "" })
      await refetch()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteUser = async (user) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.username}"?`)) {
      return
    }

    try {
      await deleteUser(user.userId)
      await refetch()
    } catch (err) {
      alert(`Lỗi khi xóa người dùng: ${err.message}`)
    }
  }

  const handleResetPassword = async (user) => {
    if (!confirm(`Bạn có chắc chắn muốn reset mật khẩu cho "${user.username}"?`)) {
      return
    }

    try {
      const result = await resetPassword(user.userId)
      if (result.success) {
        alert(`Mật khẩu mới: ${result.data.newPassword}`)
        await refetch()
      }
    } catch (err) {
      alert(`Lỗi khi reset mật khẩu: ${err.message}`)
    }
  }

  const openEditDialog = (user) => {
    setSelectedUser(user)
    setFormData({
      username: user.username || "",
      password: "",
      role: user.role || "admin",
      deviceId: user.device?.deviceId || "",
    })
    setActionError("")
    setIsEditDialogOpen(true)
  }

  const openAddDialog = () => {
    setFormData({ username: "", password: "", role: "admin", deviceId: "" })
    setActionError("")
    setIsAddDialogOpen(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Đang tải danh sách người dùng...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Quản lý người dùng
          </CardTitle>
          <CardDescription>Thêm, sửa, xóa và quản lý tài khoản người dùng trong hệ thống</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">
                <Search className="h-4 w-4" />
              </Button>
              {searchKeyword && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  Xóa bộ lọc
                </Button>
              )}
            </form>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm người dùng
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Thêm người dùng mới</DialogTitle>
                  <DialogDescription>Tạo tài khoản người dùng mới trong hệ thống</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddUser}>
                  <div className="space-y-4 py-4">
                    {actionError && (
                      <Alert variant="destructive">
                        <AlertDescription>{actionError}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="username">Tên đăng nhập</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                        placeholder="Nhập tên đăng nhập"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mật khẩu</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Nhập mật khẩu"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Vai trò</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deviceId">Thiết bị (tùy chọn)</Label>
                      <Select
                        value={formData.deviceId}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, deviceId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn thiết bị" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Không gán thiết bị</SelectItem>
                          {devices.map((device) => (
                            <SelectItem key={device.deviceId} value={device.deviceId}>
                              {device.nameDevice || device.deviceId} ({device.deviceId})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Hủy
                    </Button>
                    <Button type="submit" disabled={actionLoading}>
                      {actionLoading ? "Đang thêm..." : "Thêm người dùng"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Avatar</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên đăng nhập</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchKeyword ? "Không tìm thấy người dùng nào" : "Chưa có người dùng nào"}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.userId}>
                      <TableCell>
                        {user.imageAvatar ? (
                          <img
                            src={user.imageAvatar || "/placeholder.svg"}
                            alt={user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">{user.username.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{user.userId}</TableCell>
                      <TableCell className="font-medium">{user.username}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "superadmin" ? "default" : "secondary"}>
                          {user.role === "superadmin" ? "Super Admin" : "Admin"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.device ? (
                          <span className="text-sm">
                            {user.device.nameDevice || "Chưa đặt tên"}
                            <br />
                            <span className="text-muted-foreground font-mono text-xs">{user.device.deviceId}</span>
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Chưa gán</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleResetPassword(user)}>
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>Cập nhật thông tin người dùng {selectedUser?.username}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser}>
            <div className="space-y-4 py-4">
              {actionError && (
                <Alert variant="destructive">
                  <AlertDescription>{actionError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label>Tên đăng nhập</Label>
                <Input value={formData.username} disabled />
                <p className="text-sm text-muted-foreground">Tên đăng nhập không thể thay đổi</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Vai trò</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deviceId">Thiết bị</Label>
                <Select
                  value={formData.deviceId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, deviceId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thiết bị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không gán thiết bị</SelectItem>
                    {devices.map((device) => (
                      <SelectItem key={device.deviceId} value={device.deviceId}>
                        {device.nameDevice || device.deviceId} ({device.deviceId})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={actionLoading}>
                {actionLoading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
