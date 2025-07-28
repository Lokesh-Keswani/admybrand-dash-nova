import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Reports() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Reports</h2>
          <p className="text-muted-foreground">
            Generate and download detailed analytics reports
          </p>
        </div>
        <Button className="bg-gradient-primary">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Performance Report", description: "Campaign performance metrics", icon: FileText },
          { title: "Revenue Analysis", description: "Detailed revenue breakdown", icon: FileText },
          { title: "User Engagement", description: "User behavior analytics", icon: FileText },
          { title: "Monthly Summary", description: "Month-over-month comparison", icon: Calendar },
          { title: "Campaign ROI", description: "Return on investment analysis", icon: FileText },
          { title: "Traffic Sources", description: "Traffic source attribution", icon: FileText },
        ].map((report) => (
          <Card key={report.title} className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <report.icon className="h-5 w-5 text-primary" />
                {report.title}
              </CardTitle>
              <CardDescription>{report.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}