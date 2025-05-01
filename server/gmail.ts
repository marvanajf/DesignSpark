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
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #1a1a27;
      padding: 20px;
      text-align: center;
    }
    .header img {
      max-width: 150px;
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .footer {
      background-color: #f7f7f7;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    .button {
      display: inline-block;
      background-color: #74d1ea;
      color: #ffffff;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 4px;
      margin-top: 15px;
    }
    h1 {
      color: #1a1a27;
    }
    .accent {
      color: #74d1ea;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://tovably.com/logo.png" alt="Tovably Logo" />
    </div>
    <div class="content">
      <h1>Thank you for reaching out, <span class="accent">${name}</span></h1>
      <p>We've received your inquiry and we're excited to connect with you.</p>
      <p>Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.</p>
      <p>In the meantime, feel free to explore our website to learn more about how Tovably can help revolutionize your marketing communications.</p>
      <a href="https://tovably.com" class="button">Visit Our Website</a>
      <p>Best regards,<br>The Tovably Team</p>
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