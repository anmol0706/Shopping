import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price images category stock'
    });

    res.json({
      success: true,
      items: user.wishlist || []
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
router.post('/add', protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get user and check if product is already in wishlist
    const user = await User.findById(req.user.id);
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    user.wishlist.push(productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
router.delete('/remove/:productId', protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Sync local wishlist with server
// @route   POST /api/wishlist/sync
// @access  Private
router.post('/sync', protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items must be an array'
      });
    }

    const user = await User.findById(req.user.id);

    // Add new items to wishlist (avoid duplicates)
    for (const productId of items) {
      if (!user.wishlist.includes(productId)) {
        // Verify product exists
        const product = await Product.findById(productId);
        if (product) {
          user.wishlist.push(productId);
        }
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Wishlist synced successfully'
    });
  } catch (error) {
    console.error('Sync wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Clear entire wishlist
// @route   DELETE /api/wishlist/clear
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = [];
    await user.save();

    res.json({
      success: true,
      message: 'Wishlist cleared successfully'
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
