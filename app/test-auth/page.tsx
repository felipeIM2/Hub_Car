'use client'

import { useEffect, useState } from 'react'
import { isAuthenticated, getCurrentUser } from '@/lib/auth'

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState<boolean | null>(null)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const auth = isAuthenticated()
    setAuthStatus(auth)
    
    if (auth) {
      const user = getCurrentUser()
      setUserData(user)
    }
  }, [])

  const handleClearAuth = () => {
    localStorage.removeItem('user')
    setAuthStatus(false)
    setUserData(null)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Authentication Test</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Authentication Status:</h2>
          <p className={`text-lg ${authStatus ? 'text-green-600' : 'text-red-600'}`}>
            {authStatus === null ? 'Checking...' : authStatus ? 'Authenticated' : 'Not Authenticated'}
          </p>
        </div>
        
        {userData && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">User Data:</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto text-sm">
              {JSON.stringify(userData, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Refresh Status
          </button>
          
          <button
            onClick={handleClearAuth}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Clear Authentication
          </button>
        </div>
      </div>
    </div>
  )
}