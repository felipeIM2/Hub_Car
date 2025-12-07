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

// GET /api/vehicles/:id - Get a single vehicle
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    })
    
    if (!vehicle) {
      const response = NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
      return setCORSHeaders(response)
    }
    
    const response = NextResponse.json(vehicle)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching vehicle:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch vehicle', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// PUT /api/vehicles/:id - Update a vehicle
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const body = await request.json()
    
    const vehicle = await prisma.vehicle.update({
      where: { id },
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
    console.error('Error updating vehicle:', error)
    const response = NextResponse.json({ 
      error: 'Failed to update vehicle', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// DELETE /api/vehicles/:id - Delete a vehicle
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    await prisma.vehicle.delete({
      where: { id }
    })
    
    const response = NextResponse.json({ message: 'Vehicle deleted successfully' })
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error deleting vehicle:', error)
    const response = NextResponse.json({ 
      error: 'Failed to delete vehicle', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}