import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';


dotenv.config();

const prisma = new PrismaClient();
const { hash } = bcrypt;

async function main() {
  try {
    const adminRole = await prisma.role.findUnique({
      where: { role: 'ADMIN' },
    });

    if (!adminRole) {
      await prisma.role.create({
        data: { role: 'ADMIN' },
      });
      console.log('Role ADMIN berhasil dibuat.');
    } else {
      console.log('Role ADMIN sudah ada dalam database.');
    }

    
    const customerRole = await prisma.role.findUnique({
      where: { role: 'CUSTOMER' },
    });

    if (!customerRole) {
      await prisma.role.create({
        data: { role: 'CUSTOMER' },
      });
      console.log('Role CUSTOMER berhasil dibuat.');
    } else {
      console.log('Role CUSTOMER sudah ada dalam database.');
    }

    const merchantRole = await prisma.role.findUnique({
      where: { role: 'MERCHANT' },
    });

    if (!merchantRole) {
      await prisma.role.create({
        data: { role: 'MERCHANT' },
      });
      console.log('Role MERCHANT berhasil dibuat.');
    } else {
      console.log('Role MERCHANT sudah ada dalam database.');
    }

    // Membuat user Admin Super jika belum ada
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'supmin' },
    });

    if (!existingAdmin) {
      const hashedPassword = await hash('password', 10);
      await prisma.user.create({
        data: {
          username: 'supmin',
          password: hashedPassword,
          roleUser: {
            create: {
              role: { connect: { role: 'ADMIN' } },
            },
          },
        },
      });
      console.log('User Admin Super berhasil dibuat.');
    } else {
      console.log('User Admin Super sudah ada dalam database.');
    }

    console.log('Seeder untuk roles, users, dan user_roles berhasil dijalankan!');
  } catch (error) {
    console.error('Seeder roles, users, dan user_roles error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
