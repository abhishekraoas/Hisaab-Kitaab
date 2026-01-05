import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - Hisaab Kitaab",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; color: #4F46E5; margin-bottom: 30px; }
          .otp-box { background-color: #EEF2FF; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .otp { font-size: 32px; font-weight: bold; color: #4F46E5; letter-spacing: 5px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">💰 Hisaab Kitaab</h1>
          <h2>Hello ${name}!</h2>
          <p>Thank you for registering with Hisaab Kitaab. Please verify your email address using the OTP below:</p>
          <div class="otp-box">
            <div class="otp">${otp}</div>
          </div>
          <p>This OTP will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <div class="footer">
            <p>© 2026 Hisaab Kitaab. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return { success: false, error };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken, name) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password - Hisaab Kitaab",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
          .container { background-color: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; color: #4F46E5; margin-bottom: 30px; }
          .button { display: inline-block; background-color: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="header">💰 Hisaab Kitaab</h1>
          <h2>Hello ${name}!</h2>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center;">
            <a href="${resetLink}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${resetLink}</p>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
          <div class="footer">
            <p>© 2026 Hisaab Kitaab. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
};
