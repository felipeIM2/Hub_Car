import Maintenance from "@/components/hubcar/maintenance/maintenance"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Maintenance />
    </ProtectedRoute>
  )
}
