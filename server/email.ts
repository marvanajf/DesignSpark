import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // Default sender email
    const defaultFrom = 'noreply@tovably.com';
    
    await mailService.send({
      to: params.to,
      from: params.from || defaultFrom,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
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