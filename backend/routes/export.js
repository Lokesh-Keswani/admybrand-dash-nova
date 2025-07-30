import express from 'express';
import puppeteer from 'puppeteer';
import { 
  campaigns, 
  liveMetrics,
  revenueData,
  trafficSources,
  geographicData 
} from '../data/mockDatabase.js';

const router = express.Router();

// Simple CSV converter function
function convertToCSV(data, headers) {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header.toLowerCase()] || row[header] || '';
      return `"${value}"`;
    }).join(',')
  ).join('\n');
  
  return `${csvHeaders}\n${csvRows}`;
}

// GET /api/export/campaigns/csv - Export campaigns to CSV
router.get('/campaigns/csv', (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let filteredCampaigns = campaigns;
    
    // Apply filters
    if (status && status !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status);
    }
    
    if (startDate && endDate) {
      filteredCampaigns = filteredCampaigns.filter(campaign => {
        const campaignDate = new Date(campaign.createdAt);
        return campaignDate >= new Date(startDate) && campaignDate <= new Date(endDate);
      });
    }

    // Define CSV headers
    const headers = [
      'name', 'status', 'budget', 'spent', 'impressions', 
      'clicks', 'conversions', 'ctr', 'conversionRate', 
      'costPerClick', 'roas', 'startDate', 'endDate'
    ];

    const csv = convertToCSV(filteredCampaigns, headers);
    const filename = `campaigns_export_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/export/analytics/csv - Export analytics data to CSV
router.get('/analytics/csv', (req, res) => {
  try {
    const { type = 'revenue', period = '30d' } = req.query;
    
    let data = [];
    let headers = [];
    
    switch (type) {
      case 'revenue':
        data = revenueData;
        headers = ['date', 'value', 'timestamp'];
        break;
      case 'traffic':
        data = trafficSources;
        headers = ['source', 'sessions', 'percentage'];
        break;
      case 'geography':
        data = geographicData;
        headers = ['country', 'users', 'revenue'];
        break;
      default:
        return res.status(400).json({ success: false, error: 'Invalid export type' });
    }

    const csv = convertToCSV(data, headers);
    const filename = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csv);

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/export/report/pdf - Generate PDF report
router.post('/report/pdf', async (req, res) => {
  let browser;
  
  try {
    const { 
      reportType = 'summary', 
      startDate, 
      endDate, 
      includeCharts = true 
    } = req.body;

    // Generate HTML content for the report
    const htmlContent = generateReportHTML(reportType, { startDate, endDate, includeCharts });

    // Launch Puppeteer
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content and wait for any images/fonts to load
    await page.setContent(htmlContent, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });

    const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(pdf);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate PDF report',
      details: error.message 
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

// Helper function to generate HTML content for PDF reports
function generateReportHTML(reportType, options = {}) {
  const { startDate, endDate, includeCharts } = options;
  const currentDate = new Date().toLocaleDateString();
  
  const styles = `
    <style>
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        margin: 0; 
        padding: 20px; 
        background: #f8fafc;
        color: #1a202c;
      }
      .header { 
        text-align: center; 
        margin-bottom: 30px; 
        border-bottom: 2px solid #4a5568;
        padding-bottom: 20px;
      }
      .header h1 { 
        color: #2d3748; 
        margin: 0;
        font-size: 28px;
        font-weight: 700;
      }
      .header p { 
        color: #718096; 
        margin: 5px 0 0 0;
        font-size: 14px;
      }
      .metric-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin: 30px 0;
      }
      .metric-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        border-left: 4px solid #4299e1;
      }
      .metric-title {
        font-size: 14px;
        color: #718096;
        margin-bottom: 8px;
        font-weight: 500;
      }
      .metric-value {
        font-size: 24px;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 4px;
      }
      .metric-change {
        font-size: 12px;
        color: #38a169;
        font-weight: 500;
      }
      .section {
        margin: 30px 0;
        background: white;
        padding: 25px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 15px;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 8px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
      }
      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      th {
        background-color: #f7fafc;
        font-weight: 600;
        color: #4a5568;
        font-size: 14px;
      }
      td {
        font-size: 13px;
        color: #2d3748;
      }
      .footer {
        margin-top: 40px;
        text-align: center;
        color: #718096;
        font-size: 12px;
        border-top: 1px solid #e2e8f0;
        padding-top: 20px;
      }
      .highlight {
        background-color: #bee3f8;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
      }
    </style>
  `;

  let content = '';
  
  if (reportType === 'summary') {
    content = `
      <div class="header">
        <h1>ADmyBRAND Insights - Executive Summary</h1>
        <p>Generated on ${currentDate}</p>
        ${startDate && endDate ? `<p>Period: ${startDate} to ${endDate}</p>` : ''}
      </div>

      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-title">Total Revenue</div>
          <div class="metric-value">$${liveMetrics.totalRevenue.toLocaleString()}</div>
          <div class="metric-change">+20.1% from last period</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Active Users</div>
          <div class="metric-value">${liveMetrics.activeUsers.toLocaleString()}</div>
          <div class="metric-change">+15.3% from last period</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Conversion Rate</div>
          <div class="metric-value">${liveMetrics.conversionRate.toFixed(1)}%</div>
          <div class="metric-change">+2.1% from last period</div>
        </div>
        <div class="metric-card">
          <div class="metric-title">Growth Rate</div>
          <div class="metric-value">${liveMetrics.growthRate.toFixed(1)}%</div>
          <div class="metric-change">+0.5% from last period</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Key Highlights</div>
        <div class="highlight">
          <ul>
            <li>Revenue increased by 20.1% compared to previous period</li>
            <li>User acquisition grew by 15.3% with improved quality</li>
            <li>Conversion optimization resulted in 12.7% increase</li>
            <li>Mobile traffic now represents 36.5% of total sessions</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Top Performing Campaigns</div>
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Conversions</th>
              <th>ROAS</th>
            </tr>
          </thead>
          <tbody>
            ${campaigns.slice(0, 5).map(campaign => `
              <tr>
                <td>${campaign.name}</td>
                <td>$${campaign.budget.toLocaleString()}</td>
                <td>$${campaign.spent.toLocaleString()}</td>
                <td>${campaign.conversions}</td>
                <td>${campaign.roas}x</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <div class="section-title">Traffic Sources</div>
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th>Sessions</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            ${trafficSources.map(source => `
              <tr>
                <td>${source.source}</td>
                <td>${source.sessions.toLocaleString()}</td>
                <td>${source.percentage}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (reportType === 'campaigns') {
    content = `
      <div class="header">
        <h1>ADmyBRAND Insights - Campaign Performance Report</h1>
        <p>Generated on ${currentDate}</p>
        ${startDate && endDate ? `<p>Period: ${startDate} to ${endDate}</p>` : ''}
      </div>

      <div class="section">
        <div class="section-title">All Campaigns Performance</div>
        <table>
          <thead>
            <tr>
              <th>Campaign</th>
              <th>Status</th>
              <th>Budget</th>
              <th>Spent</th>
              <th>Impressions</th>
              <th>Clicks</th>
              <th>Conversions</th>
              <th>CTR</th>
              <th>ROAS</th>
            </tr>
          </thead>
          <tbody>
            ${campaigns.map(campaign => `
              <tr>
                <td>${campaign.name}</td>
                <td>${campaign.status}</td>
                <td>$${campaign.budget.toLocaleString()}</td>
                <td>$${campaign.spent.toLocaleString()}</td>
                <td>${campaign.impressions.toLocaleString()}</td>
                <td>${campaign.clicks.toLocaleString()}</td>
                <td>${campaign.conversions}</td>
                <td>${campaign.ctr}%</td>
                <td>${campaign.roas}x</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>ADmyBRAND Analytics Report</title>
      ${styles}
    </head>
    <body>
      ${content}
      <div class="footer">
        <p>© 2024 ADmyBRAND Insights. This report is confidential and proprietary.</p>
        <p>Generated by ADmyBRAND Analytics Platform</p>
      </div>
    </body>
    </html>
  `;
}

// GET /api/export/formats - Get available export formats
router.get('/formats', (req, res) => {
  try {
    const formats = {
      csv: {
        name: 'CSV (Comma Separated Values)',
        description: 'Spreadsheet compatible format',
        mimeType: 'text/csv',
        extension: '.csv',
        supports: ['campaigns', 'analytics', 'revenue', 'traffic', 'geography']
      }
    };

    res.json({
      success: true,
      data: formats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 