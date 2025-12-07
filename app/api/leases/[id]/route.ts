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

// PUT /api/leases/:id - Update a lease
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Lease ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const body = await request.json()
    
    const lease = await prisma.lease.update({
      where: { id },
      data: {
        idcliente: body.idcliente,
        idveiculo: body.idveiculo,
        cliente_nome: body.cliente_nome,
        veiculo_info: body.veiculo_info,
        kmatual: body.kmatual,
        kmrodado: body.kmrodado,
        franquia: body.franquia,
        valor: body.valor,
        datainicial: new Date(body.datainicial),
        datafinal: new Date(body.datafinal),
        status: body.status
      }
    })
    
    const response = NextResponse.json(lease)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error updating lease:', error)
    const response = NextResponse.json({ 
      error: 'Failed to update lease', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// DELETE /api/leases/:id - Delete a lease
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Lease ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    await prisma.lease.delete({
      where: { id }
    })
    
    const response = NextResponse.json({ message: 'Lease deleted successfully' })
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error deleting lease:', error)
    const response = NextResponse.json({ 
      error: 'Failed to delete lease', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}