// Manual Upload Helper - Generates upload commands and URLs for Cloudinary

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// List all images that need to be uploaded
const imagesToUpload = [
  // Electronics - Smartphones
  { local: '../../frontend/src/assets/products/electronics/smartphones/samsung-s24.png', cloudinary: 'shopease/products/electronics/smartphones/samsung-s24' },
  { local: '../../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-1.jpg', cloudinary: 'shopease/products/electronics/smartphones/iphone-16-pro-max-1' },
  { local: '../../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-2.jpg', cloudinary: 'shopease/products/electronics/smartphones/iphone-16-pro-max-2' },
  { local: '../../frontend/src/assets/products/electronics/smartphones/iphone-16-pro-max-3.jpg', cloudinary: 'shopease/products/electronics/smartphones/iphone-16-pro-max-3' },
  { local: '../../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-1.jpg', cloudinary: 'shopease/products/electronics/smartphones/google-pixel-9-pro-1' },
  { local: '../../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-2.jpg', cloudinary: 'shopease/products/electronics/smartphones/google-pixel-9-pro-2' },
  { local: '../../frontend/src/assets/products/electronics/smartphones/google-pixel-9-pro-3.jpg', cloudinary: 'shopease/products/electronics/smartphones/google-pixel-9-pro-3' },

  // Electronics - Accessories
  { local: '../../frontend/src/assets/products/electronics/accessories/airpods.png', cloudinary: 'shopease/products/electronics/accessories/airpods' },
  { local: '../../frontend/src/assets/products/electronics/accessories/apple-watch.png', cloudinary: 'shopease/products/electronics/accessories/apple-watch' },

  // Electronics - Gaming
  { local: '../../frontend/src/assets/products/electronics/gaming/playstation-5-1.jpg', cloudinary: 'shopease/products/electronics/gaming/playstation-5-1' },
  { local: '../../frontend/src/assets/products/electronics/gaming/playstation-5-2.jpg', cloudinary: 'shopease/products/electronics/gaming/playstation-5-2' },

  // Electronics - Cameras
  { local: '../../frontend/src/assets/products/electronics/cameras/canon-eos-r6-mark2-1.jpg', cloudinary: 'shopease/products/electronics/cameras/canon-eos-r6-mark2-1' },
  { local: '../../frontend/src/assets/products/electronics/cameras/canon-eos-r6-mark2-2.jpg', cloudinary: 'shopease/products/electronics/cameras/canon-eos-r6-mark2-2' },

  // Clothing - Shoes
  { local: '../../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-1.jpg', cloudinary: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-1' },
  { local: '../../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-2.jpg', cloudinary: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-2' },
  { local: '../../frontend/src/assets/products/clothing/shoes/nike-air-jordan-4-travis-scott-3.jpg', cloudinary: 'shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-3' },
  { local: '../../frontend/src/assets/products/clothing/shoes/yeezy-boost-350-v2-1.jpg', cloudinary: 'shopease/products/clothing/shoes/yeezy-boost-350-v2-1' },
  { local: '../../frontend/src/assets/products/clothing/shoes/yeezy-boost-350-v2-2.jpg', cloudinary: 'shopease/products/clothing/shoes/yeezy-boost-350-v2-2' },
  { local: '../../frontend/src/assets/products/clothing/shoes/yeezy-boost-350-v2-3.jpg', cloudinary: 'shopease/products/clothing/shoes/yeezy-boost-350-v2-3' },

  // Clothing - Apparel
  { local: '../../frontend/src/assets/products/clothing/apparel/supreme-box-logo-hoodie-1.jpg', cloudinary: 'shopease/products/clothing/apparel/supreme-box-logo-hoodie-1' },
  { local: '../../frontend/src/assets/products/clothing/apparel/supreme-box-logo-hoodie-2.jpg', cloudinary: 'shopease/products/clothing/apparel/supreme-box-logo-hoodie-2' },

  // Books
  { local: '../../frontend/src/assets/products/books/atomic-habits-1.jpg', cloudinary: 'shopease/products/books/atomic-habits-1' },
  { local: '../../frontend/src/assets/products/books/atomic-habits-2.jpg', cloudinary: 'shopease/products/books/atomic-habits-2' },
  { local: '../../frontend/src/assets/products/books/harry-potter-set-1.jpg', cloudinary: 'shopease/products/books/harry-potter-set-1' },
  { local: '../../frontend/src/assets/products/books/harry-potter-set-2.jpg', cloudinary: 'shopease/products/books/harry-potter-set-2' },

  // Beauty
  { local: '../../frontend/src/assets/products/beauty/tea-tree-face-wash-1.jpg', cloudinary: 'shopease/products/beauty/tea-tree-face-wash-1' },
  { local: '../../frontend/src/assets/products/beauty/tea-tree-face-wash-2.jpg', cloudinary: 'shopease/products/beauty/tea-tree-face-wash-2' },

  // Food & Beverages
  { local: '../../frontend/src/assets/products/food-beverages/organic-green-tea-1.jpg', cloudinary: 'shopease/products/food-beverages/organic-green-tea-1' },
  { local: '../../frontend/src/assets/products/food-beverages/organic-green-tea-2.jpg', cloudinary: 'shopease/products/food-beverages/organic-green-tea-2' },

  // Toys
  { local: '../../frontend/src/assets/products/toys/barbie-dreamhouse-1.jpg', cloudinary: 'shopease/products/toys/barbie-dreamhouse-1' }
];

const generateUploadInstructions = () => {
  console.log('📋 CLOUDINARY MANUAL UPLOAD INSTRUCTIONS\n');
  console.log('🔗 Go to: https://cloudinary.com/console (login with your account)\n');
  
  console.log('📁 CREATE THESE FOLDERS IN CLOUDINARY:');
  const folders = [...new Set(imagesToUpload.map(img => img.cloudinary.split('/').slice(0, -1).join('/')))];
  folders.forEach(folder => {
    console.log(`   📂 ${folder}`);
  });
  
  console.log('\n📤 UPLOAD THESE IMAGES:\n');
  
  imagesToUpload.forEach((img, index) => {
    const fullPath = path.resolve(__dirname, img.local);
    const fileName = path.basename(fullPath);
    const folder = img.cloudinary.split('/').slice(0, -1).join('/');
    
    console.log(`${index + 1}. ${fileName}`);
    console.log(`   📁 Upload to folder: ${folder}`);
    console.log(`   📍 Local path: ${fullPath}`);
    console.log(`   🔗 Final URL: https://res.cloudinary.com/YOUR-CLOUD-NAME/image/upload/v1/${img.cloudinary}.${path.extname(fileName).slice(1)}`);
    console.log('');
  });
  
  console.log('🎯 AFTER UPLOAD:');
  console.log('1. Replace YOUR-CLOUD-NAME with your actual Cloudinary cloud name');
  console.log('2. Update the seed data with correct URLs');
  console.log('3. Test your application');
  
  console.log('\n📊 SUMMARY:');
  console.log(`   • Total images to upload: ${imagesToUpload.length}`);
  console.log(`   • Total folders to create: ${folders.length}`);
  console.log(`   • All images are ready in local folders`);
};

const generateCloudinaryURLs = (cloudName = 'YOUR-CLOUD-NAME') => {
  console.log('\n🔗 GENERATED CLOUDINARY URLS:\n');
  
  imagesToUpload.forEach(img => {
    const extension = path.extname(img.local);
    const url = `https://res.cloudinary.com/${cloudName}/image/upload/v1/${img.cloudinary}${extension}`;
    console.log(`${path.basename(img.local)} -> ${url}`);
  });
};

const checkLocalFiles = () => {
  console.log('\n🔍 CHECKING LOCAL FILES:\n');
  
  let existingFiles = 0;
  let missingFiles = 0;
  
  imagesToUpload.forEach(img => {
    const fullPath = path.resolve(__dirname, img.local);
    const fileName = path.basename(fullPath);
    
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${fileName}`);
      existingFiles++;
    } else {
      console.log(`❌ ${fileName} - NOT FOUND`);
      missingFiles++;
    }
  });
  
  console.log(`\n📊 File Status:`);
  console.log(`   ✅ Found: ${existingFiles} files`);
  console.log(`   ❌ Missing: ${missingFiles} files`);
  
  if (missingFiles === 0) {
    console.log('\n🎉 All files are ready for upload!');
  } else {
    console.log('\n⚠️  Some files are missing. Please check the paths.');
  }
};

// Run all functions
console.log('🚀 CLOUDINARY UPLOAD HELPER\n');
console.log('=' * 50);

checkLocalFiles();
generateUploadInstructions();
generateCloudinaryURLs();

console.log('\n' + '=' * 50);
console.log('📞 Need help? Check the setup guide: scripts/cloudinarySetupGuide.md');
console.log('=' * 50);
