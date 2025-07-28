import { MetricCard } from "@/components/MetricCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Users, Target, TrendingUp, BarChart3, PieChart } from "lucide-react"

const metrics = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+15.3%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Conversions",
    value: "12.5%",
    change: "+2.1%",
    changeType: "positive" as const,
    icon: Target,
  },
  {
    title: "Growth Rate",
    value: "8.2%",
    change: "-0.5%",
    changeType: "negative" as const,
    icon: TrendingUp,
  },
]

const campaigns = [
  {
    campaign: "Summer Sale 2024",
    impressions: "1,234,567",
    clicks: "12,345",
    ctr: "1.0%",
    conversions: "123",
  },
  {
    campaign: "Brand Awareness Q3",
    impressions: "987,654",
    clicks: "9,876",
    ctr: "1.0%",
    conversions: "98",
  },
  {
    campaign: "Product Launch",
    impressions: "654,321",
    clicks: "8,765",
    ctr: "1.3%",
    conversions: "87",
  },
  {
    campaign: "Holiday Campaign",
    impressions: "543,210",
    clicks: "6,543",
    ctr: "1.2%",
    conversions: "65",
  },
]

export function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your campaign performance.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

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
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.campaign} className="border-glass-border">
                  <TableCell className="font-medium text-foreground">
                    {campaign.campaign}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{campaign.impressions}</TableCell>
                  <TableCell className="text-muted-foreground">{campaign.clicks}</TableCell>
                  <TableCell className="text-muted-foreground">{campaign.ctr}</TableCell>
                  <TableCell className="font-medium text-foreground">{campaign.conversions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}