require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  })

  try {
    console.log('Testing database connection...')
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL)
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test a simple query
    const vehicles = await prisma.vehicle.findMany({
      take: 1
    })
    console.log('✅ Sample query successful:', vehicles.length, 'records found')
    
    await prisma.$disconnect()
    console.log('✅ Disconnected from database')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Error code:', error.code)
    console.error('Error meta:', error.meta)
    process.exit(1)
  }
}

testConnection()