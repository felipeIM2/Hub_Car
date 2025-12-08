import Lease from "@/components/hubcar/lease/lease"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Lease />
    </ProtectedRoute>
  )
}
