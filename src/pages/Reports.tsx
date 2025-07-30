import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, FileDown, Calendar, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Reports() {
  const [downloadingReports, setDownloadingReports] = useState<Set<string>>(new Set());
  const [exportingAll, setExportingAll] = useState(false);
  const [exportingAllPDF, setExportingAllPDF] = useState(false);
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

  // Mock function to simulate report PDF download
  const handleDownloadReportPDF = async (reportTitle: string) => {
    // Add to downloading set
    setDownloadingReports(prev => new Set([...prev, `${reportTitle}_PDF`]));

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 1000));

      // Generate actual PDF using browser's print functionality
      await generateReportPDF(reportTitle);

      toast({
        title: "PDF Report Complete",
        description: `${reportTitle} PDF has been generated successfully.`,
      });
    } catch (error) {
      // Show error toast
      toast({
        title: "PDF Generation Failed",
        description: `Failed to generate ${reportTitle} PDF. Please try again.`,
        variant: "destructive",
      });
    } finally {
      // Remove from downloading set
      setDownloadingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(`${reportTitle}_PDF`);
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

  // Mock function to export all reports as PDF
  const handleExportAllPDF = async () => {
    setExportingAllPDF(true);

    try {
      // Simulate longer process for multiple reports
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Generate actual PDF using browser's print functionality
      await generateAllReportsPDF();

      toast({
        title: "PDF Reports Complete",
        description: "All reports have been generated as PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate reports PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setExportingAllPDF(false);
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

  // Generate actual PDF report for individual report
  const generateReportPDF = async (reportTitle: string): Promise<void> => {
    return new Promise((resolve) => {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      const reportData = generateMockReportData(reportTitle);
      const today = new Date().toLocaleDateString();

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .report-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .report-date {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .content {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              border-left: 4px solid #2563eb;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            .data-table th, .data-table td {
              border: 1px solid #e5e7eb;
              padding: 8px 12px;
              text-align: left;
            }
            .data-table th {
              background: #f3f4f6;
              font-weight: bold;
            }
            .data-table tr:nth-child(even) {
              background: #f9fafb;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { margin: 20px; }
              .header { border-bottom-color: #000; }
              .company-name { color: #000; }
              .content { border-left-color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">AdMyBrand</div>
            <div class="report-title">${reportTitle}</div>
            <div class="report-date">Generated on ${today}</div>
          </div>
          
          <div class="content">
            <h2>Report Summary</h2>
            <p>This report contains detailed analytics data for ${reportTitle.toLowerCase()}.</p>
            
            <h3>Data Overview</h3>
            <table class="data-table">
              <thead>
                <tr>
                  ${reportData.split('\n')[0].split(',').map(header => `<th>${header}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${reportData.split('\n').slice(1).map(row => 
                  `<tr>${row.split(',').map(cell => `<td>${cell}</td>`).join('')}</tr>`
                ).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="footer">
            <p>Generated by AdMyBrand Dashboard | ${today}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
        resolve();
      };
    });
  };

  // Generate actual PDF report for all reports
  const generateAllReportsPDF = async (): Promise<void> => {
    return new Promise((resolve) => {
      // Create a new window for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Failed to open print window');
      }

      const today = new Date().toLocaleDateString();
      const reportsContent = reports.map(report => {
        const reportData = generateMockReportData(report.title);
        return `
          <div style="page-break-before: always; margin-top: 40px;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
              ${report.title}
            </h2>
            <p style="color: #666; margin-bottom: 20px;">${report.description}</p>
            
            <table class="data-table">
              <thead>
                <tr>
                  ${reportData.split('\n')[0].split(',').map(header => `<th>${header}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${reportData.split('\n').slice(1).map(row => 
                  `<tr>${row.split(',').map(cell => `<td>${cell}</td>`).join('')}</tr>`
                ).join('')}
              </tbody>
            </table>
          </div>
        `;
      }).join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>All Reports - AdMyBrand</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #2563eb;
              margin-bottom: 10px;
            }
            .report-title {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .report-date {
              font-size: 14px;
              color: #666;
              margin-bottom: 10px;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 12px;
            }
            .data-table th, .data-table td {
              border: 1px solid #e5e7eb;
              padding: 6px 8px;
              text-align: left;
            }
            .data-table th {
              background: #f3f4f6;
              font-weight: bold;
            }
            .data-table tr:nth-child(even) {
              background: #f9fafb;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #666;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { margin: 20px; }
              .header { border-bottom-color: #000; }
              .company-name { color: #000; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">AdMyBrand</div>
            <div class="report-title">All Reports</div>
            <div class="report-date">Generated on ${today}</div>
          </div>
          
          ${reportsContent}
          
          <div class="footer">
            <p>Generated by AdMyBrand Dashboard | ${today}</p>
          </div>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
        resolve();
      };
    });
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
        <div className="flex gap-2">
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
                <FileText className="mr-2 h-4 w-4" />
                Export All
              </>
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={handleExportAllPDF}
            disabled={exportingAllPDF}
          >
            {exportingAllPDF ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Generating...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-4 w-4" />
                Export All PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => {
          const isDownloading = downloadingReports.has(report.title);
          const isDownloadingPDF = downloadingReports.has(`${report.title}_PDF`);
          
          return (
            <Card key={report.title} className="bg-gradient-surface border-glass-border shadow-glass backdrop-blur-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <report.icon className="h-5 w-5 text-primary" />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
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
                      <FileText className="mr-2 h-4 w-4" />
                      Download CSV
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownloadReportPDF(report.title)}
                  disabled={isDownloadingPDF}
                >
                  {isDownloadingPDF ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Download PDF
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