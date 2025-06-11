import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Star,
  ShoppingBag,
  Users,
  Zap,
  Gift,
  Percent,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';

// Components
import LoadingSpinner from '../components/common/LoadingSpinner';
import ProductCard from '../components/product/ProductCard';
import PromotionalBanner from '../components/promotional/PromotionalBanner';
import LifestyleBanner from '../components/promotional/LifestyleBanner';
import SpecialOffers from '../components/promotional/SpecialOffers';
import api from '../utils/api';

// Import Cloudinary images using the correct cloud name
const s24Image = 'https://res.cloudinary.com/jarvis/image/upload/v1/shopease/products/electronics/smartphones/samsung-s24.png';
const airpodsImage = 'https://res.cloudinary.com/jarvis/image/upload/v1/shopease/products/electronics/accessories/airpods.png';
const appleWatchImage = 'https://res.cloudinary.com/jarvis/image/upload/v1/shopease/products/electronics/accessories/apple-watch.png';

const Home = () => {
  // Navigation
  const navigate = useNavigate();

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch products from database
  const { data: productsData, isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ['products', 'homepage'],
    queryFn: async () => {
      const response = await api.get('/products?limit=50'); // Fetch more products for variety
      return response.data;
    }
  });

  // Performance and accessibility optimizations
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for reduced motion preference and mobile screen
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    setPrefersReducedMotion(mediaQuery.matches);
    setIsMobile(mobileQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    const handleMobileChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener('change', handleMotionChange);
    mobileQuery.addEventListener('change', handleMobileChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      mobileQuery.removeEventListener('change', handleMobileChange);
    };
  }, []);

  // Animation configuration based on user preference and device
  const getAnimationProps = (animationConfig) => {
    if (prefersReducedMotion) {
      return {
        ...animationConfig,
        animate: { opacity: 1 },
        transition: { duration: 0.3 }
      };
    }

    // Optimize animations for mobile devices
    if (isMobile && animationConfig.animate) {
      const mobileConfig = { ...animationConfig };
      if (mobileConfig.transition) {
        mobileConfig.transition = {
          ...mobileConfig.transition,
          duration: Math.min(mobileConfig.transition.duration || 1, 0.8)
        };
      }
      return mobileConfig;
    }

    return animationConfig;
  };

  // Enhanced sample products with better descriptions and features
  const sampleProducts = [
    {
      _id: '1',
      name: 'iPhone 16 Pro',
      price: 79999,
      originalPrice: 89999,
      category: 'Electronics',
      stock: 25,
      rating: { average: 4.8, count: 1247 },
      reviews: [
        { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 5 }
      ],
      shortDescription: 'Revolutionary iPhone 16 Pro with titanium design, A18 Pro chip, and advanced camera system',
      features: ['A18 Pro Chip', 'Titanium Design', 'Pro Camera System', '5G Ready'],
      badge: 'Bestseller',
      images: ['https://pngimg.com/uploads/iphone16/iphone16_PNG27.png']
    },
    {
      _id: '2',
      name: 'MacBook Air M3',
      price: 99999,
      originalPrice: 119999,
      category: 'Electronics',
      stock: 15,
      rating: { average: 4.9, count: 892 },
      reviews: [
        { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }
      ],
      shortDescription: 'Ultra-thin MacBook Air with M3 chip delivering exceptional performance and all-day battery life',
      features: ['M3 Chip', '18-hour Battery', 'Liquid Retina Display', 'Silent Operation'],
      badge: 'New',
      images: ['https://pngimg.com/uploads/macbook/macbook_PNG8.png']
    },
    {
      _id: '3',
      name: 'AirPods Pro 2',
      price: 24999,
      originalPrice: 27999,
      category: 'Electronics',
      stock: 50,
      rating: { average: 4.7, count: 2156 },
      reviews: [
        { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 5 }
      ],
      shortDescription: 'Next-generation AirPods Pro with active noise cancellation and immersive spatial audio',
      features: ['Active Noise Cancellation', 'Spatial Audio', 'Adaptive Transparency', 'MagSafe Charging'],
      badge: 'Popular',
      images: [airpodsImage]
    },
    {
      _id: '4',
      name: 'Samsung Galaxy S24',
      price: 74999,
      originalPrice: 84999,
      category: 'Electronics',
      stock: 30,
      rating: { average: 4.6, count: 1834 },
      reviews: [
        { rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 5 }, { rating: 4 }
      ],
      shortDescription: 'AI-powered Galaxy S24 with advanced camera system and intelligent features for modern life',
      features: ['AI Photography', '200MP Camera', 'S Pen Compatible', 'All-day Battery'],
      badge: 'Featured',
      images: [s24Image]
    },
    {
      _id: '5',
      name: 'Sony WH-1000XM5',
      price: 29999,
      originalPrice: 34999,
      category: 'Electronics',
      stock: 20,
      rating: { average: 4.8, count: 967 },
      reviews: [
        { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }
      ],
      shortDescription: 'Industry-leading noise canceling headphones with premium sound quality and comfort',
      features: ['30-hour Battery', 'Quick Charge', 'Multipoint Connection', 'Touch Controls'],
      badge: 'Editor\'s Choice',
      images: ['https://pngimg.com/uploads/headphones/headphones_PNG7646.png']
    },
    {
      _id: '6',
      name: 'Apple Watch Ultra',
      price: 79999,
      originalPrice: 89999,
      category: 'Electronics',
      stock: 12,
      rating: { average: 4.7, count: 543 },
      reviews: [
        { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 5 }
      ],
      shortDescription: 'Most rugged and capable Apple Watch designed for extreme adventures and professional use',
      features: ['Titanium Case', 'Action Button', '36-hour Battery', 'Precision GPS'],
      badge: 'Premium',
      images: [appleWatchImage]
    },
    {
      _id: '7',
      name: 'Nike Air Max 270',
      price: 12999,
      originalPrice: 15999,
      category: 'Footwear',
      stock: 35,
      rating: { average: 4.5, count: 1672 },
      reviews: [
        { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 5 }
      ],
      shortDescription: 'Comfortable lifestyle sneakers with Max Air cushioning for all-day comfort and style',
      features: ['Max Air Cushioning', 'Breathable Mesh', 'Durable Outsole', 'Iconic Design'],
      badge: 'Trending',
      images: ['https://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png']
    },
    {
      _id: '8',
      name: 'Canon EOS R5',
      price: 299999,
      originalPrice: 329999,
      category: 'Electronics',
      stock: 8,
      rating: { average: 4.9, count: 234 },
      reviews: [
        { rating: 5 }, { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }
      ],
      shortDescription: 'Professional mirrorless camera with 8K video recording and advanced autofocus system',
      features: ['45MP Full-Frame', '8K Video', 'In-Body Stabilization', 'Dual Card Slots'],
      badge: 'Professional',
      images: ['https://pngimg.com/uploads/photo_camera/photo_camera_PNG101.png']
    },
    {
      _id: '9',
      name: 'PlayStation 5',
      price: 49999,
      originalPrice: 54999,
      category: 'Gaming',
      stock: 22,
      rating: { average: 4.8, count: 3421 },
      reviews: [
        { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }
      ],
      shortDescription: 'Next-generation gaming console with lightning-fast SSD and immersive gaming experience',
      features: ['Ultra-High Speed SSD', '4K Gaming', 'Ray Tracing', 'DualSense Controller'],
      badge: 'Hot Deal',
      images: ['https://pngimg.com/uploads/playstation_5/playstation_5_PNG17.png']
    },
    {
      _id: '10',
      name: 'Adidas Running Shoes',
      price: 8999,
      originalPrice: 11999,
      category: 'Footwear',
      stock: 45,
      rating: { average: 4.4, count: 892 },
      reviews: [
        { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 5 }
      ],
      shortDescription: 'Comfortable running shoes with advanced cushioning technology for all-day comfort',
      features: ['Boost Cushioning', 'Breathable Upper', 'Durable Outsole', 'Lightweight Design'],
      badge: 'Popular',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80']
    },
    {
      _id: '11',
      name: 'Levi\'s Denim Jacket',
      price: 4999,
      originalPrice: 6999,
      category: 'Clothing',
      stock: 28,
      rating: { average: 4.6, count: 567 },
      reviews: [
        { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 4 }
      ],
      shortDescription: 'Classic denim jacket with timeless style and premium quality construction',
      features: ['100% Cotton Denim', 'Classic Fit', 'Button Closure', 'Multiple Pockets'],
      badge: 'Trending',
      images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80']
    },
    {
      _id: '12',
      name: 'Wireless Gaming Mouse',
      price: 3999,
      originalPrice: 5499,
      category: 'Electronics',
      stock: 67,
      rating: { average: 4.7, count: 1234 },
      reviews: [
        { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }, { rating: 4 }
      ],
      shortDescription: 'High-precision wireless gaming mouse with customizable RGB lighting and programmable buttons',
      features: ['16000 DPI Sensor', 'RGB Lighting', 'Programmable Buttons', '100-hour Battery'],
      badge: 'Editor\'s Choice',
      images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80']
    },
    {
      _id: '13',
      name: 'Casual Cotton T-Shirt',
      price: 1299,
      originalPrice: 1899,
      category: 'Clothing',
      stock: 89,
      rating: { average: 4.3, count: 2156 },
      reviews: [
        { rating: 4 }, { rating: 4 }, { rating: 5 }, { rating: 4 }, { rating: 4 }
      ],
      shortDescription: 'Soft and comfortable cotton t-shirt perfect for everyday casual wear',
      features: ['100% Cotton', 'Pre-shrunk', 'Comfortable Fit', 'Machine Washable'],
      badge: 'New',
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80']
    },
    {
      _id: '14',
      name: 'Bluetooth Earbuds',
      price: 2999,
      originalPrice: 4499,
      category: 'Electronics',
      stock: 156,
      rating: { average: 4.5, count: 3421 },
      reviews: [
        { rating: 5 }, { rating: 4 }, { rating: 4 }, { rating: 5 }, { rating: 4 }
      ],
      shortDescription: 'True wireless earbuds with active noise cancellation and long battery life',
      features: ['Active Noise Cancellation', '24-hour Battery', 'IPX4 Water Resistant', 'Touch Controls'],
      badge: 'Featured',
      images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80']
    },
    {
      _id: '15',
      name: 'Leather Wallet',
      price: 1999,
      originalPrice: 2999,
      category: 'Fashion',
      stock: 78,
      rating: { average: 4.8, count: 456 },
      reviews: [
        { rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 5 }, { rating: 5 }
      ],
      shortDescription: 'Premium leather wallet with RFID blocking technology and multiple card slots',
      features: ['Genuine Leather', 'RFID Blocking', '8 Card Slots', 'Coin Pocket'],
      badge: 'Premium',
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80']
    }
  ];

  // Utility function to shuffle array with seed for consistent randomization
  const shuffleWithSeed = (array, seed) => {
    const shuffled = [...array];
    let currentIndex = shuffled.length;
    let temporaryValue, randomIndex;

    // Simple seeded random number generator
    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    while (0 !== currentIndex) {
      randomIndex = Math.floor(seededRandom(seed + currentIndex) * currentIndex);
      currentIndex -= 1;

      temporaryValue = shuffled[currentIndex];
      shuffled[currentIndex] = shuffled[randomIndex];
      shuffled[randomIndex] = temporaryValue;
    }

    return shuffled;
  };

  // Function to distribute products across sections without duplicates
  const distributeProducts = (products) => {
    if (!products || products.length === 0) {
      return {
        bestSellers: [],
        newArrivals: [],
        trending: [],
        deals: [],
        electronics: [],
        fashion: []
      };
    }

    const usedProductIds = new Set();
    const sections = {};

    // Get current date for time-based seed
    const today = new Date();
    const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    // Helper function to get products for a section
    const getProductsForSection = (filterFn, sectionName, maxCount = 6, fallbackProducts = []) => {
      // First, get products that match the filter and haven't been used
      let availableProducts = products.filter(product =>
        filterFn(product) && !usedProductIds.has(product._id)
      );

      // If not enough products, add fallback products that haven't been used
      if (availableProducts.length < maxCount && fallbackProducts.length > 0) {
        const additionalProducts = fallbackProducts.filter(product =>
          !usedProductIds.has(product._id) && !availableProducts.some(p => p._id === product._id)
        );
        availableProducts = [...availableProducts, ...additionalProducts];
      }

      // If still not enough products, add any remaining unused products
      if (availableProducts.length < maxCount) {
        const remainingProducts = products.filter(product =>
          !usedProductIds.has(product._id) && !availableProducts.some(p => p._id === product._id)
        );
        availableProducts = [...availableProducts, ...remainingProducts];
      }

      // Shuffle with section-specific seed for randomization
      const sectionSeed = dateSeed + sectionName.length * 1000;
      const shuffledProducts = shuffleWithSeed(availableProducts, sectionSeed);

      // Take the required number of products
      const selectedProducts = shuffledProducts.slice(0, maxCount);

      // Mark these products as used
      selectedProducts.forEach(product => usedProductIds.add(product._id));

      return selectedProducts;
    };

    // Distribute products to each section in priority order

    // 1. Best Sellers - High priority for featured products and high ratings
    sections.bestSellers = getProductsForSection(
      product => product.isFeatured || product.rating?.average >= 4.7,
      'bestSellers',
      6, // Reduced count to ensure distribution
      products.filter(p => p.rating?.average >= 4.5) // Fallback to good ratings
    );

    // 2. New Arrivals - Recently created products
    sections.newArrivals = getProductsForSection(
      product => {
        const createdDate = new Date(product.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate > thirtyDaysAgo || product.isFeatured;
      },
      'newArrivals',
      6,
      products.filter(p => p.isFeatured) // Fallback to featured products
    );

    // 3. Trending Now - Products with high view counts or ratings
    sections.trending = getProductsForSection(
      product => product.viewCount > 100 || product.rating?.average >= 4.0,
      'trending',
      6,
      products.filter(p => p.rating?.average >= 4.0) // Fallback to decent ratings
    );

    // 4. Deal of the Day - Discounted products
    sections.deals = getProductsForSection(
      product => (product.originalPrice && product.originalPrice > product.price),
      'deals',
      6,
      products.filter(p => p.originalPrice && p.originalPrice > p.price) // Fallback to any discounted
    );

    // 5. Electronics - Electronics category
    sections.electronics = getProductsForSection(
      product => product.category === 'Electronics',
      'electronics',
      6,
      products.filter(p => p.subcategory === 'Gaming' || p.subcategory === 'Smartphones') // Fallback to gaming/smartphones
    );

    // 6. Fashion - Clothing and Fashion categories
    sections.fashion = getProductsForSection(
      product => product.category === 'Clothing',
      'fashion',
      6,
      products.filter(p => p.subcategory === 'Shoes' || p.subcategory === 'Apparel') // Fallback to shoes/apparel
    );

    return sections;
  };

  // Get products from API or fallback to sample products
  const products = productsData?.products || sampleProducts;

  // Distribute products across sections
  const distributedProducts = distributeProducts(products);

  // Debug: Log product distribution (remove in production)
  // console.log('Products:', products.map(p => ({
  //   id: p._id,
  //   name: p.name,
  //   badge: p.badge,
  //   category: p.category,
  //   rating: p.rating?.average,
  //   hasDiscount: p.originalPrice > p.price
  // })));

  // console.log('Product Distribution:', {
  //   bestSellers: distributedProducts.bestSellers.map(p => ({ id: p._id, name: p.name, badge: p.badge })),
  //   newArrivals: distributedProducts.newArrivals.map(p => ({ id: p._id, name: p.name, badge: p.badge })),
  //   trending: distributedProducts.trending.map(p => ({ id: p._id, name: p.name, badge: p.badge })),
  //   deals: distributedProducts.deals.map(p => ({ id: p._id, name: p.name, badge: p.badge })),
  //   electronics: distributedProducts.electronics.map(p => ({ id: p._id, name: p.name, category: p.category })),
  //   fashion: distributedProducts.fashion.map(p => ({ id: p._id, name: p.name, category: p.category }))
  // });

  // Use real products for slideshow
  const featuredProducts = products.slice(0, 7); // Show 7 products in slideshow

  // Auto-slide effect
  useEffect(() => {
    if (featuredProducts && featuredProducts.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [featuredProducts]);

  // Show loading state if products are being fetched
  if (isLoadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Show error state if there's an error
  if (productsError) {
    console.error('Error fetching products:', productsError);
    // Continue with sample products as fallback
  }

  // Auto-slide functionality (navigation controls removed)





  return (
    <>
      <Helmet>
        <title>ShopEase - Your Ultimate Shopping Destination</title>
        <meta name="description" content="Discover amazing products at unbeatable prices. Shop electronics, clothing, home goods and more with free shipping and easy returns." />
        <meta name="keywords" content="online shopping, electronics, clothing, home goods, deals, discounts" />
      </Helmet>

      <div className="min-h-screen mobile-content">
        {/* Hero Section - Ultra-Sophisticated Background Design with Mobile Optimization */}
        <section className="relative min-h-screen bg-gradient-to-br from-slate-50/95 via-blue-50/85 via-indigo-50/75 via-purple-50/65 via-cyan-50/75 to-blue-50/90 overflow-hidden">
          {/* Multi-layered Background System - Responsive */}
          <div className="absolute inset-0">
            {/* Base atmospheric layer */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/20 via-transparent via-indigo-100/15 to-cyan-100/25"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-100/15 via-transparent via-blue-100/20 to-indigo-100/30"></div>

            {/* Primary floating elements with sophisticated animations - Mobile Optimized */}
            <motion.div
              className="absolute top-8 sm:top-16 left-4 sm:left-8 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-blue-400/35 via-cyan-400/25 to-indigo-400/30 rounded-full blur-2xl sm:blur-3xl"
              {...getAnimationProps({
                animate: prefersReducedMotion ? { opacity: 0.4 } : {
                  y: [0, -15, 0],
                  x: [0, 8, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.25, 0.45, 0.25],
                  rotate: [0, 30, 0]
                },
                transition: prefersReducedMotion ? { duration: 0.3 } : {
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              })}
            />
            <motion.div
              className="absolute bottom-8 sm:bottom-16 right-4 sm:right-8 w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-indigo-400/30 via-purple-400/20 to-blue-400/25 rounded-full blur-2xl sm:blur-3xl"
              {...getAnimationProps({
                animate: prefersReducedMotion ? { opacity: 0.2 } : {
                  y: [0, 20, 0],
                  x: [0, -10, 0],
                  scale: [1, 0.9, 1],
                  opacity: [0.2, 0.35, 0.2],
                  rotate: [0, -45, 0]
                },
                transition: prefersReducedMotion ? { duration: 0.3 } : {
                  duration: 16,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }
              })}
            />
            <motion.div
              className="absolute top-1/3 left-1/3 w-24 h-24 sm:w-36 sm:h-36 bg-gradient-to-br from-cyan-400/35 via-sky-400/25 to-blue-400/30 rounded-full blur-xl sm:blur-2xl"
              {...getAnimationProps({
                animate: prefersReducedMotion ? { opacity: 0.15 } : {
                  x: [0, 15, 0],
                  y: [0, -15, 0],
                  scale: [1, 1.15, 1],
                  opacity: [0.15, 0.3, 0.15],
                  rotate: [0, 60, 0]
                },
                transition: prefersReducedMotion ? { duration: 0.3 } : {
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4
                }
              })}
            />
            <motion.div
              className="absolute top-1/4 right-1/4 w-28 h-28 sm:w-44 sm:h-44 bg-gradient-to-br from-purple-400/30 via-indigo-400/20 to-cyan-400/25 rounded-full blur-xl sm:blur-2xl"
              {...getAnimationProps({
                animate: prefersReducedMotion ? { opacity: 0.15 } : {
                  x: [0, -18, 0],
                  y: [0, 12, 0],
                  scale: [1, 1.1, 1],
                  opacity: [0.15, 0.28, 0.15],
                  rotate: [0, -30, 0]
                },
                transition: prefersReducedMotion ? { duration: 0.3 } : {
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }
              })}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/5 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-sky-400/35 via-cyan-400/30 to-blue-400/25 rounded-full blur-lg sm:blur-xl"
              {...getAnimationProps({
                animate: prefersReducedMotion ? { opacity: 0.2 } : {
                  y: [0, 18, 0],
                  x: [0, 12, 0],
                  scale: [1, 1.05, 1],
                  opacity: [0.2, 0.35, 0.2],
                  rotate: [0, 90, 0]
                },
                transition: prefersReducedMotion ? { duration: 0.3 } : {
                  duration: 18,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3
                }
              })}
            />

            {/* Secondary ambient elements with organic movement - Mobile Optimized */}
            <motion.div
              className="absolute top-3/4 right-1/3 w-18 h-18 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-300/25 via-indigo-300/15 to-purple-300/20 rounded-full blur-lg sm:blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.12, 0.25, 0.12],
                rotate: [0, 120, 0]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 6
              }}
            />
            <motion.div
              className="absolute top-1/6 left-2/3 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-300/30 via-sky-300/20 to-blue-300/25 rounded-full blur-md sm:blur-lg"
              animate={{
                x: [0, -10, 0],
                y: [0, 8, 0],
                scale: [1, 1.1, 1],
                opacity: [0.15, 0.28, 0.15],
                rotate: [0, -60, 0]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5
              }}
            />

            {/* Tertiary micro-elements for texture - Mobile Optimized */}
            <motion.div
              className="absolute top-1/2 left-1/6 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-300/20 to-blue-300/15 rounded-full blur-sm sm:blur-md"
              animate={{
                x: [0, 6, 0],
                y: [0, -6, 0],
                opacity: [0.08, 0.18, 0.08]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 7
              }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/6 w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-300/18 to-cyan-300/12 rounded-full blur-md sm:blur-lg"
              animate={{
                x: [0, -8, 0],
                y: [0, 7, 0],
                opacity: [0.1, 0.22, 0.1]
              }}
              transition={{
                duration: 11,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 8
              }}
            />

            {/* Advanced mesh gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 via-transparent to-blue-50/20"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-indigo-50/15 via-transparent via-purple-50/10 to-cyan-50/18"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-blue-50/12 via-transparent to-indigo-50/15"></div>

            {/* Enhanced geometric pattern overlay */}
            <div className="absolute inset-0 opacity-[0.025]" style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, #3B82F6 1.5px, transparent 1.5px),
                               radial-gradient(circle at 80% 70%, #6366F1 1px, transparent 1px),
                               radial-gradient(circle at 60% 40%, #06B6D4 0.8px, transparent 0.8px)`,
              backgroundSize: '80px 80px, 60px 60px, 100px 100px'
            }}></div>

            {/* Organic noise texture with subtle animation */}
            <motion.div
              className="absolute inset-0 opacity-[0.018]"
              animate={{ opacity: [0.015, 0.022, 0.015] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            />

            {/* Dynamic lighting effects */}
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200/8 via-transparent to-indigo-200/6"
              animate={{
                opacity: [0.6, 0.8, 0.6],
                background: [
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, transparent 50%, rgba(99, 102, 241, 0.06) 100%)',
                  'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, transparent 50%, rgba(59, 130, 246, 0.06) 100%)',
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, transparent 50%, rgba(99, 102, 241, 0.06) 100%)'
                ]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24">
            {/* Enhanced Glass Card Container - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative bg-gradient-to-br from-white/85 via-white/75 to-white/65 backdrop-blur-2xl border border-white/60 rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 lg:p-16 shadow-2xl"
              style={{
                boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.4)'
              }}
            >
              {/* Subtle inner glow effect */}
              <div className="absolute inset-0 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-blue-50/30 via-transparent to-indigo-50/20 pointer-events-none"></div>
              {/* Enhanced Brand Badges - Mobile Responsive */}
              <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg"
                >
                  ✨ Premium Quality
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-lg"
                >
                  🚚 Free Shipping
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-lg"
                >
                  🔥 Hot Deals
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center min-h-[60vh] sm:min-h-[70vh]">

              {/* Left Content - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4 sm:space-y-6 lg:space-y-8 text-gray-800 order-2 lg:order-1"
              >
                {/* Brand Name - Mobile Responsive */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 italic"
                >
                  ShopEase
                </motion.div>

                {/* Dynamic Main Heading based on current product - Mobile Responsive */}
                <motion.div
                  key={`heading-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-1 sm:space-y-2"
                >
                  <div className="border-l-2 sm:border-l-4 border-blue-500 pl-3 sm:pl-4 lg:pl-6">
                    {featuredProducts && featuredProducts[currentSlide] ? (
                      <>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-gray-900 leading-tight">
                          {featuredProducts[currentSlide]?.name?.split(' ')[0] || 'AMAZING'}
                        </h1>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-gray-900 leading-tight">
                          {featuredProducts[currentSlide]?.name?.split(' ').slice(1).join(' ') || 'PRODUCTS'}
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-gray-700 mt-1 sm:mt-2">
                          AT ₹{featuredProducts[currentSlide]?.price?.toLocaleString('en-IN') || '0'} ONLY
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-gray-900 leading-tight">
                          AMAZING
                        </h1>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-black text-gray-900 leading-tight">
                          PRODUCTS
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium text-gray-700 mt-1 sm:mt-2">
                          AT LOW PRICE
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>

                {/* Dynamic Description based on current product - Mobile Responsive */}
                <motion.p
                  key={`description-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-full sm:max-w-md"
                >
                  {featuredProducts && featuredProducts[currentSlide]
                    ? (featuredProducts[currentSlide]?.shortDescription || featuredProducts[currentSlide]?.description?.substring(0, 120) + '...' || 'Premium quality product with amazing features and unbeatable price!')
                    : 'Discover amazing products at unbeatable prices. Quality guaranteed with fast delivery!'
                  }
                </motion.p>

                {/* Enhanced Dynamic CTA Buttons - Mobile Optimized */}
                <motion.div
                  key={`cta-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4"
                >
                  {featuredProducts && featuredProducts[currentSlide] ? (
                    <>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to={`/products/${featuredProducts[currentSlide]?._id || ''}`}
                          className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[48px]"
                        >
                          <span className="text-sm sm:text-base">Explore Product</span>
                          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <button
                          onClick={() => {
                            // Add to cart functionality can be added here
                            window.location.href = `/products/${featuredProducts[currentSlide]?._id || ''}`;
                          }}
                          className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[48px]"
                        >
                          <ShoppingBag className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">Buy Now - ₹{featuredProducts[currentSlide]?.price?.toLocaleString('en-IN') || '0'}</span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/products"
                          className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[48px]"
                        >
                          <span className="text-sm sm:text-base">Discover Products</span>
                          <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Link
                          to="/register"
                          className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/90 backdrop-blur-sm border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[48px]"
                        >
                          <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base">Join Community</span>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </motion.div>

                {/* Promotional Highlights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-6"
                >
                  <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Fast Delivery
                  </div>
                  <div className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Free Gifts
                  </div>
                  <div className="flex items-center bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Percent className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Best Prices
                  </div>
                  <div className="flex items-center bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Top Quality
                  </div>
                </motion.div>

                {/* Dynamic Features based on current product - Mobile Responsive */}
                <motion.div
                  key={`features-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 pt-4 sm:pt-6 lg:pt-8"
                >
                  {featuredProducts && featuredProducts[currentSlide] ? (
                    <>
                      <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                        <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm lg:text-base">Category</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{featuredProducts[currentSlide]?.category || 'Category'}</p>
                      </div>
                      <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                        <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm lg:text-base">Stock</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {(featuredProducts[currentSlide]?.stock || 0) > 0
                            ? `${featuredProducts[currentSlide]?.stock || 0} Available`
                            : 'Out of Stock'
                          }
                        </p>
                      </div>
                      <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                        <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm lg:text-base">Rating</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {featuredProducts[currentSlide]?.rating?.average || 4.5}/5 ⭐
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                        <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm lg:text-base">Free Shipping</h4>
                        <p className="text-xs sm:text-sm text-gray-600">On orders ₹500+</p>
                      </div>
                      <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                        <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm lg:text-base">Easy Returns</h4>
                        <p className="text-xs sm:text-sm text-gray-600">30-day policy</p>
                      </div>
                      <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                        <h4 className="font-bold text-gray-800 mb-1 text-xs sm:text-sm lg:text-base">24/7 Support</h4>
                        <p className="text-xs sm:text-sm text-gray-600">Always here</p>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>

              {/* Right Content - Product Slideshow - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative flex justify-center items-center order-1 lg:order-2"
              >
                {isLoadingProducts ? (
                  <div className="flex justify-center items-center h-48 sm:h-64 lg:h-96">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : featuredProducts && featuredProducts.length > 0 ? (
                  <>
                    {/* Product Slideshow Container - Mobile Responsive */}
                    <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-lg h-48 sm:h-64 lg:h-96 overflow-hidden rounded-xl sm:rounded-2xl">
                      {/* Product Images */}
                      <div className="relative w-full h-full">
                        {featuredProducts.map((product, index) => (
                          <motion.div
                            key={product._id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: index === currentSlide ? 1 : 0,
                              scale: index === currentSlide ? 1 : 0.8,
                              zIndex: index === currentSlide ? 10 : 1
                            }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <img
                              src={product?.images?.[0]?.url || product?.images?.[0] || 'https://via.placeholder.com/400x400?text=No+Image'}
                              alt={product?.name || 'Product'}
                              className="w-full h-full object-contain drop-shadow-2xl bg-transparent max-h-[180px] sm:max-h-[240px] lg:max-h-[350px] max-w-[180px] sm:max-w-[240px] lg:max-w-[350px]"
                              style={{
                                filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15))'
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Navigation arrows and indicators removed as requested */}
                    </div>

                    {/* Floating Product Info - Mobile Responsive */}
                    {featuredProducts[currentSlide] && (
                      <>
                        <motion.div
                          key={`price-${currentSlide}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6 }}
                          className="absolute top-4 sm:top-6 lg:top-10 right-4 sm:right-6 lg:right-10 bg-white/90 backdrop-blur-md rounded-full p-2 sm:p-3 lg:p-4 border border-gray-200 shadow-xl"
                        >
                          <div className="text-center text-gray-800">
                            <div className="text-sm sm:text-lg lg:text-2xl font-bold">₹{featuredProducts[currentSlide]?.price?.toLocaleString('en-IN') || '0'}</div>
                            <div className="text-xs text-gray-600">Only</div>
                          </div>
                        </motion.div>

                        <motion.div
                          key={`rating-${currentSlide}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.6 }}
                          className="absolute bottom-4 sm:bottom-6 lg:bottom-10 left-4 sm:left-6 lg:left-10 bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 border border-gray-200 shadow-xl"
                        >
                          <div className="flex items-center space-x-1 sm:space-x-2 text-gray-800">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
                            <div>
                              <div className="font-semibold text-xs sm:text-sm lg:text-base">{featuredProducts[currentSlide]?.rating?.average || 4.5}</div>
                              <div className="text-xs text-gray-600">Rating</div>
                            </div>
                          </div>
                        </motion.div>
                      </>
                    )}

                    {/* Enhanced Background Glow */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-300/25 via-cyan-300/20 to-indigo-300/25 rounded-full blur-3xl scale-150"
                      animate={{
                        scale: [1.4, 1.6, 1.4],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-l from-purple-300/15 via-transparent to-sky-300/20 rounded-full blur-2xl scale-125"
                      animate={{
                        rotate: [0, 180, 360],
                        opacity: [0.2, 0.35, 0.2]
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </>
                ) : (
                  <div className="flex justify-center items-center h-96 text-gray-700">
                    <p>No featured products available</p>
                  </div>
                )}
              </motion.div>
              </div>
            </motion.div>
          </div>
        </section>



        {/* Product Categories Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/70 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200/15 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-100/15 to-indigo-100/15 rounded-full blur-3xl"></div>
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8 sm:mb-12 lg:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Shop by Category
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Discover our wide range of products across different categories
              </p>
            </motion.div>

            {/* Horizontal scrolling categories */}
            <div className="relative w-full">
              <div
                className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 px-2 mobile-scroll-container"
                style={{
                  scrollbarWidth: 'none !important',
                  msOverflowStyle: 'none !important',
                  WebkitScrollbar: 'none !important',
                  overflowX: 'auto',
                  overflowY: 'hidden',
                  cursor: 'grab'
                }}
                onMouseDown={(e) => e.currentTarget.style.cursor = 'grabbing'}
                onMouseUp={(e) => e.currentTarget.style.cursor = 'grab'}
                onMouseLeave={(e) => e.currentTarget.style.cursor = 'grab'}
              >
                {[
                  {
                    name: 'All Items',
                    icon: '❤️',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    count: '32+',
                    category: '' // Empty for all products
                  },
                  {
                    name: 'Electronics',
                    icon: '📱',
                    bgColor: 'bg-indigo-100',
                    textColor: 'text-indigo-700',
                    count: '9+',
                    category: 'Electronics'
                  },
                  {
                    name: 'Clothing',
                    icon: '👕',
                    bgColor: 'bg-cyan-100',
                    textColor: 'text-cyan-700',
                    count: '5+',
                    category: 'Clothing'
                  },
                  {
                    name: 'Home & Garden',
                    icon: '🏠',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    count: '3+',
                    category: 'Home & Garden'
                  },
                  {
                    name: 'Sports',
                    icon: '⚽',
                    bgColor: 'bg-indigo-100',
                    textColor: 'text-indigo-700',
                    count: '2+',
                    category: 'Sports'
                  },
                  {
                    name: 'Books',
                    icon: '📚',
                    bgColor: 'bg-cyan-100',
                    textColor: 'text-cyan-700',
                    count: '3+',
                    category: 'Books'
                  },
                  {
                    name: 'Beauty',
                    icon: '💄',
                    bgColor: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    count: '3+',
                    category: 'Beauty'
                  },
                  {
                    name: 'Toys',
                    icon: '🧸',
                    bgColor: 'bg-indigo-100',
                    textColor: 'text-indigo-700',
                    count: '2+',
                    category: 'Toys'
                  },
                  {
                    name: 'Health',
                    icon: '💊',
                    bgColor: 'bg-green-100',
                    textColor: 'text-green-700',
                    count: '2+',
                    category: 'Health'
                  },
                  {
                    name: 'Food & Beverages',
                    icon: '🍎',
                    bgColor: 'bg-orange-100',
                    textColor: 'text-orange-700',
                    count: '2+',
                    category: 'Food & Beverages'
                  },
                  {
                    name: 'Automotive',
                    icon: '🚗',
                    bgColor: 'bg-gray-100',
                    textColor: 'text-gray-700',
                    count: '1+',
                    category: 'Automotive'
                  }
                ].map((category, index) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.6,
                      ease: "easeOut"
                    }}
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() => {
                      if (category.category) {
                        navigate(`/products?category=${encodeURIComponent(category.category)}`);
                      } else {
                        navigate('/products');
                      }
                    }}
                  >
                    <div className={`${category.bgColor} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-white/50 backdrop-blur-sm min-w-[120px] sm:min-w-[140px] lg:min-w-[160px] hover:shadow-xl hover:scale-105 transition-all duration-300`}>
                      {/* Icon */}
                      <div className="text-center mb-3 sm:mb-4">
                        <div className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">
                          {category.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className={`text-sm sm:text-base lg:text-lg font-bold ${category.textColor} mb-1 sm:mb-2`}>
                          {category.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 font-medium">
                          {category.count} items
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>


        {/* Product Showcase Sections */}

        {/* Featured Products Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/70 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-10 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl"
              animate={{
                x: [0, 15, 0],
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-200/15 rounded-full blur-3xl"
              animate={{
                x: [0, -12, 0],
                y: [0, 8, 0],
                scale: [1, 1.15, 1],
                opacity: [0.12, 0.25, 0.12]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 5
              }}
            />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6 sm:mb-8 lg:mb-12"
            >
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Handpicked Selection
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Featured Products
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Handpicked products that our customers love the most
              </p>
            </motion.div>

            {/* Enhanced Horizontal scrolling products */}
            <div className="relative w-full">
              <div className="mobile-product-grid mobile-scroll-container mobile-momentum-scroll flex overflow-x-auto gap-3 sm:gap-4 lg:gap-6 pb-4 px-2 mobile-touch-friendly">
                {products.slice(0, 10).map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 mobile-scroll-item mobile-optimized"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-pink-50/70 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-10 right-10 w-36 h-36 bg-purple-200/20 rounded-full blur-2xl"
              animate={{
                x: [0, -15, 0],
                y: [0, 10, 0],
                scale: [1, 1.3, 1],
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{
                duration: 14,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6 sm:mb-8 lg:mb-12"
            >
              <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                Most Popular
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  Best Sellers
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Top-rated products that customers can't get enough of
              </p>
            </motion.div>

            {/* Enhanced Horizontal scrolling products */}
            <div className="relative w-full">
              <div className="mobile-product-grid mobile-scroll-container mobile-momentum-scroll flex overflow-x-auto gap-3 sm:gap-4 lg:gap-6 pb-4 px-2 mobile-touch-friendly">
                {(distributedProducts.bestSellers && distributedProducts.bestSellers.length > 0
                  ? distributedProducts.bestSellers
                  : products.slice(0, 6)
                ).map((product, index) => (
                  <motion.div
                    key={`bestseller-${product._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 mobile-scroll-item mobile-optimized"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/70 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute bottom-10 left-10 w-44 h-44 bg-green-200/20 rounded-full blur-2xl"
              animate={{
                x: [0, 12, 0],
                y: [0, -8, 0],
                scale: [1, 1.1, 1],
                opacity: [0.15, 0.25, 0.15]
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6 sm:mb-8 lg:mb-12"
            >
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Fresh Collection
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  New Arrivals
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Latest products just added to our collection
              </p>
            </motion.div>

            {/* Enhanced Horizontal scrolling products */}
            <div className="relative w-full">
              <div className="mobile-product-grid mobile-scroll-container mobile-momentum-scroll flex overflow-x-auto gap-3 sm:gap-4 lg:gap-6 pb-4 px-2 mobile-touch-friendly">
                {(distributedProducts.newArrivals && distributedProducts.newArrivals.length > 0
                  ? distributedProducts.newArrivals
                  : products.slice(6, 12)
                ).map((product, index) => (
                  <motion.div
                    key={`new-${product._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 mobile-scroll-item mobile-optimized"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Trending Now Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-orange-50/80 via-amber-50/60 to-yellow-50/70 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/2 right-10 w-40 h-40 bg-orange-200/20 rounded-full blur-2xl"
              animate={{
                x: [0, -10, 0],
                y: [0, 15, 0],
                scale: [1, 1.2, 1],
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{
                duration: 13,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6 sm:mb-8 lg:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                Trending Now
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                What's hot and popular among shoppers right now
              </p>
            </motion.div>

            {/* Horizontal scrolling products */}
            <div className="relative w-full">
              <div className="mobile-product-grid mobile-scroll-container mobile-momentum-scroll flex overflow-x-auto gap-3 sm:gap-4 lg:gap-6 pb-4 px-2 mobile-touch-friendly">
                {(distributedProducts.trending && distributedProducts.trending.length > 0
                  ? distributedProducts.trending
                  : products.slice(3, 9)
                ).map((product, index) => (
                  <motion.div
                    key={`trending-${product._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 mobile-scroll-item mobile-optimized"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Deal of the Day Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-red-50/80 via-pink-50/60 to-rose-50/70 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-10 left-1/2 w-48 h-48 bg-red-200/20 rounded-full blur-2xl"
              animate={{
                x: [0, 20, 0],
                y: [0, -12, 0],
                scale: [1, 1.15, 1],
                opacity: [0.15, 0.28, 0.15]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6 sm:mb-8 lg:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                Deal of the Day
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Limited time offers with incredible discounts
              </p>
            </motion.div>

            {/* Horizontal scrolling products */}
            <div className="relative w-full">
              <div className="mobile-product-grid mobile-scroll-container flex overflow-x-auto gap-3 sm:gap-4 lg:gap-6 pb-4 px-2 mobile-touch-friendly">
                {(distributedProducts.deals && distributedProducts.deals.length > 0
                  ? distributedProducts.deals
                  : products.slice(9, 15)
                ).map((product, index) => (
                  <motion.div
                    key={`deal-${product._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 mobile-scroll-item"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Electronics Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-slate-50/80 via-gray-50/60 to-zinc-50/70 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute bottom-10 right-1/3 w-36 h-36 bg-slate-200/20 rounded-full blur-2xl"
              animate={{
                x: [0, 8, 0],
                y: [0, -18, 0],
                scale: [1, 1.25, 1],
                opacity: [0.15, 0.3, 0.15]
              }}
              transition={{
                duration: 17,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6 sm:mb-8 lg:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                Electronics & Gadgets
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Latest technology and innovative gadgets for modern life
              </p>
            </motion.div>

            {/* Horizontal scrolling products */}
            <div className="relative w-full">
              <div className="mobile-product-grid mobile-scroll-container flex overflow-x-auto gap-3 sm:gap-4 lg:gap-6 pb-4 px-2 mobile-touch-friendly">
                {(distributedProducts.electronics && distributedProducts.electronics.length > 0
                  ? distributedProducts.electronics
                  : products.filter(p => p.category === 'Electronics').slice(0, 6)
                ).map((product, index) => (
                  <motion.div
                    key={`electronics-${product._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 mobile-scroll-item"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Fashion & Clothing Section */}
        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-rose-50/80 via-pink-50/60 to-fuchsia-50/70 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/3 left-10 w-42 h-42 bg-rose-200/20 rounded-full blur-2xl"
              animate={{
                x: [0, 14, 0],
                y: [0, 10, 0],
                scale: [1, 1.18, 1],
                opacity: [0.15, 0.28, 0.15]
              }}
              transition={{
                duration: 19,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-6 sm:mb-8 lg:mb-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
                Fashion & Style
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Trendy clothing and accessories for every occasion
              </p>
            </motion.div>

            {/* Horizontal scrolling products */}
            <div className="relative w-full">
              <div className="mobile-product-grid mobile-scroll-container flex overflow-x-auto gap-3 sm:gap-4 lg:gap-6 pb-4 px-2 mobile-touch-friendly">
                {(distributedProducts.fashion && distributedProducts.fashion.length > 0
                  ? distributedProducts.fashion
                  : products.filter(p => p.category === 'Clothing' || p.category === 'Fashion').slice(0, 6)
                ).map((product, index) => (
                  <motion.div
                    key={`fashion-${product._id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex-shrink-0 w-40 sm:w-48 md:w-56 lg:w-64 mobile-scroll-item"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>


      </div>
    </>
  );
};

export default Home;
