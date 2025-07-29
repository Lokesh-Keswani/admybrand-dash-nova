import { MetricCard } from "@/components/MetricCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Users, Target, TrendingUp, BarChart3, PieChart, Wifi, WifiOff } from "lucide-react"
import { useEffect, useState } from "react"
import { analyticsAPI, campaignsAPI, Metrics, Campaign } from "@/services/api"
import { useWebSocket } from "@/services/websocket"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Sample fallback data
const sampleMetrics: Metrics = {
  totalRevenue: {
    value: "$124,580",
    change: "+12.5%",
    changeType: "positive" as const,
    raw: 124580
  },
  activeUsers: {
    value: "24,567",
    change: "+8.3%",
    changeType: "positive" as const,
    raw: 24567
  },
  conversions: {
    value: "892",
    change: "+15.2%",
    changeType: "positive" as const,
    raw: 892
  },
  growthRate: {
    value: "15.3%",
    change: "+2.1%",
    changeType: "positive" as const,
    raw: 15.3
  }
};

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
  }
];

export function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(sampleMetrics);
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  const { isConnected, subscribe, on } = useWebSocket();

  // Load initial data (disabled to prevent aggressive retries)
  // useEffect(() => {
  //   loadDashboardData();
  // }, []);

  // Subscribe to real-time updates
  useEffect(() => {
    if (isConnected) {
      subscribe('metrics');
      
      // Listen for real-time updates
      const unsubscribeMetrics = on('real-time-update', (data) => {
        if (data.metrics) {
          setMetrics({
            totalRevenue: {
              value: `$${data.metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
              change: "+20.1%",
              changeType: "positive",
              raw: data.metrics.totalRevenue
            },
            activeUsers: {
              value: data.metrics.activeUsers.toLocaleString(),
              change: "+15.3%",
              changeType: "positive",
              raw: data.metrics.activeUsers
            },
            conversions: {
              value: `${data.metrics.conversionRate.toFixed(1)}%`,
              change: "+2.1%",
              changeType: "positive",
              raw: data.metrics.conversionRate
            },
            growthRate: {
              value: `${data.metrics.growthRate.toFixed(1)}%`,
              change: data.metrics.growthRate > 8 ? "+0.5%" : "-0.5%",
              changeType: data.metrics.growthRate > 8 ? "positive" : "negative",
              raw: data.metrics.growthRate
            }
          });
          setLastUpdated(data.timestamp);
        }
      });

      return () => {
        unsubscribeMetrics();
      };
    }
  }, [isConnected, subscribe, on]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load metrics and campaigns in parallel
      const [metricsResponse, campaignsResponse] = await Promise.all([
        analyticsAPI.getMetrics(),
        campaignsAPI.getCampaigns({ limit: 5, sortBy: 'roas', sortOrder: 'desc' })
      ]);

      if (metricsResponse.success) {
        setMetrics(metricsResponse.data);
      }

      if (campaignsResponse.success) {
        setCampaigns(campaignsResponse.data.data);
      }

      setLastUpdated(new Date().toISOString());
    } catch (err) {
      // If API fails, keep sample data but show error
      setError(err instanceof Error ? err.message : 'API not available - showing sample data');
      console.error('Dashboard data loading error:', err);
      // Keep sample data instead of empty
      setMetrics(sampleMetrics);
      setCampaigns(sampleCampaigns);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <Alert className="border-red-500">
          <AlertDescription>
            Error loading dashboard data: {error}
            <button 
              onClick={loadDashboardData}
              className="ml-2 text-primary hover:underline"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your campaign performance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isConnected ? (
            <><Wifi className="h-4 w-4 text-green-500" /> Live Updates</>
          ) : (
            <><WifiOff className="h-4 w-4 text-red-500" /> Offline</>
          )}
          {lastUpdated && (
            <span className="ml-2">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Revenue"
            value={metrics.totalRevenue.value}
            change={metrics.totalRevenue.change}
            changeType={metrics.totalRevenue.changeType}
            icon={DollarSign}
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers.value}
            change={metrics.activeUsers.change}
            changeType={metrics.activeUsers.changeType}
            icon={Users}
          />
          <MetricCard
            title="Conversions"
            value={metrics.conversions.value}
            change={metrics.conversions.change}
            changeType={metrics.conversions.changeType}
            icon={Target}
          />
          <MetricCard
            title="Growth Rate"
            value={metrics.growthRate.value}
            change={metrics.growthRate.change}
            changeType={metrics.growthRate.changeType}
            icon={TrendingUp}
          />
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-glass-border rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Line Chart Placeholder</p>
                <p className="text-xs">Revenue trends visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-secondary" />
              Campaign Conversions
            </CardTitle>
            <CardDescription>Conversions by campaign type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-glass-border rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Bar Chart Placeholder</p>
                <p className="text-xs">Campaign conversion data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-accent" />
              Traffic Sources
            </CardTitle>
            <CardDescription>Traffic distribution by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-glass-border rounded-lg">
              <div className="text-center text-muted-foreground">
                <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Pie Chart Placeholder</p>
                <p className="text-xs">Traffic source breakdown</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
        <CardHeader>
          <CardTitle>Top Campaigns</CardTitle>
          <CardDescription>
            Your best performing campaigns this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-glass-border">
                <TableHead className="text-muted-foreground">Campaign</TableHead>
                <TableHead className="text-muted-foreground">Impressions</TableHead>
                <TableHead className="text-muted-foreground">Clicks</TableHead>
                <TableHead className="text-muted-foreground">CTR</TableHead>
                <TableHead className="text-muted-foreground">Conversions</TableHead>
                <TableHead className="text-muted-foreground">ROAS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns && campaigns.length > 0 ? campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-glass-border">
                  <TableCell className="font-medium text-foreground">
                    {campaign.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatNumber(campaign.impressions)}</TableCell>
                  <TableCell className="text-muted-foreground">{formatNumber(campaign.clicks)}</TableCell>
                  <TableCell className="text-muted-foreground">{campaign.ctr}%</TableCell>
                  <TableCell className="font-medium text-foreground">{campaign.conversions}</TableCell>
                  <TableCell className="font-medium text-foreground">{campaign.roas}x</TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    {loading ? "Loading campaigns..." : "No campaigns found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}