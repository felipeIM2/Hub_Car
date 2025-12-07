import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

// GET /api/vehicles/:id - Get a single vehicle
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 })
    }
    
    const vehicle = await prisma.vehicle.findUnique({
      where: { id }
    })
    
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }
    
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json({ error: 'Failed to fetch vehicle' }, { status: 500 })
  }
}

// PUT /api/vehicles/:id - Update a vehicle
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 })
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
    
    return NextResponse.json(vehicle)
  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 })
  }
}

// DELETE /api/vehicles/:id - Delete a vehicle
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: 'Vehicle ID is required' }, { status: 400 })
    }
    
    await prisma.vehicle.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 })
  }
}