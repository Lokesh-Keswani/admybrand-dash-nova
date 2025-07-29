import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState, useCallback, useRef } from 'react';
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

// Global state to persist chart data across component remounts
let globalChartData: RevenueDataPoint[] | null = null;

export function RevenueChart({ data = defaultData, height = 200 }: RevenueChartProps) {
  const [chartData, setChartData] = useState<RevenueDataPoint[]>(globalChartData || data);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialized, setInitialized] = useState(!!globalChartData);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Debounced update function to prevent flickering
  const debouncedUpdate = useCallback((newData: RevenueDataPoint[]) => {
    const now = Date.now();
    
    // Prevent updates more frequent than 1.5 seconds to reduce flickering
    if (now - lastUpdateRef.current < 1500) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        setChartData(newData);
        globalChartData = newData;
        lastUpdateRef.current = Date.now();
      }, 500);
      return;
    }
    
    setChartData(newData);
    globalChartData = newData;
    lastUpdateRef.current = now;
  }, []);

  useEffect(() => {
    // Listen for initial data to get current backend state
    const unsubscribeInitial = webSocketService.on('initial-data', (initialData) => {
      if (initialData.metrics?.totalRevenue && !initialized && !globalChartData) {
        // Initialize chart with current backend data, not defaults
        const currentTime = new Date();
        const initialPoint: RevenueDataPoint = {
          date: currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          value: initialData.metrics.totalRevenue,
          timestamp: currentTime.getTime()
        };
        debouncedUpdate([initialPoint]);
        setInitialized(true);
      }
    });

    // Listen for real-time revenue updates
    const unsubscribe = webSocketService.on('real-time-update', (update) => {
      if (update.metrics?.totalRevenue) {
        // Show updating animation
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 800);
        
        // Smooth update - modify the last data point or add new one
        const now = new Date();
        const currentTime = now.getTime();
        const currentData = chartData;
        const lastPoint = currentData[currentData.length - 1];
        
        let updated: RevenueDataPoint[];
        
        // If last update was less than 30 seconds ago, update the last point
        // Otherwise add a new point
        if (lastPoint && (currentTime - lastPoint.timestamp) < 30000) {
          updated = [...currentData];
          updated[updated.length - 1] = {
            ...lastPoint,
            value: update.metrics.totalRevenue,
            timestamp: currentTime
          };
        } else {
          // Add new point with proper time formatting
          const newPoint: RevenueDataPoint = {
            date: now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            value: update.metrics.totalRevenue,
            timestamp: currentTime
          };
          
          // Keep last 15 points for smoother visualization
          updated = [...currentData, newPoint].slice(-15);
        }
        
        // Use debounced update to prevent flickering
        debouncedUpdate(updated);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeInitial();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [initialized, debouncedUpdate]);

  const formatValue = (value: number) => {
    return `$${(value / 1000).toFixed(1)}k`;
  };

  const formatDate = (dateString: string) => {
    // Handle time strings for real-time data
    if (dateString.includes(':')) {
      return dateString; // Already formatted time string
    }
    // Handle date strings for historical data
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`relative transition-all duration-700 ease-in-out ${isUpdating ? 'ring-1 ring-primary/30 rounded-lg' : ''}`}>
      {isUpdating && (
        <div className="absolute top-2 right-2 z-10 transition-opacity duration-300">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" title="Updating..." />
        </div>
      )}
      <div className="transition-all duration-500 ease-in-out">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              strokeOpacity={0.3}
            />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={formatValue}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              formatter={(value: number) => [formatValue(value), 'Revenue']}
              labelFormatter={(label) => formatDate(label)}
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
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2.5}
              dot={false}
              activeDot={{ 
                r: 5, 
                stroke: 'hsl(var(--primary))', 
                strokeWidth: 2,
                fill: 'hsl(var(--background))'
              }}
              animationDuration={800}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 