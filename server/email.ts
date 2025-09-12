import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  grade?: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<boolean> {
  try {
    const emailContent = `
New contact form submission from ISB Medical Society website:

Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Grade Level: ${formData.grade || 'Not specified'}
Subject: ${formData.subject}

Message:
${formData.message}

---
This email was sent from the ISB Medical Society contact form.
    `.trim();

    await mailService.send({
      to: 'info@isbmedicalsociety.org',
      from: formData.email,
      subject: `ISB MedSociety Contact: ${formData.subject}`,
      text: emailContent,
      replyTo: formData.email,
    });
    
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}