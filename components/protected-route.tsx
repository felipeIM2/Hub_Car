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
    console.log('Protected route check - authenticated:', authStatus)
    
    if (!authStatus) {
      // Redirect to login page if not authenticated
      console.log('Redirecting to login page')
      router.replace('/login')
    } else {
      console.log('User is authenticated, allowing access')
      setAuthenticated(true)
      setLoading(false)
    }
  }, [router])

  // Also listen for storage changes to handle logout events
  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = isAuthenticated()
      console.log('Storage change detected - authenticated:', authStatus)
      if (!authStatus) {
        console.log('Storage change: Redirecting to login page')
        router.replace('/login')
      } else {
        console.log('Storage change: User is authenticated')
        setAuthenticated(true)
        setLoading(false)
      }
    }

    // Listen for storage changes (e.g., logout in another tab)
    window.addEventListener('storage', handleStorageChange)
    
    // Also check authentication status periodically
    const interval = setInterval(() => {
      const authStatus = isAuthenticated()
      if (authStatus && !authenticated) {
        console.log('Interval check: User is authenticated')
        setAuthenticated(true)
        setLoading(false)
      }
    }, 1000)
    
    // Cleanup listener and interval
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [router, authenticated])

  // Show nothing while checking authentication
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // Render children if authenticated
  return authenticated ? <>{children}</> : null
}