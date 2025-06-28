import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to realtime page
  redirect("/dashboard/realtime")
}
