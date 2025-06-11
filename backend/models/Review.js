import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Review must belong to a product']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Review title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Review comment cannot be more than 1000 characters']
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpfulVotes: {
    type: Number,
    default: 0
  },
  reportedCount: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  pros: [String],
  cons: [String]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ product: 1, rating: -1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ isApproved: 1 });

// Virtual for review age
reviewSchema.virtual('reviewAge').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Static method to calculate average rating for a product
reviewSchema.statics.calcAverageRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { 
        product: productId,
        isApproved: true
      }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      'rating.average': Math.round(stats[0].averageRating * 10) / 10,
      'rating.count': stats[0].totalReviews
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      'rating.average': 0,
      'rating.count': 0
    });
  }
};

// Update product rating after save
reviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.product);
});

// Update product rating after remove
reviewSchema.post('remove', function() {
  this.constructor.calcAverageRating(this.product);
});

// Update product rating after findOneAndDelete
reviewSchema.post('findOneAndDelete', function(doc) {
  if (doc) {
    doc.constructor.calcAverageRating(doc.product);
  }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
