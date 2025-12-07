import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

// PUT /api/parts/:id - Update a part
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Part ID is required' }, { status: 400 })
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
    
    return NextResponse.json(part)
  } catch (error) {
    console.error('Error updating part:', error)
    return NextResponse.json({ error: 'Failed to update part' }, { status: 500 })
  }
}

// DELETE /api/parts/:id - Delete a part
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Part ID is required' }, { status: 400 })
    }
    
    await prisma.part.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Part deleted successfully' })
  } catch (error) {
    console.error('Error deleting part:', error)
    return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 })
  }
}