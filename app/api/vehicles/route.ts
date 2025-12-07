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
    // Test database connection first
    await prisma.$connect()
    
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const response = NextResponse.json(vehicles)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching vehicles:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to fetch vehicles'
    let errorStatus = 500
    
    if (error.code === 'P1001') {
      errorMessage = 'Cannot connect to database. Please check your connection settings.'
      errorStatus = 503
    } else if (error.code === 'P1013') {
      errorMessage = 'Invalid database connection string. Please check your DATABASE_URL.'
      errorStatus = 500
    } else if (error.message?.includes('Server selection timeout')) {
      errorMessage = 'Database connection timeout. The database server may be unavailable.'
      errorStatus = 503
    }
    
    const response = NextResponse.json({ 
      error: errorMessage, 
      message: error.message,
      code: error.code
    }, { status: errorStatus })
    return setCORSHeaders(response)
  }
}

// POST /api/vehicles - Create a new vehicle
export async function POST(request: Request) {
  try {
    // Test database connection first
    await prisma.$connect()
    
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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create vehicle'
    let errorStatus = 500
    
    if (error.code === 'P1001') {
      errorMessage = 'Cannot connect to database. Please check your connection settings.'
      errorStatus = 503
    } else if (error.code === 'P2002') {
      errorMessage = 'A vehicle with this plate already exists.'
      errorStatus = 409
    } else if (error.message?.includes('Server selection timeout')) {
      errorMessage = 'Database connection timeout. The database server may be unavailable.'
      errorStatus = 503
    }
    
    const response = NextResponse.json({ 
      error: errorMessage, 
      message: error.message,
      code: error.code
    }, { status: errorStatus })
    return setCORSHeaders(response)
  }
}