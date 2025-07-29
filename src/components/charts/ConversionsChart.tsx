import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { webSocketService } from '@/services/websocket';

interface ConversionDataPoint {
  campaign: string;
  conversions: number;
  color: string;
}

interface ConversionsChartProps {
  data?: ConversionDataPoint[];
  height?: number;
}

// Default mock data for campaign conversions
const defaultData: ConversionDataPoint[] = [
  { campaign: 'Summer Sale', conversions: 234, color: '#3b82f6' },
  { campaign: 'Brand Awareness', conversions: 186, color: '#10b981' },
  { campaign: 'Product Launch', conversions: 175, color: '#f59e0b' },
  { campaign: 'Holiday', conversions: 98, color: '#ef4444' },
  { campaign: 'Retargeting', conversions: 156, color: '#8b5cf6' },
];

export function ConversionsChart({ data = defaultData, height = 200 }: ConversionsChartProps) {
  const [chartData, setChartData] = useState<ConversionDataPoint[]>(data);

  useEffect(() => {
    // Listen for real-time campaign updates
    const unsubscribe = webSocketService.on('campaigns-update', (update) => {
      if (update.metrics?.conversions) {
        // Update the first campaign's conversions for demo
        setChartData(prev => 
          prev.map((item, index) => 
            index === 0 
              ? { ...item, conversions: update.metrics.conversions }
              : item
          )
        );
      }
    });

    return unsubscribe;
  }, []);

  const formatCampaignName = (name: string) => {
    return name.length > 10 ? name.substring(0, 10) + '...' : name;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="campaign" 
          tickFormatter={formatCampaignName}
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
          formatter={(value: number) => [value, 'Conversions']}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
        <Bar 
          dataKey="conversions" 
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
} 