'use client'

import { logout } from './auth'
import { useRouter } from 'next/navigation'

export function useLogout() {
  const router = useRouter()

  const handleLogout = () => {
    logout(() => {
      // Redirect to login page after logout
      router.push('/login')
    })
  }

  return { handleLogout }
}