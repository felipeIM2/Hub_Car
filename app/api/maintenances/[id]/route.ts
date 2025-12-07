import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT /api/maintenances/:id - Update a maintenance
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Maintenance ID is required' }, { status: 400 })
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
    
    return NextResponse.json(maintenance)
  } catch (error) {
    console.error('Error updating maintenance:', error)
    return NextResponse.json({ error: 'Failed to update maintenance' }, { status: 500 })
  }
}

// DELETE /api/maintenances/:id - Delete a maintenance
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Maintenance ID is required' }, { status: 400 })
    }
    
    await prisma.maintenance.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Maintenance deleted successfully' })
  } catch (error) {
    console.error('Error deleting maintenance:', error)
    return NextResponse.json({ error: 'Failed to delete maintenance' }, { status: 500 })
  }
}