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

// POST /api/users/register - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, name, email, role } = body

    // Validate input
    if (!username || !password || !name || !email) {
      const response = NextResponse.json(
        { error: 'Username, password, name, and email are required' },
        { status: 400 }
      )
      return setCORSHeaders(response)
    }

    // Check if user already exists
    // @ts-ignore: Prisma client typing issue - this works correctly
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username
      }
    })

    if (existingUser) {
      const response = NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
      return setCORSHeaders(response)
    }

    // Hash the password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create a new user
    // @ts-ignore: Prisma client typing issue - this works correctly
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        role: role || 'user' // Default to 'user' role if not provided
      }
    })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    const response = NextResponse.json(userWithoutPassword)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error creating user:', error)
    const response = NextResponse.json(
      {
        error: 'Failed to create user',
        message: error.message,
        code: error.code
      },
      { status: 500 }
    )
    return setCORSHeaders(response)
  }
}