import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendPasswordResetEmail(email: string, token: string, resetUrlBase: string) {
    const url = `${resetUrlBase}?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset - BSNG Construction',
      html: `
        <h3>Reset Your Password</h3>
        <p>You requested to reset your password. Please click the link below to set a new password:</p>
        <a href="${url}">Reset Password</a>
        <br/><br/>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });
  }

  async sendContactNotification(name: string, email: string, subject: string, message: string) {
    await this.mailerService.sendMail({
      to: process.env.MAIL_USER, // send to the company email
      subject: `New Contact Request: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
  }
}
