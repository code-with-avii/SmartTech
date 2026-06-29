import nodemailer from 'nodemailer';
import crypto from 'crypto';

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = createEmailTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email - E-Commerce Store',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Welcome to Our E-Commerce Store!</h2>
          <p>Thank you for signing up. Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours. If you didn't create an account, please ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link: ${verificationUrl}
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully');
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createEmailTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password - E-Commerce Store',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
          <p>You requested to reset your password. Click the link below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
          <p style="color: #666; font-size: 14px;">
            Or copy and paste this link: ${resetUrl}
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully');
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendOrderConfirmationEmail = async (email, name, orderId, products, totalAmount) => {
  try {
    const transporter = createEmailTransporter();
    
    const productListHtml = products
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        </tr>
      `
      )
      .join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Order Confirmed! Order ID: ${orderId}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; color: #333;">
          <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 20px;">
            <h2 style="color: #3b82f6; margin: 0;">SmartTech</h2>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Thank you for your order!</p>
          </div>
          
          <p>Hi ${name || 'Customer'},</p>
          <p>We are excited to confirm your order! Your payment was successful, and we are now processing your items.</p>
          
          <div style="background-color: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #64748b;">Order ID</p>
            <p style="margin: 0; font-family: monospace; font-size: 16px; font-weight: bold; color: #1e293b;">${orderId}</p>
          </div>
          
          <h3 style="border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; color: #1e293b;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
              <tr style="background-color: #f1f5f9;">
                <th style="padding: 10px; text-align: left; font-size: 14px; color: #475569;">Item</th>
                <th style="padding: 10px; text-align: center; font-size: 14px; color: #475569;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 14px; color: #475569;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${productListHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px 10px 10px 10px; text-align: right; font-weight: bold; font-size: 16px;">Total Amount:</td>
                <td style="padding: 15px 10px 10px 10px; text-align: right; font-weight: bold; font-size: 16px; color: #3b82f6;">₹${totalAmount}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #64748b;">
            <p>If you have any questions, please contact our support team at support@smarttech.com</p>
            <p>&copy; ${new Date().getFullYear()} SmartTech. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent successfully to', email);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
  }
};
