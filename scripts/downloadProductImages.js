const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Product images mapping from seed data
const productImages = [
  // Electronics - Smartphones
  {
    name: 'iphone-16-pro-max-1.jpg',
    url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
    category: 'electronics/smartphones'
  },
  {
    name: 'iphone-16-pro-max-2.jpg',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    category: 'electronics/smartphones'
  },
  {
    name: 'iphone-16-pro-max-3.jpg',
    url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
    category: 'electronics/smartphones'
  },
  {
    name: 'google-pixel-9-pro-1.jpg',
    url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
    category: 'electronics/smartphones'
  },
  {
    name: 'google-pixel-9-pro-2.jpg',
    url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80',
    category: 'electronics/smartphones'
  },
  {
    name: 'google-pixel-9-pro-3.jpg',
    url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
    category: 'electronics/smartphones'
  },

  // Electronics - Gaming
  {
    name: 'playstation-5-1.jpg',
    url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&q=80',
    category: 'electronics/gaming'
  },
  {
    name: 'playstation-5-2.jpg',
    url: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&q=80',
    category: 'electronics/gaming'
  },

  // Electronics - Cameras
  {
    name: 'canon-eos-r6-mark2-1.jpg',
    url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
    category: 'electronics/cameras'
  },
  {
    name: 'canon-eos-r6-mark2-2.jpg',
    url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&q=80',
    category: 'electronics/cameras'
  },

  // Clothing - Shoes
  {
    name: 'nike-air-jordan-4-travis-scott-1.jpg',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    category: 'clothing/shoes'
  },
  {
    name: 'nike-air-jordan-4-travis-scott-2.jpg',
    url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
    category: 'clothing/shoes'
  },
  {
    name: 'nike-air-jordan-4-travis-scott-3.jpg',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    category: 'clothing/shoes'
  },
  {
    name: 'yeezy-boost-350-v2-1.jpg',
    url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
    category: 'clothing/shoes'
  },
  {
    name: 'yeezy-boost-350-v2-2.jpg',
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    category: 'clothing/shoes'
  },
  {
    name: 'yeezy-boost-350-v2-3.jpg',
    url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
    category: 'clothing/shoes'
  },

  // Clothing - Apparel
  {
    name: 'supreme-box-logo-hoodie-1.jpg',
    url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    category: 'clothing/apparel'
  },
  {
    name: 'supreme-box-logo-hoodie-2.jpg',
    url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80',
    category: 'clothing/apparel'
  },

  // Books
  {
    name: 'atomic-habits-1.jpg',
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    category: 'books'
  },
  {
    name: 'atomic-habits-2.jpg',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    category: 'books'
  },
  {
    name: 'harry-potter-set-1.jpg',
    url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    category: 'books'
  },
  {
    name: 'harry-potter-set-2.jpg',
    url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    category: 'books'
  },

  // Toys
  {
    name: 'barbie-dreamhouse-1.jpg',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    category: 'toys'
  },
  {
    name: 'barbie-dreamhouse-2.jpg',
    url: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=800&q=80',
    category: 'toys'
  },

  // Food & Beverages
  {
    name: 'organic-green-tea-1.jpg',
    url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
    category: 'food-beverages'
  },
  {
    name: 'organic-green-tea-2.jpg',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
    category: 'food-beverages'
  },

  // Beauty
  {
    name: 'tea-tree-face-wash-1.jpg',
    url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80',
    category: 'beauty'
  },
  {
    name: 'tea-tree-face-wash-2.jpg',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    category: 'beauty'
  }
];

// Function to download image
const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filepath}`);
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete the file on error
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
};

// Main download function
const downloadAllImages = async () => {
  console.log('🚀 Starting product images download...\n');
  
  const baseDir = path.join(__dirname, '../frontend/src/assets/products');
  
  for (const image of productImages) {
    try {
      const categoryDir = path.join(baseDir, image.category);
      const filepath = path.join(categoryDir, image.name);
      
      // Ensure directory exists
      if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
      }
      
      // Download image
      await downloadImage(image.url, filepath);
      
      // Add small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Failed to download ${image.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 Product images download completed!');
  console.log(`📁 Images saved to: ${baseDir}`);
};

// Run the download
downloadAllImages().catch(console.error);
