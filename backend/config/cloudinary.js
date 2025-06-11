import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Cloudinary
const configureCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true, // Use HTTPS URLs
    });

    console.log('✅ Cloudinary configured successfully');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary configuration failed:', error.message);
    return false;
  }
};

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    // Check if credentials are configured
    if (!process.env.CLOUDINARY_CLOUD_NAME ||
        !process.env.CLOUDINARY_API_KEY ||
        !process.env.CLOUDINARY_API_SECRET) {
      console.warn('⚠️  Cloudinary credentials not configured - skipping connection test');
      return false;
    }

    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection test successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:', error.message);
    return false;
  }
};

// Upload image to Cloudinary
const uploadImage = async (file, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'shopease/products',
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };

    const result = await cloudinary.uploader.upload(file, defaultOptions);
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate optimized image URL
const getOptimizedImageUrl = (publicId, options = {}) => {
  try {
    const defaultOptions = {
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };

    return cloudinary.url(publicId, defaultOptions);
  } catch (error) {
    console.error('Cloudinary URL generation error:', error);
    return null;
  }
};

export {
  cloudinary,
  configureCloudinary,
  testCloudinaryConnection,
  uploadImage,
  deleteImage,
  getOptimizedImageUrl
};
