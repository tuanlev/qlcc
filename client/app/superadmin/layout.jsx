import { SuperAdminSidebar } from "@/components/superadmin/sidebar"
import { SuperAdminHeader } from "@/components/superadmin/header"

export default function SuperAdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SuperAdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <SuperAdminHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
