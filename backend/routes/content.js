import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Mock data for content management
const mockBanners = [
  {
    _id: '1',
    title: 'Summer Collection 2024',
    description: 'Discover our latest summer fashion trends',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    link: '/products?category=clothing',
    order: 1,
    isActive: true,
    createdAt: new Date('2024-06-01')
  },
  {
    _id: '2',
    title: 'Electronics Sale',
    description: 'Up to 50% off on all electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800',
    link: '/products?category=electronics',
    order: 2,
    isActive: true,
    createdAt: new Date('2024-06-15')
  },
  {
    _id: '3',
    title: 'Home & Garden',
    description: 'Transform your living space',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    link: '/products?category=home-garden',
    order: 3,
    isActive: false,
    createdAt: new Date('2024-05-20')
  }
];

const mockCategories = [
  {
    _id: '1',
    name: 'Electronics',
    description: 'Latest gadgets and electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200',
    productCount: 125,
    isActive: true,
    isFeatured: true,
    order: 1
  },
  {
    _id: '2',
    name: 'Clothing',
    description: 'Fashion for all occasions',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    productCount: 89,
    isActive: true,
    isFeatured: true,
    order: 2
  },
  {
    _id: '3',
    name: 'Home & Garden',
    description: 'Everything for your home',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200',
    productCount: 67,
    isActive: true,
    isFeatured: false,
    order: 3
  },
  {
    _id: '4',
    name: 'Sports',
    description: 'Sports and fitness equipment',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
    productCount: 45,
    isActive: true,
    isFeatured: false,
    order: 4
  }
];

const mockPages = [
  {
    _id: '1',
    title: 'About Us',
    slug: 'about',
    description: 'Learn more about our company',
    content: '<h1>About ShopEase</h1><p>We are a leading e-commerce platform...</p>',
    isPublished: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-01')
  },
  {
    _id: '2',
    title: 'Privacy Policy',
    slug: 'privacy',
    description: 'Our privacy policy and data protection',
    content: '<h1>Privacy Policy</h1><p>Your privacy is important to us...</p>',
    isPublished: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-05-15')
  },
  {
    _id: '3',
    title: 'Terms of Service',
    slug: 'terms',
    description: 'Terms and conditions for using our service',
    content: '<h1>Terms of Service</h1><p>By using our service, you agree to...</p>',
    isPublished: false,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-06-10')
  }
];

// @desc    Get homepage banners
// @route   GET /api/content/banners
// @access  Private (Admin only)
router.get('/banners', protect, authorize('admin'), async (req, res) => {
  try {
    res.json({
      success: true,
      banners: mockBanners.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching banners'
    });
  }
});

// @desc    Get categories
// @route   GET /api/content/categories
// @access  Private (Admin only)
router.get('/categories', protect, authorize('admin'), async (req, res) => {
  try {
    res.json({
      success: true,
      categories: mockCategories.sort((a, b) => a.order - b.order)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// @desc    Get static pages
// @route   GET /api/content/pages
// @access  Private (Admin only)
router.get('/pages', protect, authorize('admin'), async (req, res) => {
  try {
    res.json({
      success: true,
      pages: mockPages.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pages'
    });
  }
});

// @desc    Create banner
// @route   POST /api/content/banners
// @access  Private (Admin only)
router.post('/banners', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, description, image, link, order } = req.body;

    const newBanner = {
      _id: (mockBanners.length + 1).toString(),
      title,
      description,
      image,
      link,
      order: order || mockBanners.length + 1,
      isActive: true,
      createdAt: new Date()
    };

    mockBanners.push(newBanner);

    res.status(201).json({
      success: true,
      banner: newBanner,
      message: 'Banner created successfully'
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating banner'
    });
  }
});

// @desc    Update banner
// @route   PUT /api/content/banners/:id
// @access  Private (Admin only)
router.put('/banners/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const bannerIndex = mockBanners.findIndex(b => b._id === id);

    if (bannerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    mockBanners[bannerIndex] = {
      ...mockBanners[bannerIndex],
      ...req.body,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      banner: mockBanners[bannerIndex],
      message: 'Banner updated successfully'
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating banner'
    });
  }
});

// @desc    Delete banner
// @route   DELETE /api/content/banners/:id
// @access  Private (Admin only)
router.delete('/banners/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const bannerIndex = mockBanners.findIndex(b => b._id === id);

    if (bannerIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    mockBanners.splice(bannerIndex, 1);

    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting banner'
    });
  }
});

// @desc    Create category
// @route   POST /api/content/categories
// @access  Private (Admin only)
router.post('/categories', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, image, isFeatured } = req.body;

    const newCategory = {
      _id: (mockCategories.length + 1).toString(),
      name,
      description,
      image,
      productCount: 0,
      isActive: true,
      isFeatured: isFeatured || false,
      order: mockCategories.length + 1,
      createdAt: new Date()
    };

    mockCategories.push(newCategory);

    res.status(201).json({
      success: true,
      category: newCategory,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category'
    });
  }
});

// @desc    Create page
// @route   POST /api/content/pages
// @access  Private (Admin only)
router.post('/pages', protect, authorize('admin'), async (req, res) => {
  try {
    const { title, slug, description, content, isPublished } = req.body;

    const newPage = {
      _id: (mockPages.length + 1).toString(),
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      description,
      content,
      isPublished: isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockPages.push(newPage);

    res.status(201).json({
      success: true,
      page: newPage,
      message: 'Page created successfully'
    });
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating page'
    });
  }
});

// @desc    Update page
// @route   PUT /api/content/pages/:id
// @access  Private (Admin only)
router.put('/pages/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const pageIndex = mockPages.findIndex(p => p._id === id);

    if (pageIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Page not found'
      });
    }

    mockPages[pageIndex] = {
      ...mockPages[pageIndex],
      ...req.body,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      page: mockPages[pageIndex],
      message: 'Page updated successfully'
    });
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating page'
    });
  }
});

export default router;
