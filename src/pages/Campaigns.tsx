import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Play, Pause, Edit, Plus } from "lucide-react"

const campaigns = [
  { name: "Summer Sale 2024", status: "Active", budget: "$5,000", performance: "High", impressions: "1.2M" },
  { name: "Brand Awareness Q3", status: "Active", budget: "$3,500", performance: "Medium", impressions: "987K" },
  { name: "Product Launch", status: "Paused", budget: "$8,000", performance: "High", impressions: "654K" },
  { name: "Holiday Campaign", status: "Draft", budget: "$12,000", performance: "-", impressions: "-" },
]

export default function Campaigns() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Campaigns</h2>
          <p className="text-muted-foreground">
            Manage and monitor your advertising campaigns
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.name} className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription>Budget: {campaign.budget}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      campaign.status === "Active" ? "default" : 
                      campaign.status === "Paused" ? "secondary" : 
                      "outline"
                    }
                  >
                    {campaign.status}
                  </Badge>
                  <div className="flex gap-1">
                    {campaign.status === "Active" ? (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Impressions</p>
                  <p className="font-medium">{campaign.impressions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Performance</p>
                  <p className="font-medium">{campaign.performance}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium">{campaign.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Budget</p>
                  <p className="font-medium">{campaign.budget}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}