// src/app/api/attendance/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const { query } = await request.json()

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Please provide an email, confirmation code, or phone number.' },
        { status: 400 }
      )
    }

    const q = query.trim()

    // Search by email, confirmationCode, or telephone
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { email: { equals: q, mode: 'insensitive' } },
          { confirmationCode: { equals: q.toUpperCase(), mode: 'insensitive' } },
          { telephone: { equals: q } },
        ],
      },
    })

    if (!registration) {
      return NextResponse.json(
        { found: false, error: 'No registration found. You can register as a walk-in below.' },
        { status: 404 }
      )
    }

    // Mark attendance if not already marked
    let alreadyCheckedIn = false
    if (registration.attendedAt) {
      alreadyCheckedIn = true
    } else {
      await prisma.registration.update({
        where: { id: registration.id },
        data: { attendedAt: new Date() },
      })
    }

    return NextResponse.json({
      found: true,
      alreadyCheckedIn,
      participant: {
        fullName: registration.fullName,
        email: registration.email,
        club: registration.club,
        memberType: registration.memberType,
        confirmationCode: registration.confirmationCode,
        paymentConfirmed: registration.paymentConfirmed,
      },
    })
  } catch (error) {
    console.error('Attendance check-in error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}