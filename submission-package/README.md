# Xandeum pNode Analytics Platform

**A comprehensive, real-time analytics dashboard for monitoring Xandeum storage provider nodes (pNodes)**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://xandeum-pnode-analytics.manus.space)
[![Built with Manus](https://img.shields.io/badge/Built%20with-Manus-blue)](https://manus.im)

---

## 🎯 Overview

The Xandeum pNode Analytics Platform is a professional-grade monitoring solution designed specifically for the Xandeum storage network. Built with modern web technologies and a focus on user experience, this platform provides comprehensive insights into pNode performance, network health, and real-time statistics.

**Live Platform:** [https://xandeum-pnode-analytics.manus.space](https://xandeum-pnode-analytics.manus.space)

---

## ✨ Key Features

### Core Functionality

The platform successfully retrieves and displays all pNodes appearing in the Xandeum gossip network using valid pRPC calls to the official Xandeum RPC endpoint. The implementation follows the official Xandeum documentation and provides real-time monitoring capabilities.

### Advanced Analytics

**Dashboard View**
- **Real-time Network Health Score**: Comprehensive health metrics calculated from availability, version distribution, and geographic diversity
- **Live Statistics**: Total nodes, online percentage, country distribution, and at-risk node identification
- **Version Distribution Chart**: Visual breakdown of pNode software versions across the network
- **Network Health Timeline**: Historical health trends with configurable time ranges (1h/6h/24h)
- **Geographic Distribution Map**: Interactive world map showing node locations with clickable markers
- **Insights Panel**: Automated network alerts and recommendations based on real-time analysis

**Rankings System**
- **Intelligent Scoring Algorithm**: Multi-factor ranking system evaluating nodes based on:
  - Software version currency (latest version bonus)
  - RPC port accessibility (open ports receive priority)
  - Performance metrics (CPU efficiency, RAM usage, uptime, network activity)
  - Geographic diversity (pioneer nodes in unique locations)
- **Badge System**: Achievement badges for top performers (Stable Champion, Latest Version, Geographic Pioneer)
- **Historical Tracking**: Database-backed ranking history with trend indicators (↑ rising, ↓ falling, → stable)
- **Leaderboard History**: View daily top 10 snapshots over time
- **Sortable Tables**: Sort by rank, score, version, location, or any metric
- **Filtering Options**: View top 10, top 50, or all nodes

**Performance Monitoring**
- **Automated Data Collection**: Background job queries all accessible nodes every 5 minutes
- **24-Hour Historical Data**: Rolling window of performance metrics with automatic cleanup
- **Trend Visualization**: Four interactive charts tracking CPU usage, RAM usage, uptime, and network activity
- **Node-Specific Analysis**: Select individual nodes to view detailed performance history
- **Time Range Filtering**: Analyze trends over 1h, 6h, or 24h periods

**RPC Accessibility Features**
- **Background Scanning**: Automated RPC port accessibility testing for all nodes
- **Direct Node Queries**: Fetch detailed statistics directly from accessible nodes
- **Smart Caching**: 5-minute cache duration to minimize redundant requests
- **Accessibility Indicators**: Visual badges showing RPC port status (🔓 open / 🔒 private)
- **Expandable Node Cards**: Click accessible nodes to view inline statistics without navigation

### User Experience Excellence

**Intuitive Interface**
- **Premium Dark Theme**: Professional glassmorphism design with neon accents optimized for crypto/blockchain aesthetics
- **Responsive Layout**: Fully responsive design works seamlessly on desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion animations provide polished transitions and interactions
- **Clear Navigation**: Consistent navigation across all pages with breadcrumb-style links
- **Search & Filters**: Real-time search across node addresses, locations, and identifiers

**Data Export**
- **Multiple Formats**: Export node data to CSV or JSON formats
- **Filtered Exports**: Export only RPC-accessible nodes or custom filtered subsets
- **Ranking Exports**: Download complete ranking tables with scores and badges

**Auto-Refresh System**
- **Configurable Intervals**: Choose refresh rates (30s, 1m, 2m, 5m)
- **Visual Countdown**: Real-time countdown timer showing seconds until next refresh
- **Pause/Resume Controls**: Toggle auto-refresh on demand
- **Persistent Settings**: User preferences saved to localStorage

**Connection Management**
- **Custom RPC Endpoints**: Configure custom Xandeum RPC endpoints
- **Stats Endpoint Support**: Optional custom stats endpoint for enhanced data retrieval
- **Connection Settings Dialog**: Easy-to-use configuration interface

---

## 🏗️ Technical Architecture

### Frontend Stack

The platform is built with cutting-edge web technologies optimized for performance and developer experience:

- **React 19**: Latest React version with concurrent features and improved performance
- **TypeScript**: Full type safety across the entire codebase
- **Tailwind CSS 4**: Modern utility-first CSS framework with custom design system
- **shadcn/ui**: High-quality, accessible component library
- **Framer Motion**: Smooth animations and transitions
- **Recharts**: Interactive, responsive data visualizations
- **Wouter**: Lightweight client-side routing
- **tRPC**: End-to-end typesafe APIs

### Backend Infrastructure

- **Node.js + Express**: RESTful API server
- **Drizzle ORM**: Type-safe database operations
- **PostgreSQL**: Relational database for historical data
- **tRPC**: Type-safe API layer with automatic client generation

### Data Flow

The platform implements a sophisticated data pipeline optimized for real-time monitoring:

1. **Initial Load**: Fetch complete pNode list via `get-pods` pRPC call
2. **Geographic Enrichment**: Automatic IP-to-location lookup for all nodes
3. **RPC Accessibility Scan**: Background job tests RPC port accessibility (every 30 minutes)
4. **Performance Collection**: Automated queries to accessible nodes (every 5 minutes)
5. **Historical Storage**: Performance snapshots stored in localStorage (24-hour rolling window)
6. **Database Persistence**: Ranking snapshots saved to PostgreSQL for long-term analysis

### Key Innovations

**Intelligent Caching Strategy**
- **Multi-Layer Cache**: Combines localStorage and in-memory caching for optimal performance
- **Smart Invalidation**: Time-based expiration (5 minutes) with manual refresh capability
- **Offline Resilience**: Cached data enables continued operation during network interruptions

**Scalable Architecture**
- **Sequential Processing**: Batch requests with delays prevent backend overload
- **Configurable Timeouts**: Adjustable timeout values for different network conditions
- **Error Handling**: Graceful degradation when nodes are unreachable

**Real-Time Updates**
- **Live Countdown Timers**: Visual feedback for auto-refresh cycles
- **Progress Indicators**: Real-time progress tracking for background scans
- **Optimistic Updates**: Immediate UI feedback while data loads

---

## 🚀 Deployment

### Live Platform

The platform is deployed and accessible at:

**https://xandeum-pnode-analytics.manus.space**

The deployment includes:
- **Automatic HTTPS**: SSL/TLS encryption for all connections
- **Global CDN**: Fast content delivery worldwide
- **Auto-Scaling**: Handles traffic spikes automatically
- **Zero Downtime**: Rolling deployments with health checks
- **Database Backups**: Automated daily backups of ranking history

### Local Development

To run the platform locally for development or testing:

#### Prerequisites

- Node.js 18+ and pnpm package manager
- PostgreSQL database (for ranking history features)

#### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/xandeum-pnode-analytics.git
cd xandeum-pnode-analytics
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
# Create .env file with database connection
DATABASE_URL="postgresql://user:password@localhost:5432/xandeum_analytics"
```

4. Run database migrations:
```bash
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

6. Open your browser to `http://localhost:3000`

The platform will automatically connect to the default Xandeum RPC endpoint (`http://192.190.136.36:6000/rpc`) and begin fetching pNode data.

---

## 📊 Feature Comparison

### Competitive Advantages

Compared to existing Solana validator dashboards (stakewiz.com, topvalidators.app, validators.app), the Xandeum pNode Analytics Platform offers several unique advantages:

| Feature | This Platform | Typical Validator Dashboards |
|---------|---------------|------------------------------|
| Real-time Health Score | ✅ Multi-factor calculation | ❌ Basic uptime only |
| Performance Trends | ✅ 24h historical charts | ❌ Current state only |
| Automated Data Collection | ✅ Background collection | ❌ Manual refresh required |
| RPC Accessibility Testing | ✅ Automatic scanning | ❌ Not available |
| Geographic Diversity | ✅ Interactive world map | ⚠️ Basic list view |
| Ranking System | ✅ Multi-factor with badges | ⚠️ Simple sorting |
| Historical Rankings | ✅ Database-backed history | ❌ No historical data |
| Performance Scoring | ✅ CPU/RAM/Uptime/Network | ❌ Not available |
| Export Functionality | ✅ CSV/JSON with filters | ⚠️ Basic export only |
| Mobile Responsive | ✅ Fully optimized | ⚠️ Desktop-focused |
| Dark Theme | ✅ Premium glassmorphism | ⚠️ Basic dark mode |

---

## 🎨 Design Philosophy

The platform's design is inspired by modern crypto/blockchain dashboards with a focus on:

- **Information Density**: Maximum insights without overwhelming the user
- **Visual Hierarchy**: Clear distinction between primary and secondary information
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Performance**: Optimized rendering with virtualization for large datasets
- **Consistency**: Unified design language across all views and components

---

## 📖 User Guide

### Getting Started

1. **Visit the Platform**: Navigate to the live URL in your web browser
2. **Explore the Dashboard**: View network health, statistics, and distribution charts
3. **Check Rankings**: Click "Rankings" to see top-performing pNodes
4. **Monitor Performance**: Click "Performance" to view historical trends
5. **Search Nodes**: Use the search bar to find specific nodes by IP or location
6. **Export Data**: Click export buttons to download data in CSV or JSON format

### Advanced Features

**Configuring Auto-Refresh**
- Click the pause/play button in the header to toggle auto-refresh
- Select your preferred interval from the dropdown (30s, 1m, 2m, 5m)
- Watch the countdown timer to see when the next refresh occurs

**Viewing Node Details**
- Click on any node card with a 🔓 icon to expand inline statistics
- View real-time CPU, RAM, uptime, and network metrics
- Click "Refresh Stats" to manually fetch the latest data

**Analyzing Performance Trends**
- Navigate to the Performance page
- Select a node from the dropdown (shows nodes with historical data)
- Choose a time range (1h, 6h, or 24h)
- Analyze trends across four interactive charts

**Understanding Rankings**
- Nodes are scored 0-100 based on multiple factors
- Hover over scores to see detailed breakdowns
- Look for badges indicating special achievements
- Use trend indicators (↑↓→) to identify improving/declining nodes

---

## 🔧 Configuration

### RPC Endpoint Configuration

The platform uses the official Xandeum public RPC endpoint by default, but supports custom endpoints:

1. Click the settings icon in the header
2. Enter your custom RPC endpoint URL
3. Optionally configure a custom stats endpoint
4. Click "Save Settings"

### Performance Tuning

For optimal performance with large node counts:

- **Auto-refresh interval**: Set to 2-5 minutes for production monitoring
- **RPC scan interval**: 30 minutes provides good balance of freshness and load
- **Performance collection**: 5 minutes captures trends without excessive queries

---

## 🛠️ Technology Stack Summary

**Frontend**
- React 19, TypeScript, Tailwind CSS 4
- shadcn/ui, Framer Motion, Recharts
- Wouter (routing), tRPC (API client)

**Backend**
- Node.js, Express, tRPC server
- Drizzle ORM, PostgreSQL
- RESTful proxy for pRPC calls

**Infrastructure**
- Manus Cloud Platform
- Automatic HTTPS with custom domains
- PostgreSQL managed database
- Global CDN distribution

---

## 📝 License

This project is submitted for the Xandeum pNode Analytics Bounty (Superteam).

---

## 🤝 Acknowledgments

- **Xandeum Labs**: For building innovative storage infrastructure for Solana
- **Superteam**: For organizing the bounty program
- **Manus Platform**: For providing the development and hosting infrastructure

---

## 📧 Contact

For questions, feedback, or support regarding this submission:

- **Platform**: [https://xandeum-pnode-analytics.manus.space](https://xandeum-pnode-analytics.manus.space)
- **Xandeum Discord**: [https://discord.gg/uqRSmmM5m](https://discord.gg/uqRSmmM5m)

---

**Built with ❤️ for the Xandeum and Solana communities**
