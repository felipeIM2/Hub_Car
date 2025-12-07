import { NextResponse } from 'next/server'
import { prisma } from '@/lib/database/client'

// GET /api/contracts - Get all contracts
export async function GET() {
  try {
    const contracts = await prisma.contract.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 })
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
        numero_contrato: parseInt(body.numero_contrato)
      }
    })
    
    return NextResponse.json(contract)
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 })
  }
}

