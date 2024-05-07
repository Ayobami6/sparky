import nodemailer, { Transporter } from 'nodemailer';
import { Injectable } from '@nestjs/common';
import ejs from 'ejs';
import path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: this.configService.get('SMTP_PORT'),
      host: this.configService.get('SMTP_HOST'),
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PSWD'),
      },
    });
  }

  async sendEmail(to: string, subject: string, template: string, data: any) {
    const templatePath = path.join(__dirname, './mails', template);
    const html = await ejs.renderFile(templatePath, data);
    const mailOptions = {
      from: this.configService.get('SMTP_USER'),
      to: to,
      subject: subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error occurred while sending email:', error);
    }
  }
}
