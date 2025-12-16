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

// POST /api/attachments - Create a new attachment
export async function POST(request: Request) {
  try {
    // For file uploads, we'll need to handle multipart form data
    // This is a simplified version - in practice, you might want to use a library like formidable
    const formData = await request.formData()
    const file = formData.get('file') as File
    const clientId = formData.get('clientId') as string
    
    if (!file || !clientId) {
      const response = NextResponse.json({ error: 'File and clientId are required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Create attachment record
    const attachment = await prisma.attachment.create({
      data: {
        clientId: clientId,
        filename: file.name,
        mimeType: file.type,
        data: buffer
      }
    })
    
    const response = NextResponse.json(attachment)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error creating attachment:', error)
    const response = NextResponse.json({ 
      error: 'Failed to create attachment', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}