import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

// PUT /api/contracts/:id - Update a contract
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Contract ID is required' }, { status: 400 })
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
        numero_contrato: parseInt(body.numero_contrato)
      }
    })
    
    return NextResponse.json(contract)
  } catch (error) {
    console.error('Error updating contract:', error)
    return NextResponse.json({ error: 'Failed to update contract' }, { status: 500 })
  }
}

// DELETE /api/contracts/:id - Delete a contract
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Contract ID is required' }, { status: 400 })
    }
    
    await prisma.contract.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Contract deleted successfully' })
  } catch (error) {
    console.error('Error deleting contract:', error)
    return NextResponse.json({ error: 'Failed to delete contract' }, { status: 500 })
  }
}