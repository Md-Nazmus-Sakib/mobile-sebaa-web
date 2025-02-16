import nodemailer from 'nodemailer';
import config from '../config';

// Create and export the email transporter
export const transporter = nodemailer.createTransport({
  host: config.email_host, // SMTP host
  port: Number(config.email_port) || 587, // Default port for non-secure connections
  secure: Number(config.email_port) === 465, // Secure true only if using port 465
  auth: {
    user: config.email_user, // SMTP username
    pass: config.email_pass, // SMTP password or app-specific password
  },
});
