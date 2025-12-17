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

// PUT /api/contracts/:id - Update a contract
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Contract ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const body = await request.json()
    
    const contract = await prisma.contract.update({
      where: { id },
      data: {
        idcliente: body.idcliente,
        idveiculo: body.idveiculo,
        cliente_nome: body.cliente_nome,
        data_inicio: new Date(body.data_inicio),
        data_final: new Date(body.data_final),
        contrato_modelo: body.contrato_modelo,
        hora_entrega: body.hora_entrega,
        valor_locacao: parseFloat(body.valor_locacao),
        franquia: body.franquia,
        caucao: body.caucao,
        numero_contrato: parseInt(body.numero_contrato),
        testemunha_nome: body.testemunha_nome,
        testemunha_cpf: body.testemunha_cpf
      }
    })
    
    const response = NextResponse.json(contract)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error updating contract:', error)
    const response = NextResponse.json({ 
      error: 'Failed to update contract', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// DELETE /api/contracts/:id - Delete a contract
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Contract ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    await prisma.contract.delete({
      where: { id }
    })
    
    const response = NextResponse.json({ message: 'Contract deleted successfully' })
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error deleting contract:', error)
    const response = NextResponse.json({ 
      error: 'Failed to delete contract', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}