import Config from "@/components/hubcar/config/config"
import ProtectedRoute from "@/components/protected-route"

export default function ClientPage() {
  return (
    <ProtectedRoute>
      <Config />
    </ProtectedRoute>
  )
}
