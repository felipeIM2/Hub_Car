import Content from "./content"
import Layout from "../component/layout"
import ProtectedRoute from "@/components/protected-route"

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Layout>
        <Content />
      </Layout>
    </ProtectedRoute>
  )
}
