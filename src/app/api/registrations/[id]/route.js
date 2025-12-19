// src/app/api/registration/[id]/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const registration = await prisma.registration.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}