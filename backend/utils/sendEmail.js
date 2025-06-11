import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Check if email configuration is available
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration is incomplete. Email will not be sent.');
    return {
      success: false,
      message: 'Email configuration is incomplete'
    };
  }

  // Check for placeholder values
  if (process.env.EMAIL_USER === 'your_email@gmail.com' || process.env.EMAIL_PASS === 'your_app_password') {
    console.warn('Email configuration contains placeholder values. Email will not be sent.');
    return {
      success: false,
      message: 'Email configuration contains placeholder values'
    };
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

  // Define email options
  const mailOptions = {
    from: `ShopEase <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
  };

  // Handle different content types
  if (options.template) {
    // Use template (you can implement template engine here)
    mailOptions.html = getEmailTemplate(options.template, options.data);
  } else if (options.html) {
    mailOptions.html = options.html;
  } else {
    mailOptions.text = options.message;
  }

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
  }
};

// Simple email templates
const getEmailTemplate = (template, data) => {
  const templates = {
    emailVerification: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to ShopEase!</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for registering with ShopEase. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${data.verifyUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by ShopEase. If you have any questions, please contact our support team.
        </p>
      </div>
    `,
    passwordReset: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hi ${data.name},</p>
        <p>You requested a password reset for your ShopEase account. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetUrl}" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${data.resetUrl}</p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by ShopEase. If you have any questions, please contact our support team.
        </p>
      </div>
    `,
    orderConfirmation: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Order Confirmation</h2>
        <p>Hi ${data.name},</p>
        <p>Thank you for your order! Your order #${data.orderNumber} has been confirmed.</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
          <p><strong>Estimated Delivery:</strong> ${data.estimatedDelivery}</p>
        </div>
        <p>You can track your order status in your account dashboard.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.trackingUrl}" style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Order
          </a>
        </div>
        <hr style="margin: 30px 0;">
        <p style="color: #666; font-size: 12px;">
          This email was sent by ShopEase. If you have any questions, please contact our support team.
        </p>
      </div>
    `
  };

  return templates[template] || `<p>${data.message || 'No template found'}</p>`;
};
