import mongoose from 'mongoose';
import Product from '../models/Product.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// High-quality Unsplash images for products
const productImageMappings = {
  'iPhone 16 Pro Max': [
    {
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
      alt: 'iPhone - Front View',
      isPrimary: true
    },
    {
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
      alt: 'iPhone - Side View',
      isPrimary: false
    }
  ],
  'MacBook Air M3': [
    {
      url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      alt: 'MacBook Air - Open View',
      isPrimary: true
    }
  ],
  'AirPods Pro 2': [
    {
      url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&q=80',
      alt: 'AirPods Pro - Case View',
      isPrimary: true
    }
  ],
  'Samsung Galaxy S24': [
    {
      url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
      alt: 'Samsung Galaxy - Front View',
      isPrimary: true
    }
  ],
  'Google Pixel 9 Pro': [
    {
      url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
      alt: 'Google Pixel - Front View',
      isPrimary: true
    }
  ],
  'Sony WH-1000XM5': [
    {
      url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
      alt: 'Sony Headphones',
      isPrimary: true
    }
  ],
  'Nike Air Jordan 4 Travis Scott': [
    {
      url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      alt: 'Nike Air Jordan - Side View',
      isPrimary: true
    }
  ],
  'PlayStation 5': [
    {
      url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
      alt: 'PlayStation 5 Console',
      isPrimary: true
    }
  ],
  'Canon EOS R6 Mark II': [
    {
      url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
      alt: 'Canon Camera',
      isPrimary: true
    }
  ]
};

const updateProductImages = async () => {
  try {
    console.log('🖼️ Updating product images with high-quality Unsplash images...');
    
    let updatedCount = 0;
    
    for (const [productName, images] of Object.entries(productImageMappings)) {
      const product = await Product.findOne({ name: productName });
      
      if (product) {
        product.images = images;
        await product.save();
        updatedCount++;
        console.log(`✅ Updated: ${productName}`);
      } else {
        console.log(`⚠️ Product not found: ${productName}`);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} products with new images`);
    
  } catch (error) {
    console.error('❌ Error updating product images:', error);
  }
};

const main = async () => {
  await connectDB();
  await updateProductImages();
  await mongoose.disconnect();
  console.log('✅ Database connection closed');
};

main().catch(console.error);
