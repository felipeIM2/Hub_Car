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

// PUT /api/parts/:id - Update a part
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Part ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const body = await request.json()
    
    const part = await prisma.part.update({
      where: { id },
      data: {
        descricao: body.descricao,
        valor: parseFloat(body.valor),
        quantidade: parseInt(body.quantidade),
        utilizados: parseInt(body.utilizados)
      }
    })
    
    const response = NextResponse.json(part)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error updating part:', error)
    const response = NextResponse.json({ 
      error: 'Failed to update part', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// DELETE /api/parts/:id - Delete a part
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Part ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    await prisma.part.delete({
      where: { id }
    })
    
    const response = NextResponse.json({ message: 'Part deleted successfully' })
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error deleting part:', error)
    const response = NextResponse.json({ 
      error: 'Failed to delete part', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}