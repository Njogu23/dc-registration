// src/app/api/registrations/[id]/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendConfirmationEmail } from '@/lib/emailService'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Get current registration to check previous state
    const currentRegistration = await prisma.registration.findUnique({
      where: { id }
    })

    if (!currentRegistration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }

    // Only allow updating specific fields
    const allowedFields = ['paymentConfirmed', 'emailSent']
    const updateData = {}
    
    for (const field of allowedFields) {
      if (body.hasOwnProperty(field)) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Update the registration
    const registration = await prisma.registration.update({
      where: { id },
      data: updateData,
    })

    // If payment is being confirmed (changing from false to true), send confirmation email
    if (body.paymentConfirmed === true && currentRegistration.paymentConfirmed === false) {
      console.log('💡 Payment confirmed for:', registration.email, '- Sending confirmation email...')
      
      const emailResult = await sendConfirmationEmail(registration)
      console.log('📧 Email result:', emailResult)
      
      // Update email sent status if email was sent successfully
      if (emailResult.status === 'sent' || emailResult.status === 'logged') {
        await prisma.registration.update({
          where: { id },
          data: { emailSent: true }
        })
        registration.emailSent = true
        console.log('✅ Email sent status updated')
      } else {
        console.error('❌ Email failed:', emailResult)
      }
    }

    return NextResponse.json(registration)
  } catch (error) {
    console.error('Update error:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    )
  }
}