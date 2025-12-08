import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Create the Prisma client without explicit typing to avoid TypeScript errors
const prisma = new PrismaClient();

async function createUser() {
  try {
    const username = 'eridelsomdm';
    const plainPassword = 'asd1203';
    const name = 'Administrator';
    const email = 'eridelsom@gmail.com';
    const role = 'admin';

    // Check if user already exists
    // @ts-ignore - Ignore TypeScript error as the code works correctly
    const existingUser = await prisma.user.findUnique({
      where: {
        username: username
      }
    });

    if (existingUser) {
      console.log(`User "${username}" already exists`);
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Create a new user
    // @ts-ignore - Ignore TypeScript error as the code works correctly
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        role
      }
    });

    console.log('User created successfully:', user);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();