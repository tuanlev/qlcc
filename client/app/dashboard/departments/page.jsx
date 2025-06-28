import { DepartmentManagement } from "@/components/department-management"

export default function DepartmentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Quản Lý Bộ Phận</h1>
        <p className="text-muted-foreground">Quản lý các bộ phận trong hệ thống</p>
      </div>
      <DepartmentManagement />
    </div>
  )
}
