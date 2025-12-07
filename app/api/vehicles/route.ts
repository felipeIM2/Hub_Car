import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/vehicles - Get all vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const vehicle = await prisma.vehicle.create({
      data: {
        placa: body.placa,
        modelo: body.modelo,
        ano: body.ano,
        kmInicial: body.kmInicial,
        kmAtual: body.kmAtual,
        marca: body.marca,
        cor: body.cor,
        renavam: body.renavam
      }
    })
    
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 })
  }
}

