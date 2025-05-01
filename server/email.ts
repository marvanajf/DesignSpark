// Import Gmail functions
import { sendGmailEmail, initializeGmailTransport } from './gmail';

// This interface is used throughout the app
interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

// Try to initialize Gmail if credentials are available
export function setupEmailService() {
  if (process.env.GMAIL_EMAIL && process.env.GMAIL_APP_PASSWORD) {
    const initialized = initializeGmailTransport(
      process.env.GMAIL_EMAIL,
      process.env.GMAIL_APP_PASSWORD
    );
    
    if (initialized) {
      console.log('Email service initialized with Gmail');
      return true;
    } else {
      console.error('Failed to initialize Gmail transport');
      return false;
    }
  } else {
    console.warn('Gmail credentials not found. Email functionality will be disabled.');
    return false;
  }
}

// This function is called from other parts of the app, now it uses Gmail
export async function sendEmail(params: EmailParams): Promise<boolean> {
  return await sendGmailEmail(params);
}

export function formatContactEmailHtml(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Contact Form Submission</h2>
      
      <div style="margin: 20px 0;">
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        
        <div style="margin-top: 20px;">
          <p><strong>Message:</strong></p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 5px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
      
      <div style="color: #777; font-size: 12px; margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee;">
        <p>This email was sent from the Tovably Contact Form.</p>
      </div>
    </div>
  `;
}

export function formatContactEmailText(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
}): string {
  return `
New Contact Form Submission
---------------------------

Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}\n` : ''}

Message:
${data.message}

---------------------------
This email was sent from the Tovably Contact Form.
  `.trim();
}