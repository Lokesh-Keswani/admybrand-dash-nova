import { v4 as uuidv4 } from 'uuid';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

// Generate realistic time-series data
const generateTimeSeriesData = (days = 30, baseValue = 1000, variance = 0.2) => {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const randomVariance = (Math.random() - 0.5) * variance;
    const value = Math.round(baseValue * (1 + randomVariance + (Math.sin(i / 7) * 0.1)));
    
    data.push({
      date: format(date, 'yyyy-MM-dd'),
      timestamp: date.getTime(),
      value: Math.max(0, value)
    });
  }
  return data;
};

// Campaign performance data
export const campaigns = [
  {
    id: uuidv4(),
    name: "Summer Sale 2024",
    status: "active",
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    budget: 50000,
    spent: 32450,
    impressions: 1234567,
    clicks: 12345,
    conversions: 234,
    ctr: 1.0,
    conversionRate: 1.9,
    costPerClick: 2.63,
    costPerConversion: 138.67,
    roas: 3.2,
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Brand Awareness Q3",
    status: "active",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    budget: 75000,
    spent: 45230,
    impressions: 987654,
    clicks: 9876,
    conversions: 186,
    ctr: 1.0,
    conversionRate: 1.9,
    costPerClick: 4.58,
    costPerConversion: 243.28,
    roas: 2.8,
    createdAt: "2024-06-20T14:30:00Z",
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: "Product Launch",
    status: "completed",
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    budget: 40000,
    spent: 38750,
    impressions: 654321,
    clicks: 8765,
    conversions: 175,
    ctr: 1.3,
    conversionRate: 2.0,
    costPerClick: 4.42,
    costPerConversion: 221.43,
    roas: 4.1,
    createdAt: "2024-04-15T09:00:00Z",
    updatedAt: "2024-07-01T16:45:00Z"
  },
  {
    id: uuidv4(),
    name: "Holiday Campaign",
    status: "paused",
    startDate: "2024-11-01",
    endDate: "2024-12-31",
    budget: 100000,
    spent: 12350,
    impressions: 543210,
    clicks: 6543,
    conversions: 98,
    ctr: 1.2,
    conversionRate: 1.5,
    costPerClick: 1.89,
    costPerConversion: 126.02,
    roas: 2.5,
    createdAt: "2024-10-15T11:15:00Z",
    updatedAt: new Date().toISOString()
  }
];

// Try to load saved state from file system, or use defaults
let savedState = null;
try {
  // Note: In a real app, you'd use a database or persistent storage
  // For demo purposes, we'll use in-memory state that persists during server runtime
  savedState = null; // Placeholder for persistent storage
} catch (error) {
  // Use defaults if no saved state
}

// Real-time metrics (will be updated periodically)
export let liveMetrics = savedState || {
  totalRevenue: 245231.89,
  activeUsers: 2350,
  conversions: 693,
  conversionRate: 12.5,
  growthRate: 8.2,
  avgOrderValue: 156.78,
  customerLifetimeValue: 890.45,
  bounceRate: 32.1,
  pageViews: 45678,
  uniqueVisitors: 12456,
  lastUpdated: new Date().toISOString()
};

// Historical data for charts
export const revenueData = generateTimeSeriesData(30, 8000, 0.3);
export const userGrowthData = generateTimeSeriesData(30, 75, 0.4);
export const conversionData = generateTimeSeriesData(30, 23, 0.5);

// Traffic sources
export const trafficSources = [
  { source: "Organic Search", sessions: 12456, percentage: 45.2, color: "#3b82f6" },
  { source: "Direct", sessions: 8234, percentage: 29.9, color: "#10b981" },
  { source: "Social Media", sessions: 4321, percentage: 15.7, color: "#f59e0b" },
  { source: "Email", sessions: 1876, percentage: 6.8, color: "#ef4444" },
  { source: "Referral", sessions: 654, percentage: 2.4, color: "#8b5cf6" }
];

