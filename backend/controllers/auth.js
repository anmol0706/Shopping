import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

// Generate JWT Token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Create and send token response
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  
  const cookieOptions = {
    expires: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  res.cookie('token', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate email verification token
    const verifyToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verifyToken)
      .digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;

      const emailResult = await sendEmail({
        email: user.email,
        subject: 'Email Verification - ShopEase',
        template: 'emailVerification',
        data: {
          name: user.name,
          verifyUrl
        }
      });

      if (!emailResult.success) {
        console.warn('Email verification not sent:', emailResult.message);
      }
    } catch (err) {
      console.error('Email sending failed:', err);
      // Don't fail registration if email fails
    }

    createSendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email, isActive: true }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to too many failed login attempts'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save({ validateBeforeSave: false });

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      phone: req.body.phone,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      addresses: req.body.addresses,
      preferences: req.body.preferences
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key =>
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Check current password
    if (!(await user.correctPassword(currentPassword, user.password))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = new Date();
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    // Get user by email
    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    // Get reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request - ShopEase',
        template: 'passwordReset',
        data: {
          name: user.name,
          resetUrl
        }
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Get hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = new Date();
    await user.save();

    createSendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email, isActive: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verifyToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verifyToken)
      .digest('hex');
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save({ validateBeforeSave: false });

    // Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verifyToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - ShopEase',
      template: 'emailVerification',
      data: {
        name: user.name,
        verifyUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    next(error);
  }
};
