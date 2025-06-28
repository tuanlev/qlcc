import { PositionManagement } from "@/components/position-management"

export default function PositionsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Chức Vụ</h1>
        <p className="text-muted-foreground">Quản lý các chức vụ trong hệ thống</p>
      </div>
      <PositionManagement />
    </div>
  )
}
