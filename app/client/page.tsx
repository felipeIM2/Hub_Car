import Client from "@/components/hubcar/client/client"
import ProtectedRoute from "@/components/protected-route"

export default function ClientPage() {
  return (
    <ProtectedRoute>
      <Client />
    </ProtectedRoute>
  )
}
