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

// GET /api/clients - Get all clients
export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const response = NextResponse.json(clients)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch clients', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// POST /api/clients - Create a new client
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const client = await prisma.client.create({
      data: {
        nome: body.nome,
        cpf: body.cpf,
        rg: body.rg,
        email: body.email,
        telefone: body.telefone,
        endereco: body.endereco,
        numero: body.numero,
        semNumero: body.semNumero,
        complemento: body.complemento,
        bairro: body.bairro,
        cidade: body.cidade,
        estado: body.estado,
        cep: body.cep
      }
    })
    
    const response = NextResponse.json(client)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error creating client:', error)
    const response = NextResponse.json({ 
      error: 'Failed to create client', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}