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

// GET /api/maintenances - Get all maintenances
export async function GET() {
  try {
    const maintenances = await prisma.maintenance.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const response = NextResponse.json(maintenances)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching maintenances:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch maintenances', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
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
    
    const response = NextResponse.json(maintenance)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error creating maintenance:', error)
    const response = NextResponse.json({ 
      error: 'Failed to create maintenance', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}