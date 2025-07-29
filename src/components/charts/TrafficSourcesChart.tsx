import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState, useCallback, useRef } from 'react';
import { webSocketService } from '@/services/websocket';

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
  const [initialized, setInitialized] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Debounced update function to prevent flickering
  const debouncedUpdate = useCallback((newData: TrafficSourceDataPoint[]) => {
    const now = Date.now();
    
    // Prevent updates more frequent than 3 seconds to reduce flickering
    if (now - lastUpdateRef.current < 3000) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        setChartData(newData);
        lastUpdateRef.current = Date.now();
      }, 1000);
      return;
    }
    
    setChartData(newData);
    lastUpdateRef.current = now;
  }, []);

  useEffect(() => {
    // Listen for initial data to get current backend state
    const unsubscribeInitial = webSocketService.on('initial-data', (initialData) => {
      if (initialData.metrics?.pageViews && !initialized) {
        // Scale traffic data based on current backend metrics
        const scaleFactor = initialData.metrics.pageViews / 45678; // Original total
        const updatedData = chartData.map(item => ({
          ...item,
          sessions: Math.floor(item.sessions * scaleFactor),
          // Percentages stay relative
        }));
        debouncedUpdate(updatedData);
        setInitialized(true);
      }
    });

    return () => {
      unsubscribeInitial();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [initialized, debouncedUpdate, chartData]);

  // Smooth real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate realistic incremental changes
      const totalSessions = chartData.reduce((sum, item) => sum + item.sessions, 0);
      
      const updatedData = chartData.map((item, index) => {
        // Different sources have different growth patterns (smaller changes)
        let sessionChange = 0;
        switch(item.source) {
          case 'Organic Search':
            sessionChange = Math.floor(Math.random() * 4 + 1); // 1-4 new sessions
            break;
          case 'Direct':
            sessionChange = Math.floor(Math.random() * 3 + 1); // 1-3 new sessions
            break;
          case 'Social Media':
            sessionChange = Math.floor(Math.random() * 3 + 1); // 1-3 new sessions
            break;
          case 'Email':
            sessionChange = Math.floor(Math.random() * 2 + 1); // 1-2 new sessions
            break;
          case 'Referral':
            sessionChange = Math.random() > 0.8 ? Math.floor(Math.random() * 2 + 1) : 0; // Occasional 1-2
            break;
          default:
            sessionChange = Math.floor(Math.random() * 2);
        }
        
        const newSessions = item.sessions + sessionChange;
        const newTotal = totalSessions + sessionChange;
        const newPercentage = (newSessions / newTotal) * 100;
        
        return {
          ...item,
          sessions: newSessions,
          percentage: Math.round(newPercentage * 10) / 10 // Round to 1 decimal
        };
      });
      
      debouncedUpdate(updatedData);
    }, 8000); // Update every 8 seconds for smoother feel

    return () => {
      clearInterval(interval);
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [debouncedUpdate, chartData]);

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
    <div className="transition-all duration-500 ease-in-out">
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
            animationDuration={1200}
            animationEasing="ease-in-out"
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
              borderRadius: '8px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }}
            animationDuration={200}
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
    </div>
  );
} 