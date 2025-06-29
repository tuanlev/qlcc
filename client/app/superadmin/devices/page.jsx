import { DeviceManagement } from "@/components/device-management"

export default function DevicesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Thiết Bị </h1>
        <p className="text-muted-foreground">Quản lý các thiết bị check-in trong hệ thống của bạn</p>
      </div>
      <DeviceManagement />
    </div>
  )
}
