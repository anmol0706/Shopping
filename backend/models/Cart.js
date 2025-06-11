import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  variant: {
    size: String,
    color: String,
    style: String
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: true
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes (user index is created automatically by unique: true)
cartSchema.index({ 'items.product': 1 });
cartSchema.index({ lastModified: -1 });

// Virtual for cart summary
cartSchema.virtual('summary').get(function() {
  return {
    totalItems: this.totalItems,
    totalAmount: this.totalAmount,
    itemCount: this.items.length
  };
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
  this.totalAmount = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  this.lastModified = new Date();
  next();
});

// Instance method to add item
cartSchema.methods.addItem = function(productId, quantity, variant, price) {
  // Check if item already exists with same variant
  const existingItemIndex = this.items.findIndex(item => 
    item.product.toString() === productId.toString() &&
    JSON.stringify(item.variant) === JSON.stringify(variant)
  );

  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({
      product: productId,
      quantity,
      variant: variant || {},
      price
    });
  }

  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.id(itemId);
  if (!item) {
    throw new Error('Item not found in cart');
  }

  if (quantity <= 0) {
    this.items.pull(itemId);
  } else {
    item.quantity = quantity;
  }

  return this.save();
};

// Instance method to remove item
cartSchema.methods.removeItem = function(itemId) {
  this.items.pull(itemId);
  return this.save();
};

// Instance method to clear cart
cartSchema.methods.clearCart = function() {
  this.items = [];
  return this.save();
};

// Instance method to get item count
cartSchema.methods.getItemCount = function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

// Static method to get or create cart for user
cartSchema.statics.getOrCreateCart = async function(userId) {
  let cart = await this.findOne({ user: userId }).populate('items.product');
  
  if (!cart) {
    cart = new this({ user: userId });
    await cart.save();
    cart = await this.findById(cart._id).populate('items.product');
  }
  
  return cart;
};

// Static method to merge guest cart with user cart
cartSchema.statics.mergeGuestCart = async function(userId, guestCartItems) {
  const cart = await this.getOrCreateCart(userId);
  
  for (const guestItem of guestCartItems) {
    await cart.addItem(
      guestItem.productId,
      guestItem.quantity,
      guestItem.variant,
      guestItem.price
    );
  }
  
  return cart;
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
