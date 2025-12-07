import { prisma } from '@/lib/database/client'

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')
    
    await prisma.$connect()
    console.log('Connected successfully')
    
    // Test a simple query
    const count = await prisma.vehicle.count()
    console.log(`Found ${count} vehicles`)
    
    return new Response(JSON.stringify({ 
      status: 'Connected',
      vehicleCount: count
    }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('Connection failed:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      code: error.code
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}