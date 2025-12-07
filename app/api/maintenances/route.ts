import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/maintenances - Get all maintenances
export async function GET() {
  try {
    const maintenances = await prisma.maintenance.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(maintenances)
  } catch (error) {
    console.error('Error fetching maintenances:', error)
    return NextResponse.json({ error: 'Failed to fetch maintenances' }, { status: 500 })
  }
}

// POST /api/maintenances - Create a new maintenance
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const maintenance = await prisma.maintenance.create({
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
    console.error('Error creating maintenance:', error)
    return NextResponse.json({ error: 'Failed to create maintenance' }, { status: 500 })
  }
}

