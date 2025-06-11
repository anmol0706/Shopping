import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Mock data for marketing campaigns
const mockCampaigns = [
  {
    _id: '1',
    name: 'Summer Sale 2024',
    description: '50% off on all summer collection',
    type: 'discount',
    status: 'active',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    clicks: 1250,
    conversions: 89,
    createdAt: new Date('2024-05-15')
  },
  {
    _id: '2',
    name: 'Flash Sale Electronics',
    description: 'Limited time offer on electronics',
    type: 'flash-sale',
    status: 'paused',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-07'),
    clicks: 890,
    conversions: 45,
    createdAt: new Date('2024-06-20')
  },
  {
    _id: '3',
    name: 'Welcome Email Series',
    description: 'Automated welcome emails for new users',
    type: 'email',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    clicks: 2340,
    conversions: 156,
    createdAt: new Date('2024-01-01')
  }
];

const mockDiscountCodes = [
  {
    _id: '1',
    code: 'SUMMER50',
    description: '50% off summer collection',
    discount: 50,
    expiryDate: new Date('2024-08-31'),
    uses: 234,
    maxUses: 1000,
    isActive: true
  },
  {
    _id: '2',
    code: 'WELCOME20',
    description: '20% off for new customers',
    discount: 20,
    expiryDate: new Date('2024-12-31'),
    uses: 89,
    maxUses: 500,
    isActive: true
  },
  {
    _id: '3',
    code: 'FLASH30',
    description: '30% off flash sale',
    discount: 30,
    expiryDate: new Date('2024-07-31'),
    uses: 156,
    maxUses: 200,
    isActive: false
  }
];

// @desc    Get marketing campaigns
// @route   GET /api/marketing/campaigns
// @access  Private (Admin only)
router.get('/campaigns', protect, authorize('admin'), async (req, res) => {
  try {
    res.json({
      success: true,
      campaigns: mockCampaigns
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching marketing campaigns'
    });
  }
});

// @desc    Get marketing statistics
// @route   GET /api/marketing/stats
// @access  Private (Admin only)
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const activeCampaigns = mockCampaigns.filter(c => c.status === 'active').length;
    const totalReach = mockCampaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = mockCampaigns.reduce((sum, c) => sum + c.conversions, 0);
    const conversionRate = totalReach > 0 ? ((totalConversions / totalReach) * 100).toFixed(1) : 0;
    const revenueGenerated = totalConversions * 2500; // Mock average order value

    res.json({
      success: true,
      stats: {
        activeCampaigns,
        totalReach,
        conversionRate: parseFloat(conversionRate),
        revenueGenerated
      }
    });
  } catch (error) {
    console.error('Error fetching marketing stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching marketing statistics'
    });
  }
});

// @desc    Get discount codes
// @route   GET /api/marketing/discount-codes
// @access  Private (Admin only)
router.get('/discount-codes', protect, authorize('admin'), async (req, res) => {
  try {
    res.json({
      success: true,
      codes: mockDiscountCodes
    });
  } catch (error) {
    console.error('Error fetching discount codes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching discount codes'
    });
  }
});

// @desc    Create marketing campaign
// @route   POST /api/marketing/campaigns
// @access  Private (Admin only)
router.post('/campaigns', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, description, type, startDate, endDate } = req.body;

    const newCampaign = {
      _id: (mockCampaigns.length + 1).toString(),
      name,
      description,
      type,
      status: 'active',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      clicks: 0,
      conversions: 0,
      createdAt: new Date()
    };

    mockCampaigns.push(newCampaign);

    res.status(201).json({
      success: true,
      campaign: newCampaign,
      message: 'Campaign created successfully'
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating marketing campaign'
    });
  }
});

// @desc    Update marketing campaign
// @route   PUT /api/marketing/campaigns/:id
// @access  Private (Admin only)
router.put('/campaigns/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const campaignIndex = mockCampaigns.findIndex(c => c._id === id);

    if (campaignIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    mockCampaigns[campaignIndex] = {
      ...mockCampaigns[campaignIndex],
      ...req.body,
      updatedAt: new Date()
    };

    res.json({
      success: true,
      campaign: mockCampaigns[campaignIndex],
      message: 'Campaign updated successfully'
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating marketing campaign'
    });
  }
});

// @desc    Delete marketing campaign
// @route   DELETE /api/marketing/campaigns/:id
// @access  Private (Admin only)
router.delete('/campaigns/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const campaignIndex = mockCampaigns.findIndex(c => c._id === id);

    if (campaignIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    mockCampaigns.splice(campaignIndex, 1);

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting marketing campaign'
    });
  }
});

// @desc    Create discount code
// @route   POST /api/marketing/discount-codes
// @access  Private (Admin only)
router.post('/discount-codes', protect, authorize('admin'), async (req, res) => {
  try {
    const { code, description, discount, expiryDate, maxUses } = req.body;

    const newCode = {
      _id: (mockDiscountCodes.length + 1).toString(),
      code: code.toUpperCase(),
      description,
      discount,
      expiryDate: new Date(expiryDate),
      uses: 0,
      maxUses,
      isActive: true,
      createdAt: new Date()
    };

    mockDiscountCodes.push(newCode);

    res.status(201).json({
      success: true,
      code: newCode,
      message: 'Discount code created successfully'
    });
  } catch (error) {
    console.error('Error creating discount code:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating discount code'
    });
  }
});

// @desc    Toggle campaign status
// @route   PATCH /api/marketing/campaigns/:id/toggle-status
// @access  Private (Admin only)
router.patch('/campaigns/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const campaignIndex = mockCampaigns.findIndex(c => c._id === id);

    if (campaignIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    const currentStatus = mockCampaigns[campaignIndex].status;
    mockCampaigns[campaignIndex].status = currentStatus === 'active' ? 'paused' : 'active';
    mockCampaigns[campaignIndex].updatedAt = new Date();

    res.json({
      success: true,
      campaign: mockCampaigns[campaignIndex],
      message: `Campaign ${mockCampaigns[campaignIndex].status === 'active' ? 'activated' : 'paused'} successfully`
    });
  } catch (error) {
    console.error('Error toggling campaign status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating campaign status'
    });
  }
});

export default router;
