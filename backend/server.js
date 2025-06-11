import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';
import wishlistRoutes from './routes/wishlist.js';
import paymentRoutes from './routes/payment.js';
import razorpayRoutes from './routes/razorpay.js';
import uploadRoutes from './routes/upload.js';
import analyticsRoutes from './routes/analytics.js';
import marketingRoutes from './routes/marketing.js';
import contentRoutes from './routes/content.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Load environment variables
dotenv.config();

// Import and configure Cloudinary
import { configureCloudinary, testCloudinaryConnection } from './config/cloudinary.js';

// Import configuration validation
import { printConfigValidation } from './utils/validateConfig.js';

// Import models to ensure they are registered
import './models/User.js';
import './models/Product.js';
import './models/Review.js';
import './models/Order.js';
import './models/Cart.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Data sanitization
app.use(mongoSanitize());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/user', userRoutes); // Add user route for profile/addresses
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ShopEase API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Connect to database and start server
let server;

const startServer = async () => {
  try {
    // Validate configuration
    const configValidation = printConfigValidation();

    if (!configValidation.valid) {
      console.error('❌ Server startup aborted due to configuration errors');
      process.exit(1);
    }

    await connectDB();

    // Configure Cloudinary
    const cloudinaryConfigured = configureCloudinary();
    if (cloudinaryConfigured) {
      // Test Cloudinary connection (optional)
      await testCloudinaryConnection();
    }

    server = app.listen(PORT, () => {
      console.log(`
🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
📡 Port: ${PORT}
🗄️  Database: Connected
🌐 CORS: Enabled
🔒 Security: Enabled
📝 Logging: ${process.env.NODE_ENV === 'development' ? 'Development' : 'Production'}
☁️  Cloudinary: ${cloudinaryConfigured ? 'Configured' : 'Not Configured'}
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  // Close server & exit process
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('Process terminated');
    });
  }
});

// Start the server
startServer();

export default app;
