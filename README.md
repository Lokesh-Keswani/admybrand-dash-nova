# 🚀 ADmyBRAND Insights - AI-Powered Analytics Dashboard

A modern, full-stack analytics dashboard for digital marketing agencies built with React, TypeScript, Node.js, and real-time WebSocket updates.

## ✨ Features

### 📊 **Dashboard Analytics**
- **Real-time Metrics** - Live updates every 5 seconds via WebSocket
- **Interactive Charts** - Revenue trends, user growth, conversion analytics
- **KPI Cards** - Total revenue, active users, conversion rates, growth metrics
- **Campaign Performance** - Top performing campaigns with detailed metrics

### 🎯 **Campaign Management**
- **Complete Campaign Overview** - Budget, spending, impressions, clicks, conversions
- **Advanced Filtering** - Search, status filters, sorting options
- **Real-time Updates** - Live campaign performance updates
- **Performance Indicators** - ROAS color coding, budget utilization tracking

### 📈 **Real-time Features**
- **WebSocket Integration** - Live data streaming from backend
- **Auto-reconnection** - Automatic reconnection on connection loss
- **Live Status Indicators** - Connection status with visual feedback
- **Real-time Alerts** - Performance notifications and budget alerts

### 📤 **Export Capabilities**
- **CSV Export** - Campaign data, analytics data with filtering
- **PDF Reports** - Professional executive summaries and campaign reports
- **Multiple Formats** - Revenue, traffic, geographic data exports
- **Date Range Filtering** - Custom date ranges for reports

### 🎨 **Modern UI/UX**
- **Dark/Light Theme** - Automatic theme switching
- **Glassmorphism Design** - Modern gradient surfaces with backdrop blur
- **Responsive Layout** - Perfect on desktop, tablet, and mobile
- **Loading States** - Beautiful loading animations and error handling
- **Accessibility** - Full keyboard navigation and screen reader support

## 🏗️ **Tech Stack**

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Socket.IO Client** for real-time updates
- **React Router** for navigation
- **Lucide React** for icons

### **Backend**
- **Node.js** with Express
- **Socket.IO** for real-time communication
- **TypeScript/ES Modules** for modern development
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **PDF Generation** with Puppeteer
- **CSV Export** with json2csv

### **Data & APIs**
- **RESTful API** design with comprehensive endpoints
- **Mock Database** with realistic analytics data
- **Time-series Data** generation for charts
- **Filtering & Pagination** support
- **Error Handling** with proper HTTP status codes

## 📁 **Project Structure**

```
ADmyBRAND/
├── admybrand-dash-nova/          # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/           # UI Components
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── MetricCard.tsx   # KPI metric cards
│   │   │   └── ...
│   │   ├── pages/               # Page components
│   │   │   ├── Index.tsx        # Dashboard page
│   │   │   ├── Campaigns.tsx    # Campaign management
│   │   │   ├── Reports.tsx      # Reports page
│   │   │   └── Settings.tsx     # Settings page
│   │   ├── services/            # API & WebSocket services
│   │   │   ├── api.ts          # REST API client
│   │   │   └── websocket.ts    # WebSocket service
│   │   └── hooks/              # Custom React hooks
│   ├── package.json
│   └── ...
└── backend/                      # Backend (Node.js + Express)
    ├── routes/                   # API routes
    │   ├── analytics.js         # Analytics endpoints
    │   ├── campaigns.js         # Campaign endpoints
    │   ├── reports.js           # Reports endpoints
    │   └── export.js            # Export endpoints
    ├── services/                 # Business logic
    │   └── realTimeService.js   # WebSocket service
    ├── data/                     # Mock data
    │   └── mockDatabase.js      # Realistic sample data
    ├── server.js                # Main server file
    ├── package.json
    └── .env                      # Environment variables
```

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Modern web browser

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ADmyBRAND
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../admybrand-dash-nova
   npm install
   ```

### **Running the Application**

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on: `http://localhost:3001`

