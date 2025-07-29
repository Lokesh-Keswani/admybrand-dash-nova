import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState, useCallback, useRef } from 'react';
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
  const [initialized, setInitialized] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Debounced update function to prevent flickering
  const debouncedUpdate = useCallback((newData: ConversionDataPoint[]) => {
    const now = Date.now();
    
    // Prevent updates more frequent than 2 seconds to reduce flickering
    if (now - lastUpdateRef.current < 2000) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      updateTimeoutRef.current = setTimeout(() => {
        setChartData(newData);
        lastUpdateRef.current = Date.now();
      }, 800);
      return;
    }
    
    setChartData(newData);
    lastUpdateRef.current = now;
  }, []);

  useEffect(() => {
    // Listen for initial data to get current backend state
    const unsubscribeInitial = webSocketService.on('initial-data', (initialData) => {
      if (initialData.metrics?.conversions && !initialized) {
        // Update chart with current backend conversions data
        const totalConversions = initialData.metrics.conversions;
        const baseConversions = Math.floor(totalConversions / chartData.length);
        
        const updatedData = chartData.map((item, index) => {
          let newConversions;
          switch(index) {
            case 0: // Summer Sale - best performer
              newConversions = Math.floor(baseConversions * 1.4);
              break;
            case 1: // Brand Awareness - second best  
              newConversions = Math.floor(baseConversions * 1.1);
              break;
            case 2: // Product Launch - average
              newConversions = Math.floor(baseConversions * 0.9);
              break;
            case 3: // Holiday - lower performance
              newConversions = Math.floor(baseConversions * 0.6);
              break;
            default: // Retargeting - variable
              newConversions = Math.floor(baseConversions * 0.8);
          }
          
          return {
            ...item,
            conversions: Math.max(50, newConversions)
          };
        });
        
        debouncedUpdate(updatedData);
        setInitialized(true);
      }
    });

    // Listen for real-time updates and simulate campaign performance changes
    const unsubscribe = webSocketService.on('real-time-update', (update) => {
      if (update.metrics?.conversions) {
        // Realistically distribute conversions across campaigns
        const totalConversions = update.metrics.conversions;
        const baseConversions = Math.floor(totalConversions / chartData.length);
        
        const updatedData = chartData.map((item, index) => {
          let newConversions;
          switch(index) {
            case 0: // Summer Sale - best performer
              newConversions = Math.floor(baseConversions * 1.4 + Math.random() * 10);
              break;
            case 1: // Brand Awareness - second best
              newConversions = Math.floor(baseConversions * 1.1 + Math.random() * 8);
              break;
            case 2: // Product Launch - average
              newConversions = Math.floor(baseConversions * 0.9 + Math.random() * 6);
              break;
            case 3: // Holiday - lower performance
              newConversions = Math.floor(baseConversions * 0.6 + Math.random() * 4);
              break;
            default: // Retargeting - variable
              newConversions = Math.floor(baseConversions * 0.8 + Math.random() * 5);
          }
          
          return {
            ...item,
            conversions: Math.max(50, newConversions) // Minimum 50 conversions
          };
        });
        
        debouncedUpdate(updatedData);
      }
    });

    // Also add smooth incremental updates every few seconds
    const smoothUpdates = setInterval(() => {
      const updatedData = chartData.map(item => ({
        ...item,
        conversions: Math.max(50, item.conversions + Math.floor(Math.random() * 2)) // Smaller incremental increases
      }));
      debouncedUpdate(updatedData);
    }, 12000); // Every 12 seconds (less frequent)

    return () => {
      unsubscribe();
      unsubscribeInitial();
      clearInterval(smoothUpdates);
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [initialized, debouncedUpdate, chartData]);

  const formatCampaignName = (name: string) => {
    return name.length > 10 ? name.substring(0, 10) + '...' : name;
  };

  return (
    <div className="transition-all duration-500 ease-in-out">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={chartData} 
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="hsl(var(--border))" 
            strokeOpacity={0.3}
          />
          <XAxis 
            dataKey="campaign" 
            tickFormatter={formatCampaignName}
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(value: number) => [value, 'Conversions']}
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
          <Bar 
            dataKey="conversions" 
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            animationDuration={1000}
            animationEasing="ease-in-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 