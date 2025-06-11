import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.getOrCreateCart(req.user._id);
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant = {} } = req.body;

    // Validate product exists and is active
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available'
      });
    }

    // Get or create cart
    const cart = await Cart.getOrCreateCart(req.user._id);

    // Add item to cart
    await cart.addItem(productId, quantity, variant, product.price);

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Item added to cart',
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find the item
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check stock availability if increasing quantity
    if (quantity > item.quantity) {
      const product = await Product.findById(item.product);
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available'
        });
      }
    }

    // Update item quantity
    await cart.updateItemQuantity(itemId, quantity);

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Cart updated',
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Remove item
    await cart.removeItem(itemId);

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear cart
    await cart.clearCart();

    res.json({
      success: true,
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync guest cart with user cart
// @route   POST /api/cart/sync
// @access  Private
export const syncCart = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart items'
      });
    }

    // Validate and process guest cart items
    const validItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.isActive && product.stock >= item.quantity) {
        validItems.push({
          productId: item.productId,
          quantity: item.quantity,
          variant: item.variant || {},
          price: product.price
        });
      }
    }

    // Merge with user cart
    const cart = await Cart.mergeGuestCart(req.user._id, validItems);

    // Populate and return updated cart
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.json({
      success: true,
      message: 'Cart synced successfully',
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cart summary
// @route   GET /api/cart/summary
// @access  Private
export const getCartSummary = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    
    if (!cart) {
      return res.json({
        success: true,
        summary: {
          totalItems: 0,
          totalAmount: 0,
          itemCount: 0
        }
      });
    }

    res.json({
      success: true,
      summary: cart.summary
    });
  } catch (error) {
    next(error);
  }
};
