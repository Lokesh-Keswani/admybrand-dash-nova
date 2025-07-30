import express from 'express';
import { 
  liveMetrics, 
  revenueData, 
  userGrowthData, 
  conversionData,
  trafficSources,
  deviceData,
  geographicData,
  topPages,
  updateLiveMetrics
} from '../data/mockDatabase.js';

const router = express.Router();

// GET /api/analytics/metrics - Get current key metrics
router.get('/metrics', (req, res) => {
  try {
    const formattedMetrics = {
      totalRevenue: {
        value: `$${liveMetrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        change: "+20.1%",
        changeType: "positive",
        raw: liveMetrics.totalRevenue
      },
      activeUsers: {
        value: liveMetrics.activeUsers.toLocaleString(),
        change: "+15.3%",
        changeType: "positive",
        raw: liveMetrics.activeUsers
      },
      conversions: {
        value: `${liveMetrics.conversionRate.toFixed(1)}%`,
        change: "+2.1%",
        changeType: "positive",
        raw: liveMetrics.conversionRate
      },
      growthRate: {
        value: `${liveMetrics.growthRate.toFixed(1)}%`,
        change: liveMetrics.growthRate > 8 ? "+0.5%" : "-0.5%",
        changeType: liveMetrics.growthRate > 8 ? "positive" : "negative",
        raw: liveMetrics.growthRate
      }
    };

    res.json({
      success: true,
      data: formattedMetrics,
      lastUpdated: liveMetrics.lastUpdated
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/charts/revenue - Get revenue chart data
router.get('/charts/revenue', (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let data = revenueData;
    if (period === '7d') {
      data = revenueData.slice(-7);
    } else if (period === '90d') {
      // For demo, just repeat the 30d data
      data = [...revenueData, ...revenueData, ...revenueData];
    }

    res.json({
      success: true,
      data: data.map(item => ({
        date: item.date,
        revenue: item.value,
        timestamp: item.timestamp
      })),
      period,
      total: data.reduce((sum, item) => sum + item.value, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/charts/users - Get user growth chart data
router.get('/charts/users', (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let data = userGrowthData;
    if (period === '7d') {
      data = userGrowthData.slice(-7);
    } else if (period === '90d') {
      data = [...userGrowthData, ...userGrowthData, ...userGrowthData];
    }

    res.json({
      success: true,
      data: data.map(item => ({
        date: item.date,
        users: item.value,
        timestamp: item.timestamp
      })),
      period,
      total: data.reduce((sum, item) => sum + item.value, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/charts/conversions - Get conversion chart data
router.get('/charts/conversions', (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let data = conversionData;
    if (period === '7d') {
      data = conversionData.slice(-7);
    } else if (period === '90d') {
      data = [...conversionData, ...conversionData, ...conversionData];
    }

    res.json({
      success: true,
      data: data.map(item => ({
        date: item.date,
        conversions: item.value,
        timestamp: item.timestamp
      })),
      period,
      average: data.reduce((sum, item) => sum + item.value, 0) / data.length
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/traffic-sources - Get traffic sources data
router.get('/traffic-sources', (req, res) => {
  try {
    res.json({
      success: true,
      data: trafficSources,
      total: trafficSources.reduce((sum, source) => sum + source.sessions, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/devices - Get device analytics data
router.get('/devices', (req, res) => {
  try {
    res.json({
      success: true,
      data: deviceData,
      total: deviceData.reduce((sum, device) => sum + device.users, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/geography - Get geographic data
router.get('/geography', (req, res) => {
  try {
    res.json({
      success: true,
      data: geographicData,
      totalUsers: geographicData.reduce((sum, country) => sum + country.users, 0),
      totalRevenue: geographicData.reduce((sum, country) => sum + country.revenue, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/top-pages - Get top performing pages
router.get('/top-pages', (req, res) => {
  try {
    res.json({
      success: true,
      data: topPages,
      totalViews: topPages.reduce((sum, page) => sum + page.views, 0),
      totalConversions: topPages.reduce((sum, page) => sum + page.conversions, 0)
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/real-time - Get real-time metrics (updates every call)
router.get('/real-time', (req, res) => {
  try {
    const updatedMetrics = updateLiveMetrics();
    
    res.json({
      success: true,
      data: updatedMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/analytics/summary - Get dashboard summary
router.get('/summary', (req, res) => {
  try {
    const summary = {
      metrics: liveMetrics,
      topTrafficSource: trafficSources[0],
      topDevice: deviceData[0],
      topCountry: geographicData[0],
      topPage: topPages[0],
      trendsUpward: liveMetrics.growthRate > 8,
      lastUpdated: liveMetrics.lastUpdated
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 