// src/app/api/attendees/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const where = {
      attendedAt: { not: null },
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { club: { contains: search, mode: 'insensitive' } },
        { memberType: { contains: search, mode: 'insensitive' } },
      ]
    }

    const attendees = await prisma.registration.findMany({
      where,
      orderBy: { attendedAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        club: true,
        memberType: true,
        designation: true,
        attendedAt: true,
      },
    })

    return NextResponse.json(attendees)
  } catch (error) {
    console.error('Attendees fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch attendees' },
      { status: 500 }
    )
  }
}