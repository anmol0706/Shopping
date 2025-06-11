import { configureCloudinary, uploadImage, testCloudinaryConnection } from '../backend/config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
configureCloudinary();

// Product images mapping with local paths and desired Cloudinary paths
const productImages = [
  // Electronics - Smartphones
  {
    localPath: '../frontend/src/assets/products/electronics/smartphones/samsung-s24.png',
    cloudinaryPath: 'shopease/products/electronics/smartphones/samsung-s24',
    productName: 'Samsung Galaxy S24',
    category: 'electronics/smartphones'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-1.jpg',
    cloudinaryPath: 'shopease/products/electronics/smartphones/iphone-16-pro-max-1',
    productName: 'iPhone 16 Pro Max - Image 1',
    category: 'electronics/smartphones'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-2.jpg',
    cloudinaryPath: 'shopease/products/electronics/smartphones/iphone-16-pro-max-2',
    productName: 'iPhone 16 Pro Max - Image 2',
    category: 'electronics/smartphones'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-3.jpg',
    cloudinaryPath: 'shopease/products/electronics/smartphones/iphone-16-pro-max-3',
    productName: 'iPhone 16 Pro Max - Image 3',
    category: 'electronics/smartphones'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-1.jpg',
    cloudinaryPath: 'shopease/products/electronics/smartphones/google-pixel-9-pro-1',
    productName: 'Google Pixel 9 Pro - Image 1',
    category: 'electronics/smartphones'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-2.jpg',
    cloudinaryPath: 'shopease/products/electronics/smartphones/google-pixel-9-pro-2',
    productName: 'Google Pixel 9 Pro - Image 2',
    category: 'electronics/smartphones'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-3.jpg',
    cloudinaryPath: 'shopease/products/electronics/smartphones/google-pixel-9-pro-3',
    productName: 'Google Pixel 9 Pro - Image 3',
    category: 'electronics/smartphones'
  },

  // Electronics - Accessories
  {
    localPath: '../frontend/src/assets/products/electronics/accessories/airpods.png',
    cloudinaryPath: 'shopease/products/electronics/accessories/airpods',
    productName: 'AirPods Pro',
    category: 'electronics/accessories'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/accessories/apple-watch.png',
    cloudinaryPath: 'shopease/products/electronics/accessories/apple-watch',
    productName: 'Apple Watch Ultra',
    category: 'electronics/accessories'
  },

  // Electronics - Gaming
  {
    localPath: '../frontend/src/assets/products/electronics/gaming/playstation-5-1.jpg',
    cloudinaryPath: 'shopease/products/electronics/gaming/playstation-5-1',
    productName: 'PlayStation 5 - Console',
    category: 'electronics/gaming'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/gaming/playstation-5-2.jpg',
    cloudinaryPath: 'shopease/products/electronics/gaming/playstation-5-2',
    productName: 'PlayStation 5 - Controller',
    category: 'electronics/gaming'
  },

  // Electronics - Cameras
  {
    localPath: '../frontend/src/assets/products/electronics/cameras/canon-eos-r6-mark2-1.jpg',
    cloudinaryPath: 'shopease/products/electronics/cameras/canon-eos-r6-mark2-1',
    productName: 'Canon EOS R6 Mark II - Front',
    category: 'electronics/cameras'
  },
  {
    localPath: '../frontend/src/assets/products/electronics/cameras/canon-eos-r6-mark2-2.jpg',
    cloudinaryPath: 'shopease/products/electronics/cameras/canon-eos-r6-mark2-2',
    productName: 'Canon EOS R6 Mark II - Side',
    category: 'electronics/cameras'
  },

  // Clothing - Shoes
  {
    localPath: '../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-1.jpg',
    cloudinaryPath: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-1',
    productName: 'Nike Air Jordan 4 Travis Scott - Main',
    category: 'clothing/shoes'
  },
  {
    localPath: '../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-2.jpg',
    cloudinaryPath: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-2',
    productName: 'Nike Air Jordan 4 Travis Scott - Side',
    category: 'clothing/shoes'
  },
  {
    localPath: '../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-3.jpg',
    cloudinaryPath: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-3',
    productName: 'Nike Air Jordan 4 Travis Scott - Detail',
    category: 'clothing/shoes'
  },
  {
    localPath: '../frontend/src/assets/products/clothing/shoes/yeezy-boost-350-v2-1.jpg',
    cloudinaryPath: 'shopease/products/clothing/shoes/yeezy-boost-350-v2-1',
    productName: 'Yeezy Boost 350 V2 - Main',
    category: 'clothing/shoes'
  },
  {
    localPath: '../frontend/src/assets/products/clothing/shoes/yeezy-boost-350-v2-2.jpg',
    cloudinaryPath: 'shopease/products/clothing/shoes/yeezy-boost-350-v2-2',
    productName: 'Yeezy Boost 350 V2 - Side',
    category: 'clothing/shoes'
  },
  {
    localPath: '../frontend/src/assets/products/clothing/shoes/yeezy-boost-350-v2-3.jpg',
    cloudinaryPath: 'shopease/products/clothing/shoes/yeezy-boost-350-v2-3',
    productName: 'Yeezy Boost 350 V2 - Boost',
    category: 'clothing/shoes'
  },

  // Clothing - Apparel
  {
    localPath: '../frontend/src/assets/products/clothing/apparel/supreme-box-logo-hoodie-1.jpg',
    cloudinaryPath: 'shopease/products/clothing/apparel/supreme-box-logo-hoodie-1',
    productName: 'Supreme Box Logo Hoodie - Front',
    category: 'clothing/apparel'
  },
  {
    localPath: '../frontend/src/assets/products/clothing/apparel/supreme-box-logo-hoodie-2.jpg',
    cloudinaryPath: 'shopease/products/clothing/apparel/supreme-box-logo-hoodie-2',
    productName: 'Supreme Box Logo Hoodie - Detail',
    category: 'clothing/apparel'
  },

  // Books
  {
    localPath: '../frontend/src/assets/products/books/atomic-habits-1.jpg',
    cloudinaryPath: 'shopease/products/books/atomic-habits-1',
    productName: 'Atomic Habits - Cover',
    category: 'books'
  },
  {
    localPath: '../frontend/src/assets/products/books/atomic-habits-2.jpg',
    cloudinaryPath: 'shopease/products/books/atomic-habits-2',
    productName: 'Atomic Habits - Open',
    category: 'books'
  },
  {
    localPath: '../frontend/src/assets/products/books/harry-potter-set-1.jpg',
    cloudinaryPath: 'shopease/products/books/harry-potter-set-1',
    productName: 'Harry Potter Set - Box',
    category: 'books'
  },
  {
    localPath: '../frontend/src/assets/products/books/harry-potter-set-2.jpg',
    cloudinaryPath: 'shopease/products/books/harry-potter-set-2',
    productName: 'Harry Potter Set - Books',
    category: 'books'
  },

  // Beauty
  {
    localPath: '../frontend/src/assets/products/beauty/tea-tree-face-wash-1.jpg',
    cloudinaryPath: 'shopease/products/beauty/tea-tree-face-wash-1',
    productName: 'Tea Tree Face Wash - Product',
    category: 'beauty'
  },
  {
    localPath: '../frontend/src/assets/products/beauty/tea-tree-face-wash-2.jpg',
    cloudinaryPath: 'shopease/products/beauty/tea-tree-face-wash-2',
    productName: 'Tea Tree Face Wash - Application',
    category: 'beauty'
  },

  // Food & Beverages
  {
    localPath: '../frontend/src/assets/products/food-beverages/organic-green-tea-1.jpg',
    cloudinaryPath: 'shopease/products/food-beverages/organic-green-tea-1',
    productName: 'Organic Green Tea - Package',
    category: 'food-beverages'
  },
  {
    localPath: '../frontend/src/assets/products/food-beverages/organic-green-tea-2.jpg',
    cloudinaryPath: 'shopease/products/food-beverages/organic-green-tea-2',
    productName: 'Organic Green Tea - Brewed',
    category: 'food-beverages'
  },

  // Toys
  {
    localPath: '../frontend/src/assets/products/toys/barbie-dreamhouse-1.jpg',
    cloudinaryPath: 'shopease/products/toys/barbie-dreamhouse-1',
    productName: 'Barbie Dreamhouse - Complete',
    category: 'toys'
  }
];

