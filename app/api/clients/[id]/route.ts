import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

// PUT /api/clients/:id - Update a client
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
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
    
    return NextResponse.json(client)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json({ error: 'Failed to update client' }, { status: 500 })
  }
}

// DELETE /api/clients/:id - Delete a client
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Client ID is required' }, { status: 400 })
    }
    
    await prisma.client.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Client deleted successfully' })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json({ error: 'Failed to delete client' }, { status: 500 })
  }
}