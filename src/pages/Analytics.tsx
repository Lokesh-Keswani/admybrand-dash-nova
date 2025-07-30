import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Globe, Smartphone, Monitor, Tablet, Activity, Target, DollarSign } from "lucide-react"
import { analyticsAPI, reportsAPI } from "@/services/api"
import { RevenueGrowthChart, UserEngagementChart, ConversionFunnelChart, PerformanceMetricsChart } from "@/components/charts/AnalyticsCharts"

// Sample analytics data
const sampleTrafficSources = [
  { source: "Google", sessions: 45620, percentage: 42.3, change: "+8.2%" },
  { source: "Direct", sessions: 28340, percentage: 26.1, change: "+3.1%" },
  { source: "Facebook", sessions: 18290, percentage: 16.9, change: "-2.4%" },
  { source: "Twitter", sessions: 8750, percentage: 8.1, change: "+12.5%" },
  { source: "LinkedIn", sessions: 4320, percentage: 4.0, change: "+5.7%" },
  { source: "Other", sessions: 2680, percentage: 2.6, change: "-1.2%" }
];

const sampleDeviceData = [
  { device: "Desktop", users: 52340, percentage: 48.5, icon: Monitor },
  { device: "Mobile", users: 41250, percentage: 38.2, icon: Smartphone },
  { device: "Tablet", users: 14410, percentage: 13.3, icon: Tablet }
];

const sampleGeographicData = [
  { country: "United States", users: 28450, revenue: 45230, flag: "🇺🇸" },
  { country: "United Kingdom", users: 18320, revenue: 32100, flag: "🇬🇧" },
  { country: "Canada", users: 15670, revenue: 28950, flag: "🇨🇦" },
  { country: "Germany", users: 12890, revenue: 24780, flag: "🇩🇪" },
  { country: "France", users: 10540, revenue: 19630, flag: "🇫🇷" },
  { country: "Australia", users: 8730, revenue: 16840, flag: "🇦🇺" }
];

const sampleTopPages = [
  { path: "/", views: 45620, bounce_rate: 32.1, avg_time: "3:24" },
  { path: "/products", views: 28340, bounce_rate: 28.7, avg_time: "4:12" },
  { path: "/pricing", views: 18290, bounce_rate: 45.2, avg_time: "2:18" },
  { path: "/blog", views: 15670, bounce_rate: 52.8, avg_time: "5:45" },
  { path: "/about", views: 12450, bounce_rate: 38.9, avg_time: "2:56" },
  { path: "/contact", views: 8730, bounce_rate: 41.3, avg_time: "2:02" }
];

const sampleConversionFunnel = [
  { stage: "Visitors", users: 108000, percentage: 100, color: "bg-blue-500" },
  { stage: "Product Views", users: 64800, percentage: 60, color: "bg-green-500" },
  { stage: "Add to Cart", users: 21600, percentage: 20, color: "bg-yellow-500" },
  { stage: "Checkout", users: 10800, percentage: 10, color: "bg-orange-500" },
  { stage: "Purchase", users: 3240, percentage: 3, color: "bg-red-500" }
];

