import Budget from "@/components/hubcar/budget/budget"
import ProtectedRoute from "@/components/protected-route"

export default function BudgetPage() {
  return (
    <ProtectedRoute>
      <Budget />
    </ProtectedRoute>
  )
}
