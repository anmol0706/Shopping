import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';

const router = express.Router();

// Public route to check Cloudinary status (no auth required)
router.get('/status', async (req, res) => {
  try {
    const configured = !!(process.env.CLOUDINARY_CLOUD_NAME &&
                         process.env.CLOUDINARY_API_KEY &&
                         process.env.CLOUDINARY_API_SECRET);

    const isDemoCredentials = process.env.CLOUDINARY_CLOUD_NAME === 'Jarvis' &&
                             process.env.CLOUDINARY_API_KEY === '162564566254619';

    const status = {
      success: true,
      cloudinary: {
        configured,
        demo: isDemoCredentials,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'Not configured',
        working: configured && !isDemoCredentials,
        status: configured ? (isDemoCredentials ? 'Demo credentials (not working)' : 'Configured and ready') : 'Not configured'
      },
      upload_mode: configured && !isDemoCredentials ? 'cloudinary' : 'fallback',
      message: configured && !isDemoCredentials
        ? 'Cloudinary is properly configured'
        : isDemoCredentials
          ? 'Using demo credentials - images will be stored as base64. Please set up real Cloudinary credentials.'
          : 'Cloudinary not configured - using fallback mode'
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Legacy endpoint for backward compatibility
router.get('/cloudinary-status', async (req, res) => {
  try {
    const configured = !!(process.env.CLOUDINARY_CLOUD_NAME &&
                         process.env.CLOUDINARY_API_KEY &&
                         process.env.CLOUDINARY_API_SECRET);

    const isDemoCredentials = process.env.CLOUDINARY_CLOUD_NAME === 'Jarvis' &&
                             process.env.CLOUDINARY_API_KEY === '162564566254619';

    res.json({
      success: true,
      cloudinary: {
        configured,
        demo: isDemoCredentials,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'Not configured',
        status: configured ? (isDemoCredentials ? 'Demo credentials' : 'Configured') : 'Not configured'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload single image
router.post('/image', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Check if Cloudinary is properly configured
    const isCloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME &&
                                     process.env.CLOUDINARY_API_KEY &&
                                     process.env.CLOUDINARY_API_SECRET);

    const isDemoCredentials = process.env.CLOUDINARY_CLOUD_NAME === 'Jarvis' &&
                             process.env.CLOUDINARY_API_KEY === '162564566254619';

    if (!isCloudinaryConfigured || isDemoCredentials) {
      // Fallback: Return base64 data URL for demo purposes
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      return res.json({
        success: true,
        message: 'Image processed (demo mode - using base64)',
        url: base64Data,
        public_id: `demo_product_${Date.now()}`,
        width: 400,
        height: 400,
        format: req.file.mimetype.split('/')[1],
        size: req.file.size,
        demo: true,
        note: 'Using demo mode. Set up real Cloudinary credentials for production.'
      });
    }

    // Convert buffer to base64 data URL for Cloudinary
    const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadImage(base64Data, {
      folder: 'shopease/products',
      public_id: `product_${Date.now()}`,
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Image uploaded successfully to Cloudinary',
        url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.bytes
      });
    } else {
      // Fallback to base64 if Cloudinary fails
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      res.json({
        success: true,
        message: 'Image processed (Cloudinary failed, using fallback)',
        url: base64Data,
        public_id: `fallback_product_${Date.now()}`,
        width: 400,
        height: 400,
        format: req.file.mimetype.split('/')[1],
        size: req.file.size,
        fallback: true,
        cloudinary_error: result.error
      });
    }
  } catch (error) {
    console.error('Upload error:', error);

    // Final fallback: return base64 data
    try {
      const base64Data = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      res.json({
        success: true,
        message: 'Image processed (error fallback)',
        url: base64Data,
        public_id: `error_fallback_${Date.now()}`,
        width: 400,
        height: 400,
        format: req.file.mimetype.split('/')[1],
        size: req.file.size,
        error_fallback: true,
        original_error: error.message
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
});

// Upload multiple images
router.post('/images', protect, authorize('admin'), upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided'
      });
    }

    // Check if Cloudinary is properly configured
    const isCloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME &&
                                     process.env.CLOUDINARY_API_KEY &&
                                     process.env.CLOUDINARY_API_SECRET);

    const isDemoCredentials = process.env.CLOUDINARY_CLOUD_NAME === 'Jarvis' &&
                             process.env.CLOUDINARY_API_KEY === '162564566254619';

    if (!isCloudinaryConfigured || isDemoCredentials) {
      // Fallback: Return base64 data URLs for demo purposes
      const images = req.files.map((file, index) => {
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return {
          url: base64Data,
          public_id: `demo_product_${Date.now()}_${index}`,
          width: 400,
          height: 400,
          format: file.mimetype.split('/')[1],
          size: file.size
        };
      });

      return res.json({
        success: true,
        message: `${images.length} images processed (demo mode)`,
        uploaded: images.length,
        failed: 0,
        images: images,
        demo: true,
        note: 'Using demo mode. Set up real Cloudinary credentials for production.'
      });
    }

    // Try Cloudinary upload
    const uploadPromises = req.files.map(async (file, index) => {
      try {
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await uploadImage(base64Data, {
          folder: 'shopease/products',
          public_id: `product_${Date.now()}_${index}`,
        });

        if (result.success) {
          return result;
        } else {
          // Fallback to base64 for this file
          return {
            success: true,
            url: base64Data,
            public_id: `fallback_product_${Date.now()}_${index}`,
            width: 400,
            height: 400,
            format: file.mimetype.split('/')[1],
            size: file.size,
            fallback: true
          };
        }
      } catch (error) {
        // Fallback to base64 for this file
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return {
          success: true,
          url: base64Data,
          public_id: `error_fallback_${Date.now()}_${index}`,
          width: 400,
          height: 400,
          format: file.mimetype.split('/')[1],
          size: file.size,
          error_fallback: true
        };
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(result => result.success);
    const failedUploads = results.filter(result => !result.success);

    res.json({
      success: true,
      message: `${successfulUploads.length} images processed successfully`,
      uploaded: successfulUploads.length,
      failed: failedUploads.length,
      images: successfulUploads.map(result => ({
        url: result.url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        size: result.size || result.bytes
      })),
      errors: failedUploads.map(result => result.error)
    });
  } catch (error) {
    console.error('Multiple upload error:', error);

    // Final fallback: process all files as base64
    try {
      const images = req.files.map((file, index) => {
        const base64Data = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return {
          url: base64Data,
          public_id: `final_fallback_${Date.now()}_${index}`,
          width: 400,
          height: 400,
          format: file.mimetype.split('/')[1],
          size: file.size
        };
      });

      res.json({
        success: true,
        message: `${images.length} images processed (error fallback)`,
        uploaded: images.length,
        failed: 0,
        images: images,
        error_fallback: true,
        original_error: error.message
      });
    } catch (fallbackError) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
});

// Test Cloudinary configuration
router.get('/test-cloudinary', protect, authorize('admin'), async (req, res) => {
  try {
    // Check if credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      return res.status(400).json({
        success: false,
        message: 'Cloudinary credentials not configured',
        configured: false
      });
    }

    // Check for demo credentials
    const isDemoCredentials = process.env.CLOUDINARY_CLOUD_NAME === 'Jarvis' &&
                             process.env.CLOUDINARY_API_KEY === '162564566254619';

    if (isDemoCredentials) {
      return res.json({
        success: false,
        message: 'Using demo Cloudinary credentials - please configure real credentials',
        configured: true,
        demo: true,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME
      });
    }

    // Try to ping Cloudinary
    const { cloudinary } = await import('../config/cloudinary.js');
    const result = await cloudinary.api.ping();

    res.json({
      success: true,
      message: 'Cloudinary is working properly',
      configured: true,
      demo: false,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      ping_result: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message,
      configured: true
    });
  }
});

// Delete image
router.delete('/image/:publicId', protect, authorize('admin'), async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required'
      });
    }

    // Decode the public ID (in case it's URL encoded)
    const decodedPublicId = decodeURIComponent(publicId);

    const result = await deleteImage(decodedPublicId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Image deleted successfully',
        result: result.result
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: result.error
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

export default router;
