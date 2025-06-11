import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Address validation rules
const addressValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('street').notEmpty().withMessage('Street address is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('state').notEmpty().withMessage('State is required'),
  body('zipCode').notEmpty().withMessage('ZIP code is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('type').isIn(['home', 'work', 'other']).withMessage('Invalid address type')
];

// @desc    Get user addresses
// @route   GET /api/user/addresses
// @access  Private
router.get('/addresses', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('addresses');

    res.json({
      success: true,
      addresses: user.addresses || []
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add new address
// @route   POST /api/user/addresses
// @access  Private
router.post('/addresses', protect, addressValidation, async (req, res, next) => {
  try {
    const { name, phone, street, city, state, zipCode, country, type, isDefault } = req.body;

    const user = await User.findById(req.user._id);

    // If this is set as default, unset other default addresses
    if (isDefault) {
      user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add new address
    const newAddress = {
      name,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      type,
      isDefault: isDefault || user.addresses.length === 0 // First address is default
    };

    user.addresses.push(newAddress);
    await user.save();

    // Get the newly added address
    const addedAddress = user.addresses[user.addresses.length - 1];

    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      address: addedAddress
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update address
// @route   PUT /api/user/addresses/:addressId
// @access  Private
router.put('/addresses/:addressId', protect, addressValidation, async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { name, phone, street, city, state, zipCode, country, type, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If this is set as default, unset other default addresses
    if (isDefault) {
      user.addresses.forEach(addr => {
        if (addr._id.toString() !== addressId) {
          addr.isDefault = false;
        }
      });
    }

    // Update address
    address.name = name;
    address.phone = phone;
    address.street = street;
    address.city = city;
    address.state = state;
    address.zipCode = zipCode;
    address.country = country;
    address.type = type;
    address.isDefault = isDefault;

    await user.save();

    res.json({
      success: true,
      message: 'Address updated successfully',
      address
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete address
// @route   DELETE /api/user/addresses/:addressId
// @access  Private
router.delete('/addresses/:addressId', protect, async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If deleting default address, set another as default
    if (address.isDefault && user.addresses.length > 1) {
      const otherAddress = user.addresses.find(addr =>
        addr._id.toString() !== addressId
      );
      if (otherAddress) {
        otherAddress.isDefault = true;
      }
    }

    user.addresses.pull(addressId);
    await user.save();

    res.json({
      success: true,
      message: 'Address deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

// Admin routes

// @desc    Get all users with pagination and filters
// @route   GET /api/users/admin/all
// @access  Private (Admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res, next) => {
  try {
    const {
      search,
      role,
      isActive,
      isEmailVerified,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (isEmailVerified !== undefined) {
      filter.isEmailVerified = isEmailVerified === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get users with pagination
    const users = await User.find(filter)
      .select('-password -emailVerificationToken -passwordResetToken')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user statistics
// @route   GET /api/users/admin/stats
// @access  Private (Admin only)
router.get('/admin/stats', protect, authorize('admin'), async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const unverifiedUsers = await User.countDocuments({ isEmailVerified: false });

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        admins: adminUsers,
        regular: regularUsers,
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        recentRegistrations
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new user
// @route   POST /api/users/admin
// @access  Private (Admin only)
router.post('/admin', protect, authorize('admin'), [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], async (req, res, next) => {
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

    const { name, email, password, role, phone, isActive = true } = req.body;

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
      password,
      role,
      phone,
      isActive,
      isEmailVerified: true // Admin created users are auto-verified
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get single user by ID
// @route   GET /api/users/admin/:id
// @access  Private (Admin only)
router.get('/admin/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -passwordResetToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user
// @route   PUT /api/users/admin/:id
// @access  Private (Admin only)
router.put('/admin/:id', protect, authorize('admin'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin')
], async (req, res, next) => {
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

    const { name, email, role, phone, isActive, isEmailVerified } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;
    if (phone !== undefined) user.phone = phone;
    if (isActive !== undefined) user.isActive = isActive;
    if (isEmailVerified !== undefined) user.isEmailVerified = isEmailVerified;

    await user.save();

    // Remove sensitive fields from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;
    delete userResponse.passwordResetToken;

    res.json({
      success: true,
      message: 'User updated successfully',
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user
// @route   DELETE /api/users/admin/:id
// @access  Private (Admin only)
router.delete('/admin/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Toggle user active status
// @route   PATCH /api/users/admin/:id/toggle-status
// @access  Private (Admin only)
router.patch('/admin/:id/toggle-status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
});

// Legacy route for backward compatibility
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');

    res.json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
});

export default router;
