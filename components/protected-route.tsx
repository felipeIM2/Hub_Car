'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const authStatus = isAuthenticated()
    if (!authStatus) {
      // Redirect to login page if not authenticated
      router.replace('/login')
    } else {
      setAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Render children if authenticated
  return authenticated ? <>{children}</> : null
}