// Function to upload single image to Cloudinary
const uploadSingleImage = async (imageInfo) => {
  try {
    const fullPath = path.resolve(__dirname, imageInfo.localPath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${fullPath}`);
      return null;
    }

    console.log(`📤 Uploading: ${imageInfo.productName}...`);
    
    // Upload to Cloudinary
    const result = await uploadImage(fullPath, {
      public_id: imageInfo.cloudinaryPath,
      folder: '', // Already included in public_id
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
      overwrite: true // Overwrite if exists
    });

    if (result.success) {
      console.log(`✅ Uploaded: ${imageInfo.productName}`);
      console.log(`   URL: ${result.url}`);
      return {
        ...imageInfo,
        cloudinaryUrl: result.url,
        publicId: result.public_id
      };
    } else {
      console.log(`❌ Failed to upload: ${imageInfo.productName} - ${result.error}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error uploading ${imageInfo.productName}:`, error.message);
    return null;
  }
};

// Main upload function
const uploadAllImages = async () => {
  console.log('🚀 Starting Cloudinary upload process...\n');
  
  // Test connection first
  console.log('🔍 Testing Cloudinary connection...');
  const connectionTest = await testCloudinaryConnection();
  
  if (!connectionTest) {
    console.log('❌ Cloudinary connection failed. Please check your credentials.');
    return;
  }

  console.log('\n📤 Uploading product images to Cloudinary...\n');
  
  const uploadResults = [];
  let successCount = 0;
  let failCount = 0;

  for (const imageInfo of productImages) {
    const result = await uploadSingleImage(imageInfo);
    
    if (result) {
      uploadResults.push(result);
      successCount++;
    } else {
      failCount++;
    }
    
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n📊 Upload Summary:');
  console.log(`✅ Successfully uploaded: ${successCount} images`);
  console.log(`❌ Failed uploads: ${failCount} images`);
  console.log(`📁 Total processed: ${productImages.length} images`);

  // Save results to file for reference
  const resultsFile = path.join(__dirname, 'cloudinary-upload-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(uploadResults, null, 2));
  console.log(`\n💾 Upload results saved to: ${resultsFile}`);

  console.log('\n🎉 Cloudinary upload process completed!');
  
  return uploadResults;
};

// Run the upload
uploadAllImages().catch(console.error);
