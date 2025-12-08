import Contract from "@/components/hubcar/contract/contract"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Contract />
    </ProtectedRoute>
  )
}
