# Xandeum pNode Analytics

A production-ready web-based analytics dashboard for discovering and monitoring Xandeum pNodes via gossip protocol. This dashboard provides real-time insights into the Xandeum network, displaying active nodes, their versions, and status.

## 🚀 Features

- **Live Node Discovery**: Automatically discovers pNodes appearing in gossip via the Xandeum RPC.
- **Real-time Analytics**: Tracks total nodes, unique software versions, and recently seen nodes.
- **Version Distribution**: Visualizes the distribution of pNode software versions across the network.
- **Interactive Table**: Sortable table displaying node identity, IP address, version, and last seen status.
- **Auto-Refresh**: Data automatically refreshes every 60 seconds to ensure up-to-date information.
- **Swiss Style Design**: A clean, objective, and high-contrast interface focused on data clarity.

## 🛠 Tech Stack

- **Frontend**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 (Swiss Style Design System)
- **Charts**: Recharts
- **Data Fetching**: Native Fetch API
- **Icons**: Lucide React

## 📦 Project Structure

```
xandeum-pnode-analytics/
├─ src/
│  ├─ components/
│  │  ├─ PNodeTable.tsx       # Sortable table for node data
│  │  ├─ StatsCards.tsx       # Key metrics display
│  │  ├─ VersionChart.tsx     # Bar chart for version distribution
│  │  └─ ui/                  # Shared UI components
│  ├─ pages/
│  │  └─ Dashboard.tsx        # Main dashboard page
│  ├─ services/
│  │  └─ prpc.ts              # Xandeum pRPC integration service
│  ├─ App.tsx                 # Main application component
│  ├─ main.tsx                # Entry point
│  └─ index.css               # Global styles & Tailwind configuration
├─ public/
├─ README.md
├─ package.json
└─ vite.config.ts
```

## 🔌 RPC Integration

This project connects to the Xandeum pNode RPC endpoint:
`https://rpc.xandeum.network`

It uses the `getPNodeGossip` JSON-RPC method to retrieve the list of active pNodes.

## 🏃‍♂️ Local Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd xandeum-pnode-analytics
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Start the development server:**
    ```bash
    npm run dev
    # or
    pnpm dev
    ```

4.  **Open your browser:**
    Navigate to `http://localhost:3000` to view the dashboard.

## 🚀 Deployment

This project is optimized for deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will automatically detect the Vite settings.
4.  Click **Deploy**.

## 🎨 Design Philosophy

The dashboard follows the **Swiss Style (International Typographic Style)** design philosophy:
- **Objective Clarity**: Prioritizing data readability above all else.
- **Asymmetric Balance**: Using a strong grid system with dynamic layouts.
- **Typography as Image**: Bold, large typography for hierarchy.
- **High Contrast**: Stark black and white palette with functional color accents.

---

Built for the Xandeum Community.
