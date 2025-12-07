import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://hub-car.vercel.app', // Your Vercel deployment domain
  // Add your custom domain here if you have one
]

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  
  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    const response = NextResponse.json({}, { status: 200 })
    
    // Set CORS headers for preflight
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    } else if (!origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      response.headers.set('Access-Control-Allow-Origin', '*')
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Max-Age', '86400') // 24 hours
    
    return response
  }
  
  // Handle actual requests
  const response = NextResponse.next()
  
  // Set CORS headers for actual requests
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (!origin) {
    // Allow requests with no origin (like mobile apps or curl requests)
    response.headers.set('Access-Control-Allow-Origin', '*')
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
  ],
}