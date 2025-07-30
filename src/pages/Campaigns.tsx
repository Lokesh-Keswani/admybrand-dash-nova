import { useState, useEffect, useMemo } from "react";
import { campaignsAPI, exportAPI, Campaign } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { FileText, FileDown, Search, Filter, Plus, Wifi, WifiOff, Calendar, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWebSocket } from "@/services/websocket";
import { useToast } from "@/hooks/use-toast";

// LocalStorage key for campaigns
const CAMPAIGNS_STORAGE_KEY = 'admybrand_campaigns';
const CHART_DATA_STORAGE_KEY = 'admybrand_chart_data';

// Chart data interface
interface ChartDataPoint {
  campaign: string;
  conversions: number;
  color: string;
}

// LocalStorage utility functions
const saveCampaignsToStorage = (campaigns: Campaign[]) => {
  try {
    localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
  } catch (error) {
    console.warn('Failed to save campaigns to localStorage:', error);
  }
};

const loadCampaignsFromStorage = (): Campaign[] | null => {
  try {
    const stored = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load campaigns from localStorage:', error);
  }
  return null;
};

// Chart data utility functions
const saveChartDataToStorage = (chartData: ChartDataPoint[]) => {
  try {
    localStorage.setItem(CHART_DATA_STORAGE_KEY, JSON.stringify(chartData));
  } catch (error) {
    console.warn('Failed to save chart data to localStorage:', error);
  }
};

const loadChartDataFromStorage = (): ChartDataPoint[] | null => {
  try {
    const stored = localStorage.getItem(CHART_DATA_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load chart data from localStorage:', error);
  }
  return null;
};

// Generate mock chart data for a campaign
const generateCampaignChartData = (campaignName: string, budget?: number): ChartDataPoint => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#84cc16'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  
  // Generate realistic conversion numbers based on campaign budget and type
  let baseConversions = Math.floor(Math.random() * 200) + 50; // 50-250 conversions
  
  // If budget is provided, scale conversions based on budget
  if (budget) {
    // Higher budget = more conversions (roughly 1 conversion per $500 budget)
    const budgetMultiplier = Math.sqrt(budget / 10000); // Square root for diminishing returns
    baseConversions = Math.floor(baseConversions * budgetMultiplier);
  }
  
  // Add campaign type-based adjustments
  const lowerName = campaignName.toLowerCase();
  if (lowerName.includes('sale') || lowerName.includes('discount')) {
    baseConversions = Math.floor(baseConversions * 1.3); // Sales perform better
  } else if (lowerName.includes('awareness') || lowerName.includes('brand')) {
    baseConversions = Math.floor(baseConversions * 0.7); // Brand awareness has lower conversions
  } else if (lowerName.includes('retargeting') || lowerName.includes('remarketing')) {
    baseConversions = Math.floor(baseConversions * 1.1); // Retargeting performs well
  }
  
  const variation = Math.floor(Math.random() * 50) - 25; // ±25 variation
  const conversions = Math.max(10, baseConversions + variation);
  
  return {
    campaign: campaignName,
    conversions,
    color: randomColor
  };
};

const clearCampaignsFromStorage = () => {
  try {
    localStorage.removeItem(CAMPAIGNS_STORAGE_KEY);
    localStorage.removeItem(CHART_DATA_STORAGE_KEY);
    console.log('Campaigns and chart data cleared from localStorage');
  } catch (error) {
    console.warn('Failed to clear campaigns from localStorage:', error);
  }
};

// For debugging purposes - expose to window object in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).clearCampaigns = clearCampaignsFromStorage;
}

