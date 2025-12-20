// lib/prisma.js
const { PrismaClient } = require('@prisma/client')

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({
    log: ['error'],
  })
} else {
  // In development, prevent multiple instances
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }
  prisma = global.prisma
}

// Test connection on startup
prisma.$connect()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection failed:', err))

module.exports = prisma