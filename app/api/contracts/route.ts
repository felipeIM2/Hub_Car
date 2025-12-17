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

// GET /api/contracts - Get all contracts
export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    const response = NextResponse.json(contracts)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error fetching contracts:', error)
    const response = NextResponse.json({ 
      error: 'Failed to fetch contracts', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}

// POST /api/contracts - Create a new contract
export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const contract = await prisma.contract.create({
      data: {
        idcliente: body.idcliente,
        idveiculo: body.idveiculo,
        cliente_nome: body.cliente_nome,
        data_inicio: new Date(body.data_inicio),
        data_final: new Date(body.data_final),
        contrato_modelo: body.contrato_modelo,
        hora_entrega: body.hora_entrega,
        valor_locacao: parseFloat(body.valor_locacao),
        franquia: body.franquia,
        caucao: body.caucao,
        numero_contrato: parseInt(body.numero_contrato),
        testemunha_nome: body.testemunha_nome,
        testemunha_cpf: body.testemunha_cpf
      }
    })
    
    const response = NextResponse.json(contract)
    return setCORSHeaders(response)
  } catch (error: any) {
    console.error('Error creating contract:', error)
    const response = NextResponse.json({ 
      error: 'Failed to create contract', 
      message: error.message,
      code: error.code
    }, { status: 500 })
    return setCORSHeaders(response)
  }
}