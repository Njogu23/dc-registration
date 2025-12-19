// api/registration/route.js
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';

    const where = {};
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { club: { contains: search, mode: 'insensitive' } },
        { confirmationCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filter === 'confirmed') {
      where.paymentConfirmed = true;
    } else if (filter === 'pending') {
      where.paymentConfirmed = false;
    }

    const registrations = await prisma.registration.findMany({
      where,
      orderBy: { registeredAt: 'desc' },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}