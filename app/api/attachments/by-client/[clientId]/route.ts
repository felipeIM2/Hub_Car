import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

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

// GET /api/attachments/by-client/:clientId - Get all attachments for a client
export async function GET(request: Request, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    const { clientId } = await params
    
    if (!clientId) {
      const response = NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const attachments = await prisma.attachment.findMany({
      where: {
        clientId: clientId
      },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        createdAt: true
      }
    })
    
    const response = NextResponse.json(attachments)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching attachments:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch attachments', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}