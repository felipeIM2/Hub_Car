import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

// GET /api/leases - Get all leases
export async function GET() {
  try {
    const leases = await prisma.lease.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(leases)
  } catch (error) {
    console.error('Error fetching leases:', error)
    return NextResponse.json({ error: 'Failed to fetch leases' }, { status: 500 })
  }
}

// POST /api/leases - Create a new lease
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const lease = await prisma.lease.create({
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
    console.error('Error creating lease:', error)
    return NextResponse.json({ error: 'Failed to create lease' }, { status: 500 })
  }
}

