import Vehicle from "@/components/hubcar/vehicle/vehicle"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Vehicle />
    </ProtectedRoute>
  )
}
