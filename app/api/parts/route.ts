import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

// GET /api/parts - Get all parts
export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(parts)
  } catch (error) {
    console.error('Error fetching parts:', error)
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 })
  }
}

// POST /api/parts - Create a new part
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const part = await prisma.part.create({
      data: {
        descricao: body.descricao,
        valor: parseFloat(body.valor),
        quantidade: parseInt(body.quantidade),
        utilizados: parseInt(body.utilizados)
      }
    })
    
    return NextResponse.json(part)
  } catch (error) {
    console.error('Error creating part:', error)
    return NextResponse.json({ error: 'Failed to create part' }, { status: 500 })
  }
}

