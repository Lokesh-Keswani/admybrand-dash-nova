import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart, Line, LineChart } from 'recharts';
import { useEffect, useState } from 'react';

// Enhanced chart components for Analytics page

interface TimeSeriesDataPoint {
  date: string;
  value: number;
  timestamp: number;
}

interface AnalyticsChartProps {
  data?: TimeSeriesDataPoint[];
  height?: number;
}

// Revenue Growth Area Chart
export function RevenueGrowthChart({ data, height = 300 }: AnalyticsChartProps) {
  const [chartData, setChartData] = useState<TimeSeriesDataPoint[]>(data || []);

  // Generate sample revenue growth data
  useEffect(() => {
    if (!data) {
      const generateData = () => {
        const baseData = [];
        for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          baseData.push({
            date: date.toISOString().split('T')[0],
            value: Math.floor(Math.random() * 5000) + 15000 + (i * 100),
            timestamp: date.getTime()
          });
        }
        return baseData;
      };
      setChartData(generateData());
    }
  }, [data]);

  const formatValue = (value: number) => `$${(value / 1000).toFixed(1)}k`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          tickFormatter={formatValue}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip 
          formatter={(value: number) => [formatValue(value), 'Revenue']}
          labelFormatter={formatDate}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="value" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          fill="url(#revenueGradient)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// User Engagement Bar Chart
export function UserEngagementChart({ height = 300 }: { height?: number }) {
  const engagementData = [
    { metric: 'Page Views', value: 45678, growth: 12.5 },
    { metric: 'Sessions', value: 28340, growth: 8.3 },
    { metric: 'Bounce Rate', value: 32.1, growth: -5.2 },
    { metric: 'Avg. Session', value: 4.32, growth: 15.8 },
    { metric: 'Conversions', value: 892, growth: 22.1 }
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={engagementData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="metric" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'value') {
              return [typeof value === 'number' ? value.toLocaleString() : value, 'Value'];
            }
            return [value, name];
          }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Bar 
          dataKey="value" 
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Conversion Funnel Chart
export function ConversionFunnelChart({ height = 300 }: { height?: number }) {
  const funnelData = [
    { stage: 'Visitors', users: 108000, percentage: 100, color: '#3b82f6' },
    { stage: 'Product Views', users: 64800, percentage: 60, color: '#10b981' },
    { stage: 'Add to Cart', users: 21600, percentage: 20, color: '#f59e0b' },
    { stage: 'Checkout', users: 10800, percentage: 10, color: '#ef4444' },
    { stage: 'Purchase', users: 3240, percentage: 3, color: '#8b5cf6' }
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={funnelData} 
        margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis 
          type="category" 
          dataKey="stage" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          width={80}
        />
        <Tooltip 
          formatter={(value: number) => [value.toLocaleString(), 'Users']}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Bar 
          dataKey="users" 
          fill="hsl(var(--primary))"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// Performance Metrics Composed Chart
export function PerformanceMetricsChart({ height = 300 }: { height?: number }) {
  const performanceData = [
    { date: '2024-01', ctr: 2.4, roas: 3.2, cpc: 1.85, impressions: 125000 },
    { date: '2024-02', ctr: 2.8, roas: 3.5, cpc: 1.92, impressions: 134000 },
    { date: '2024-03', ctr: 3.1, roas: 3.8, cpc: 1.78, impressions: 142000 },
    { date: '2024-04', ctr: 2.9, roas: 4.1, cpc: 1.65, impressions: 158000 },
    { date: '2024-05', ctr: 3.3, roas: 4.4, cpc: 1.58, impressions: 167000 },
    { date: '2024-06', ctr: 3.6, roas: 4.7, cpc: 1.52, impressions: 175000 }
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={performanceData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          yAxisId="left"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          yAxisId="right" 
          orientation="right"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
        />
        <Bar yAxisId="left" dataKey="impressions" fill="hsl(var(--muted))" opacity={0.6} />
        <Line yAxisId="right" type="monotone" dataKey="ctr" stroke="#3b82f6" strokeWidth={2} />
        <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#10b981" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  );
} 