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

// GET /api/vehicles - Get all vehicles
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const response = NextResponse.json(vehicles)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching vehicles:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch vehicles', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
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
    
    const response = NextResponse.json(vehicle)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error creating vehicle:', error)
    const response = NextResponse.json({ 
      error: 'Failed to create vehicle', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}