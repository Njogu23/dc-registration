// src/app/api/registrations/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const filter = searchParams.get('filter') || 'all'

    const where = {}
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { club: { contains: search, mode: 'insensitive' } },
        { confirmationCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (filter === 'confirmed') {
      where.paymentConfirmed = true
    } else if (filter === 'pending') {
      where.paymentConfirmed = false
    }

    const registrations = await prisma.registration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    )
  }
}