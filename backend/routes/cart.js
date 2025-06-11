import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  syncCart,
  getCartSummary
} from '../controllers/cart.js';

const router = express.Router();

// Validation rules
const addToCartValidation = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('variant')
    .optional()
    .isObject()
    .withMessage('Variant must be an object')
];

const updateCartValidation = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer')
];

// All routes require authentication
router.use(protect);

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
router.get('/', getCart);

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
router.get('/summary', getCartSummary);

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
router.post('/add', addToCartValidation, addToCart);

// @desc    Sync guest cart with user cart
// @route   POST /api/cart/sync
// @access  Private
router.post('/sync', syncCart);

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
router.put('/update/:itemId', updateCartValidation, updateCartItem);

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
router.delete('/remove/:itemId', removeFromCart);

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
router.delete('/clear', clearCart);

export default router;
