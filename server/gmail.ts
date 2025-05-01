import nodemailer from 'nodemailer';

// For Gmail, you need to use an "app password" - not your regular Gmail password
// To create an app password:
// 1. Enable 2-step verification on your Google account
// 2. Go to https://myaccount.google.com/apppasswords
// 3. Generate a password for "Mail" and "Other (Custom name)" - call it something like "Tovably"

// This will be populated with the actual credentials later
let transporter: nodemailer.Transporter | null = null;
let senderEmail: string = '';

export function initializeGmailTransport(email: string, password: string) {
  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password // This should be an app password, not your regular password
      }
    });
    
    senderEmail = email;
    console.log('Gmail transport initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Gmail transport:', error);
    return false;
  }
}

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export async function sendGmailEmail(params: EmailParams): Promise<boolean> {
  if (!transporter) {
    console.error('Gmail transporter not initialized');
    return false;
  }
  
  try {
    await transporter.sendMail({
      from: params.from || `Tovably <${senderEmail}>`,
      to: params.to,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    
    console.log('Email sent successfully via Gmail');
    return true;
  } catch (error) {
    console.error('Gmail email error:', error);
    return false;
  }
}

// Template for sending thank you emails to contacts
export function createThankYouEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Tovably</title>
  <!-- Import Open Sans font -->
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Open Sans', Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #1a1a27;
      padding: 30px;
      text-align: center;
    }
    .logo-text {
      font-family: 'Open Sans', Arial, sans-serif;
      font-weight: 600;
      font-size: 28px;
      color: #ffffff;
      text-transform: lowercase;
      letter-spacing: 1px;
    }
    .logo-accent {
      color: #74d1ea;
    }
    .content {
      padding: 30px;
      background-color: #ffffff;
    }
    .footer {
      background-color: #f5f5f7;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    .button {
      display: inline-block;
      background-color: #74d1ea;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      margin-top: 20px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .button:hover {
      background-color: #5ec7e2;
    }
    h1 {
      color: #1a1a27;
      font-weight: 700;
      margin-bottom: 20px;
      font-size: 24px;
      line-height: 1.3;
    }
    .accent {
      color: #74d1ea;
    }
    p {
      margin-bottom: 16px;
      font-size: 15px;
    }
    .signature {
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <!-- Text-based logo instead of image -->
      <div class="logo-text">tov<span class="logo-accent">ably</span></div>
    </div>
    <div class="content">
      <h1>Thank you for reaching out, <span class="accent">${name}</span></h1>
      <p>We've received your inquiry and we're excited to connect with you.</p>
      <p>Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.</p>
      <p>In the meantime, feel free to explore our website to learn more about how Tovably can help revolutionize your marketing communications.</p>
      <a href="https://tovably.com" class="button">Visit Our Website</a>
      <div class="signature">
        <p>Best regards,<br><strong>The Tovably Team</strong></p>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Tovably. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function createThankYouEmailText(name: string): string {
  return `
Thank you for reaching out, ${name}

We've received your inquiry and we're excited to connect with you.

Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.

In the meantime, feel free to explore our website to learn more about how Tovably can help revolutionize your marketing communications.

Visit Our Website: https://tovably.com

Best regards,
The Tovably Team

© ${new Date().getFullYear()} Tovably. All rights reserved.
This is an automated message, please do not reply to this email.
  `;
}