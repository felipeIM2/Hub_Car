import Part from "@/components/hubcar/part/part"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Part />
    </ProtectedRoute>
  )
}