2. **Start the Frontend Development Server**
   ```bash
   cd admybrand-dash-nova
   npm run dev
   ```
   Frontend will run on: `http://localhost:8080`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:8080`

## 📊 **API Endpoints**

### **Analytics Endpoints**
- `GET /api/analytics/metrics` - Current key metrics
- `GET /api/analytics/charts/revenue` - Revenue chart data
- `GET /api/analytics/charts/users` - User growth data
- `GET /api/analytics/charts/conversions` - Conversion data
- `GET /api/analytics/traffic-sources` - Traffic source breakdown
- `GET /api/analytics/real-time` - Real-time metrics

### **Campaign Endpoints**
- `GET /api/campaigns` - All campaigns with filtering
- `GET /api/campaigns/:id` - Single campaign details
- `GET /api/campaigns/stats/overview` - Campaign overview stats
- `GET /api/campaigns/performance/top` - Top performing campaigns

### **Report Endpoints**
- `GET /api/reports/performance` - Performance reports
- `GET /api/reports/revenue` - Revenue reports
- `GET /api/reports/audience` - Audience analytics
- `GET /api/reports/conversion` - Conversion funnel reports

### **Export Endpoints**
- `GET /api/export/campaigns/csv` - Export campaigns to CSV
- `GET /api/export/analytics/csv` - Export analytics to CSV
- `POST /api/export/report/pdf` - Generate PDF reports

## 🔄 **Real-time Features**

### **WebSocket Events**
- `connection` - Client connection status
- `real-time-update` - Live metrics updates (every 5s)
- `campaigns-update` - Campaign performance updates (every 30s)
- `alerts-update` - Performance alerts (every 2min)

### **Subscription Types**
- `metrics` - Subscribe to live metrics
- `campaigns` - Subscribe to campaign updates
- `analytics` - Subscribe to analytics updates

## 🎯 **Key Features Implemented**

### ✅ **Completed Features**
- [x] Modern React dashboard with TypeScript
- [x] Real-time WebSocket updates
- [x] Comprehensive REST API
- [x] Campaign management with filtering
- [x] Export functionality (CSV/PDF)
- [x] Beautiful UI with glassmorphism design
- [x] Dark/light theme support
- [x] Responsive design
- [x] Error handling and loading states
- [x] Advanced filtering and search
- [x] Live connection status indicators
- [x] Professional PDF report generation
- [x] Mock database with realistic data
- [x] Security middleware and rate limiting

### 🚀 **Production Ready**
- Environment configuration
- Error handling and validation
- Security best practices
- Performance optimization
- Clean code architecture
- Comprehensive documentation

## 🛠️ **Development**

### **Available Scripts**

**Frontend (admybrand-dash-nova/)**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend (backend/)**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### **Environment Variables**

**Backend (.env)**
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=1000
```

## 📈 **Performance**

- **Real-time Updates**: 5-second intervals for metrics
- **WebSocket Reconnection**: Automatic with exponential backoff
- **API Response Time**: < 100ms for most endpoints
- **Bundle Size**: Optimized with Vite tree-shaking
- **Loading Performance**: Lazy loading and code splitting

## 🔒 **Security**

- **CORS Protection**: Configured for frontend origin
- **Rate Limiting**: 1000 requests per 15-minute window
- **Helmet Security**: Security headers and protection
- **Input Validation**: Sanitized API inputs
- **Error Handling**: No sensitive data in error responses

## 🎨 **Design System**

### **Color Palette**
- **Primary**: Blue (`#3b82f6`)
- **Secondary**: Purple (`#8b5cf6`)
- **Accent**: Green (`#10b981`)
- **Success**: Green (`#22c55e`)
- **Warning**: Orange (`#f59e0b`)
- **Error**: Red (`#ef4444`)

### **Typography**
- **Font Family**: Segoe UI, system fonts
- **Weights**: 400, 500, 600, 700
- **Responsive scaling**: clamp() functions

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License.

## 🙏 **Acknowledgments**

- **shadcn/ui** for the beautiful component library
- **Lucide** for the icon set
- **Tailwind CSS** for the utility-first CSS framework
- **Socket.IO** for real-time communication
- **Express.js** for the robust backend framework

---

**Built with ❤️ for modern digital marketing agencies**

*ADmyBRAND Insights - Transform your data into actionable insights* 