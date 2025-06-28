/**
 * Component hiển thị thống kê hàng tháng cho một nhân viên
 * Bao gồm các thông tin như số ngày làm việc, tổng số giờ, tăng ca, ngày đi muộn...
 */
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * Component hiển thị thống kê hàng tháng
 * @param {Object} props - Props của component
 * @param {number} props.employeeId - ID của nhân viên
 */
export function MonthlyStats({ employeeId }) {
  // Dữ liệu mẫu cho thống kê tháng hiện tại
  const currentMonthStats = {
    daysWorked: 18,
    totalHours: 147.5,
    overtimeHours: 3.5,
    lateDays: 2,
    absentDays: 1,
    averageCheckIn: "08:10",
    averageCheckOut: "17:30",
  }

  // Dữ liệu mẫu cho thống kê tháng trước
  const previousMonthStats = {
    daysWorked: 21,
    totalHours: 172.0,
    overtimeHours: 4.0,
    lateDays: 3,
    absentDays: 0,
    averageCheckIn: "08:05",
    averageCheckOut: "17:25",
  }

  return (
    <Tabs defaultValue="current">
      <div className="flex items-center justify-between">
        <CardTitle>Thống Kê Hàng Tháng</CardTitle>
        {/* Tab chuyển đổi giữa tháng hiện tại và tháng trước */}
        <TabsList>
          <TabsTrigger value="current">Tháng Hiện Tại</TabsTrigger>
          <TabsTrigger value="previous">Tháng Trước</TabsTrigger>
        </TabsList>
      </div>

      {/* Nội dung thống kê tháng hiện tại */}
      <TabsContent value="current">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <StatCard title="Ngày Làm Việc" value={`${currentMonthStats.daysWorked} ngày`} />
          <StatCard title="Tổng Số Giờ" value={`${currentMonthStats.totalHours} giờ`} />
          <StatCard title="Tăng Ca" value={`${currentMonthStats.overtimeHours} giờ`} />
          <StatCard title="Ngày Đi Muộn" value={`${currentMonthStats.lateDays} ngày`} />
          <StatCard title="Ngày Vắng Mặt" value={`${currentMonthStats.absentDays} ngày`} />
          <StatCard title="Giờ Vào TB" value={currentMonthStats.averageCheckIn} />
          <StatCard title="Giờ Ra TB" value={currentMonthStats.averageCheckOut} />
          <StatCard
            title="Tỷ Lệ Chuyên Cần"
            value={`${Math.round((currentMonthStats.daysWorked / (currentMonthStats.daysWorked + currentMonthStats.absentDays)) * 100)}%`}
          />
        </div>
      </TabsContent>

      {/* Nội dung thống kê tháng trước */}
      <TabsContent value="previous">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <StatCard title="Ngày Làm Việc" value={`${previousMonthStats.daysWorked} ngày`} />
          <StatCard title="Tổng Số Giờ" value={`${previousMonthStats.totalHours} giờ`} />
          <StatCard title="Tăng Ca" value={`${previousMonthStats.overtimeHours} giờ`} />
          <StatCard title="Ngày Đi Muộn" value={`${previousMonthStats.lateDays} ngày`} />
          <StatCard title="Ngày Vắng Mặt" value={`${previousMonthStats.absentDays} ngày`} />
          <StatCard title="Giờ Vào TB" value={previousMonthStats.averageCheckIn} />
          <StatCard title="Giờ Ra TB" value={previousMonthStats.averageCheckOut} />
          <StatCard
            title="Tỷ Lệ Chuyên Cần"
            value={`${Math.round((previousMonthStats.daysWorked / (previousMonthStats.daysWorked + previousMonthStats.absentDays)) * 100)}%`}
          />
        </div>
      </TabsContent>
    </Tabs>
  )
}

/**
 * Component hiển thị một thẻ thống kê
 * @param {Object} props - Props của component
 * @param {string} props.title - Tiêu đề thống kê
 * @param {string|number} props.value - Giá trị thống kê
 */
function StatCard({ title, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
