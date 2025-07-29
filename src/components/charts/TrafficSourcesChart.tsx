import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from 'react';

interface TrafficSourceDataPoint {
  source: string;
  sessions: number;
  percentage: number;
  color: string;
}

interface TrafficSourcesChartProps {
  data?: TrafficSourceDataPoint[];
  height?: number;
}

// Default mock data for traffic sources
const defaultData: TrafficSourceDataPoint[] = [
  { source: 'Organic Search', sessions: 12456, percentage: 45.2, color: '#3b82f6' },
  { source: 'Direct', sessions: 8234, percentage: 29.9, color: '#10b981' },
  { source: 'Social Media', sessions: 4321, percentage: 15.7, color: '#f59e0b' },
  { source: 'Email', sessions: 1876, percentage: 6.8, color: '#ef4444' },
  { source: 'Referral', sessions: 654, percentage: 2.4, color: '#8b5cf6' },
];

export function TrafficSourcesChart({ data = defaultData, height = 200 }: TrafficSourcesChartProps) {
  const [chartData, setChartData] = useState<TrafficSourceDataPoint[]>(data);

  // Simulate occasional data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => 
        prev.map(item => ({
          ...item,
          sessions: item.sessions + Math.floor(Math.random() * 10) - 5,
          percentage: Math.max(1, item.percentage + (Math.random() - 0.5) * 0.5)
        }))
      );
    }, 45000); // Update every 45 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTooltip = (value: number, name: string) => {
    if (name === 'sessions') {
      return [value.toLocaleString(), 'Sessions'];
    }
    return [value, name];
  };

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={60}
          fill="#8884d8"
          dataKey="sessions"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          formatter={formatTooltip}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            fontSize: '12px'
          }}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36}
          formatter={(value, entry) => (
            <span style={{ color: entry.color, fontSize: '12px' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
} 