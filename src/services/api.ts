// API Configuration
const API_BASE_URL = 'http://localhost:3001/api';

// Add explicit fetch options for CORS
const defaultOptions: RequestInit = {
  mode: 'cors',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
};

// Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface MetricData {
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  raw: number;
}

export interface Metrics {
  totalRevenue: MetricData;
  activeUsers: MetricData;
  conversions: MetricData;
  growthRate: MetricData;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  conversionRate: number;
  costPerClick: number;
  costPerConversion: number;
  roas: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChartData {
  date: string;
  value: number;
  timestamp: number;
}

export interface TrafficSource {
  source: string;
  sessions: number;
  percentage: number;
  color: string;
}

// Generic API request function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Analytics API
export const analyticsAPI = {
  // Get current metrics
  getMetrics: (): Promise<ApiResponse<Metrics>> => 
    apiRequest<Metrics>('/analytics/metrics'),

  // Get chart data
  getRevenueData: (period = '30d'): Promise<ApiResponse<{ data: ChartData[]; total: number; period: string }>> =>
    apiRequest(`/analytics/charts/revenue?period=${period}`),

  getUserData: (period = '30d'): Promise<ApiResponse<{ data: ChartData[]; total: number; period: string }>> =>
    apiRequest(`/analytics/charts/users?period=${period}`),

  getConversionData: (period = '30d'): Promise<ApiResponse<{ data: ChartData[]; average: number; period: string }>> =>
    apiRequest(`/analytics/charts/conversions?period=${period}`),

  // Get traffic sources
  getTrafficSources: (): Promise<ApiResponse<TrafficSource[]>> =>
    apiRequest<TrafficSource[]>('/analytics/traffic-sources'),

  // Get device data
  getDeviceData: (): Promise<ApiResponse<any[]>> =>
    apiRequest<any[]>('/analytics/devices'),

  // Get geographic data
  getGeographicData: (): Promise<ApiResponse<any[]>> =>
    apiRequest<any[]>('/analytics/geography'),

  // Get top pages
  getTopPages: (): Promise<ApiResponse<any[]>> =>
    apiRequest<any[]>('/analytics/top-pages'),

  // Get real-time data
  getRealTimeData: (): Promise<ApiResponse<any>> =>
    apiRequest<any>('/analytics/real-time'),

  // Get summary
  getSummary: (): Promise<ApiResponse<any>> =>
    apiRequest<any>('/analytics/summary'),
};

// Campaigns API
export const campaignsAPI = {
  // Get all campaigns
  getCampaigns: (params: {
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<ApiResponse<{ data: Campaign[]; pagination: any; summary: any }>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    return apiRequest(`/campaigns?${queryParams.toString()}`);
  },

  // Get single campaign
  getCampaign: (id: string): Promise<ApiResponse<Campaign>> =>
    apiRequest<Campaign>(`/campaigns/${id}`),

  // Get campaigns overview stats
  getCampaignsOverview: (): Promise<ApiResponse<any>> =>
    apiRequest<any>('/campaigns/stats/overview'),

  // Get top performing campaigns
  getTopCampaigns: (metric = 'roas', limit = 5): Promise<ApiResponse<Campaign[]>> =>
    apiRequest<Campaign[]>(`/campaigns/performance/top?metric=${metric}&limit=${limit}`),
};

// Reports API
export const reportsAPI = {
  // Get performance report
  getPerformanceReport: (params: {
    startDate?: string;
    endDate?: string;
    period?: string;
  } = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    return apiRequest(`/reports/performance?${queryParams.toString()}`);
  },

  // Get revenue report
  getRevenueReport: (params: {
    startDate?: string;
    endDate?: string;
    period?: string;
    groupBy?: string;
  } = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    return apiRequest(`/reports/revenue?${queryParams.toString()}`);
  },

  // Get audience report
  getAudienceReport: (params: {
    startDate?: string;
    endDate?: string;
  } = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    return apiRequest(`/reports/audience?${queryParams.toString()}`);
  },

  // Get conversion report
  getConversionReport: (params: {
    startDate?: string;
    endDate?: string;
    funnelStep?: string;
  } = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    return apiRequest(`/reports/conversion?${queryParams.toString()}`);
  },

  // Get executive summary
  getExecutiveSummary: (params: {
    startDate?: string;
    endDate?: string;
    period?: string;
  } = {}): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    return apiRequest(`/reports/summary?${queryParams.toString()}`);
  },
};

// Export API
export const exportAPI = {
  // Export campaigns to CSV
  exportCampaignsCSV: async (params: {
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<void> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/export/campaigns/csv?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaigns_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Export analytics to CSV
  exportAnalyticsCSV: async (params: {
    type?: 'revenue' | 'traffic' | 'geography';
    period?: string;
  } = {}): Promise<void> => {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value);
      }
    });
    
    const response = await fetch(`${API_BASE_URL}/export/analytics/csv?${queryParams.toString()}`);
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${params.type || 'analytics'}_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Export report to PDF
  exportReportPDF: async (params: {
    reportType?: 'summary' | 'campaigns' | 'performance';
    startDate?: string;
    endDate?: string;
    includeCharts?: boolean;
  } = {}): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/export/report/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) throw new Error('PDF export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${params.reportType || 'report'}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Get available export formats
  getExportFormats: (): Promise<ApiResponse<any>> =>
    apiRequest<any>('/export/formats'),
};

// Health check
export const healthAPI = {
  checkHealth: (): Promise<any> =>
    fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(r => r.json()),
}; 