// Device analytics
export const deviceData = [
  { device: "Desktop", users: 15678, percentage: 58.2, color: "#3b82f6" },
  { device: "Mobile", users: 9845, percentage: 36.5, color: "#10b981" },
  { device: "Tablet", users: 1432, percentage: 5.3, color: "#f59e0b" }
];

// Geographic data
export const geographicData = [
  { country: "United States", users: 8456, revenue: 89234.56, flag: "🇺🇸" },
  { country: "United Kingdom", users: 5432, revenue: 67890.12, flag: "🇬🇧" },
  { country: "Canada", users: 3210, revenue: 45123.78, flag: "🇨🇦" },
  { country: "Germany", users: 2876, revenue: 38765.43, flag: "🇩🇪" },
  { country: "France", users: 2134, revenue: 29876.21, flag: "🇫🇷" },
  { country: "Australia", users: 1987, revenue: 25643.89, flag: "🇦🇺" }
];

// Top performing pages
export const topPages = [
  { page: "/products/analytics-pro", views: 15678, conversions: 234, conversionRate: 1.49 },
  { page: "/pricing", views: 12456, conversions: 189, conversionRate: 1.52 },
  { page: "/features", views: 9876, conversions: 156, conversionRate: 1.58 },
  { page: "/about", views: 7654, conversions: 98, conversionRate: 1.28 },
  { page: "/contact", views: 5432, conversions: 76, conversionRate: 1.40 }
];

// Tracking variables for smooth trends
let trendDirection = {
  revenue: 1,
  users: 1,
  conversions: 1,
  growth: 1
};

let updateCount = 0;

// Update live metrics with smooth, realistic variations
export const updateLiveMetrics = () => {
  updateCount++;
  
  // Change trend direction occasionally for realistic behavior
  if (updateCount % 50 === 0) { // Every ~2.5 minutes
    trendDirection.revenue = Math.random() > 0.3 ? 1 : -1; // 70% chance positive
    trendDirection.users = Math.random() > 0.4 ? 1 : -1;   // 60% chance positive
    trendDirection.conversions = Math.random() > 0.5 ? 1 : -1; // 50% chance positive
    trendDirection.growth = Math.random() > 0.4 ? 1 : -1;  // 60% chance positive
  }

  // Very small, ultra-smooth incremental changes
  const revenueChange = trendDirection.revenue * (Math.random() * 25 + 5); // $5-30 per update (smaller changes)
  const userChange = trendDirection.users * Math.floor(Math.random() * 2 + 1); // 1-2 users
  const conversionChange = trendDirection.conversions * (Math.random() > 0.9 ? 1 : 0); // Very occasional +1 conversion
  const growthChange = trendDirection.growth * (Math.random() * 0.02); // Very small growth rate changes
  
  // Add some natural variation (±10%)
  const naturalVariation = () => (Math.random() - 0.5) * 0.1;
  
  liveMetrics = {
    ...liveMetrics,
    totalRevenue: Math.max(100000, liveMetrics.totalRevenue + revenueChange * (1 + naturalVariation())),
    activeUsers: Math.max(1000, liveMetrics.activeUsers + userChange),
    conversions: Math.max(100, liveMetrics.conversions + conversionChange),
    conversionRate: Math.max(5, Math.min(25, liveMetrics.conversionRate + growthChange * 0.1)),
    growthRate: Math.max(0, Math.min(50, liveMetrics.growthRate + growthChange)),
    avgOrderValue: Math.max(50, liveMetrics.avgOrderValue + (Math.random() - 0.5) * 2),
    customerLifetimeValue: Math.max(200, liveMetrics.customerLifetimeValue + (Math.random() - 0.5) * 5),
    bounceRate: Math.max(15, Math.min(60, liveMetrics.bounceRate + (Math.random() - 0.5) * 0.5)),
    pageViews: Math.max(10000, liveMetrics.pageViews + Math.floor(Math.random() * 20 + 5)),
    uniqueVisitors: Math.max(5000, liveMetrics.uniqueVisitors + Math.floor(Math.random() * 8 + 2)),
    lastUpdated: new Date().toISOString()
  };
  
  return liveMetrics;
}; 