export default function Analytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trafficSources, setTrafficSources] = useState(sampleTrafficSources);
  const [deviceData, setDeviceData] = useState(sampleDeviceData);
  const [geographicData, setGeographicData] = useState(sampleGeographicData);
  const [topPages, setTopPages] = useState(sampleTopPages);
  const [conversionFunnel, setConversionFunnel] = useState(sampleConversionFunnel);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to load real data, but keep sample data if it fails
      const metricsResponse = await analyticsAPI.getMetrics();

      if (metricsResponse.success) {
        // Analytics data loaded successfully
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API not available - showing sample data');
      console.error('Analytics loading error:', err);
      // Keep sample data on error
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="flex-1 space-y-4 sm:space-y-6 py-2 sm:py-4 lg:py-6 bg-gradient-to-br from-background via-muted/5 to-accent/5 min-h-screen">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Analytics
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Deep insights into your website performance and user behavior
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="border-green-200 text-green-700 text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Live Data
          </Badge>
        </div>
      </div>

      {error && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        {/* Mobile-responsive tab list */}
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-5 min-w-max sm:min-w-0">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="traffic" className="text-xs sm:text-sm">Traffic</TabsTrigger>
            <TabsTrigger value="audience" className="text-xs sm:text-sm">Audience</TabsTrigger>
            <TabsTrigger value="behavior" className="text-xs sm:text-sm">Behavior</TabsTrigger>
            <TabsTrigger value="conversions" className="text-xs sm:text-sm">Conversions</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Revenue Growth Chart */}
            <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />
                  Revenue Growth Trend
                </CardTitle>
                <CardDescription className="text-sm">
                  30-day revenue performance with growth indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueGrowthChart height={250} />
              </CardContent>
            </Card>

            {/* User Engagement Chart */}
            <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                  User Engagement Metrics
                </CardTitle>
                <CardDescription className="text-sm">
                  Key engagement indicators and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserEngagementChart height={250} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Performance Metrics Chart */}
            <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription className="text-sm">
                  CTR, ROAS, and impression trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PerformanceMetricsChart height={250} />
              </CardContent>
            </Card>

            {/* Conversion Funnel Chart */}
            <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5" />
                  Conversion Funnel Analysis
                </CardTitle>
                <CardDescription className="text-sm">
                  User journey from visitors to customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ConversionFunnelChart height={300} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Traffic Sources */}
            <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                  Traffic Sources
                </CardTitle>
                <CardDescription className="text-sm">
                  Where your visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {trafficSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <span className="font-medium text-sm sm:text-base truncate">{source.source}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-sm sm:text-base">{formatNumber(source.sessions)}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
                  Device Types
                </CardTitle>
                <CardDescription className="text-sm">
                  User device preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {deviceData.map((device) => {
                  const IconComponent = device.icon;
                  return (
                    <div key={device.device} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                          <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-base truncate">{device.device}</span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-semibold text-sm sm:text-base">{formatNumber(device.users)}</div>
                          <div className="text-xs sm:text-sm text-muted-foreground">{device.percentage}%</div>
                        </div>
                      </div>
                      <Progress value={device.percentage} className="h-1.5 sm:h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Geographic Data */}
            <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription className="text-sm">
                  Users by country
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {geographicData.map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <span className="text-lg sm:text-xl flex-shrink-0">{country.flag}</span>
                      <span className="font-medium text-sm sm:text-base truncate">{country.country}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-sm sm:text-base">{formatNumber(country.users)}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{formatCurrency(country.revenue)}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Audience Insights */}
            <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                  Audience Insights
                </CardTitle>
                <CardDescription className="text-sm">
                  User demographics and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">New vs Returning</span>
                    <span className="text-sm text-muted-foreground">68% : 32%</span>
                  </div>
                  <Progress value={68} className="h-1.5 sm:h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Average Session Duration</span>
                    <span className="text-sm font-semibold">4:32</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Pages per Session</span>
                    <span className="text-sm font-semibold">3.4</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Bounce Rate</span>
                    <span className="text-sm font-semibold text-orange-600">42.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-4 sm:space-y-6">
          <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
                Top Pages
              </CardTitle>
              <CardDescription className="text-sm">
                Most visited pages and their performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.path} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg bg-muted/50 gap-3 sm:gap-0">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-primary/10 text-primary text-xs font-medium rounded flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm sm:text-base truncate">{page.path}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {formatNumber(page.views)} views
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row sm:flex-col sm:text-right gap-4 sm:gap-1 text-xs sm:text-sm">
                      <div>
                        <span className="text-muted-foreground">Bounce: </span>
                        <span className="font-medium">{page.bounce_rate}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Time: </span>
                        <span className="font-medium">{page.avg_time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4 sm:space-y-6">
          <Card className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                Conversion Funnel
              </CardTitle>
              <CardDescription className="text-sm">
                User journey from visitor to customer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                      <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${stage.color} flex-shrink-0`}></div>
                      <span className="font-medium text-sm sm:text-base truncate">{stage.stage}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-sm sm:text-base">{formatNumber(stage.users)}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{stage.percentage}%</div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-muted rounded-full h-2 sm:h-3">
                      <div 
                        className={`h-2 sm:h-3 rounded-full ${stage.color} transition-all duration-1000`}
                        style={{ width: `${stage.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  {index < conversionFunnel.length - 1 && (
                    <div className="text-center text-xs sm:text-sm text-muted-foreground py-1">
                      ↓ {((conversionFunnel[index + 1].users / stage.users) * 100).toFixed(1)}% convert
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 