import { ShiftManagement } from "@/components/shift-management"

export default function ShiftsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Ca Làm</h1>
        <p className="text-muted-foreground">Quản lý các ca làm việc trong hệ thống</p>
      </div>
      <ShiftManagement />
    </div>
  )
}
