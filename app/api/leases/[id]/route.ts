import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

// PUT /api/leases/:id - Update a lease
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Lease ID is required' }, { status: 400 })
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
    
    return NextResponse.json(lease)
  } catch (error) {
    console.error('Error updating lease:', error)
    return NextResponse.json({ error: 'Failed to update lease' }, { status: 500 })
  }
}

// DELETE /api/leases/:id - Delete a lease
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Lease ID is required' }, { status: 400 })
    }
    
    await prisma.lease.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Lease deleted successfully' })
  } catch (error) {
    console.error('Error deleting lease:', error)
    return NextResponse.json({ error: 'Failed to delete lease' }, { status: 500 })
  }
}