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
admybrand-dash-nova/
├── .git/
├── .env
├── .env.local
├── .env.production
├── .gitignore
├── README.md
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── netlify.toml
├── package-lock.json
├── package.json
├── postcss.config.js
├── start-servers-debug.bat
├── start-servers-with-mongo.bat
├── start-servers.bat
├── tailwind.config.ts
├── test-account-reactivation.js
├── test-connection.html
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
├── backend/
│   ├── .env
│   ├── .env.local
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   ├── render.yaml
│   ├── server.js
│   ├── test-mongo.js
│   ├── config/
│   │   └── database.js
│   ├── data/
│   │   └── mockDatabase.js
│   ├── models/
│   │   └── User.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── auth.js
│   │   ├── campaigns.js
│   │   ├── export.js
│   │   └── reports.js
│   └── services/
│       └── realTimeService.js
├── node_modules/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── components/
    │   ├── AppSidebar.tsx
    │   ├── Dashboard.tsx
    │   ├── MetricCard.tsx
    │   ├── Navbar.tsx
    │   ├── ThemeProvider.tsx
    │   ├── ThemeToggle.tsx
    │   ├── auth/
    │   │   ├── LoginForm.tsx
    │   │   ├── ProtectedRoute.tsx
    │   │   └── SignupForm.tsx
    │   ├── charts/
    │   │   ├── AnalyticsCharts.tsx
    │   │   ├── ConversionsChart.tsx
    │   │   ├── RevenueChart.tsx
    │   │   └── TrafficSourcesChart.tsx
    │   └── ui/
    │       ├── accordion.tsx
    │       ├── alert.tsx
    │       ├── alert-dialog.tsx
    │       ├── aspect-ratio.tsx
    │       ├── avatar.tsx
    │       ├── badge.tsx
    │       ├── breadcrumb.tsx
    │       ├── button.tsx
    │       ├── calendar.tsx
    │       ├── card.tsx
    │       ├── carousel.tsx
    │       ├── chart.tsx
    │       ├── checkbox.tsx
    │       ├── collapsible.tsx
    │       ├── command.tsx
    │       ├── context-menu.tsx
    │       ├── dialog.tsx
    │       ├── drawer.tsx
    │       ├── dropdown-menu.tsx
    │       ├── form.tsx
    │       ├── hover-card.tsx
    │       ├── input-otp.tsx
    │       ├── input.tsx
    │       ├── label.tsx
    │       ├── menubar.tsx
    │       ├── navigation-menu.tsx
    │       ├── pagination.tsx
    │       ├── popover.tsx
    │       ├── progress.tsx
    │       ├── radio-group.tsx
    │       ├── resizable.tsx
    │       ├── scroll-area.tsx
    │       ├── select.tsx
    │       ├── separator.tsx
    │       ├── sheet.tsx
    │       ├── sidebar.tsx
    │       ├── skeleton.tsx
    │       ├── slider.tsx
    │       ├── sonner.tsx
    │       ├── switch.tsx
    │       ├── table.tsx
    │       ├── tabs.tsx
    │       ├── textarea.tsx
    │       ├── toast.tsx
    │       ├── toaster.tsx
    │       ├── toggle.tsx
    │       ├── toggle-group.tsx
    │       └── tooltip.tsx
    ├── contexts/
    │   └── AuthContext.tsx
    ├── hooks/
    │   ├── use-mobile.tsx
    │   └── use-toast.ts
    ├── lib/
    │   └── utils.ts
    ├── pages/
    │   ├── Analytics.tsx
    │   ├── AuthPage.tsx
    │   ├── Campaigns.tsx
    │   ├── Index.tsx
    │   ├── NotFound.tsx
    │   ├── Reports.tsx
    │   └── Settings.tsx
    └── services/
        ├── api.ts
        └── websocket.ts
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
   Frontend will run on: `http://localhost:5174`

3. **Access the Application**
   Open your browser and navigate to `http://localhost:5174`

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
FRONTEND_URL=http://localhost:5174
JWT_EXPIRE=7d
JWT_SECRET=your_jwt_secret_key
MONGODB_URI="mongodb+srv://keswani399:270778eshnali@cluster0.fvmbrtz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
NODE_ENV=development
PORT=10000
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
