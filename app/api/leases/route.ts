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

// GET /api/leases - Get all leases
export async function GET() {
  try {
    const leases = await prisma.lease.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const response = NextResponse.json(leases)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching leases:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch leases', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
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
    
    const response = NextResponse.json(lease)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error creating lease:', error)
    const response = NextResponse.json({ 
      error: 'Failed to create lease', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}