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

// GET /api/attachments/:id/view - View attachment by ID
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Attachment ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const attachment = await prisma.attachment.findUnique({
      where: {
        id: id
      }
    })
    
    if (!attachment) {
      const response = NextResponse.json({ error: 'Attachment not found' }, { status: 404 })
      return setCORSHeaders(response)
    }
    
    // Create response with file data for inline viewing
    const response = new NextResponse(attachment.data, {
      headers: {
        'Content-Type': attachment.mimeType,
        'Content-Disposition': `inline; filename="${attachment.filename}"`
      }
    })
    
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching attachment:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch attachment', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}