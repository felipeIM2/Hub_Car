import { prisma } from './lib/database/client'

async function diagnoseConnection() {
  console.log('🔍 Diagnosing database connection...\n')
  
  try {
    console.log('1. Checking environment variables...')
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL is not set in environment variables')
      process.exit(1)
    }
    console.log('✅ DATABASE_URL is set')
    
    // Mask the password for security
    const maskedUrl = process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//********:********@')
    console.log('   Database URL:', maskedUrl)
    
    console.log('\n2. Testing database connection...')
    await prisma.$connect()
    console.log('✅ Successfully connected to database')
    
    console.log('\n3. Testing simple query...')
    const count = await prisma.vehicle.count()
    console.log(`✅ Query successful. Found ${count} vehicles in database`)
    
    console.log('\n4. Testing findMany query...')
    const vehicles = await prisma.vehicle.findMany({
      take: 3,
      select: {
        id: true,
        placa: true,
        marca: true,
        modelo: true
      }
    })
    console.log(`✅ findMany query successful. Sample vehicles:`, vehicles)
    
    console.log('\n5. Disconnecting...')
    await prisma.$disconnect()
    console.log('✅ Disconnected successfully')
    
    console.log('\n🎉 All tests passed! Database connection is working properly.')
  } catch (error: any) {
    console.error('\n❌ Database connection test failed:')
    console.error('   Error:', error.message)
    console.error('   Code:', error.code)
    
    if (error.meta) {
      console.error('   Meta:', JSON.stringify(error.meta, null, 2))
    }
    
    // Specific error handling
    if (error.code === 'P1001') {
      console.error('\n💡 Troubleshooting tips:')
      console.error('   - Check if your MongoDB Atlas cluster is running')
      console.error('   - Verify your IP address is whitelisted in MongoDB Atlas')
      console.error('   - Ensure your username and password are correct')
    } else if (error.code === 'P1013') {
      console.error('\n💡 Troubleshooting tips:')
      console.error('   - Check your DATABASE_URL format')
      console.error('   - Ensure the hostname is correct')
    } else if (error.message?.includes('Server selection timeout')) {
      console.error('\n💡 Troubleshooting tips:')
      console.error('   - Check your MongoDB Atlas cluster status')
      console.error('   - Verify your IP whitelist settings')
      console.error('   - Ensure your network allows outbound connections to MongoDB')
      console.error('   - Check if your MongoDB Atlas cluster is paused')
    }
    
    process.exit(1)
  }
}

diagnoseConnection()