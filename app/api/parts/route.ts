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

// GET /api/parts - Get all parts
export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const response = NextResponse.json(parts)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching parts:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch parts', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// POST /api/parts - Create a new part
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const part = await prisma.part.create({
      data: {
        descricao: body.descricao,
        valor: parseFloat(body.valor),
        quantidade: parseInt(body.quantidade),
        utilizados: parseInt(body.utilizados)
      }
    })
    
    const response = NextResponse.json(part)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error creating part:', error)
    const response = NextResponse.json({ 
      error: 'Failed to create part', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}