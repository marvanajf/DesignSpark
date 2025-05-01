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
      // Adding headers to help prevent email clipping and improve rendering
      headers: {
        'X-Entity-Ref-ID': `tovably-contact-${Date.now()}`, // Unique reference ID
        'X-Auto-Response-Suppress': 'OOF, AutoReply',
        'Precedence': 'bulk',
        'Importance': 'high',
        'X-Priority': '1',
        'X-MSMail-Priority': 'High'
      }
    });
    
    console.log('Email sent successfully via Gmail');
    return true;
  } catch (error) {
    console.error('Gmail email error:', error);
    return false;
  }
}

// Template for sending thank you emails to contacts
export function createThankYouEmailHtml(name: string, isLaunchNotification = false): string {
  // Create different content based on whether this is a launch notification
  let heading = `Thank you for reaching out, <span class="accent">${name}</span>`;
  let paragraphs = [
    `We've received your inquiry and we're excited to connect with you.`,
    `Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.`,
    `In the meantime, feel free to explore our website to learn more about how Tovably can help revolutionize your marketing communications.`
  ];
  let buttonText = 'Visit Our Website';
  let preheaderText = 'Thank you for contacting Tovably. We\'ve received your message and will get back to you within 24-48 hours.';
  
  if (isLaunchNotification) {
    heading = `You're on the Tovably waiting list, <span class="accent">${name}</span>!`;
    paragraphs = [
      `Thank you for your interest in Tovably! We've added you to our early access waiting list.`,
      `You'll be among the first to know when we launch and will receive exclusive benefits as an early supporter.`,
      `We're working hard to bring you a revolutionary AI platform for content creation and tone analysis that will transform how you communicate with your audience.`
    ];
    buttonText = 'Learn More';
    preheaderText = 'Thank you for joining the Tovably waiting list! You\'ll be the first to know when we launch.';
  }
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>Thank You from Tovably</title>
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
  <!-- Preheader text that will be shown in email previews -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${preheaderText}
  </div>
  
  <div class="container">
    <div class="header">
      <!-- Text-based logo instead of image -->
      <div class="logo-text">tovably</div>
    </div>
    <div class="content">
      <h1>${heading}</h1>
      <p>${paragraphs[0]}</p>
      <p>${paragraphs[1]}</p>
      <p>${paragraphs[2]}</p>
      <a href="https://tovably.com" class="button">${buttonText}</a>
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

export function createThankYouEmailText(name: string, isLaunchNotification = false): string {
  // Create different content based on whether this is a launch notification
  let heading = `Thank you for reaching out, ${name}`;
  let paragraphs = [
    `We've received your inquiry and we're excited to connect with you.`,
    `Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.`,
    `In the meantime, feel free to explore our website to learn more about how Tovably can help revolutionize your marketing communications.`
  ];
  let buttonText = 'Visit Our Website';
  
  if (isLaunchNotification) {
    heading = `You're on the Tovably waiting list, ${name}!`;
    paragraphs = [
      `Thank you for your interest in Tovably! We've added you to our early access waiting list.`,
      `You'll be among the first to know when we launch and will receive exclusive benefits as an early supporter.`,
      `We're working hard to bring you a revolutionary AI platform for content creation and tone analysis that will transform how you communicate with your audience.`
    ];
    buttonText = 'Learn More';
  }

  return `
${heading}

${paragraphs[0]}

${paragraphs[1]}

${paragraphs[2]}

${buttonText}: https://tovably.com

Best regards,
The Tovably Team

© ${new Date().getFullYear()} Tovably. All rights reserved.
This is an automated message, please do not reply to this email.
  `;
}