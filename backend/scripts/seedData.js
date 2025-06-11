import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Product from '../models/Product.js';

// Load environment variables
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@shopease.com',
      password: 'admin123456',
      role: 'admin',
      isEmailVerified: true,
      isActive: true
    });

    await adminUser.save();
    console.log('Admin user created');

    // Create demo user
    const demoUser = new User({
      name: 'Demo User',
      email: 'user@example.com',
      password: 'password123',
      role: 'user',
      isEmailVerified: true,
      isActive: true,
      addresses: [{
        type: 'home',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        isDefault: true
      }]
    });

    await demoUser.save();
    console.log('Demo user created');

    console.log('Users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Get admin user for createdBy field
    const adminUser = await User.findOne({ email: 'admin@shopease.com' });

    const sampleProducts = [
      // Test Product - ₹1
      {
        name: 'Test Product - ₹1',
        description: 'This is a test product created for testing purposes. It costs only ₹1 to test the complete shopping flow including cart, checkout, and payment functionality.',
        shortDescription: 'Test product for ₹1 - Perfect for testing',
        price: 100, // ₹1 in paisa (100 paisa = ₹1)
        originalPrice: 500, // ₹5 original price to show discount
        category: 'Electronics',
        subcategory: 'Testing',
        brand: 'TestBrand',
        sku: 'TEST-PRODUCT-001',
        images: [
          {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHJ4PSIyMCIgZmlsbD0iIzM0RDM5OSIvPgo8dGV4dCB4PSIyMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlRFU1Q8L3RleHQ+Cjx0ZXh0IHg9IjIwMCIgeT0iMjEwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7iuLkxPC90ZXh0Pgo8dGV4dCB4PSIyMDAiIHk9IjI0MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UHJvZHVjdDwvdGV4dD4KPC9zdmc+',
            alt: 'Test Product - ₹1',
            isPrimary: true
          }
        ],
        stock: 999,
        isActive: true,
        isFeatured: true,
        specifications: [
          { name: 'Type', value: 'Test Product' },
          { name: 'Price', value: '₹1' },
          { name: 'Purpose', value: 'Testing' },
          { name: 'Availability', value: 'In Stock' }
        ],
        features: [
          'Perfect for testing',
          'Only ₹1 price',
          'Instant delivery',
          'Test all features'
        ],
        tags: ['test', 'cheap', 'demo', 'sample'],
        seoTitle: 'Test Product ₹1 - Perfect for Testing Shopping Cart',
        seoDescription: 'Test product for only ₹1. Perfect for testing shopping cart, checkout, and payment functionality.',
        seoKeywords: ['test product', 'cheap', 'demo', 'shopping test'],
        createdBy: adminUser._id
      },
      // Electronics
      {
        name: 'iPhone 16 Pro Max',
        description: 'The most advanced iPhone ever with A18 Pro chip, titanium design, and revolutionary camera system. Features the new Action Button and USB-C connectivity.',
        shortDescription: 'Latest iPhone with A18 Pro chip',
        price: 159900,
        originalPrice: 179900,
        category: 'Electronics',
        subcategory: 'Smartphones',
        brand: 'Apple',
        sku: 'IPHONE16PROMAX',
        images: [
          {
            url: 'https://res.cloudinary.com/Jarvis/image/upload/v1/shopease/products/electronics/smartphones/iphone-16-pro-max-1.jpg',
            alt: 'iPhone 16 Pro Max - Front View',
            isPrimary: true
          },
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/smartphones/iphone-16-pro-max-2.jpg',
            alt: 'iPhone 16 Pro Max - Side View',
            isPrimary: false
          },
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/smartphones/iphone-16-pro-max-3.jpg',
            alt: 'iPhone 16 Pro Max - Back View',
            isPrimary: false
          }
        ],
        stock: 45,
        isFeatured: true,
        specifications: [
          { name: 'Display', value: '6.9-inch Super Retina XDR' },
          { name: 'Chip', value: 'A18 Pro' },
          { name: 'Camera', value: '48MP Fusion + 48MP Ultra Wide + 12MP Telephoto' },
          { name: 'Storage', value: '256GB' }
        ],
        features: ['Action Button', 'USB-C', 'Titanium Design', '5G Ready', 'Face ID'],
        tags: ['smartphone', 'apple', 'iphone', 'premium', 'titanium'],
        createdBy: adminUser._id
      },
      {
        name: 'Google Pixel 9 Pro',
        description: 'AI-powered smartphone with Magic Eraser, Best Take, and incredible computational photography. Pure Android experience with 7 years of updates.',
        shortDescription: 'AI-powered Android flagship',
        price: 109999,
        originalPrice: 124999,
        category: 'Electronics',
        subcategory: 'Smartphones',
        brand: 'Google',
        sku: 'PIXEL9PRO',
        images: [
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/smartphones/google-pixel-9-pro-1.jpg',
            alt: 'Google Pixel 9 Pro - Front View',
            isPrimary: true
          },
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/smartphones/google-pixel-9-pro-2.jpg',
            alt: 'Google Pixel 9 Pro - Back View',
            isPrimary: false
          },
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/smartphones/google-pixel-9-pro-3.jpg',
            alt: 'Google Pixel 9 Pro - Camera Bar',
            isPrimary: false
          }
        ],
        stock: 40,
        isFeatured: true,
        specifications: [
          { name: 'Display', value: '6.3-inch LTPO OLED' },
          { name: 'Processor', value: 'Google Tensor G4' },
          { name: 'Camera', value: '50MP Main + 48MP Ultra Wide + 48MP Telephoto' },
          { name: 'Storage', value: '128GB' }
        ],
        features: ['Magic Eraser', 'Best Take', 'Call Screen', '7 years updates', 'Titan M security'],
        tags: ['smartphone', 'google', 'pixel', 'ai', 'photography'],
        createdBy: adminUser._id
      },
      {
        name: 'MacBook Pro 16" M4 Pro',
        description: 'The most powerful MacBook Pro ever with M4 Pro chip, Liquid Retina XDR display, and professional performance for creators and developers.',
        shortDescription: 'Professional laptop with M4 Pro chip',
        price: 249900,
        originalPrice: 279900,
        category: 'Electronics',
        subcategory: 'Laptops',
        brand: 'Apple',
        sku: 'MACBOOKPROM4PRO',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
            alt: 'MacBook Pro M4 Pro - Open View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
            alt: 'MacBook Pro M4 Pro - Closed View',
            isPrimary: false
          },
          {
            url: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80',
            alt: 'MacBook Pro M4 Pro - Side Profile',
            isPrimary: false
          }
        ],
        stock: 25,
        isFeatured: true,
        specifications: [
          { name: 'Chip', value: 'Apple M4 Pro' },
          { name: 'Display', value: '16.2-inch Liquid Retina XDR' },
          { name: 'Memory', value: '18GB unified memory' },
          { name: 'Storage', value: '512GB SSD' }
        ],
        features: ['22-hour battery life', 'Thunderbolt 5', 'MagSafe 3', 'Touch ID', 'Studio-quality mics'],
        tags: ['laptop', 'apple', 'macbook', 'professional', 'm4'],
        createdBy: adminUser._id
      },
      {
        name: 'ASUS ROG Zephyrus G16',
        description: 'Ultimate gaming laptop with RTX 4080, Intel Core i9, and 240Hz display. Perfect for gaming and content creation.',
        shortDescription: 'High-performance gaming laptop',
        price: 199999,
        originalPrice: 229999,
        category: 'Electronics',
        subcategory: 'Laptops',
        brand: 'ASUS',
        sku: 'ASUSROGZEPHYRUS',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
            alt: 'ASUS ROG Zephyrus - Open View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
            alt: 'ASUS ROG Zephyrus - RGB Keyboard',
            isPrimary: false
          }
        ],
        stock: 20,
        specifications: [
          { name: 'Processor', value: 'Intel Core i9-14900HX' },
          { name: 'Graphics', value: 'NVIDIA RTX 4080' },
          { name: 'Display', value: '16-inch 240Hz QHD+' },
          { name: 'Memory', value: '32GB DDR5' },
          { name: 'Storage', value: '1TB SSD' }
        ],
        features: ['240Hz display', 'RGB keyboard', 'Advanced cooling', 'Thunderbolt 4'],
        tags: ['laptop', 'asus', 'gaming', 'rtx', 'high-performance'],
        createdBy: adminUser._id
      },
      {
        name: 'AirPods Pro 3rd Gen',
        description: 'Revolutionary AirPods with Adaptive Audio, Personalized Spatial Audio, and USB-C charging case. The most advanced AirPods ever.',
        shortDescription: 'Premium wireless earbuds',
        price: 24900,
        originalPrice: 27900,
        category: 'Electronics',
        subcategory: 'Audio',
        brand: 'Apple',
        sku: 'AIRPODSPRO3',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            alt: 'AirPods Pro 3rd Gen - Case and Earbuds',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
            alt: 'AirPods Pro 3rd Gen - In Ear',
            isPrimary: false
          },
          {
            url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
            alt: 'AirPods Pro 3rd Gen - USB-C Case',
            isPrimary: false
          }
        ],
        stock: 80,
        isFeatured: true,
        specifications: [
          { name: 'Battery Life', value: '6 hours + 30 hours with case' },
          { name: 'Connectivity', value: 'Bluetooth 5.3' },
          { name: 'Noise Cancellation', value: 'Adaptive Audio' },
          { name: 'Charging', value: 'USB-C + Wireless' }
        ],
        features: ['Adaptive Audio', 'Personalized Spatial Audio', 'USB-C charging', 'Conversation Awareness'],
        tags: ['earbuds', 'apple', 'airpods', 'wireless', 'anc'],
        createdBy: adminUser._id
      },
      {
        name: 'LG OLED C4 77" 4K Smart TV',
        description: 'Self-lit OLED pixels deliver perfect blacks and infinite contrast. α9 AI Processor 4K Gen7 with Dolby Vision and Atmos.',
        shortDescription: '77-inch OLED 4K Smart TV',
        price: 299999,
        originalPrice: 349999,
        category: 'Electronics',
        subcategory: 'TVs',
        brand: 'LG',
        sku: 'LGOLED77C4',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80',
            alt: 'LG OLED C4 77" - Front View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=800&q=80',
            alt: 'LG OLED C4 - Ultra Slim Profile',
            isPrimary: false
          },
          {
            url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
            alt: 'LG OLED C4 - Magic Remote',
            isPrimary: false
          }
        ],
        stock: 12,
        isFeatured: true,
        specifications: [
          { name: 'Screen Size', value: '77 inches' },
          { name: 'Resolution', value: '4K UHD (3840 x 2160)' },
          { name: 'Technology', value: 'Self-lit OLED' },
          { name: 'Processor', value: 'α9 AI Processor 4K Gen7' },
          { name: 'Smart Platform', value: 'webOS 24' }
        ],
        features: ['Perfect blacks', 'Dolby Vision IQ', 'Dolby Atmos', 'NVIDIA G-SYNC', 'VRR 120Hz'],
        tags: ['tv', 'lg', 'oled', '4k', 'gaming', 'dolby'],
        createdBy: adminUser._id
      },

      // Clothing & Fashion
      {
        name: 'Nike Air Jordan 4 Travis Scott',
        description: 'Limited edition collaboration with Travis Scott featuring premium materials and unique colorway. A must-have for sneaker collectors.',
        shortDescription: 'Limited edition Travis Scott collaboration',
        price: 45999,
        originalPrice: 52999,
        category: 'Clothing',
        subcategory: 'Shoes',
        brand: 'Nike',
        sku: 'JORDAN4TRAVIS',
        images: [
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-1.jpg',
            alt: 'Nike Air Jordan 4 Travis Scott - Main View',
            isPrimary: true
          },
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-2.jpg',
            alt: 'Nike Air Jordan 4 Travis Scott - Side Profile',
            isPrimary: false
          },
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/clothing/shoes/nike-air-jordan-4-travis-scott-3.jpg',
            alt: 'Nike Air Jordan 4 Travis Scott - Sole Detail',
            isPrimary: false
          }
        ],
        stock: 25,
        isFeatured: true,
        variants: [{
          name: 'Size',
          options: [
            { value: '7', stock: 3 },
            { value: '8', stock: 5 },
            { value: '9', stock: 8 },
            { value: '10', stock: 6 },
            { value: '11', stock: 3 }
          ]
        }],
        specifications: [
          { name: 'Material', value: 'Premium suede and leather' },
          { name: 'Sole', value: 'Rubber outsole with Air cushioning' },
          { name: 'Collaboration', value: 'Travis Scott x Nike' }
        ],
        features: ['Limited edition', 'Premium materials', 'Collector\'s item', 'Unique colorway'],
        tags: ['shoes', 'nike', 'jordan', 'travis-scott', 'limited', 'collaboration'],
        createdBy: adminUser._id
      },
      {
        name: 'Yeezy Boost 350 V2',
        description: 'Iconic Yeezy silhouette with Primeknit upper and BOOST midsole. Designed by Kanye West for ultimate comfort and style.',
        shortDescription: 'Iconic Yeezy lifestyle sneakers',
        price: 22999,
        originalPrice: 25999,
        category: 'Clothing',
        subcategory: 'Shoes',
        brand: 'Adidas',
        sku: 'YEEZY350V2',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
            alt: 'Yeezy Boost 350 V2 - Main View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
            alt: 'Yeezy Boost 350 V2 - Side View',
            isPrimary: false
          },
          {
            url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
            alt: 'Yeezy Boost 350 V2 - Boost Technology',
            isPrimary: false
          }
        ],
        stock: 35,
        isFeatured: true,
        variants: [{
          name: 'Size',
          options: [
            { value: '7', stock: 5 },
            { value: '8', stock: 8 },
            { value: '9', stock: 10 },
            { value: '10', stock: 8 },
            { value: '11', stock: 4 }
          ]
        }],
        specifications: [
          { name: 'Upper', value: 'Primeknit textile' },
          { name: 'Midsole', value: 'BOOST energy return' },
          { name: 'Designer', value: 'Kanye West' }
        ],
        features: ['Yeezy design', 'BOOST comfort', 'Primeknit upper', 'Lifestyle icon'],
        tags: ['shoes', 'yeezy', 'adidas', 'kanye', 'lifestyle', 'boost'],
        createdBy: adminUser._id
      },
      {
        name: 'Supreme Box Logo Hoodie',
        description: 'Iconic Supreme box logo hoodie in premium cotton fleece. A streetwear essential and collector\'s piece.',
        shortDescription: 'Iconic streetwear hoodie',
        price: 35999,
        originalPrice: 42999,
        category: 'Clothing',
        subcategory: 'Hoodies',
        brand: 'Supreme',
        sku: 'SUPREMEBOXLOGO',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
            alt: 'Supreme Box Logo Hoodie - Front View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&q=80',
            alt: 'Supreme Box Logo Hoodie - Back View',
            isPrimary: false
          },
          {
            url: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80',
            alt: 'Supreme Box Logo Hoodie - Detail View',
            isPrimary: false
          }
        ],
        stock: 15,
        isFeatured: true,
        variants: [{
          name: 'Size',
          options: [
            { value: 'S', stock: 2 },
            { value: 'M', stock: 4 },
            { value: 'L', stock: 5 },
            { value: 'XL', stock: 3 },
            { value: 'XXL', stock: 1 }
          ]
        }],
        specifications: [
          { name: 'Material', value: '100% Cotton fleece' },
          { name: 'Fit', value: 'Regular' },
          { name: 'Origin', value: 'Made in Canada' }
        ],
        features: ['Box logo design', 'Premium cotton', 'Collector\'s item', 'Streetwear icon'],
        tags: ['hoodie', 'supreme', 'streetwear', 'box-logo', 'limited'],
        createdBy: adminUser._id
      },

      // Home & Garden
      {
        name: 'Tesla Powerwall 3',
        description: 'Home battery system that stores solar energy and provides backup power during outages. Smart energy management for modern homes.',
        shortDescription: 'Home battery energy storage system',
        price: 899999,
        originalPrice: 999999,
        category: 'Home & Garden',
        subcategory: 'Smart Home',
        brand: 'Tesla',
        sku: 'TESLAPOWERWALL3',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            alt: 'Tesla Powerwall 3 - Installation',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
            alt: 'Tesla Powerwall 3 - App Control',
            isPrimary: false
          },
          {
            url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&q=80',
            alt: 'Tesla Powerwall 3 - Solar Integration',
            isPrimary: false
          }
        ],
        stock: 8,
        isFeatured: true,
        specifications: [
          { name: 'Capacity', value: '13.5 kWh' },
          { name: 'Power Output', value: '11.5 kW continuous' },
          { name: 'Efficiency', value: '97.5% round-trip' },
          { name: 'Warranty', value: '10 years' }
        ],
        features: ['Solar integration', 'Backup power', 'Smart monitoring', 'Weather resistant'],
        tags: ['battery', 'tesla', 'solar', 'smart-home', 'energy'],
        createdBy: adminUser._id
      },
      {
        name: 'Philips Air Fryer XXL',
        description: 'Extra large air fryer with Rapid Air technology for healthy cooking.',
        shortDescription: 'Large capacity air fryer',
        price: 18999,
        originalPrice: 22999,
        category: 'Home & Garden',
        subcategory: 'Kitchen',
        brand: 'Philips',
        sku: 'PHILIPSAIRFRYERXXL',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1585515656973-a0b8b3d0b6d7?w=800&q=80',
            alt: 'Philips Air Fryer XXL - Main View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
            alt: 'Philips Air Fryer XXL - Digital Display',
            isPrimary: false
          },
          {
            url: 'https://images.unsplash.com/photo-1574781330855-d0db2706b3d0?w=800&q=80',
            alt: 'Philips Air Fryer XXL - Cooking Food',
            isPrimary: false
          }
        ],
        stock: 50,
        specifications: [
          { name: 'Capacity', value: '7.3 liters' },
          { name: 'Power', value: '2225W' },
          { name: 'Technology', value: 'Rapid Air' },
          { name: 'Programs', value: '13 preset programs' }
        ],
        features: ['XXL family size', 'Fat removal technology', 'Digital display', 'Dishwasher safe'],
        tags: ['air-fryer', 'philips', 'kitchen', 'healthy-cooking'],
        createdBy: adminUser._id
      },

      // Books
      {
        name: 'Fourth Wing by Rebecca Yarros',
        description: 'The explosive first book in the Empyrean series. A thrilling fantasy romance that has taken the world by storm.',
        shortDescription: 'Bestselling fantasy romance',
        price: 599,
        originalPrice: 799,
        category: 'Books',
        subcategory: 'Fantasy',
        brand: 'Piatkus Books',
        sku: 'FOURTHWING',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
            alt: 'Fourth Wing - Book Cover',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
            alt: 'Fourth Wing - Open Book',
            isPrimary: false
          }
        ],
        stock: 150,
        isFeatured: true,
        specifications: [
          { name: 'Author', value: 'Rebecca Yarros' },
          { name: 'Pages', value: '512' },
          { name: 'Language', value: 'English' },
          { name: 'Format', value: 'Paperback' }
        ],
        features: ['TikTok sensation', 'Fantasy romance', 'Dragon riders', 'Series starter'],
        tags: ['book', 'fantasy', 'romance', 'bestseller', 'tiktok', 'dragons'],
        createdBy: adminUser._id
      },

      // Beauty
      {
        name: 'Lakme Absolute Perfect Radiance Kit',
        description: 'Complete skincare kit for radiant and glowing skin.',
        shortDescription: 'Complete skincare kit',
        price: 2499,
        originalPrice: 2999,
        category: 'Beauty',
        subcategory: 'Skincare',
        brand: 'Lakme',
        sku: 'LAKMERADIANCEKIT',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
            alt: 'Lakme Skincare Kit - Complete Set',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&q=80',
            alt: 'Lakme Skincare Kit - Individual Products',
            isPrimary: false
          },
          {
            url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
            alt: 'Lakme Skincare Kit - Application',
            isPrimary: false
          }
        ],
        stock: 85,
        specifications: [
          { name: 'Kit Contents', value: 'Cleanser, Toner, Serum, Moisturizer' },
          { name: 'Skin Type', value: 'All skin types' },
          { name: 'Benefits', value: 'Radiance, Hydration' }
        ],
        features: ['Complete routine', 'Dermatologically tested', 'Natural ingredients', 'Visible results'],
        tags: ['skincare', 'lakme', 'beauty', 'radiance', 'kit'],
        createdBy: adminUser._id
      },

      // More Electronics
      {
        name: 'iPad Pro 12.9" M2',
        description: 'The ultimate iPad experience with M2 chip and Liquid Retina XDR display.',
        shortDescription: 'Professional tablet with M2 chip',
        price: 109900,
        originalPrice: 119900,
        category: 'Electronics',
        subcategory: 'Tablets',
        brand: 'Apple',
        sku: 'IPADPROM2',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
            alt: 'iPad Pro M2 - Front View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&q=80',
            alt: 'iPad Pro M2 - With Apple Pencil',
            isPrimary: false
          }
        ],
        stock: 40,
        isFeatured: true,
        specifications: [
          { name: 'Display', value: '12.9-inch Liquid Retina XDR' },
          { name: 'Chip', value: 'Apple M2' },
          { name: 'Storage', value: '128GB' },
          { name: 'Camera', value: '12MP Wide + 10MP Ultra Wide' }
        ],
        features: ['M2 chip performance', 'Apple Pencil support', 'Magic Keyboard compatible', 'All-day battery'],
        tags: ['tablet', 'apple', 'ipad', 'professional', 'm2'],
        createdBy: adminUser._id
      },
      {
        name: 'PlayStation 5',
        description: 'Next-generation gaming console with ultra-high speed SSD and ray tracing.',
        shortDescription: 'Next-gen gaming console',
        price: 49990,
        originalPrice: 54990,
        category: 'Electronics',
        subcategory: 'Gaming',
        brand: 'Sony',
        sku: 'PLAYSTATION5',
        images: [
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/gaming/playstation-5-1.jpg',
            alt: 'PlayStation 5 - Console',
            isPrimary: true
          },
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/gaming/playstation-5-2.jpg',
            alt: 'PlayStation 5 - Controller',
            isPrimary: false
          }
        ],
        stock: 25,
        isFeatured: true,
        specifications: [
          { name: 'CPU', value: 'AMD Zen 2' },
          { name: 'GPU', value: 'AMD RDNA 2' },
          { name: 'Storage', value: '825GB SSD' },
          { name: 'Resolution', value: 'Up to 4K 120fps' }
        ],
        features: ['Ray tracing', 'Ultra-high speed SSD', 'DualSense controller', '3D audio'],
        tags: ['gaming', 'sony', 'playstation', 'console', '4k'],
        createdBy: adminUser._id
      },
      {
        name: 'Canon EOS R6 Mark II',
        description: 'Professional mirrorless camera with 24.2MP sensor and advanced autofocus.',
        shortDescription: 'Professional mirrorless camera',
        price: 249900,
        originalPrice: 279900,
        category: 'Electronics',
        subcategory: 'Cameras',
        brand: 'Canon',
        sku: 'CANONR6MARK2',
        images: [
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/cameras/canon-eos-r6-mark2-1.jpg',
            alt: 'Canon EOS R6 Mark II - Front View',
            isPrimary: true
          },
          {
            url: 'https://res.cloudinary.com/djd7um7/image/upload/v1/shopease/products/electronics/cameras/canon-eos-r6-mark2-2.jpg',
            alt: 'Canon EOS R6 Mark II - Side View',
            isPrimary: false
          }
        ],
        stock: 15,
        specifications: [
          { name: 'Sensor', value: '24.2MP Full-Frame CMOS' },
          { name: 'Video', value: '4K 60p / FHD 180p' },
          { name: 'ISO Range', value: '100-102400' },
          { name: 'Autofocus', value: '1053 AF points' }
        ],
        features: ['In-body stabilization', 'Dual card slots', 'Weather sealing', 'Silent shooting'],
        tags: ['camera', 'canon', 'mirrorless', 'professional', 'photography'],
        createdBy: adminUser._id
      },

      // More Clothing
      {
        name: 'Zara Slim Fit Shirt',
        description: 'Premium cotton shirt with modern slim fit design.',
        shortDescription: 'Slim fit cotton shirt',
        price: 2999,
        originalPrice: 3499,
        category: 'Clothing',
        subcategory: 'Shirts',
        brand: 'Zara',
        sku: 'ZARASLIMSHIRT',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
            alt: 'Zara Slim Fit Shirt - Front View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
            alt: 'Zara Slim Fit Shirt - Detail',
            isPrimary: false
          }
        ],
        stock: 150,
        variants: [{
          name: 'Size',
          options: [
            { value: 'S', stock: 30 },
            { value: 'M', stock: 40 },
            { value: 'L', stock: 50 },
            { value: 'XL', stock: 30 }
          ]
        }],
        specifications: [
          { name: 'Material', value: '100% Cotton' },
          { name: 'Fit', value: 'Slim' },
          { name: 'Care', value: 'Machine washable' }
        ],
        features: ['Slim fit', 'Premium cotton', 'Easy care', 'Modern design'],
        tags: ['shirt', 'zara', 'cotton', 'slim-fit', 'formal'],
        createdBy: adminUser._id
      },
      {
        name: 'H&M Summer Dress',
        description: 'Flowy summer dress perfect for casual and semi-formal occasions.',
        shortDescription: 'Casual summer dress',
        price: 1999,
        originalPrice: 2499,
        category: 'Clothing',
        subcategory: 'Dresses',
        brand: 'H&M',
        sku: 'HMSUMMERDRESS',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80',
            alt: 'H&M Summer Dress - Front View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=800&q=80',
            alt: 'H&M Summer Dress - Side View',
            isPrimary: false
          }
        ],
        stock: 100,
        variants: [{
          name: 'Size',
          options: [
            { value: 'XS', stock: 15 },
            { value: 'S', stock: 25 },
            { value: 'M', stock: 35 },
            { value: 'L', stock: 20 },
            { value: 'XL', stock: 5 }
          ]
        }],
        specifications: [
          { name: 'Material', value: 'Polyester blend' },
          { name: 'Length', value: 'Midi' },
          { name: 'Style', value: 'A-line' }
        ],
        features: ['Flowy design', 'Comfortable fit', 'Versatile styling', 'Easy care'],
        tags: ['dress', 'hm', 'summer', 'casual', 'midi'],
        createdBy: adminUser._id
      },

      // Sports
      {
        name: 'Nike Dri-FIT Running Shorts',
        description: 'Lightweight running shorts with moisture-wicking technology.',
        shortDescription: 'Performance running shorts',
        price: 2499,
        originalPrice: 2999,
        category: 'Sports',
        subcategory: 'Apparel',
        brand: 'Nike',
        sku: 'NIKERUNSHORTS',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80',
            alt: 'Nike Running Shorts - Front View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
            alt: 'Nike Running Shorts - Side View',
            isPrimary: false
          }
        ],
        stock: 200,
        variants: [{
          name: 'Size',
          options: [
            { value: 'S', stock: 40 },
            { value: 'M', stock: 60 },
            { value: 'L', stock: 70 },
            { value: 'XL', stock: 30 }
          ]
        }],
        specifications: [
          { name: 'Material', value: 'Dri-FIT polyester' },
          { name: 'Length', value: '7-inch inseam' },
          { name: 'Features', value: 'Moisture-wicking' }
        ],
        features: ['Dri-FIT technology', 'Lightweight', 'Quick-dry', 'Comfortable fit'],
        tags: ['sports', 'nike', 'running', 'shorts', 'dri-fit'],
        createdBy: adminUser._id
      },
      {
        name: 'Wilson Tennis Racket Pro',
        description: 'Professional tennis racket with carbon fiber frame for power and control.',
        shortDescription: 'Professional tennis racket',
        price: 12999,
        originalPrice: 14999,
        category: 'Sports',
        subcategory: 'Equipment',
        brand: 'Wilson',
        sku: 'WILSONTENNISPRO',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
            alt: 'Wilson Tennis Racket - Main View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&q=80',
            alt: 'Wilson Tennis Racket - Detail',
            isPrimary: false
          }
        ],
        stock: 50,
        specifications: [
          { name: 'Head Size', value: '100 sq in' },
          { name: 'Weight', value: '300g' },
          { name: 'String Pattern', value: '16x19' },
          { name: 'Material', value: 'Carbon Fiber' }
        ],
        features: ['Carbon fiber frame', 'Power and control', 'Professional grade', 'Comfortable grip'],
        tags: ['sports', 'wilson', 'tennis', 'racket', 'professional'],
        createdBy: adminUser._id
      },

      // Toys
      {
        name: 'LEGO Creator Expert Taj Mahal',
        description: 'Detailed LEGO model of the iconic Taj Mahal with over 5900 pieces.',
        shortDescription: 'LEGO Taj Mahal building set',
        price: 34999,
        originalPrice: 39999,
        category: 'Toys',
        subcategory: 'Building Sets',
        brand: 'LEGO',
        sku: 'LEGOTAJMAHAL',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            alt: 'LEGO Taj Mahal - Complete Model',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
            alt: 'LEGO Taj Mahal - Building Process',
            isPrimary: false
          }
        ],
        stock: 20,
        isFeatured: true,
        specifications: [
          { name: 'Pieces', value: '5923' },
          { name: 'Age Range', value: '18+' },
          { name: 'Dimensions', value: '51cm x 41cm x 20cm' },
          { name: 'Series', value: 'Creator Expert' }
        ],
        features: ['5900+ pieces', 'Detailed architecture', 'Display worthy', 'Premium building experience'],
        tags: ['toys', 'lego', 'building', 'architecture', 'expert'],
        createdBy: adminUser._id
      },
      {
        name: 'Barbie Dreamhouse Playset',
        description: 'Three-story dollhouse with elevator, lights, and sounds.',
        shortDescription: 'Barbie dollhouse playset',
        price: 15999,
        originalPrice: 18999,
        category: 'Toys',
        subcategory: 'Dolls',
        brand: 'Mattel',
        sku: 'BARBIEDREAMHOUSE',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            alt: 'Barbie Dreamhouse - Complete Set',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1566479179817-c0b5b4b4b1e5?w=800&q=80',
            alt: 'Barbie Dreamhouse - Interior',
            isPrimary: false
          }
        ],
        stock: 35,
        specifications: [
          { name: 'Stories', value: '3 stories' },
          { name: 'Rooms', value: '8 rooms' },
          { name: 'Features', value: 'Elevator, lights, sounds' },
          { name: 'Age Range', value: '3-12 years' }
        ],
        features: ['Working elevator', 'Lights and sounds', '8 rooms', 'Furniture included'],
        tags: ['toys', 'barbie', 'dollhouse', 'playset', 'girls'],
        createdBy: adminUser._id
      },

      // Automotive
      {
        name: 'Bosch Car Battery 12V',
        description: 'High-performance car battery with long-lasting power and reliability.',
        shortDescription: 'Car battery 12V 60Ah',
        price: 8999,
        originalPrice: 9999,
        category: 'Automotive',
        subcategory: 'Batteries',
        brand: 'Bosch',
        sku: 'BOSCHBATTERY12V',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            alt: 'Bosch Car Battery - Main View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
            alt: 'Bosch Car Battery - Terminals',
            isPrimary: false
          }
        ],
        stock: 75,
        specifications: [
          { name: 'Voltage', value: '12V' },
          { name: 'Capacity', value: '60Ah' },
          { name: 'CCA', value: '540A' },
          { name: 'Warranty', value: '3 years' }
        ],
        features: ['Long-lasting power', 'Maintenance-free', 'Vibration resistant', 'Quick start'],
        tags: ['automotive', 'bosch', 'battery', 'car', '12v'],
        createdBy: adminUser._id
      },

      // Health
      {
        name: 'Optimum Nutrition Whey Protein',
        description: 'Gold Standard 100% Whey protein powder for muscle building and recovery.',
        shortDescription: 'Whey protein powder 2.27kg',
        price: 4999,
        originalPrice: 5999,
        category: 'Health',
        subcategory: 'Supplements',
        brand: 'Optimum Nutrition',
        sku: 'ONWHEYPROTEIN',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80',
            alt: 'Optimum Nutrition Whey Protein - Container',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
            alt: 'Whey Protein - Scoop and Powder',
            isPrimary: false
          }
        ],
        stock: 100,
        specifications: [
          { name: 'Protein per serving', value: '24g' },
          { name: 'Servings', value: '74' },
          { name: 'Flavor', value: 'Double Rich Chocolate' },
          { name: 'Weight', value: '2.27kg' }
        ],
        features: ['24g protein per serving', 'Fast absorption', 'Muscle recovery', 'Great taste'],
        tags: ['health', 'protein', 'supplements', 'fitness', 'muscle'],
        createdBy: adminUser._id
      },
      {
        name: 'Fitbit Charge 5 Fitness Tracker',
        description: 'Advanced fitness tracker with built-in GPS and health monitoring.',
        shortDescription: 'Advanced fitness tracker',
        price: 19999,
        originalPrice: 22999,
        category: 'Health',
        subcategory: 'Fitness',
        brand: 'Fitbit',
        sku: 'FITBITCHARGE5',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800&q=80',
            alt: 'Fitbit Charge 5 - Main View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
            alt: 'Fitbit Charge 5 - Display',
            isPrimary: false
          }
        ],
        stock: 80,
        isFeatured: true,
        specifications: [
          { name: 'Battery Life', value: 'Up to 7 days' },
          { name: 'GPS', value: 'Built-in GPS' },
          { name: 'Water Resistance', value: '50 meters' },
          { name: 'Display', value: 'Color AMOLED' }
        ],
        features: ['Built-in GPS', 'Heart rate monitoring', 'Sleep tracking', 'Stress management'],
        tags: ['health', 'fitbit', 'fitness', 'tracker', 'gps'],
        createdBy: adminUser._id
      },

      // Food & Beverages
      {
        name: 'Organic Green Tea Bags',
        description: 'Premium organic green tea bags with antioxidants and natural flavor.',
        shortDescription: 'Organic green tea 100 bags',
        price: 899,
        originalPrice: 1199,
        category: 'Food & Beverages',
        subcategory: 'Tea',
        brand: 'Twinings',
        sku: 'ORGANICGREENTEA',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80',
            alt: 'Organic Green Tea - Package',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&q=80',
            alt: 'Green Tea - Brewed Cup',
            isPrimary: false
          }
        ],
        stock: 300,
        specifications: [
          { name: 'Quantity', value: '100 tea bags' },
          { name: 'Type', value: 'Organic Green Tea' },
          { name: 'Caffeine', value: 'Medium' },
          { name: 'Origin', value: 'China' }
        ],
        features: ['100% organic', 'Rich in antioxidants', 'Natural flavor', 'Premium quality'],
        tags: ['food', 'tea', 'organic', 'green-tea', 'healthy'],
        createdBy: adminUser._id
      },
      {
        name: 'Himalayan Pink Salt',
        description: 'Pure Himalayan pink salt crystals, unrefined and mineral-rich.',
        shortDescription: 'Himalayan pink salt 1kg',
        price: 599,
        originalPrice: 799,
        category: 'Food & Beverages',
        subcategory: 'Spices',
        brand: 'Tata Salt',
        sku: 'HIMALAYANSALT',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            alt: 'Himalayan Pink Salt - Crystals',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
            alt: 'Pink Salt - Package',
            isPrimary: false
          }
        ],
        stock: 500,
        specifications: [
          { name: 'Weight', value: '1kg' },
          { name: 'Type', value: 'Rock Salt' },
          { name: 'Source', value: 'Himalayan Mountains' },
          { name: 'Processing', value: 'Unrefined' }
        ],
        features: ['100% natural', 'Mineral-rich', 'Unrefined', 'Premium quality'],
        tags: ['food', 'salt', 'himalayan', 'natural', 'minerals'],
        createdBy: adminUser._id
      },

      // More Home & Garden
      {
        name: 'IKEA Hemnes Bookshelf',
        description: 'Solid wood bookshelf with adjustable shelves, perfect for any room.',
        shortDescription: 'Solid wood bookshelf',
        price: 12999,
        originalPrice: 14999,
        category: 'Home & Garden',
        subcategory: 'Furniture',
        brand: 'IKEA',
        sku: 'IKEA HEMNES',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
            alt: 'IKEA Hemnes Bookshelf - Main View',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
            alt: 'Bookshelf - With Books',
            isPrimary: false
          }
        ],
        stock: 25,
        specifications: [
          { name: 'Material', value: 'Solid pine wood' },
          { name: 'Dimensions', value: '90x197x37 cm' },
          { name: 'Shelves', value: '5 adjustable shelves' },
          { name: 'Color', value: 'White stain' }
        ],
        features: ['Solid wood construction', 'Adjustable shelves', 'Easy assembly', 'Timeless design'],
        tags: ['furniture', 'ikea', 'bookshelf', 'storage', 'wood'],
        createdBy: adminUser._id
      },

      // More Books
      {
        name: 'Atomic Habits by James Clear',
        description: 'An easy and proven way to build good habits and break bad ones.',
        shortDescription: 'Self-help bestseller',
        price: 449,
        originalPrice: 599,
        category: 'Books',
        subcategory: 'Self-Help',
        brand: 'Random House',
        sku: 'ATOMICHABITS',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
            alt: 'Atomic Habits - Book Cover',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
            alt: 'Atomic Habits - Open Book',
            isPrimary: false
          }
        ],
        stock: 250,
        specifications: [
          { name: 'Author', value: 'James Clear' },
          { name: 'Pages', value: '320' },
          { name: 'Language', value: 'English' },
          { name: 'Format', value: 'Paperback' }
        ],
        features: ['International bestseller', 'Practical strategies', 'Easy to implement', 'Life-changing'],
        tags: ['book', 'self-help', 'habits', 'bestseller', 'productivity'],
        createdBy: adminUser._id
      },
      {
        name: 'Harry Potter Complete Series',
        description: 'Complete collection of all 7 Harry Potter books in a beautiful box set.',
        shortDescription: 'Harry Potter 7-book set',
        price: 3999,
        originalPrice: 4999,
        category: 'Books',
        subcategory: 'Fiction',
        brand: 'Bloomsbury',
        sku: 'HARRYPOTTERSET',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
            alt: 'Harry Potter Box Set - Complete Collection',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
            alt: 'Harry Potter Books - Individual Volumes',
            isPrimary: false
          }
        ],
        stock: 100,
        isFeatured: true,
        specifications: [
          { name: 'Author', value: 'J.K. Rowling' },
          { name: 'Books', value: '7 complete novels' },
          { name: 'Language', value: 'English' },
          { name: 'Format', value: 'Paperback box set' }
        ],
        features: ['Complete series', 'Beautiful box set', 'Collector\'s edition', 'Perfect gift'],
        tags: ['book', 'harry-potter', 'fiction', 'series', 'fantasy'],
        createdBy: adminUser._id
      },

      // More Beauty Products
      {
        name: 'Maybelline Fit Me Foundation',
        description: 'Lightweight liquid foundation that matches your skin tone perfectly.',
        shortDescription: 'Liquid foundation 30ml',
        price: 699,
        originalPrice: 899,
        category: 'Beauty',
        subcategory: 'Makeup',
        brand: 'Maybelline',
        sku: 'MAYBELLINEFITME',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
            alt: 'Maybelline Fit Me Foundation - Bottle',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
            alt: 'Foundation - Application',
            isPrimary: false
          }
        ],
        stock: 200,
        variants: [{
          name: 'Shade',
          options: [
            { value: 'Fair', stock: 40 },
            { value: 'Light', stock: 60 },
            { value: 'Medium', stock: 70 },
            { value: 'Dark', stock: 30 }
          ]
        }],
        specifications: [
          { name: 'Volume', value: '30ml' },
          { name: 'Coverage', value: 'Medium' },
          { name: 'Finish', value: 'Natural' },
          { name: 'SPF', value: 'SPF 18' }
        ],
        features: ['Perfect match', 'Lightweight', 'Natural finish', 'SPF protection'],
        tags: ['beauty', 'maybelline', 'foundation', 'makeup', 'coverage'],
        createdBy: adminUser._id
      },
      {
        name: 'The Body Shop Tea Tree Face Wash',
        description: 'Purifying face wash with tea tree oil for blemish-prone skin.',
        shortDescription: 'Tea tree face wash 250ml',
        price: 1299,
        originalPrice: 1599,
        category: 'Beauty',
        subcategory: 'Skincare',
        brand: 'The Body Shop',
        sku: 'TBSTEATREEWASH',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&q=80',
            alt: 'Tea Tree Face Wash - Bottle',
            isPrimary: true
          },
          {
            url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
            alt: 'Face Wash - Application',
            isPrimary: false
          }
        ],
        stock: 150,
        specifications: [
          { name: 'Volume', value: '250ml' },
          { name: 'Skin Type', value: 'Blemish-prone' },
          { name: 'Key Ingredient', value: 'Tea Tree Oil' },
          { name: 'Benefits', value: 'Purifying, Cleansing' }
        ],
        features: ['Tea tree oil', 'Purifying formula', 'Gentle cleansing', 'Natural ingredients'],
        tags: ['beauty', 'bodyshop', 'facewash', 'teatree', 'skincare'],
        createdBy: adminUser._id
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('Sample products created');

    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};

const seedData = async () => {
  try {
    await connectDB();
    await seedUsers();
    await seedProducts();
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\n📧 Demo Credentials:');
    console.log('Admin: admin@shopease.com / admin123456');
    console.log('User: user@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Run the seeding
seedData();
