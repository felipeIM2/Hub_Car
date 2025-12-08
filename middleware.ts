import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define the allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://panelhubcar.vercel.app', // Your Vercel deployment domain
  // Add your custom domain here if you have one
]

// List of paths that require authentication
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/settings',
  '/client',
  '/vehicle',
  '/contract',
  '/lease',
  '/maintenance',
  '/part',
  '/config'
]

// List of paths that are public (don't require authentication)
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/auth',
  '/api/auth/register'
]

function isPublicPath(pathname: string): boolean {
  return publicPaths.some(publicPath => 
    pathname === publicPath || pathname.startsWith(`${publicPath}/`)
  )
}

function isProtectedPath(pathname: string): boolean {
  return protectedPaths.some(protectedPath => 
    pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  )
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin')
  const pathname = request.nextUrl.pathname
  
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
  
  // Check if the path requires authentication
  const isProtected = isProtectedPath(pathname);
  const isPublic = isPublicPath(pathname);
  
  // If it's a protected path, check for authentication
  if (isProtected) {
    // Try to get the user token from cookies (you might want to adjust this based on your auth strategy)
    // For now, we'll redirect to login since client-side localStorage isn't accessible in middleware
    // In a real implementation, you'd use JWT tokens in cookies
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}