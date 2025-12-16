import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'
import bcrypt from 'bcryptjs'

// Helper function to set CORS headers
function setCORSHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return response
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 })
  return setCORSHeaders(response)
}

// POST /api/auth/login - Validate user credentials
export async function POST(request: Request) {
  try {
    // Ensure prisma client is connected
    await prisma.$connect()
    
    const body = await request.json()
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      const response = NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
      return setCORSHeaders(response)
    }

    // Find user by username only (not by password)
    const user = await prisma.user.findUnique({
      where: {
        username: username
      }
    })

    // Check if user exists
    if (!user) {
      const response = NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
      return setCORSHeaders(response)
    }

    // Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      const response = NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
      return setCORSHeaders(response)
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    const response = NextResponse.json(userWithoutPassword)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error during login:', error)
    const response = NextResponse.json(
      {
        error: 'Login failed',
        message: error.message
      },
      { status: 500 }
    )
    return setCORSHeaders(response)
  }
}