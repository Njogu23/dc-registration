// src/lib/emailService.js

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
  console.warn('Nodemailer not configured')
}

export async function sendConfirmationEmail(registration) {
  if (!transporter) {
    console.log('📧 Confirmation email would be sent to:', registration.email)
    return { status: 'logged' }
  }

  try {
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">✅ Registration Confirmed!</h2>
        <p>Dear ${registration.fullName},</p>
        <p>Great news! Your payment has been verified and your registration is now <strong>confirmed</strong>.</p>
        
        <div style="background: #d1fae5; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #065f46;">Your Confirmation Code</h3>
          <p style="font-size: 24px; font-weight: bold; color: #065f46; font-family: monospace; letter-spacing: 2px; margin: 10px 0;">
            ${registration.confirmationCode}
          </p>
          <p style="color: #065f46; margin-bottom: 0; font-size: 14px;">Please save this code. You will need it at the venue.</p>
        </div>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Event Details</h3>
          <p><strong>📅 Date:</strong> 20th - 21st February 2026</p>
          <p><strong>📍 Venue:</strong> Sky Beach Resort, Kisumu</p>
          <p><strong>💳 Payment Reference:</strong> ${registration.paymentCode}</p>
        </div>
        
        <div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Registration Details</h3>
          <p><strong>Name:</strong> ${registration.fullName}</p>
          <p><strong>Email:</strong> ${registration.email}</p>
          <p><strong>Designation:</strong> ${registration.designation || 'N/A'}</p>
          <p><strong>Club:</strong> ${registration.club === 'Other' && registration.otherClub ? `${registration.club} (${registration.otherClub})` : registration.club}</p>
          <p><strong>Member Type:</strong> ${registration.memberType}</p>
          <p><strong>Payment Type:</strong> ${registration.paymentType}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>⚠️ Important:</strong> Please bring this confirmation code and your payment receipt to the venue for check-in.</p>
        </div>
        
        <p>We look forward to seeing you at the conference!</p>
        <p>Best regards,<br>Kenya District Y's Men International</p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@example.com',
      to: registration.email,
      subject: '✅ Payment Confirmed - Y\'s Men District Conference 2026',
      html: emailContent,
    })

    return { status: 'sent' }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    return { status: 'failed', error: error.message }
  }
}