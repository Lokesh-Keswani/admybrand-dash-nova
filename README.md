# 🚀 AdMyBrand Dashboard

A modern, responsive marketing analytics dashboard built with React, TypeScript, and Tailwind CSS. Track campaigns, analyze performance, generate reports, and manage your marketing efforts with a beautiful glassmorphism UI.

![AdMyBrand Dashboard](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.11-38B2AC?style=for-the-badge&logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646CFF?style=for-the-badge&logo=vite)

## ✨ Features

### 📊 **Analytics Dashboard**
- **Real-time Metrics**: Live performance indicators with auto-refresh
- **Interactive Charts**: Beautiful visualizations using Recharts
- **Key Performance Indicators**: Revenue, conversions, engagement metrics
- **Responsive Design**: Optimized for all screen sizes

### 🎯 **Campaign Management**
- **Campaign Creation**: Easy-to-use campaign setup interface
- **Performance Tracking**: Monitor impressions, clicks, CTR, conversions
- **Status Management**: Active, paused, completed campaign states
- **Individual Exports**: Download CSV and PDF reports per campaign
- **Bulk Operations**: Export all campaigns with filtering options

### 📈 **Advanced Reporting**
- **Multiple Report Types**: Performance, Revenue, User Engagement, ROI
- **PDF Generation**: Professional PDF reports with browser print functionality
- **CSV Exports**: Data export for further analysis
- **Custom Date Ranges**: Flexible reporting periods
- **All Reports Export**: Comprehensive multi-report PDF generation

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Beautiful frosted glass effects
- **Dark/Light Theme**: Seamless theme switching
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Enhanced user experience
- **Accessibility**: WCAG compliant components

### 🔧 **Technical Features**
- **TypeScript**: Full type safety and better development experience
- **React Query**: Efficient data fetching and caching
- **WebSocket Support**: Real-time data updates
- **Local Storage**: Persistent user preferences and data
- **Error Handling**: Comprehensive error management

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Vite 5.4.1** - Lightning-fast build tool and dev server

### **Styling & UI**
- **Tailwind CSS 3.4.11** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customizable icons

### **Data & State Management**
- **React Query (@tanstack/react-query)** - Server state management
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### **Charts & Visualizations**
- **Recharts** - Composable charting library
- **React Day Picker** - Flexible date picker component

### **Real-time Features**
- **Socket.io Client** - Real-time bidirectional communication

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:

- **📱 Mobile S** (320px+)
- **📱 Mobile M** (375px+)
- **📱 Mobile L** (425px+)
- **📱 Tablet** (768px+)
- **💻 Laptop** (1024px+)
- **🖥️ Large Laptop** (1440px+)

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **bun**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/admybrand-dashboard.git
   cd admybrand-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
# or
yarn build
# or
bun run build
```

## 📁 Project Structure

```
admybrand-dash-nova/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── charts/         # Chart components
│   │   ├── auth/           # Authentication components
│   │   ├── Navbar.tsx      # Top navigation
│   │   ├── AppSidebar.tsx  # Sidebar navigation
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   └── ThemeToggle.tsx # Theme switcher
│   ├── pages/              # Page components
│   │   ├── Analytics.tsx   # Analytics dashboard
│   │   ├── Campaigns.tsx   # Campaign management
│   │   ├── Reports.tsx     # Report generation
│   │   ├── Settings.tsx    # User settings
│   │   └── AuthPage.tsx    # Authentication
│   ├── hooks/              # Custom React hooks
│   ├── contexts/           # React contexts
│   ├── services/           # API services
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎯 Key Features Explained

### **Campaign Management**
- Create and manage marketing campaigns
- Track real-time performance metrics
- Export individual campaign data (CSV/PDF)
- Bulk export functionality with filters
- Status management (Active, Paused, Completed)

### **Analytics Dashboard**
- Real-time performance indicators
- Interactive charts and graphs
- Key metrics overview
- Responsive design for all devices

### **Report Generation**
- Multiple report types available
- PDF generation using browser print functionality
- CSV export for data analysis
- Professional report formatting
- All reports export feature

### **Glassmorphism UI**
- Beautiful frosted glass effects
- Smooth hover animations
- Consistent design language
- Enhanced visual hierarchy

## 🔧 Configuration

### **Environment Variables**
Create a `.env` file in the root directory:

```env
VITE_API_URL=your_api_url_here
VITE_WS_URL=your_websocket_url_here
```

### **Tailwind Configuration**
The project uses a custom Tailwind configuration with:
- Glassmorphism utilities
- Custom color palette
- Responsive breakpoints
- Animation utilities

### **Theme Configuration**
Supports both light and dark themes with:
- Automatic system preference detection
- Manual theme switching
- Persistent theme selection

## 📊 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🎨 Customization

### **Adding New Components**
1. Create component in `src/components/`
2. Use Shadcn/ui components for consistency
3. Follow the established naming conventions
4. Add TypeScript types for props

### **Styling Guidelines**
- Use Tailwind CSS utilities
- Follow the glassmorphism design system
- Maintain responsive design principles
- Use the established color palette

### **Adding New Pages**
1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Update sidebar navigation if needed
4. Add proper TypeScript types

## 🐛 Troubleshooting

### **Common Issues**

**PDF Generation Fails**
- Ensure popups are allowed in your browser
- Check browser settings for print functionality
- Try refreshing the page and retrying

**Build Errors**
- Clear `node_modules` and reinstall dependencies
- Check TypeScript configuration
- Verify all imports are correct

**Styling Issues**
- Ensure Tailwind CSS is properly configured
- Check for conflicting CSS rules
- Verify responsive breakpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow TypeScript best practices
- Use conventional commit messages
- Maintain responsive design
- Add proper error handling
- Write clean, readable code

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **Tailwind CSS** for the utility-first CSS framework
- **Recharts** for the charting capabilities
- **Lucide** for the beautiful icons
- **Vite** for the fast build tool

## 📞 Support

If you have any questions or need support:

- 📧 Email: support@admybrand.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/admybrand-dashboard/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/admybrand-dashboard/wiki)

---

**Made with ❤️ by the AdMyBrand Team**
