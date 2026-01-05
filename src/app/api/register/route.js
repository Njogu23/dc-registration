// src/app/api/register/route.js

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// Only import nodemailer if SMTP is configured
let transporter
try {
  const nodemailer = require('nodemailer')
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })
} catch (error) {
  console.warn('Nodemailer not configured, emails will be logged instead')
}

export async function POST(request) {
  try {
    const { participants, paymentCode } = await request.json()
    
    // Validate input
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      return NextResponse.json(
        { error: 'At least one participant is required' },
        { status: 400 }
      )
    }

    if (!paymentCode || paymentCode.trim() === '') {
      return NextResponse.json(
        { error: 'Payment code is required' },
        { status: 400 }
      )
    }

    // Validate each participant
    for (const participant of participants) {
      if (!participant.fullName || !participant.email || !participant.telephone || 
          !participant.profession || !participant.residentialAddress || !participant.club) {
        return NextResponse.json(
          { error: 'All required fields must be filled for each participant' },
          { status: 400 }
        )
      }
    }

    // Extract and normalize all emails
    const emails = participants.map(p => p.email.trim().toLowerCase())

    // Check for duplicate emails within the submission
    const emailSet = new Set(emails)
    if (emailSet.size !== emails.length) {
      return NextResponse.json(
        { error: 'You have duplicate emails in your submission. Each participant must have a unique email address.' },
        { status: 400 }
      )
    }

    // Check for existing registrations in database
    const existingRegistrations = await prisma.registration.findMany({
      where: {
        email: {
          in: emails
        }
      },
      select: {
        email: true,
        fullName: true,
        confirmationCode: true
      }
    })

    // If any emails already exist, return detailed error
    if (existingRegistrations.length > 0) {
      const duplicateDetails = existingRegistrations.map(r => 
        `${r.fullName} (${r.email})`
      ).join(', ')
      
      return NextResponse.json(
        { 
          error: `The following participant(s) are already registered: ${duplicateDetails}. Please use different email addresses or contact support if you believe this is an error.`,
          duplicates: existingRegistrations.map(r => ({
            email: r.email,
            name: r.fullName,
            confirmationCode: r.confirmationCode
          }))
        },
        { status: 409 }
      )
    }

    // Generate unique confirmation code
    const confirmationCode = 'YMI' + 
      Date.now().toString(36).toUpperCase() + 
      Math.random().toString(36).substring(2, 6).toUpperCase()

    // Create registrations in database
    const registrations = []
    for (const participant of participants) {
      const registration = await prisma.registration.create({
        data: {
          fullName: participant.fullName.trim(),
          email: participant.email.trim().toLowerCase(),
          telephone: participant.telephone?.trim() || null,
          profession: participant.profession?.trim() || null,
          residentialAddress: participant.residentialAddress?.trim() || null,
          designation: participant.designation?.trim() || '',
          memberType: participant.memberType,
          club: participant.club,
          otherClub: participant.club === 'Other' ? participant.otherClub?.trim() : null,
          paymentType: participant.paymentType,
          paymentCode: paymentCode.trim(),
          confirmationCode,
          emailSent: false,
          paymentConfirmed: false,
        }
      })
      registrations.push(registration)
    }

    // Send initial registration emails (pending confirmation)
    const emailResults = []
    for (const registration of registrations) {
      try {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #f59e0b;">Registration Received - Pending Confirmation</h2>
            <p>Dear ${registration.fullName},</p>
            <p>Thank you for submitting your registration for the Kenya District Y's Men International District Conference and Youth Convocation.</p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #92400e;">⏳ Pending Payment Confirmation</h3>
              <p style="color: #92400e; margin-bottom: 0;">Your registration is currently being reviewed. You will receive a confirmation email with your registration code once your payment has been verified by our admin team.</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Event Details</h3>
              <p><strong>Date:</strong> 20th - 21st February 2026</p>
              <p><strong>Venue:</strong> Sky Beach Resort, Kisumu</p>
              <p><strong>Payment Reference:</strong> ${paymentCode}</p>
            </div>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Registration Details</h3>
              <p><strong>Name:</strong> ${registration.fullName}</p>
              <p><strong>Email:</strong> ${registration.email}</p>
              <p><strong>Telephone:</strong> ${registration.telephone || 'N/A'}</p>
              <p><strong>Profession:</strong> ${registration.profession || 'N/A'}</p>
              <p><strong>Address:</strong> ${registration.residentialAddress || 'N/A'}</p>
              <p><strong>Designation:</strong> ${registration.designation || 'N/A'}</p>
              <p><strong>Club:</strong> ${registration.club}</p>
              <p><strong>Member Type:</strong> ${registration.memberType}</p>
              <p><strong>Payment Type:</strong> ${registration.paymentType}</p>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Our team will verify your payment</li>
              <li>You will receive a confirmation email within 24-48 hours</li>
              <li>The confirmation email will contain your registration code</li>
            </ul>
            
            <p>If you have any questions, please contact us.</p>
            <p>Best regards,<br>Kenya District Y's Men International</p>
          </div>
        `

        if (transporter) {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@example.com',
            to: registration.email,
            subject: 'Registration Received - Pending Confirmation',
            html: emailContent,
          })
          
          emailResults.push({ email: registration.email, status: 'sent', type: 'participant' })
        } else {
          console.log('📧 Participant email would be sent to:', registration.email)
          emailResults.push({ email: registration.email, status: 'logged', type: 'participant' })
        }
      } catch (emailError) {
        console.error('Failed to send email to:', registration.email, emailError)
        emailResults.push({ 
          email: registration.email, 
          status: 'failed', 
          error: emailError.message,
          type: 'participant'
        })
      }
    }

    // Send admin notification email
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail && transporter) {
      try {
        const participantsList = registrations.map(r => 
          `<tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${r.fullName}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${r.email}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${r.telephone || 'N/A'}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${r.club}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${r.memberType}</td>
          </tr>`
        ).join('')

        const adminEmailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
            <h2 style="color: #2563eb;">🔔 New Registration Received</h2>
            <p>A new registration has been submitted and requires payment confirmation.</p>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Registration Summary</h3>
              <p><strong>Confirmation Code:</strong> <span style="font-family: monospace; font-size: 18px;">${confirmationCode}</span></p>
              <p><strong>Payment Reference:</strong> ${paymentCode}</p>
              <p><strong>Number of Participants:</strong> ${registrations.length}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-KE')}</p>
            </div>
            
            <h3>Participants:</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Name</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Email</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Phone</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Club</th>
                  <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Type</th>
                </tr>
              </thead>
              <tbody>
                ${participantsList}
              </tbody>
            </table>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Action Required:</strong> Please verify the payment and confirm the registration in the admin panel.</p>
            </div>
            
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/district-conference-list" 
               style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
              Go to Admin Panel
            </a></p>
          </div>
        `

        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@example.com',
          to: adminEmail,
          subject: `New Registration - ${confirmationCode} (${registrations.length} participant${registrations.length > 1 ? 's' : ''})`,
          html: adminEmailContent,
        })
        
        emailResults.push({ email: adminEmail, status: 'sent', type: 'admin' })
      } catch (emailError) {
        console.error('Failed to send admin notification:', emailError)
        emailResults.push({ 
          email: adminEmail, 
          status: 'failed', 
          error: emailError.message,
          type: 'admin'
        })
      }
    } else {
      console.log('📧 Admin notification would be sent (ADMIN_EMAIL not configured)')
      emailResults.push({ email: 'admin', status: 'not_configured', type: 'admin' })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully registered ${registrations.length} participant(s)`,
      confirmationCode,
      emailResults
    })

  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A participant with this email is already registered. Please use a different email address.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Registration failed. Please try again.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}