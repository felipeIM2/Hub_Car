'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { isAuthenticated } from '@/lib/auth'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const authStatus = isAuthenticated()
    if (authStatus) {
      router.replace('/dashboard')
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Welcome to HubCar</h1>
        <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
          Manage your car rental business efficiently with our comprehensive platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => router.push('/login')}
          >
            Login to Account
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => router.push('/register')}
          >
            Create New Account
          </Button>
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Vehicle Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track and manage your vehicle fleet with ease.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Client Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Maintain detailed records of your clients and their preferences.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-2">Contract Handling</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create and manage rental contracts seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}