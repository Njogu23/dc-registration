// src/app/api/register/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const { participants, paymentCode } = await request.json();
    
    // Generate unique confirmation code
    const confirmationCode = 'YMI' + Date.now().toString(36).toUpperCase() + 
      Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Create all registrations
    const registrations = await Promise.all(
      participants.map((p) =>
        prisma.registration.create({
          data: {
            fullName: p.fullName,
            email: p.email,
            designation: p.designation,
            memberType: p.memberType,
            club: p.club,
            paymentType: p.paymentType,
            paymentCode,
            confirmationCode,
          },
        })
      )
    );

    // Send confirmation emails
    for (const participant of participants) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: participant.email,
        subject: 'Registration Confirmation - Y\'s Men District Conference 2026',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Registration Confirmed!</h2>
            <p>Dear ${participant.fullName},</p>
            <p>Thank you for registering for the Kenya District Y's Men International District Conference and Youth Convocation.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Event Details</h3>
              <p><strong>Date:</strong> 20th - 21st February 2026</p>
              <p><strong>Venue:</strong> Sky Beach Resort, Kisumu</p>
              <p><strong>Confirmation Code:</strong> ${confirmationCode}</p>
            </div>
            
            <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Registration Details</h3>
              <p><strong>Name:</strong> ${participant.fullName}</p>
              <p><strong>Email:</strong> ${participant.email}</p>
              <p><strong>Club:</strong> ${participant.club}</p>
              <p><strong>Member Type:</strong> ${participant.memberType}</p>
              <p><strong>Payment Type:</strong> ${participant.paymentType}</p>
              <p><strong>Payment Reference:</strong> ${paymentCode}</p>
            </div>
            
            <p>We look forward to seeing you at the conference!</p>
            <p>Best regards,<br>Kenya District Y's Men International</p>
          </div>
        `,
      });
    }

    // Update email sent status
    await prisma.registration.updateMany({
      where: { confirmationCode },
      data: { emailSent: true },
    });

    return NextResponse.json({ 
      success: true, 
      confirmationCode,
      registrations 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}