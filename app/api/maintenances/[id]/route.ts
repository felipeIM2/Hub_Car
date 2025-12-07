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

// PUT /api/maintenances/:id - Update a maintenance
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Maintenance ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const body = await request.json()
    
    const maintenance = await prisma.maintenance.update({
      where: { id },
      data: {
        idveiculo: body.idveiculo,
        veiculo: body.veiculo,
        placa: body.placa,
        datainicio: new Date(body.datainicio),
        datafinal: new Date(body.datafinal),
        valorManutencao: parseFloat(body.valorManutencao),
        valorServico: parseFloat(body.valorServico),
        total: parseFloat(body.total),
        status: body.status,
        descricao: body.descricao,
        pecas: body.pecas
      }
    })
    
    const response = NextResponse.json(maintenance)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error updating maintenance:', error)
    const response = NextResponse.json({ 
      error: 'Failed to update maintenance', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// DELETE /api/maintenances/:id - Delete a maintenance
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Maintenance ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    await prisma.maintenance.delete({
      where: { id }
    })
    
    const response = NextResponse.json({ message: 'Maintenance deleted successfully' })
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error deleting maintenance:', error)
    const response = NextResponse.json({ 
      error: 'Failed to delete maintenance', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}