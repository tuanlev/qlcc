/**
 * Trang hiển thị thông tin nhân viên làm thêm giờ (OT)
 * Hiển thị danh sách nhân viên làm thêm giờ và thông tin chi tiết
 */
import { ShiftRecordManagement } from "@/components/shift-record-management"

export default function OvertimePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nhân Viên Làm Thêm Giờ (OT)</h1>
      <p className="text-muted-foreground">Thông tin nhân viên làm thêm giờ trong ngày</p>
      <ShiftRecordManagement />
    </div>
  )
}
