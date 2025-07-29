import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { webSocketService } from '@/services/websocket';

interface RevenueDataPoint {
  date: string;
  value: number;
  timestamp: number;
}

interface RevenueChartProps {
  data?: RevenueDataPoint[];
  height?: number;
}

// Default mock data for revenue trend
const defaultData: RevenueDataPoint[] = [
  { date: '2024-06-01', value: 8420, timestamp: Date.now() },
  { date: '2024-06-02', value: 9200, timestamp: Date.now() },
  { date: '2024-06-03', value: 8950, timestamp: Date.now() },
  { date: '2024-06-04', value: 10200, timestamp: Date.now() },
  { date: '2024-06-05', value: 11500, timestamp: Date.now() },
  { date: '2024-06-06', value: 12300, timestamp: Date.now() },
  { date: '2024-06-07', value: 13100, timestamp: Date.now() },
];

export function RevenueChart({ data = defaultData, height = 200 }: RevenueChartProps) {
  const [chartData, setChartData] = useState<RevenueDataPoint[]>(data);

  useEffect(() => {
    // Listen for real-time revenue updates
    const unsubscribe = webSocketService.on('real-time-update', (update) => {
      if (update.metrics?.totalRevenue) {
        // Add new data point and keep last 7 entries
        setChartData(prev => {
          const newPoint: RevenueDataPoint = {
            date: new Date().toISOString().split('T')[0],
            value: update.metrics.totalRevenue,
            timestamp: Date.now()
          };
          
          const updated = [...prev, newPoint].slice(-7);
          return updated;
        });
      }
    });

    return unsubscribe;
  }, []);

  const formatValue = (value: number) => {
    return `$${(value / 1000).toFixed(1)}k`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          labelFormatter={(label) => formatDate(label)}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 