import express from 'express';
import { campaigns } from '../data/mockDatabase.js';

const router = express.Router();

// GET /api/campaigns - Get all campaigns with filtering and sorting
router.get('/', (req, res) => {
  try {
    const { 
      status, 
      sortBy = 'updatedAt', 
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      search = ''
    } = req.query;

    let filteredCampaigns = [...campaigns];

    // Filter by status
    if (status && status !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCampaigns = filteredCampaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchLower)
      );
    }

    // Sort campaigns
    filteredCampaigns.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

    // Calculate totals and averages
    const totals = filteredCampaigns.reduce((acc, campaign) => ({
      budget: acc.budget + campaign.budget,
      spent: acc.spent + campaign.spent,
      impressions: acc.impressions + campaign.impressions,
      clicks: acc.clicks + campaign.clicks,
      conversions: acc.conversions + campaign.conversions
    }), { budget: 0, spent: 0, impressions: 0, clicks: 0, conversions: 0 });

    const averages = {
      ctr: filteredCampaigns.reduce((sum, c) => sum + c.ctr, 0) / filteredCampaigns.length,
      conversionRate: filteredCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / filteredCampaigns.length,
      costPerClick: filteredCampaigns.reduce((sum, c) => sum + c.costPerClick, 0) / filteredCampaigns.length,
      roas: filteredCampaigns.reduce((sum, c) => sum + c.roas, 0) / filteredCampaigns.length
    };

    res.json({
      success: true,
      data: paginatedCampaigns,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(filteredCampaigns.length / limit),
        totalCampaigns: filteredCampaigns.length,
        hasNextPage: endIndex < filteredCampaigns.length,
        hasPrevPage: startIndex > 0
      },
      summary: {
        totals,
        averages: {
          ctr: parseFloat(averages.ctr.toFixed(2)),
          conversionRate: parseFloat(averages.conversionRate.toFixed(2)),
          costPerClick: parseFloat(averages.costPerClick.toFixed(2)),
          roas: parseFloat(averages.roas.toFixed(2))
        }
      },
      filters: { status, sortBy, sortOrder, search }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/campaigns/:id - Get single campaign
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const campaign = campaigns.find(c => c.id === id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        error: 'Campaign not found'
      });
    }

    // Add performance metrics
    const performanceMetrics = {
      efficiency: {
        budgetUtilization: (campaign.spent / campaign.budget * 100).toFixed(1),
        costEfficiency: campaign.costPerClick < 3 ? 'High' : campaign.costPerClick < 5 ? 'Medium' : 'Low',
        conversionEfficiency: campaign.conversionRate > 2 ? 'High' : campaign.conversionRate > 1.5 ? 'Medium' : 'Low'
      },
      timeline: {
        daysRunning: Math.floor((new Date() - new Date(campaign.startDate)) / (1000 * 60 * 60 * 24)),
        daysRemaining: Math.floor((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      },
      projections: {
        projectedSpend: campaign.budget,
        projectedConversions: Math.round(campaign.conversions * (campaign.budget / campaign.spent)),
        projectedROAS: campaign.roas
      }
    };

    res.json({
      success: true,
      data: {
        ...campaign,
        performanceMetrics
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/campaigns/stats/overview - Get campaigns overview stats
router.get('/stats/overview', (req, res) => {
  try {
    const activeCampaigns = campaigns.filter(c => c.status === 'active');
    const completedCampaigns = campaigns.filter(c => c.status === 'completed');
    const pausedCampaigns = campaigns.filter(c => c.status === 'paused');

    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);

    const overview = {
      totalCampaigns: campaigns.length,
      activeCampaigns: activeCampaigns.length,
      completedCampaigns: completedCampaigns.length,
      pausedCampaigns: pausedCampaigns.length,
      totalBudget,
      totalSpent,
      budgetUtilization: (totalSpent / totalBudget * 100).toFixed(1),
      totalConversions,
      totalClicks,
      overallCTR: (totalClicks / campaigns.reduce((sum, c) => sum + c.impressions, 0) * 100).toFixed(2),
      overallConversionRate: (totalConversions / totalClicks * 100).toFixed(2),
      averageROAS: (campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length).toFixed(2)
    };

    res.json({
      success: true,
      data: overview
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/campaigns/performance/top - Get top performing campaigns
router.get('/performance/top', (req, res) => {
  try {
    const { metric = 'roas', limit = 5 } = req.query;

    const sortedCampaigns = [...campaigns].sort((a, b) => {
      return b[metric] - a[metric];
    }).slice(0, parseInt(limit));

    res.json({
      success: true,
      data: sortedCampaigns,
      metric,
      limit: parseInt(limit)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 