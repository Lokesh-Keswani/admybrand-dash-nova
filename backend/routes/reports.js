import express from 'express';
import { 
  campaigns, 
  liveMetrics,
  revenueData,
  userGrowthData,
  conversionData,
  trafficSources,
  geographicData 
} from '../data/mockDatabase.js';
import { subDays, format, isAfter, isBefore, parseISO } from 'date-fns';

const router = express.Router();

// Helper function to filter data by date range
const filterByDateRange = (data, startDate, endDate) => {
  if (!startDate || !endDate) return data;
  
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  
  return data.filter(item => {
    const itemDate = parseISO(item.date || item.createdAt || item.updatedAt);
    return isAfter(itemDate, start) && isBefore(itemDate, end);
  });
};

// GET /api/reports/performance - Get performance report
router.get('/performance', (req, res) => {
  try {
    const { startDate, endDate, period = '30d' } = req.query;
    
    // Filter campaigns by date range
    let filteredCampaigns = campaigns;
    if (startDate && endDate) {
      filteredCampaigns = filterByDateRange(campaigns, startDate, endDate);
    }

    // Calculate performance metrics
    const performanceData = {
      overview: {
        totalCampaigns: filteredCampaigns.length,
        totalBudget: filteredCampaigns.reduce((sum, c) => sum + c.budget, 0),
        totalSpent: filteredCampaigns.reduce((sum, c) => sum + c.spent, 0),
        totalImpressions: filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0),
        totalClicks: filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0),
        totalConversions: filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0)
      },
      averages: {
        avgCTR: filteredCampaigns.reduce((sum, c) => sum + c.ctr, 0) / filteredCampaigns.length,
        avgConversionRate: filteredCampaigns.reduce((sum, c) => sum + c.conversionRate, 0) / filteredCampaigns.length,
        avgCostPerClick: filteredCampaigns.reduce((sum, c) => sum + c.costPerClick, 0) / filteredCampaigns.length,
        avgROAS: filteredCampaigns.reduce((sum, c) => sum + c.roas, 0) / filteredCampaigns.length
      },
      trends: {
        revenueGrowth: 12.5,
        conversionGrowth: 8.3,
        trafficGrowth: 15.7,
        costOptimization: -5.2
      },
      topPerformers: filteredCampaigns
        .sort((a, b) => b.roas - a.roas)
        .slice(0, 3)
        .map(campaign => ({
          name: campaign.name,
          roas: campaign.roas,
          conversions: campaign.conversions,
          spent: campaign.spent
        }))
    };

    res.json({
      success: true,
      data: performanceData,
      dateRange: { startDate, endDate },
      period,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/reports/revenue - Get revenue report
router.get('/revenue', (req, res) => {
  try {
    const { startDate, endDate, period = '30d', groupBy = 'day' } = req.query;
    
    let filteredData = revenueData;
    if (startDate && endDate) {
      filteredData = filterByDateRange(revenueData, startDate, endDate);
    }

    // Group data based on groupBy parameter
    let groupedData = filteredData;
    if (groupBy === 'week') {
      // Group by week (simplified)
      groupedData = filteredData.reduce((acc, item, index) => {
        if (index % 7 === 0) {
          const weekData = filteredData.slice(index, index + 7);
          const weekTotal = weekData.reduce((sum, d) => sum + d.value, 0);
          acc.push({
            date: item.date,
            value: weekTotal,
            period: `Week of ${item.date}`
          });
        }
        return acc;
      }, []);
    } else if (groupBy === 'month') {
      // Group by month (simplified)
      const monthlyData = {};
      filteredData.forEach(item => {
        const monthKey = item.date.substring(0, 7); // YYYY-MM
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { value: 0, date: monthKey + '-01' };
        }
        monthlyData[monthKey].value += item.value;
      });
      groupedData = Object.values(monthlyData);
    }

    const totalRevenue = groupedData.reduce((sum, item) => sum + item.value, 0);
    const averageDaily = totalRevenue / groupedData.length;
    const growth = groupedData.length > 1 
      ? ((groupedData[groupedData.length - 1].value - groupedData[0].value) / groupedData[0].value * 100)
      : 0;

    res.json({
      success: true,
      data: {
        chartData: groupedData,
        summary: {
          totalRevenue,
          averageDaily,
          growth: parseFloat(growth.toFixed(2)),
          highestDay: Math.max(...groupedData.map(d => d.value)),
          lowestDay: Math.min(...groupedData.map(d => d.value))
        },
        period,
        groupBy,
        dateRange: { startDate, endDate }
      },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/reports/audience - Get audience report
router.get('/audience', (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const audienceData = {
      demographics: {
        totalUsers: liveMetrics.activeUsers,
        newUsers: Math.floor(liveMetrics.activeUsers * 0.3),
        returningUsers: Math.floor(liveMetrics.activeUsers * 0.7),
        userGrowth: 15.3
      },
      geography: geographicData.map(country => ({
        ...country,
        growthRate: (Math.random() * 20 - 5).toFixed(1) // Random growth rate for demo
      })),
      devices: [
        { device: "Desktop", users: 15678, percentage: 58.2, sessions: 23456 },
        { device: "Mobile", users: 9845, percentage: 36.5, sessions: 18765 },
        { device: "Tablet", users: 1432, percentage: 5.3, sessions: 2876 }
      ],
      behavior: {
        avgSessionDuration: "3m 24s",
        pagesPerSession: 2.8,
        bounceRate: 32.1,
        conversionRate: liveMetrics.conversionRate
      },
      acquisition: trafficSources.map(source => ({
        ...source,
        costPerAcquisition: (Math.random() * 50 + 10).toFixed(2),
        conversionRate: (Math.random() * 3 + 1).toFixed(2)
      }))
    };

    res.json({
      success: true,
      data: audienceData,
      dateRange: { startDate, endDate },
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/reports/conversion - Get conversion report
router.get('/conversion', (req, res) => {
  try {
    const { startDate, endDate, funnelStep } = req.query;

    let filteredData = conversionData;
    if (startDate && endDate) {
      filteredData = filterByDateRange(conversionData, startDate, endDate);
    }

    const conversionReport = {
      overview: {
        totalConversions: liveMetrics.conversions,
        conversionRate: liveMetrics.conversionRate,
        avgOrderValue: liveMetrics.avgOrderValue,
        totalRevenue: liveMetrics.totalRevenue
      },
      funnel: [
        { step: "Landing Page Views", visitors: 100000, rate: 100 },
        { step: "Product Views", visitors: 45000, rate: 45 },
        { step: "Add to Cart", visitors: 15000, rate: 15 },
        { step: "Checkout Initiated", visitors: 8000, rate: 8 },
        { step: "Purchase Completed", visitors: liveMetrics.conversions, rate: liveMetrics.conversionRate }
      ],
      trends: filteredData.map(item => ({
        date: item.date,
        conversions: item.value,
        rate: (item.value / 100).toFixed(2) // Mock conversion rate
      })),
      topConvertingPages: [
        { page: "/pricing", conversions: 145, rate: 3.2 },
        { page: "/product-demo", conversions: 89, rate: 2.8 },
        { page: "/features", conversions: 67, rate: 2.1 },
        { page: "/contact", conversions: 34, rate: 1.9 }
      ],
      conversionSources: trafficSources.map(source => ({
        source: source.source,
        conversions: Math.floor(source.sessions * 0.02),
        rate: (Math.random() * 3 + 0.5).toFixed(2),
        revenue: (Math.random() * 10000 + 5000).toFixed(2)
      }))
    };

    res.json({
      success: true,
      data: conversionReport,
      dateRange: { startDate, endDate },
      funnelStep,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/reports/summary - Get executive summary report
router.get('/summary', (req, res) => {
  try {
    const { startDate, endDate, period = '30d' } = req.query;

    const executiveSummary = {
      keyMetrics: {
        revenue: {
          current: liveMetrics.totalRevenue,
          growth: "+20.1%",
          trend: "up"
        },
        users: {
          current: liveMetrics.activeUsers,
          growth: "+15.3%",
          trend: "up"
        },
        conversions: {
          current: liveMetrics.conversions,
          growth: "+12.7%",
          trend: "up"
        },
        roas: {
          current: 3.2,
          growth: "+8.5%",
          trend: "up"
        }
      },
      highlights: [
        "Revenue increased by 20.1% compared to previous period",
        "User acquisition grew by 15.3% with improved quality",
        "Conversion optimization resulted in 12.7% increase",
        "Mobile traffic now represents 36.5% of total sessions"
      ],
      concerns: [
        "Cost per click increased by 3.2% in paid campaigns",
        "Bounce rate slightly elevated on mobile devices"
      ],
      recommendations: [
        "Increase budget allocation to top-performing campaigns",
        "Optimize mobile experience to reduce bounce rate",
        "Expand successful campaigns to new geographic markets",
        "Implement retargeting campaigns for cart abandoners"
      ],
      campaignPerformance: {
        topPerformer: campaigns.sort((a, b) => b.roas - a.roas)[0],
        totalCampaigns: campaigns.length,
        activeCampaigns: campaigns.filter(c => c.status === 'active').length,
        avgROAS: (campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length).toFixed(2)
      }
    };

    res.json({
      success: true,
      data: executiveSummary,
      dateRange: { startDate, endDate },
      period,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 