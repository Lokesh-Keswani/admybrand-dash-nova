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

## 🚀 Deployment

### **Vercel Deployment** (Recommended)

Vercel is the recommended deployment platform for this React application due to its excellent performance and developer experience.

#### **Option 1: Deploy via Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   cd admybrand-dash-nova
   vercel
   ```

4. **Follow the prompts**
   - Set up and deploy? `Y`
   - Which scope? Select your account
   - Link to existing project? `N`
   - Project name: `admybrand-dashboard` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings? `N`

5. **Your app will be deployed!**
   - Production URL: `https://your-project.vercel.app`
   - Preview deployments for each commit

#### **Option 2: Deploy via GitHub Integration**

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository

3. **Configure deployment**
   - Framework Preset: `Vite`
   - Root Directory: `./` (leave empty)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Environment Variables** (if needed)
   ```env
   VITE_API_URL=your_api_url_here
   VITE_WS_URL=your_websocket_url_here
   ```

5. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

#### **Vercel Configuration File**

Create a `vercel.json` file in your project root for custom configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **Netlify Deployment**

Netlify is another excellent option for deploying React applications with great performance and features.

#### **Option 1: Deploy via Netlify CLI**

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Build your project**
   ```bash
   npm run build
   ```

4. **Deploy to Netlify**
   ```bash
   netlify deploy --prod --dir=dist
   ```

5. **Follow the prompts**
   - Create & configure a new site? `Y`
   - Team: Select your team
   - Site name: `admybrand-dashboard` (or your preferred name)

#### **Option 2: Deploy via Netlify UI**

1. **Build your project**
   ```bash
   npm run build
   ```

2. **Drag & Drop Deployment**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login
   - Drag your `dist` folder to the deploy area
   - Your site will be live instantly!

3. **Git Integration**
   - Connect your GitHub repository
   - Automatic deployments on every push
   - Preview deployments for pull requests

#### **Netlify Configuration File**

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### **Environment Variables Setup**

For both platforms, set up environment variables in their respective dashboards:

#### **Vercel Environment Variables**
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add your variables:
   ```
   VITE_API_URL=https://your-api.com
   VITE_WS_URL=wss://your-websocket.com
   ```

#### **Netlify Environment Variables**
1. Go to your site dashboard
2. Navigate to Site settings → Environment variables
3. Add your variables:
   ```
   VITE_API_URL=https://your-api.com
   VITE_WS_URL=wss://your-websocket.com
   ```

### **Custom Domain Setup**

#### **Vercel Custom Domain**
1. Go to your project dashboard
2. Navigate to Settings → Domains
3. Add your domain
4. Update DNS records as instructed
5. Wait for propagation (up to 48 hours)

#### **Netlify Custom Domain**
1. Go to your site dashboard
2. Navigate to Domain management
3. Add custom domain
4. Update DNS records as instructed
5. Wait for propagation (up to 48 hours)

### **Performance Optimization**

#### **Vercel Optimizations**
- Automatic image optimization
- Edge caching
- CDN distribution
- Automatic HTTPS
- Performance monitoring

#### **Netlify Optimizations**
- Automatic asset optimization
- Global CDN
- Automatic HTTPS
- Form handling
- Serverless functions support

### **Deployment Checklist**

Before deploying, ensure:

- [ ] All environment variables are set
- [ ] Build command works locally (`npm run build`)
- [ ] No console errors in development
- [ ] All dependencies are in `package.json`
- [ ] `.gitignore` excludes `node_modules` and `dist`
- [ ] Custom domain DNS is configured (if applicable)

### **Post-Deployment**

After successful deployment:

1. **Test your application**
   - Check all pages load correctly
   - Verify API connections work
   - Test responsive design
   - Validate PDF generation

2. **Set up monitoring**
   - Enable error tracking
   - Monitor performance
   - Set up uptime monitoring

3. **Configure analytics**
   - Add Google Analytics
   - Set up conversion tracking
   - Monitor user behavior

### **Troubleshooting Deployment**

#### **Common Vercel Issues**
- **Build fails**: Check build logs for missing dependencies
- **404 errors**: Ensure `vercel.json` has proper redirects
- **Environment variables**: Verify they're set in Vercel dashboard

#### **Common Netlify Issues**
- **Build fails**: Check `netlify.toml` configuration
- **404 errors**: Ensure `netlify.toml` has proper redirects
- **Environment variables**: Verify they're set in Netlify dashboard

#### **General Issues**
- **CORS errors**: Configure API CORS settings
- **WebSocket issues**: Ensure WSS (secure) URLs in production
- **Performance**: Optimize images and bundle size

---

**🎉 Your AdMyBrand Dashboard is now live!**