// Sample fallback data to prevent crashes
const sampleCampaigns: Campaign[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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

export default function Campaigns() {
  // Initialize campaigns from localStorage or fallback to sample data
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const storedCampaigns = loadCampaignsFromStorage();
    return storedCampaigns || sampleCampaigns;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Loading states for downloads
  const [downloadingCSV, setDownloadingCSV] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  
  // New campaign dialog
  const [showNewCampaignDialog, setShowNewCampaignDialog] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    budget: '',
    startDate: '',
    endDate: '',
    status: 'active'
  });
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<{id: string, name: string} | null>(null);
  
  const { toast } = useToast();

  // Custom function to update campaigns and save to localStorage
  const updateCampaigns = (newCampaigns: Campaign[] | ((prev: Campaign[]) => Campaign[])) => {
    setCampaigns(prev => {
      const updated = typeof newCampaigns === 'function' ? newCampaigns(prev) : newCampaigns;
      saveCampaignsToStorage(updated);
      return updated;
    });
  };

  const { isConnected, subscribe, on } = useWebSocket();

  // Initialize chart data on first load
  useEffect(() => {
    const existingChartData = loadChartDataFromStorage();
    if (!existingChartData) {
      // Initialize with default chart data for sample campaigns
      const defaultChartData: ChartDataPoint[] = [
        { campaign: 'Summer Sale 2024', conversions: 234, color: '#3b82f6' },
        { campaign: 'Brand Awareness Q3', conversions: 186, color: '#10b981' },
        { campaign: 'Product Launch', conversions: 175, color: '#f59e0b' },
        { campaign: 'Holiday Campaign', conversions: 98, color: '#ef4444' },
        { campaign: 'Retargeting', conversions: 156, color: '#8b5cf6' },
      ];
      saveChartDataToStorage(defaultChartData);
    }
  }, []);

  // Backup: Save campaigns to localStorage whenever campaigns state changes
  useEffect(() => {
    saveCampaignsToStorage(campaigns);
  }, [campaigns]);

  // Listen for localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CAMPAIGNS_STORAGE_KEY && e.newValue) {
        try {
          const updatedCampaigns = JSON.parse(e.newValue);
          setCampaigns(updatedCampaigns);
        } catch (error) {
          console.warn('Failed to parse campaigns from storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter and sort campaigns based on current filters
  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns];

    // Apply search filter
    if (search.trim()) {
      filtered = filtered.filter(campaign =>
        campaign.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(campaign => campaign.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Campaign];
      let bValue: any = b[sortBy as keyof Campaign];

      // Handle different data types
      if (sortBy === 'updatedAt' || sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [campaigns, search, statusFilter, sortBy, sortOrder]);

  // Load initial data (disabled to prevent aggressive retries)
  // useEffect(() => {
  //   loadCampaigns();
  // }, [search, statusFilter, sortBy, sortOrder]);

  // Subscribe to real-time campaign updates (disabled to prevent WebSocket errors)
  // useEffect(() => {
  //   if (isConnected) {
  //     subscribe('campaigns');
  //     
  //     const unsubscribeCampaigns = on('campaigns-update', (data) => {
  //       console.log('Campaign update received:', data);
  //       setLastUpdated(new Date().toISOString());
  //       // Reload campaigns when updates are received
  //       loadCampaigns();
  //     });

  //     return () => {
  //       unsubscribeCampaigns();
  //     };
  //   }
  // }, [isConnected, subscribe, on]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await campaignsAPI.getCampaigns({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        sortBy,
        sortOrder,
        limit: 50
      });

      if (response.success) {
        setCampaigns(response.data.data);
        setLastUpdated(new Date().toISOString());
      }
    } catch (err) {
      // If API fails, keep sample data but show error
      setError(err instanceof Error ? err.message : 'API not available - showing sample data');
      console.error('Campaigns loading error:', err);
      // Keep sample data instead of empty array
      setCampaigns(sampleCampaigns);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    setDownloadingCSV(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      
      // Generate CSV data from filtered campaigns
      const csvData = generateCampaignCSV(filteredCampaigns);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaigns_${statusFilter}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "CSV Export Complete",
        description: `${filteredCampaigns.length} campaigns exported successfully.`,
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to export campaigns CSV. Please try again.",
        variant: "destructive",
      });
      console.error('Export failed:', err);
    } finally {
      setDownloadingCSV(false);
    }
  };

  const handleExportPDF = async () => {
    setDownloadingPDF(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 1000));
      
      // Generate actual PDF using browser's print functionality
      await generatePDFReport(filteredCampaigns, statusFilter);

      toast({
        title: "PDF Report Complete",
        description: `Campaign report generated successfully.`,
      });
    } catch (err) {
      toast({
        title: "Export Failed",
        description: "Failed to generate PDF report. Please try again.",
        variant: "destructive",
      });
      console.error('PDF export failed:', err);
    } finally {
      setDownloadingPDF(false);
    }
  };

  // Generate CSV data for campaigns
  const generateCampaignCSV = (campaigns: Campaign[]): string => {
    const headers = [
      'Campaign Name', 'Status', 'Start Date', 'End Date', 'Budget', 'Spent', 
      'Impressions', 'Clicks', 'CTR', 'Conversions', 'Conversion Rate', 
      'Cost Per Click', 'Cost Per Conversion', 'ROAS', 'Created At', 'Updated At'
    ];
    
    const rows = campaigns.map(campaign => [
      campaign.name,
      campaign.status,
      campaign.startDate,
      campaign.endDate,
      campaign.budget,
      campaign.spent,
      campaign.impressions,
      campaign.clicks,
      campaign.ctr,
      campaign.conversions,
      campaign.conversionRate,
      campaign.costPerClick,
      campaign.costPerConversion,
      campaign.roas,
      campaign.createdAt,
      campaign.updatedAt
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  // Generate report data for campaigns
  const generateCampaignReport = (campaigns: Campaign[]): string => {
    const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
    const avgROAS = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length;

    return `
CAMPAIGN PERFORMANCE REPORT
Generated: ${new Date().toLocaleString()}
Filter: ${statusFilter === 'all' ? 'All Campaigns' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}

SUMMARY
=======
Total Campaigns: ${campaigns.length}
Total Budget: $${totalBudget.toLocaleString()}
Total Spent: $${totalSpent.toLocaleString()}
Budget Utilization: ${((totalSpent / totalBudget) * 100).toFixed(1)}%
Total Impressions: ${totalImpressions.toLocaleString()}
Total Clicks: ${totalClicks.toLocaleString()}
Total Conversions: ${totalConversions.toLocaleString()}
Average ROAS: ${avgROAS.toFixed(2)}x

CAMPAIGN DETAILS
===============
${campaigns.map(campaign => `
Campaign: ${campaign.name}
Status: ${campaign.status}
Period: ${campaign.startDate} to ${campaign.endDate}
Budget: $${campaign.budget.toLocaleString()}
Spent: $${campaign.spent.toLocaleString()} (${((campaign.spent / campaign.budget) * 100).toFixed(1)}%)
Performance: ${campaign.impressions.toLocaleString()} impressions, ${campaign.clicks.toLocaleString()} clicks, ${campaign.conversions} conversions
ROAS: ${campaign.roas}x
`).join('\n')}
    `.trim();
  };

  // Generate actual PDF report
  const generatePDFReport = async (campaigns: Campaign[], filterStatus: string): Promise<void> => {
    return new Promise((resolve) => {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
      const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
      const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
      const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
      const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
      const avgROAS = campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Campaign Performance Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .report-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .report-date {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .filter-info {
              font-size: 14px;
              background: #f3f4f6;
              padding: 8px 16px;
              border-radius: 6px;
              display: inline-block;
            }
            .summary {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #2563eb;
            }
            .summary h2 {
              color: #2563eb;
              margin-top: 0;
              font-size: 18px;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-top: 15px;
            }
            .summary-item {
              text-align: center;
            }
            .summary-value {
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
            }
            .summary-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              margin-top: 5px;
            }
            .campaigns-section h2 {
              color: #374151;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .campaign-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              page-break-inside: avoid;
            }
            .campaign-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 15px;
            }
            .campaign-name {
              font-size: 16px;
              font-weight: bold;
              color: #1f2937;
            }
            .campaign-status {
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-active { background: #dcfce7; color: #166534; }
            .status-paused { background: #fef3c7; color: #92400e; }
            .status-completed { background: #e0e7ff; color: #3730a3; }
            .campaign-metrics {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-top: 15px;
            }
            .metric {
              text-align: center;
              padding: 10px;
              background: #f9fafb;
              border-radius: 6px;
            }
            .metric-value {
              font-size: 14px;
              font-weight: bold;
              color: #1f2937;
            }
            .metric-label {
              font-size: 11px;
              color: #6b7280;
              margin-top: 2px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .header { page-break-after: avoid; }
              .campaign-card { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">AdMyBrand Analytics</div>
            <div class="report-title">Campaign Performance Report</div>
            <div class="report-date">Generated on ${new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</div>
            <div class="filter-info">
              Filter: ${filterStatus === 'all' ? 'All Campaigns' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1) + ' Campaigns'}
            </div>
          </div>

          <div class="summary">
            <h2>Executive Summary</h2>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-value">${campaigns.length}</div>
                <div class="summary-label">Total Campaigns</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">$${totalBudget.toLocaleString()}</div>
                <div class="summary-label">Total Budget</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">$${totalSpent.toLocaleString()}</div>
                <div class="summary-label">Total Spent</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${((totalSpent / totalBudget) * 100).toFixed(1)}%</div>
                <div class="summary-label">Budget Utilization</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${totalImpressions.toLocaleString()}</div>
                <div class="summary-label">Total Impressions</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${totalClicks.toLocaleString()}</div>
                <div class="summary-label">Total Clicks</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${totalConversions.toLocaleString()}</div>
                <div class="summary-label">Total Conversions</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${avgROAS.toFixed(2)}x</div>
                <div class="summary-label">Average ROAS</div>
              </div>
              <div class="summary-item">
                <div class="summary-value">${((totalClicks / totalImpressions) * 100).toFixed(2)}%</div>
                <div class="summary-label">Overall CTR</div>
              </div>
            </div>
          </div>

          <div class="campaigns-section">
            <h2>Campaign Details</h2>
            ${campaigns.map(campaign => `
              <div class="campaign-card">
                <div class="campaign-header">
                  <div class="campaign-name">${campaign.name}</div>
                  <div class="campaign-status status-${campaign.status}">${campaign.status}</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 15px;">
                  <div>
                    <strong>Campaign Period:</strong><br>
                    ${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Budget Usage:</strong><br>
                    $${campaign.spent.toLocaleString()} of $${campaign.budget.toLocaleString()} (${((campaign.spent / campaign.budget) * 100).toFixed(1)}%)
                  </div>
                </div>
                <div class="campaign-metrics">
                  <div class="metric">
                    <div class="metric-value">${campaign.impressions.toLocaleString()}</div>
                    <div class="metric-label">Impressions</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">${campaign.clicks.toLocaleString()}</div>
                    <div class="metric-label">Clicks</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">${campaign.ctr}%</div>
                    <div class="metric-label">CTR</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">${campaign.conversions}</div>
                    <div class="metric-label">Conversions</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">${campaign.conversionRate}%</div>
                    <div class="metric-label">Conv. Rate</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">$${campaign.costPerClick.toFixed(2)}</div>
                    <div class="metric-label">Cost/Click</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value">$${campaign.costPerConversion.toFixed(2)}</div>
                    <div class="metric-label">Cost/Conversion</div>
                  </div>
                  <div class="metric">
                    <div class="metric-value" style="color: ${campaign.roas >= 3 ? '#166534' : campaign.roas >= 2 ? '#92400e' : '#dc2626'};">
                      ${campaign.roas}x
                    </div>
                    <div class="metric-label">ROAS</div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="footer">
            <p>This report was generated by AdMyBrand Analytics Dashboard</p>
            <p>For questions or support, contact your analytics team</p>
          </div>

          <script>
            window.onload = function() {
              // Auto-print and close
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              }, 500);
            }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Resolve after a short delay to allow the print dialog to appear
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  };

  // Handle creating a new campaign
  const handleCreateCampaign = async () => {
    try {
      // Validate form
      if (!newCampaign.name || !newCampaign.budget || !newCampaign.startDate || !newCampaign.endDate) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate realistic mock performance data
      const budget = parseFloat(newCampaign.budget);
      const spent = Math.floor(budget * (0.1 + Math.random() * 0.3)); // 10-40% of budget spent so far
      const impressions = Math.floor(budget * (0.5 + Math.random() * 1.5)); // Impressions scale with budget
      const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.03)); // 1-4% CTR
      const conversions = Math.floor(clicks * (0.02 + Math.random() * 0.08)); // 2-10% conversion rate
      const ctr = clicks > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(1)) : 0;
      const conversionRate = clicks > 0 ? parseFloat(((conversions / clicks) * 100).toFixed(1)) : 0;
      const costPerClick = clicks > 0 ? parseFloat((spent / clicks).toFixed(2)) : 0;
      const costPerConversion = conversions > 0 ? parseFloat((spent / conversions).toFixed(2)) : 0;
      const revenue = conversions * (50 + Math.random() * 200); // $50-250 per conversion
      const roas = spent > 0 ? parseFloat((revenue / spent).toFixed(1)) : 0;

      const newCampaignData: Campaign = {
        id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newCampaign.name,
        status: newCampaign.status as any,
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
        budget,
        spent,
        impressions,
        clicks,
        conversions,
        ctr,
        conversionRate,
        costPerClick,
        costPerConversion,
        roas,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      updateCampaigns(prev => [newCampaignData, ...prev]);
      
      // Generate and save chart data for the new campaign
      const currentChartData = loadChartDataFromStorage() || [];
      const newChartData = generateCampaignChartData(newCampaign.name, parseFloat(newCampaign.budget));
      const updatedChartData = [newChartData, ...currentChartData].slice(0, 8); // Keep only top 8 campaigns
      saveChartDataToStorage(updatedChartData);
      
      setShowNewCampaignDialog(false);
      setNewCampaign({
        name: '',
        budget: '',
        startDate: '',
        endDate: '',
        status: 'active'
      });

      toast({
        title: "Campaign Created",
        description: `${newCampaign.name} has been created with realistic performance metrics and will appear in dashboard charts.`,
      });
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (campaignId: string, campaignName: string) => {
    setCampaignToDelete({ id: campaignId, name: campaignName });
    setDeleteDialogOpen(true);
  };

  // Handle deleting a campaign
  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Remove campaign from campaigns list
      updateCampaigns(prev => prev.filter(campaign => campaign.id !== campaignToDelete.id));
      
      // Remove campaign from chart data
      const currentChartData = loadChartDataFromStorage() || [];
      const updatedChartData = currentChartData.filter(item => item.campaign !== campaignToDelete.name);
      saveChartDataToStorage(updatedChartData);

      toast({
        title: "Campaign Deleted",
        description: `${campaignToDelete.name} has been deleted successfully.`,
      });

      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default" as const,
      paused: "secondary" as const, 
      completed: "outline" as const
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString()}`;
  const formatNumber = (num: number) => num.toLocaleString();

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 py-2 sm:py-4 lg:py-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Campaigns</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage and track your marketing campaigns
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            {isConnected ? (
              <><Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" /> Live Updates</>
            ) : (
              <><WifiOff className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" /> Offline</>
            )}
            {lastUpdated && (
              <span className="hidden sm:inline-block ml-2">
                Last updated: {new Date(lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={handleExportCSV} 
              variant="outline" 
              size="sm"
              disabled={downloadingCSV}
              className="h-8 text-xs sm:h-9 sm:text-sm"
            >
              {downloadingCSV ? (
                <>
                  <div className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="hidden sm:inline">Exporting...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">CSV</span>
                </>
              )}
            </Button>
            <Button 
              onClick={handleExportPDF} 
              variant="outline" 
              size="sm"
              disabled={downloadingPDF}
              className="h-8 text-xs sm:h-9 sm:text-sm"
            >
              {downloadingPDF ? (
                <>
                  <div className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <FileDown className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">PDF</span>
                </>
              )}
            </Button>
            <Button 
              className="bg-gradient-primary h-8 text-xs sm:h-9 sm:text-sm"
              onClick={() => setShowNewCampaignDialog(true)}
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Campaign</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert className="border-red-500">
          <AlertDescription className="text-sm">
            Error loading campaigns: {error}
            <button 
              onClick={loadCampaigns}
              className="ml-2 text-primary hover:underline"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 sm:w-[140px] text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 sm:w-[140px] text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="spent">Spent</SelectItem>
                  <SelectItem value="roas">ROAS</SelectItem>
                  <SelectItem value="updatedAt">Updated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                <SelectTrigger className="w-20 sm:w-[100px] text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Table */}
      <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">All Campaigns</CardTitle>
          <CardDescription className="text-sm">
            {filteredCampaigns?.length || 0} campaigns found
            {search || statusFilter !== "all" ? ` (filtered from ${campaigns?.length || 0} total)` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Mobile Card View */}
          <div className="block lg:hidden space-y-3 p-4">
            {filteredCampaigns && filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="p-4 bg-muted/50 hover:bg-muted/70 transition-colors">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm truncate">{campaign.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {campaign.startDate} - {campaign.endDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getStatusBadge(campaign.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(campaign.id, campaign.name)}
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Budget:</span>
                        <p className="text-sm font-medium">{formatCurrency(campaign.budget)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Spent:</span>
                        <p className="text-sm font-medium">{formatCurrency(campaign.spent)}</p>
                        <p className="text-xs text-muted-foreground">
                          {((campaign.spent / campaign.budget) * 100).toFixed(1)}% used
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Impressions:</span>
                        <p className="text-sm font-medium">{formatNumber(campaign.impressions)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Clicks:</span>
                        <p className="text-sm font-medium">{formatNumber(campaign.clicks)}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">CTR:</span>
                        <p className="text-sm font-medium">{campaign.ctr}%</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Conversions:</span>
                        <p className="text-sm font-medium">{campaign.conversions}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">ROAS:</span>
                      <div className={`text-sm font-bold ${campaign.roas >= 3 ? 'text-green-500' : campaign.roas >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {campaign.roas}x
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )) : (
              <div className="text-center text-muted-foreground py-8 text-sm">
                {loading ? "Loading campaigns..." : 
                 search || statusFilter !== "all" ? 
                 "No campaigns match your filters" : 
                 "No campaigns found"}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-glass-border">
                  <TableHead className="text-muted-foreground text-sm">Campaign</TableHead>
                  <TableHead className="text-muted-foreground text-sm">Status</TableHead>
                  <TableHead className="text-muted-foreground text-sm">Budget</TableHead>
                  <TableHead className="text-muted-foreground text-sm">Spent</TableHead>
                  <TableHead className="text-muted-foreground text-sm">Impressions</TableHead>
                  <TableHead className="text-muted-foreground text-sm">Clicks</TableHead>
                  <TableHead className="text-muted-foreground text-sm">CTR</TableHead>
                  <TableHead className="text-muted-foreground text-sm">Conversions</TableHead>
                  <TableHead className="text-muted-foreground text-sm">ROAS</TableHead>
                  <TableHead className="text-muted-foreground text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCampaigns && filteredCampaigns.length > 0 ? filteredCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="border-glass-border hover:bg-muted/50">
                    <TableCell className="font-medium text-foreground">
                      <div>
                        <div className="font-medium text-sm">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {campaign.startDate} - {campaign.endDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatCurrency(campaign.budget)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      <div>
                        <div className="text-sm">{formatCurrency(campaign.spent)}</div>
                        <div className="text-xs text-muted-foreground">
                          {((campaign.spent / campaign.budget) * 100).toFixed(1)}% used
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatNumber(campaign.impressions)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatNumber(campaign.clicks)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{campaign.ctr}%</TableCell>
                    <TableCell className="font-medium text-foreground text-sm">{campaign.conversions}</TableCell>
                    <TableCell className="font-medium text-foreground">
                      <div className={`font-medium text-sm ${campaign.roas >= 3 ? 'text-green-500' : campaign.roas >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                        {campaign.roas}x
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(campaign.id, campaign.name)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8 text-sm">
                      {loading ? "Loading campaigns..." : 
                       search || statusFilter !== "all" ? 
                       "No campaigns match your filters" : 
                       "No campaigns found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Campaign Dialog */}
      <Dialog open={showNewCampaignDialog} onOpenChange={setShowNewCampaignDialog}>
        <DialogContent className="sm:max-w-[425px] max-w-[95vw] sm:mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">Create New Campaign</DialogTitle>
            <DialogDescription className="text-sm">
              Add a new marketing campaign to track performance and ROI.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="name" className="text-sm sm:text-right">
                Name *
              </Label>
              <Input
                id="name"
                placeholder="Summer Sale 2024"
                className="sm:col-span-3"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="budget" className="text-sm sm:text-right">
                Budget *
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="50000"
                className="sm:col-span-3"
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="startDate" className="text-sm sm:text-right">
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                className="sm:col-span-3"
                value={newCampaign.startDate}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="endDate" className="text-sm sm:text-right">
                End Date *
              </Label>
              <Input
                id="endDate"
                type="date"
                className="sm:col-span-3"
                value={newCampaign.endDate}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="status" className="text-sm sm:text-right">
                Status
              </Label>
              <Select 
                value={newCampaign.status} 
                onValueChange={(value) => setNewCampaign(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="sm:col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowNewCampaignDialog(false)}
              className="mt-0"
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} className="bg-gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:mx-4 sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete "{campaignToDelete?.name}"? This action cannot be undone and will remove the campaign from all charts and reports.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel 
              onClick={() => {
                setDeleteDialogOpen(false);
                setCampaignToDelete(null);
              }}
              className="mt-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCampaign}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}