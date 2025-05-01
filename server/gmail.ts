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
  // Base64 encoded Tovably logo (you can replace this with your actual logo)
  const logoBase64 = `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`;
  
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
      padding: 20px;
      text-align: center;
    }
    .header img {
      max-width: 150px;
      height: auto;
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
      <!-- Using embedded Base64 logo instead of external URL -->
      <img src="data:image/png;base64,${logoBase64}" alt="Tovably Logo" />
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