import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Reports() {
  const [downloadingReports, setDownloadingReports] = useState<Set<string>>(new Set());
  const [exportingAll, setExportingAll] = useState(false);
  const { toast } = useToast();

  // Mock function to simulate report download
  const handleDownloadReport = async (reportTitle: string) => {
    // Add to downloading set
    setDownloadingReports(prev => new Set([...prev, reportTitle]));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

      // Create a mock blob for download
      const mockData = generateMockReportData(reportTitle);
      const blob = new Blob([mockData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportTitle.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success toast
      toast({
        title: "Download Complete",
        description: `${reportTitle} has been downloaded successfully.`,
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "Download Failed",
        description: `Failed to download ${reportTitle}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      // Remove from downloading set
      setDownloadingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportTitle);
        return newSet;
      });
    }
  };

  // Mock function to export all reports
  const handleExportAll = async () => {
    setExportingAll(true);

    try {
      // Simulate longer process for multiple reports
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Create mock ZIP-like data
      const allReportsData = reports.map(report => 
        `=== ${report.title} ===\n${generateMockReportData(report.title)}\n\n`
      ).join('');

      const blob = new Blob([allReportsData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `all_reports_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "All reports have been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportingAll(false);
    }
  };

  // Generate mock CSV data for reports
  const generateMockReportData = (reportTitle: string): string => {
    const today = new Date();
    const dates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    switch (reportTitle) {
      case 'Performance Report':
        return [
          'Date,Campaign,Impressions,Clicks,CTR,Conversions,Cost',
          ...dates.map(date => 
            `${date},Summer Sale,${Math.floor(Math.random() * 5000 + 2000)},${Math.floor(Math.random() * 200 + 50)},${(Math.random() * 3 + 1).toFixed(2)}%,${Math.floor(Math.random() * 20 + 5)},${(Math.random() * 200 + 100).toFixed(2)}`
          )
        ].join('\n');
      
      case 'Revenue Analysis':
        return [
          'Date,Revenue,Orders,AOV,Refunds',
          ...dates.map(date => 
            `${date},${(Math.random() * 5000 + 2000).toFixed(2)},${Math.floor(Math.random() * 50 + 20)},${(Math.random() * 200 + 80).toFixed(2)},${(Math.random() * 100).toFixed(2)}`
          )
        ].join('\n');
      
      case 'User Engagement':
        return [
          'Date,Page Views,Unique Visitors,Bounce Rate,Session Duration',
          ...dates.map(date => 
            `${date},${Math.floor(Math.random() * 2000 + 800)},${Math.floor(Math.random() * 500 + 200)},${(Math.random() * 30 + 25).toFixed(1)}%,${(Math.random() * 300 + 120).toFixed(0)}s`
          )
        ].join('\n');
      
      default:
        return [
          'Date,Metric,Value',
          ...dates.map(date => 
            `${date},${reportTitle},${(Math.random() * 1000).toFixed(2)}`
          )
        ].join('\n');
    }
  };

  const reports = [
    { title: "Performance Report", description: "Campaign performance metrics", icon: FileText },
    { title: "Revenue Analysis", description: "Detailed revenue breakdown", icon: FileText },
    { title: "User Engagement", description: "User behavior analytics", icon: FileText },
    { title: "Monthly Summary", description: "Month-over-month comparison", icon: Calendar },
    { title: "Campaign ROI", description: "Return on investment analysis", icon: FileText },
    { title: "Traffic Sources", description: "Traffic source attribution", icon: FileText },
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Reports</h2>
          <p className="text-muted-foreground">
            Generate and download detailed analytics reports
          </p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={handleExportAll}
          disabled={exportingAll}
        >
          {exportingAll ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const isDownloading = downloadingReports.has(report.title);
          
          return (
            <Card key={report.title} className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <report.icon className="h-5 w-5 text-primary" />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownloadReport(report.title)}
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  )
}