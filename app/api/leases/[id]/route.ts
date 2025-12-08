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

// PUT /api/leases/:id - Update a lease
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Lease ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    const body = await request.json()
    
    // Fetch the existing lease to check status changes
    const existingLease = await prisma.lease.findUnique({
      where: { id }
    });
    
    // Update the lease
    const lease = await prisma.lease.update({
      where: { id },
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
    
    // Handle KM updates based on status changes and kmrodado changes
    if (existingLease) {
      // If changing from Concluído to Ativo or Cancelado - subtract kmrodado
      if (existingLease.status === 'Concluído' && (body.status === 'Ativo' || body.status === 'Cancelado')) {
        const kmrodado = parseFloat(existingLease.kmrodado || '0') || 0;
        if (kmrodado > 0) {
          try {
            // Fetch the current vehicle data
            const vehicle = await prisma.vehicle.findUnique({
              where: { id: existingLease.idveiculo }
            });
            
            if (vehicle) {
              // Calculate new kmAtual value
              const currentKm = parseFloat(vehicle.kmAtual) || 0;
              const newKm = currentKm - kmrodado;
              
              // Update the vehicle with new kmAtual value
              await prisma.vehicle.update({
                where: { id: existingLease.idveiculo },
                data: {
                  kmAtual: newKm.toString()
                }
              });
            }
          } catch (vehicleError) {
            console.error('Error updating vehicle KM:', vehicleError);
            // Don't throw here as we still want to return the updated lease
          }
        }
      } 
      // If changing to Concluído - add kmrodado
      else if (existingLease.status !== 'Concluído' && body.status === 'Concluído') {
        const kmrodado = parseFloat(body.kmrodado || '0') || 0;
        if (kmrodado > 0) {
          try {
            // Fetch the current vehicle data
            const vehicle = await prisma.vehicle.findUnique({
              where: { id: body.idveiculo }
            });
            
            if (vehicle) {
              // Calculate new kmAtual value
              const currentKm = parseFloat(vehicle.kmAtual) || 0;
              const newKm = currentKm + kmrodado;
              
              // Update the vehicle with new kmAtual value
              await prisma.vehicle.update({
                where: { id: body.idveiculo },
                data: {
                  kmAtual: newKm.toString()
                }
              });
            }
          } catch (vehicleError) {
            console.error('Error updating vehicle KM:', vehicleError);
            // Don't throw here as we still want to return the updated lease
          }
        }
      }
      // If status remains Concluído but kmrodado value changed - adjust vehicle KM accordingly
      else if (existingLease.status === 'Concluído' && body.status === 'Concluído') {
        const oldKmrodado = parseFloat(existingLease.kmrodado || '0') || 0;
        const newKmrodado = parseFloat(body.kmrodado || '0') || 0;
        
        // Only update if the kmrodado value actually changed
        if (oldKmrodado !== newKmrodado && (oldKmrodado > 0 || newKmrodado > 0)) {
          try {
            // Fetch the current vehicle data
            const vehicle = await prisma.vehicle.findUnique({
              where: { id: body.idveiculo }
            });
            
            if (vehicle) {
              // Calculate the difference
              const kmDifference = newKmrodado - oldKmrodado;
              
              // Calculate new kmAtual value
              const currentKm = parseFloat(vehicle.kmAtual) || 0;
              const newKm = currentKm + kmDifference;
              
              // Update the vehicle with new kmAtual value
              await prisma.vehicle.update({
                where: { id: body.idveiculo },
                data: {
                  kmAtual: newKm.toString()
                }
              });
            }
          } catch (vehicleError) {
            console.error('Error updating vehicle KM:', vehicleError);
            // Don't throw here as we still want to return the updated lease
          }
        }
      }
    }
    
    const response = NextResponse.json(lease)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error updating lease:', error)
    const response = NextResponse.json({ 
      error: 'Failed to update lease', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// DELETE /api/leases/:id - Delete a lease
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      const response = NextResponse.json({ error: 'Lease ID is required' }, { status: 400 })
      return setCORSHeaders(response)
    }
    
    await prisma.lease.delete({
      where: { id }
    })
    
    const response = NextResponse.json({ message: 'Lease deleted successfully' })
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error deleting lease:', error)
    const response = NextResponse.json({ 
      error: 'Failed to delete lease', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}