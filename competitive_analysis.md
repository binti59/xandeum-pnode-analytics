# Competitive Analysis - pGlobe vs Xandeum pNode Analytics

## Date: December 24, 2024

## Competitor 1: pGlobe (https://pglobe.vercel.app/)

### Key Features Identified:

**Network Statistics:**
- Total Nodes: 284
- Online: 182
- Syncing: 32
- Offline: 70

**Performance Metrics (Aggregated):**
- Avg Uptime: 5d 8h
- Avg CPU: 1.3%
- Avg RAM: 8.0%
- Avg Latency: 858ms

**Storage & Memory (CRITICAL - They have this!):**
- Total Storage: 127.45 TB
- Total RAM: 628.33 GB
- Used RAM: 104.18 GB
- Avg RAM Usage: 8.0%

**Network Activity:**
- Active Streams: 218
- Packets Received: 728,991,705
- Packets Sent: 817,198,163
- Avg Packet Rate: 66.24/s
- Total Credits: 7,465,847

**Visualization:**
- 3D Globe visualization (interactive map)
- Search by pubkey, address, or location
- Navigation: Overview, Nodes, Analytics, Regions, Scan, Help
- Network: DEVNET

### Competitive Advantages pGlobe Has:

1. **Storage Statistics** - Shows total storage (127.45 TB) - WE DON'T HAVE THIS
2. **3D Globe Visualization** - Interactive 3D globe (we have 2D map)
3. **Credits System** - Tracks total credits (7,465,847)
4. **Packet Rate Metrics** - Shows avg packet rate (66.24/s)
5. **Latency Metrics** - Shows avg latency (858ms) - WE DON'T HAVE THIS
6. **Syncing Status** - Separate category for syncing nodes (32)

### Our Advantages Over pGlobe:

1. **Intelligent Ranking System** - Multi-factor scoring (they don't have rankings)
2. **Performance Alerts** - Real-time alerts for CPU/RAM/uptime issues
3. **Historical Trends** - 24-hour performance tracking with charts
4. **Automated Background Collection** - Every 5 minutes (they appear to be manual refresh)
5. **Achievement Badges** - Latest Version, Geographic Pioneer, etc.
6. **Health Score Algorithm** - Composite 0-100 score (they show raw metrics only)
7. **RPC Accessibility Scanning** - Identifies which nodes have open RPC ports
8. **Expandable Node Cards** - Inline stats without navigation
9. **Performance Comparison** - Rankings page with sortable columns
10. **Export Functionality** - CSV/JSON with filters

### Critical Gaps to Address:

1. **STORAGE STATISTICS** - Need to implement if available via RPC
2. **LATENCY METRICS** - Should add if available
3. **CREDITS TRACKING** - Should add if available
4. **SYNCING STATUS** - Should differentiate syncing vs online

## Competitor 2: Xandeum Explorer (https://explorerxandeum.vercel.app/)

### Key Features Identified:

**Navigation:**
- Dashboard, Analytics, Leaderboard, Map, Directory, Watchlist, Compare
- AI chatbot integration ("Ask AI" button)
- XandBot integration

**Status Distribution:**
- Total Nodes: 252
- Public RPC: 0 (0.0%)
- Private Nodes: 252 (100.0%)
- Online: 195 (77.4%)
- Degraded: 57 (22.6%)
- Not Seen Recently: 0 (0.0%)

**Version Distribution:**
- v0.8.0: 199 (79.0%) - Latest
- v0.7.3: 28 (11.1%)
- v0.8.0-trynet variants: Multiple versions
- v0.7.1: 2 (0.8%)
- v1.0.0: 1 (0.4%)
- **Alert: 251 nodes outdated, 99.6% should upgrade to v1.0.0**

**Geographic Insights:**
- 26 Locations
- 13 Countries
- Top Countries: FR (68), US (26), DE, UK

**Unique Features:**
- **Watchlist** - Save favorite nodes for monitoring
- **Compare** - Side-by-side node comparison
- **Directory** - Organized node listing
- **AI Chatbot** - Ask questions about network
- **Status Categories** - Degraded status separate from offline
- **Global Node Distribution Map** - Interactive world map with zoom controls

### Competitive Advantages explorerxandeum Has:

1. **Watchlist Feature** - Save/monitor favorite nodes - WE DON'T HAVE THIS
2. **Compare Feature** - Side-by-side comparison - WE DON'T HAVE THIS
3. **AI Chatbot** - Ask questions about network - WE DON'T HAVE THIS
4. **Degraded Status** - Separate category for degraded nodes
5. **Version Upgrade Alerts** - Shows % that should upgrade
6. **Top Countries Bar Chart** - Visual country distribution

### Our Advantages Over explorerxandeum:

1. **Performance Metrics** - CPU, RAM, uptime tracking (they don't show this)
2. **Performance Alerts** - Real-time monitoring
3. **Historical Trends** - 24-hour performance charts
4. **Intelligent Ranking System** - Multi-factor scoring
5. **RPC Accessibility Scanning** - Identifies open RPC ports
6. **Achievement Badges** - Gamification elements
7. **Automated Background Collection** - Every 5 minutes
8. **Expandable Node Cards** - Inline stats display
9. **Export Functionality** - CSV/JSON with filters
10. **Health Score Algorithm** - Composite 0-100 score

### Combined Critical Gaps to Address:

**From pGlobe:**
1. **STORAGE STATISTICS** - Total storage, used storage (127.45 TB total)
2. **LATENCY METRICS** - Avg latency (858ms)
3. **CREDITS TRACKING** - Total credits (7,465,847)
4. **SYNCING STATUS** - Separate syncing category
5. **Packet Rate** - Avg packet rate (66.24/s)

**From explorerxandeum:**
1. **WATCHLIST FEATURE** - Save favorite nodes
2. **COMPARE FEATURE** - Side-by-side node comparison
3. **DEGRADED STATUS** - Separate from offline

### Action Items:

1. ✅ Analyzed both competitor platforms
2. Test if storage/latency/credits are available via get-stats RPC call
3. Implement storage display if available
4. Implement Watchlist feature (localStorage-based)
5. Implement Compare feature (multi-select nodes)
6. Add degraded status detection
7. Update competitive analysis in submission materials
8. Emphasize our unique advantages (Performance Alerts, Historical Trends, Ranking System)
