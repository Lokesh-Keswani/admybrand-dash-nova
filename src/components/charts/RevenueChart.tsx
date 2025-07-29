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

// Generate 6 months of monthly revenue data
const generateInitialData = (): RevenueDataPoint[] => {
  const points: RevenueDataPoint[] = [];
  const now = new Date();
  const baseRevenue = 2400000; // Monthly revenue base: $2.4M
  
  // Create 6 months of data (current month + 5 previous months)
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
    
    // Generate realistic monthly revenue with seasonal trends
    let monthlyMultiplier = 1;
    const month = date.getMonth();
    
    // Seasonal adjustments (holiday season higher, summer lower)
    if (month === 11 || month === 0) monthlyMultiplier = 1.3; // Dec/Jan
    else if (month >= 9 && month <= 10) monthlyMultiplier = 1.15; // Oct/Nov
    else if (month >= 6 && month <= 8) monthlyMultiplier = 0.9; // Summer
    else monthlyMultiplier = 1.0; // Spring
    
    // Add growth trend (3% monthly growth)
    const growthFactor = Math.pow(1.03, 5 - i);
    
    // Add some random variation (±10%)
    const variation = 0.9 + (Math.random() * 0.2);
    
    const monthlyRevenue = Math.round(baseRevenue * monthlyMultiplier * growthFactor * variation);
    
    points.push({
      date: monthName,
      value: monthlyRevenue,
      timestamp: date.getTime()
    });
  }
  
  return points;
};

const defaultData: RevenueDataPoint[] = generateInitialData();

// Global state to persist chart data across component remounts
let globalChartData: RevenueDataPoint[] | null = null;

export function RevenueChart({ data = defaultData, height = 200 }: RevenueChartProps) {
  const [chartData, setChartData] = useState<RevenueDataPoint[]>(globalChartData || defaultData);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialized, setInitialized] = useState(!!globalChartData);
  const [hasRealData, setHasRealData] = useState(!!globalChartData);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Debounced update function to prevent flickering
  const debouncedUpdate = useCallback((newData: RevenueDataPoint[]) => {
    const now = Date.now();
    
    // Reduce debounce time for more responsive updates
    if (now - lastUpdateRef.current < 1000) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        setChartData(newData);
        globalChartData = newData;
        lastUpdateRef.current = Date.now();
      }, 300);
      return;
    }
    
    setChartData(newData);
    globalChartData = newData;
    lastUpdateRef.current = now;
  }, []);

  // Initialize with default data if not already initialized
  useEffect(() => {
    if (!initialized && !globalChartData) {
      debouncedUpdate(defaultData);
      setInitialized(true);
    }
  }, [initialized, debouncedUpdate]);

  useEffect(() => {
    // Listen for initial data to get current backend state
    const unsubscribeInitial = webSocketService.on('initial-data', (initialData) => {
      if (initialData.metrics?.totalRevenue) {
        // Update current month's revenue in monthly chart
        const currentData = globalChartData || chartData;
        const updatedData = [...currentData];
        
        // Update the last (current) month with live revenue data
        if (updatedData.length > 0) {
          const lastIndex = updatedData.length - 1;
          // Convert daily revenue to estimated monthly revenue
          const dailyRevenue = initialData.metrics.totalRevenue;
          const currentDate = new Date();
          const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          const dayOfMonth = currentDate.getDate();
          const estimatedMonthlyRevenue = (dailyRevenue * daysInMonth) / dayOfMonth;
          
          updatedData[lastIndex] = {
            ...updatedData[lastIndex],
            value: Math.round(estimatedMonthlyRevenue)
          };
          
          debouncedUpdate(updatedData);
          setHasRealData(true);
        }
      }
    });

    // Listen for real-time revenue updates
    const unsubscribe = webSocketService.on('real-time-update', (update) => {
      if (update.metrics?.totalRevenue) {
        // Show updating animation
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 800);
        
        // Update current month's revenue based on live data
        const currentData = chartData;
        const updated = [...currentData];
        
        // Update the last (current) month with estimated monthly revenue
        if (updated.length > 0) {
          const lastIndex = updated.length - 1;
          // Convert daily revenue to estimated monthly revenue
          const dailyRevenue = update.metrics.totalRevenue;
          const currentDate = new Date();
          const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
          const dayOfMonth = currentDate.getDate();
          const estimatedMonthlyRevenue = (dailyRevenue * daysInMonth) / dayOfMonth;
          
          updated[lastIndex] = {
            ...updated[lastIndex],
            value: Math.round(estimatedMonthlyRevenue)
          };
        }
        
        // Use debounced update to prevent flickering
        debouncedUpdate(updated);
        setHasRealData(true);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeInitial();
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [debouncedUpdate, chartData]);

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 100000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${(value / 1000).toFixed(1)}k`;
  };

  const formatDate = (dateString: string) => {
    // Return month names as-is (already formatted like "Jan 24", "Feb 24", etc.)
    return dateString;
  };

  return (
    <div className={`relative transition-all duration-700 ease-in-out ${isUpdating ? 'ring-2 ring-primary/40 rounded-lg shadow-lg' : ''}`}>
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        {isUpdating && (
          <div className="transition-opacity duration-300">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-lg" title="Updating..." />
          </div>
        )}
        {!hasRealData && (
          <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded" title="Sample monthly revenue data">
            Sample Data
          </div>
        )}
      </div>
      <div className="transition-all duration-500 ease-in-out p-1">
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
              interval={0}
            />
            <YAxis 
              tickFormatter={formatValue}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 200000', 'dataMax + 200000']}
              tickCount={5}
            />
            <Tooltip 
              formatter={(value: number) => [formatValue(value), 'Monthly Revenue']}
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
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="revenueLineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" />
              </linearGradient>
            </defs>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="url(#revenueLineGradient)" 
              strokeWidth={3}
              dot={{ 
                fill: 'hsl(var(--primary))', 
                strokeWidth: 2, 
                r: 3,
                stroke: 'hsl(var(--background))',
                style: { filter: 'drop-shadow(0 0 3px hsl(var(--primary)))' }
              }}
              activeDot={{ 
                r: 6, 
                stroke: 'hsl(var(--primary))', 
                strokeWidth: 3,
                fill: 'hsl(var(--background))',
                style: { filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }
              }}
              animationDuration={1000}
              animationEasing="ease-in-out"
              connectNulls={true}
              style={{ filter: 'drop-shadow(0 0 2px hsl(var(--primary)))'}}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 