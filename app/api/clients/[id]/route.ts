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

// PUT /api/clients/:id - Update a client
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const body = await request.json()
    
    const client = await prisma.client.update({
      where: { id },
      data: {
        nome: body.nome,
        cpf: body.cpf,
        rg: body.rg,
        email: body.email,
        telefone: body.telefone,
        endereco: body.endereco,
        numero: body.numero,
        semNumero: body.semNumero,
        complemento: body.complemento,
        bairro: body.bairro,
        cidade: body.cidade,
        estado: body.estado,
        cep: body.cep
      }
    })
    
    const response = NextResponse.json(client)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error updating client:', error)
    const response = NextResponse.json({ 
      error: 'Failed to update client', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// DELETE /api/clients/:id - Delete a client
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    await prisma.client.delete({
      where: { id }
    })
    
    const response = NextResponse.json({ message: 'Client deleted successfully' })
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error deleting client:', error)
    const response = NextResponse.json({ 
      error: 'Failed to delete client', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}