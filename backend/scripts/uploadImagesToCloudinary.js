import { configureCloudinary, uploadImage } from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configure Cloudinary first
configureCloudinary();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product images to upload
const imagesToUpload = [
  // Electronics - Smartphones
  {
    localPath: '../../frontend/src/assets/products/electronics/smartphones/samsung-s24.png',
    publicId: 'shopease/products/electronics/smartphones/samsung-s24',
    name: 'Samsung Galaxy S24'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-1.jpg',
    publicId: 'shopease/products/electronics/smartphones/iphone-16-pro-max-1',
    name: 'iPhone 16 Pro Max - Image 1'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-2.jpg',
    publicId: 'shopease/products/electronics/smartphones/iphone-16-pro-max-2',
    name: 'iPhone 16 Pro Max - Image 2'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-3.jpg',
    publicId: 'shopease/products/electronics/smartphones/iphone-16-pro-max-3',
    name: 'iPhone 16 Pro Max - Image 3'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-1.jpg',
    publicId: 'shopease/products/electronics/smartphones/google-pixel-9-pro-1',
    name: 'Google Pixel 9 Pro - Image 1'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-2.jpg',
    publicId: 'shopease/products/electronics/smartphones/google-pixel-9-pro-2',
    name: 'Google Pixel 9 Pro - Image 2'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-3.jpg',
    publicId: 'shopease/products/electronics/smartphones/google-pixel-9-pro-3',
    name: 'Google Pixel 9 Pro - Image 3'
  },

  // Electronics - Accessories
  {
    localPath: '../../frontend/src/assets/products/electronics/accessories/airpods.png',
    publicId: 'shopease/products/electronics/accessories/airpods',
    name: 'AirPods Pro'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/accessories/apple-watch.png',
    publicId: 'shopease/products/electronics/accessories/apple-watch',
    name: 'Apple Watch Ultra'
  },

  // Electronics - Gaming
  {
    localPath: '../../frontend/src/assets/products/electronics/gaming/playstation-5-1.jpg',
    publicId: 'shopease/products/electronics/gaming/playstation-5-1',
    name: 'PlayStation 5 - Console'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/gaming/playstation-5-2.jpg',
    publicId: 'shopease/products/electronics/gaming/playstation-5-2',
    name: 'PlayStation 5 - Controller'
  },

  // Electronics - Cameras
  {
    localPath: '../../frontend/src/assets/products/electronics/cameras/canon-eos-r6-mark2-1.jpg',
    publicId: 'shopease/products/electronics/cameras/canon-eos-r6-mark2-1',
    name: 'Canon EOS R6 Mark II - Front'
  },
  {
    localPath: '../../frontend/src/assets/products/electronics/cameras/canon-eos-r6-mark2-2.jpg',
    publicId: 'shopease/products/electronics/cameras/canon-eos-r6-mark2-2',
    name: 'Canon EOS R6 Mark II - Side'
  },

  // Clothing - Shoes
  {
    localPath: '../../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-1.jpg',
    publicId: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-1',
    name: 'Nike Air Jordan 4 Travis Scott - Main'
  },
  {
    localPath: '../../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-2.jpg',
    publicId: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-2',
    name: 'Nike Air Jordan 4 Travis Scott - Side'
  },
  {
    localPath: '../../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-3.jpg',
    publicId: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-3',
    name: 'Nike Air Jordan 4 Travis Scott - Detail'
  }
];

// Function to upload single image
const uploadSingleImage = async (imageInfo) => {
  try {
    const fullPath = path.resolve(__dirname, imageInfo.localPath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${fullPath}`);
      return null;
    }

    console.log(`📤 Uploading: ${imageInfo.name}...`);
    
    // Upload to Cloudinary
    const result = await uploadImage(fullPath, {
      public_id: imageInfo.publicId,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
      overwrite: true
    });

    if (result.success) {
      console.log(`✅ Uploaded: ${imageInfo.name}`);
      console.log(`   URL: ${result.url}`);
      return {
        ...imageInfo,
        cloudinaryUrl: result.url,
        publicId: result.public_id
      };
    } else {
      console.log(`❌ Failed to upload: ${imageInfo.name} - ${result.error}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error uploading ${imageInfo.name}:`, error.message);
    return null;
  }
};

// Main upload function
const uploadAllImages = async () => {
  console.log('🚀 Starting Cloudinary upload process...\n');
  
  const uploadResults = [];
  let successCount = 0;
  let failCount = 0;

  for (const imageInfo of imagesToUpload) {
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
  console.log(`📁 Total processed: ${imagesToUpload.length} images`);

  // Save results to file for reference
  const resultsFile = path.join(__dirname, 'cloudinary-upload-results.json');
  fs.writeFileSync(resultsFile, JSON.stringify(uploadResults, null, 2));
  console.log(`\n💾 Upload results saved to: ${resultsFile}`);

  console.log('\n🎉 Cloudinary upload process completed!');
  console.log('\n✅ Your images are now available at:');
  console.log('   https://cloudinary.com/console/c-Jarvis/media_library');
  
  return uploadResults;
};

// Run the upload
uploadAllImages().catch(console.error);
