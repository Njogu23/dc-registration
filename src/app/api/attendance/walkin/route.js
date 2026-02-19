// src/app/api/attendance/walkin/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getClubMembership } from '@/data/clubsData'

export async function POST(request) {
  try {
    const { fullName, email, club, memberType: clientMemberType } = await request.json()

    if (!fullName || !email || !club) {
      return NextResponse.json(
        { error: 'Full name, email, and club are required.' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Check if email is already registered
    const existing = await prisma.registration.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This email is already registered. Please check in using your email or confirmation code.' },
        { status: 409 }
      )
    }

    // Determine memberType: use client-provided if club is in both lists, otherwise infer
    const membership = getClubMembership(club)
    let memberType
    if (membership === 'both') {
      if (!clientMemberType) {
        return NextResponse.json(
          { error: 'Please select whether you are a Y\'s Men or YS Youth member.' },
          { status: 400 }
        )
      }
      memberType = clientMemberType
    } else {
      memberType = membership // "Y's Men", "YS Youth", or "Guest"
    }

    // Generate a walk-in confirmation code
    const confirmationCode =
      'WALK' +
      Date.now().toString(36).toUpperCase() +
      Math.random().toString(36).substring(2, 5).toUpperCase()

    const registration = await prisma.registration.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        club: club.trim(),
        designation: 'Walk-in',
        memberType,
        paymentType: 'Walk-in',
        paymentCode: 'WALKIN',
        confirmationCode,
        paymentConfirmed: true,
        emailSent: false,
        attendedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      participant: {
        fullName: registration.fullName,
        email: registration.email,
        club: registration.club,
        memberType: registration.memberType,
        confirmationCode: registration.confirmationCode,
        paymentConfirmed: true,
      },
    })
  } catch (error) {
    console.error('Walk-in registration error:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'This email is already registered.' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}