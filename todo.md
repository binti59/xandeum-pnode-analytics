# Xandeum pNode Analytics - TODO

## Completed Features
- [x] Backend proxy for HTTP pNode RPC calls
- [x] Basic pNode grid view with search and filters
- [x] Premium dark glassmorphism design
- [x] Framer Motion animations
- [x] Connection settings dialog
- [x] Error handling for Mixed Content issues

## Lattice-Inspired Enhancements (Completed)
- [x] Add geographic data lookup (IP to country/city)
- [x] Implement health score calculation system
- [x] Create version distribution donut chart
- [x] Add enhanced stats cards (countries count, at-risk nodes)
- [x] Implement CSV/JSON export functionality
- [x] Add country flag emojis to node cards
- [x] Add city names to node cards
- [x] Create circular health score indicator

## Future Enhancements (Deferred)
- [x] Implement network health timeline chart
- [x] Add insights/alerts panel
- [x] Add time range selector (1h, 6h, 24h) for charts
- [x] Implement trend indicators (e.g., "-12 pts")

## Future Enhancements (Post-API Update)
- [ ] Display extended stats when API adds them (uptime, storage, rpc_port)
- [ ] Interactive world map for geographic distribution
- [ ] Advanced filtering by health status, version, location
- [ ] Real-time event feed
- [ ] Historical uptime tracking

## Recently Completed
- [x] Add geographic data lookup (IP to country/city)
- [x] Add country flag emojis to node cards
- [x] Add city names to node cards

## New Feature Requests (User Requested)
- [x] Add search filter buttons (All/Online/Offline)
- [x] Create interactive global distribution map with clickable markers
- [x] Implement network health timeline chart (1h/6h/24h views)
- [x] Create insights panel with auto-generated network alerts
- [x] Build detailed node drawer/panel showing full specifications
- [x] Add node click handler to open detail drawer

## New User Request (Lazy-Loading Detail System)
- [x] Check Xandeum documentation for enhanced API method with detailed stats
- [x] Simplify NodeCard to show only essential info (IP, location, version, status)
- [x] Add get-stats RPC method to backend proxy
- [x] Update NodeDetailsDrawer to fetch individual node stats on click
- [x] Add loading state while fetching node details
- [x] Handle errors gracefully if node doesn't respond
- [ ] Use public RPC node (192.190.136.36:6000) as fallback for stats
- [ ] Display real uptime, storage, CPU, RAM, and network stats in drawer

## New Feature Request (Custom RPC Endpoint Support)
- [x] Add "Custom Stats Endpoint" field to Connection Settings dialog
- [x] Allow users to configure ngrok HTTPS URL for their tunneled pNode
- [x] Update getNodeStats to use custom endpoint when configured
- [x] Add toggle to switch between public node and custom endpoint
- [ ] Test with user's ngrok tunnel (localhost:3000 → ngrok HTTPS URL)
- [x] Display custom endpoint status in Connection Settings

## New Feature Request (Auto-Refresh Visual Indicators)
- [x] Add countdown timer showing seconds until next refresh
- [x] Add auto-refresh toggle switch (pause/play button)
- [x] Add interval selector dropdown (30s, 1m, 2m, 5m)
- [x] Persist auto-refresh settings in localStorage
- [x] Default auto-refresh enabled at 1 minute interval

## New Feature Request (pNode Ranking System)
- [x] Create ranking algorithm based on available metrics (version, geo diversity, stability)
- [x] Build sortable ranking table component with columns (Rank, Node, Location, Version, Score, Status)
- [x] Add ranking page accessible from dashboard navigation
- [x] Implement score calculation (0-100 scale)
- [x] Add sorting by different columns (rank, score, version, location)
- [x] Prepare for future enhancement when detailed stats API becomes available
- [x] Add filters to show top 10, top 50, or all nodes
- [x] Add CSV/JSON export buttons
- [x] Add summary stats (top score, average score, total nodes)
- [x] Add medal badges for top 3 ranks

## New Enhancement Requests (Ranking System Advanced Features)
- [x] Create database schema for storing historical ranking snapshots
- [ ] Implement automatic daily snapshot capture of top rankings (requires cron job)
- [x] Add score trend tracking (compare current vs previous score)
- [x] Display trend indicators (↑ rising, ↓ falling, → stable) next to ranks
- [x] Create badge system with achievement criteria
- [x] Award "Stable Champion" badge (top 10 for 7+ days)
- [x] Award "Latest Version" badge (running version 1.0.0)
- [x] Award "Geographic Pioneer" badge (only node in country)
- [x] Award "Uptime Hero" badge (when uptime data becomes available)
- [x] Build leaderboard history page showing daily top 10 snapshots
- [x] Add date range selector for viewing historical rankings
- [x] Display badges on ranking table

## New Feature Request (Node Performance History Page)
- [x] Create NodeHistory page component with URL parameter for node address
- [x] Add performance timeline chart showing score changes over time
- [x] Add rank progression chart with trend line
- [x] Display badge history timeline showing when badges were earned
- [x] Display comprehensive statistics (average score, best rank, days tracked, current score/rank)
- [x] Add geographic information section
- [x] Make node cards clickable to navigate to history page
- [x] Add back navigation to return to dashboard/rankings
- [x] Handle cases where no historical data exists yet

## New Feature Request (On-Demand Stats Fetching + RPC Accessibility Prioritization)
- [x] Update backend proxy to query individual nodes directly (http://<node-ip>:6000/rpc)
- [x] Add timeout handling (5 seconds) for nodes with private/firewalled RPC ports
- [x] Implement client-side caching (localStorage) for successful stats responses
- [x] Update NodeDetailsDrawer to attempt direct node query on open
- [x] Show loading spinner while fetching stats
- [x] Display real stats (uptime, storage, CPU, RAM, network) if node responds
- [x] Show "RPC port private" message if node times out or is unreachable
- [x] Cache successful responses for 5 minutes to avoid repeated queries
- [x] Add "Refresh Stats" button to manually re-fetch data
- [x] Add visual indicator (🔓 unlocked/🔒 locked icon) for nodes with open/private RPC port
- [x] Add RPC accessibility bonus (+10 points) to ranking algorithm
- [x] Add "RPC Accessible" filter to show only queryable nodes
- [x] Sort nodes with accessible RPC ports to top of list by default
- [x] Update node cards to show RPC status badge

## New Feature Request (RPC Accessibility Enhancements)
- [x] Implement background RPC scanning job that checks all nodes every 30 minutes
- [x] Pre-populate statsCache with RPC accessibility status for all nodes
- [x] Add RPC accessibility statistics panel to dashboard showing count of accessible nodes
- [x] Create mini leaderboard in stats panel showing top-ranked accessible nodes
- [x] Add dedicated export button for RPC-accessible nodes only (CSV/JSON)
- [x] Display loading state during background RPC scan

## Bug Fix
- [x] Fix TypeError in NodeDetailsDrawer when clicking nodes with private RPC ports (Cannot read properties of undefined reading 'uptime')

## New Feature Request (Manual RPC Re-scan)
- [x] Add manual refresh button to RPC Accessibility panel
- [x] Trigger full network re-scan on button click
- [x] Show loading state during manual scan
- [x] Add cooldown period to prevent spam (disabled state during scan)

## Version Recognition Update
- [x] Update ranking algorithm to recognize 0.8.0 as latest version (not 1.0.0)
- [x] Update health metrics calculation to use 0.8.0 as current version
- [x] Update badge system to award "Latest Version" badge for 0.8.0
- [x] Update insights panel to reflect correct version status


## Bug Fix - RPC Scanner Not Working
- [x] Fix RPC scanner to use correct method (get-stats instead of get-version)
- [x] Fix RPC scanner request format to match tRPC batched format
- [x] Fix RPC scanner response parsing to extract from tRPC wrapper
- [x] Test expandable cards with accessible nodes - All features working perfectly! - Direct test successful, but scanner shows as private (needs debugging) which have port 6000 open

## Bug Fix - RPC Scanner Request Format Mismatch
- [x] Identified issue: raw fetch() cannot call tRPC endpoints directly
- [ ] Create dedicated REST endpoint /api/proxy-rpc for RPC proxying
- [ ] Update prpc.ts to use new REST endpoint
- [ ] Update rpcScanner.ts to use new REST endpoint

## Bug Fix - Create REST Endpoint for RPC Proxy
- [x] Create /api/proxy-rpc REST endpoint following Xandeum pRPC protocol
- [x] Endpoint accepts {endpoint, method, params} and returns JSON-RPC 2.0 response
- [x] Update prpc.ts getPods() to use new endpoint
- [x] Update prpc.ts getNodeStats() to use new endpoint
- [x] Update rpcScanner.ts checkNodeRpcAccessibility() to use new endpoint
- [x] Test with user's nodes (62.171.135.107 and 62.171.138.27) - Direct test successful, but scanner shows as private (needs debugging)


## Scanner Improvements for User Node Detection
- [x] Increase RPC_TIMEOUT from 5 to 10 seconds in rpcScanner.ts
- [x] Reduce BATCH_SIZE from 5 to 3 concurrent requests
- [x] Add debug logging to checkNodeRpcAccessibility() to track failures
- [x] Log timeout errors, network errors, and invalid responses separately
- [x] Create manual "Test RPC" button for individual node cards
- [x] Display test result (success/failure reason) in real-time
- [x] Test with user's nodes (62.171.135.107 - SUCCESS! Manual test shows RPC accessible)


## Bug Fix - Accessible Nodes Show No Stats in Drawer
- [x] Fixed NodeDetailsDrawer using tRPC hook incorrectly in async function
- [x] Changed to use REST endpoint /api/proxy-rpc instead
- [x] Fixed 503 errors by reducing BATCH_SIZE to 1 (sequential scanning)
- [x] Added 500ms delay between requests to prevent backend overload
- [ ] Verify stats display correctly for both accessible and private nodes


## Feature - Expandable Node Cards with Inline Stats
- [x] Make NodeCard expandable with click to show/hide details (only for accessible nodes)
- [x] Display inline stats when card is expanded (uptime, CPU, RAM, streams, packets)
- [x] Fetch stats on-demand when user expands card
- [x] Show loading state while fetching stats
- [x] Handle both accessible (expandable) and private (not expandable) nodes
- [x] Add smooth expand/collapse animation with AnimatePresence
- [x] Test expandable cards with accessible nodes - SUCCESS! Card expands showing stats inline


## UI/UX Improvements
- [x] Implement localStorage caching for fetched node stats (5-minute TTL)
- [x] Add refresh button on expanded cards to re-fetch stats
- [x] Improve "Click to view detailed statistics" button visibility (changed to primary color, always visible)
- [x] Remove NodeDetailsDrawer component (no longer needed with inline stats)
- [x] Remove drawer trigger from Dashboard component


## Feature - Performance-Based Rankings
- [x] Design performance scoring system using real-time metrics (20 points total)
- [x] Add CPU efficiency score (lower CPU usage = higher score, max 5 points)
- [x] Add RAM efficiency score (lower RAM usage = higher score, max 5 points)
- [x] Add uptime reliability score (longer uptime = higher score, max 5 points)
- [x] Add network activity score (active streams + packet throughput, max 5 points)
- [x] Update nodeRanking.ts to incorporate performance metrics
- [x] Fetch stats from statsCache for accessible nodes during ranking calculation
- [x] Display performance breakdown in Rankings page (tooltip + inline breakdown)
- [x] Test with accessible nodes to verify scoring accuracy - SUCCESS! Top nodes show performance breakdown


## Feature - Performance Monitoring Page
- [x] Create performance history tracking system using localStorage
- [x] Store CPU, RAM, uptime snapshots every 5 minutes for accessible nodes
- [x] Maintain 24-hour rolling window of historical data
- [x] Integrate tracking into NodeCard when stats are fetched
- [x] Create Performance.tsx page component
- [x] Add trend charts using recharts library (CPU, RAM, Uptime over time)
- [x] Display accessible nodes with performance trends
- [x] Add node selector to view individual node performance history
- [x] Add time range filter (1h/6h/24h)
- [x] Add navigation link to Performance page in Dashboard and Rankings
- [x] Add route to App.tsx for /performance path
- [x] Add Active Streams chart to show network activity trends


## Bug Fix - Performance Page Navigation and Styling
- [x] Add navigation header to Performance page with back links to Dashboard/Rankings
- [x] Update Performance page background gradient to match Dashboard (slate-950 via purple-950)
- [x] Update chart panel styling to match glassmorphism design (glass-panel class)
- [x] Ensure consistent color palette across all pages (primary, chart-2, chart-4, chart-5)
- [x] Test navigation flow between all pages


## Feature - Automated Background Performance Data Collection
- [x] Create performanceCollector.ts utility for automated data collection
- [x] Implement periodic collection job (every 5 minutes)
- [x] Query all accessible nodes from statsCache automatically
- [x] Store performance snapshots using addPerformanceSnapshot()
- [x] Add progress tracking and error handling
- [x] Integrate with Dashboard component lifecycle (start/stop)
- [x] Add getAllAccessible() method to statsCache
- [x] Export CollectionProgress interface for type safety
- [x] Automatic data accumulation without user interaction


## Bug Fix - CPU % Not Displaying in Node Cards
- [x] Investigate why CPU percentage is not showing in expandable node cards
- [x] Check if stats API response includes CPU data
- [x] Verify CPU data parsing and display logic
- [x] Fixed field name from `cpu` to `cpu_percent` in NodeCard component
- [x] Fixed field name from `ram` to `ram_used` in performance snapshot
- [x] Test with accessible nodes to confirm fix - verified RPC returns cpu_percent field


## Update - Change Live Platform URL to Custom Domain
- [x] Update README.md with https://xandanalytics.bikramjitchowdhury.com/
- [x] Update SUBMISSION.md with custom domain
- [x] Update USER_GUIDE.md with custom domain
- [x] Update VIDEO_SCRIPT.md with custom domain
- [x] Update INDEX.md with custom domain
- [x] Recreate submission package archive
- [x] Push changes to GitHub repository


## Bug Fix - Version Health Bar Display
- [x] Fix version health bar to show correct width (79% should show 79% width, not 100%)
- [x] Fix version health bar color based on percentage (green ≥80%, yellow 60-79%, red <60%)
- [x] Apply same logic to Availability and Distribution bars for consistency
- [x] Added getHealthBgColor() function for proper background color mapping
- [x] Test with different health score values - verified 79% shows correct width and yellow color


## Feature - Performance Alerts Dashboard Widget
- [x] Create PerformanceAlerts.tsx component with compact card design
- [x] Add real-time alert monitoring for CPU >80%, RAM >90%, Storage >85%
- [x] Add offline node detection alerts
- [x] Add outdated version alerts
- [x] Show last 5 alerts with timestamps
- [x] Add badge showing total active alerts count (critical/warning)
- [x] Add click-to-navigate to Performance page for specific node
- [x] Add storage space monitoring to NodeStats interface (disk_used, disk_total)
- [x] Display storage space in expandable node cards
- [ ] Add storage metric to Performance trends page charts
- [x] Integrate alerts widget into Dashboard layout

## Feature - Loading Skeletons & Empty States
- [x] Skeleton.tsx component already exists with shimmer effect
- [x] Create DashboardSkeleton component for full dashboard loading state
- [x] Add loading skeletons for Dashboard stats cards
- [x] Add loading skeletons for node cards grid
- [x] Add loading skeletons for charts (Version Distribution, Health Timeline)
- [x] Create EmptyState.tsx component with icon and action button
- [x] Add loading skeleton to Dashboard initial load
- [ ] Add empty state for "No nodes found" with search
- [ ] Add empty state for "No accessible nodes" in RPC panel
- [ ] Add empty state for "No performance data" in Performance page
- [ ] Add success toasts for completed actions


## Bug Fix - Performance Alerts Node Address
- [x] Fix PerformanceAlerts component to use node.address instead of node.ip
- [x] Update all alert messages to display correct node addresses
- [x] Test alerts widget - verified showing correct node addresses


## Documentation Update - Remove Storage Monitoring References
- [x] Remove storage monitoring from PRESENTATION_SCRIPT.md
- [x] Check SUBMISSION.md - no node storage references found (only localStorage)
- [x] Check README.md - no node storage references found (only localStorage)
- [x] Check VIDEO_SCRIPT.md - file not in submission package
- [x] Update submission package with corrected documentation
- [x] Push updated documentation to GitHub


## Create Presentation Slides for Submission Package
- [x] Create detailed slide content outline (15 slides)
- [x] Generate professional presentation PDF
- [x] Remove PRESENTATION_SCRIPT.md and VIDEO_SCRIPT.md from submission package
- [x] Update submission package with presentation PDF
- [x] Push to GitHub


## Generate HTML Slide Presentation
- [ ] Generate interactive HTML slides from slide content
- [ ] Export slides to PPT format
- [ ] Add to submission package


## Competitive Analysis - Surpass Competitor Platforms
- [x] Analyze pglobe.vercel.app features and implementation
- [x] Analyze explorerxandeum.vercel.app features and implementation
- [x] Identify storage statistics display methods
- [x] Check if storage data is available via RPC endpoints - file_size field available!
- [ ] Implement storage statistics in cards, rankings, and performance pages
- [x] Identify any unique features competitors have
- [ ] Implement Watchlist feature (save favorite nodes)
- [ ] Implement Compare feature (side-by-side node comparison)
- [ ] Document competitive advantages in submission materials
- [ ] Test all new features thoroughly
- [ ] Update submission package with competitive analysis

## Feature - Storage Statistics Display
- [x] Add file_size field to NodeStats interface - already exists
- [x] Display storage in expandable node cards (convert bytes to GB/TB)
- [ ] Add storage column to Rankings table
- [ ] Add storage chart to Performance trends page
- [ ] Add total network storage to Dashboard stats
- [ ] Update Performance Alerts to monitor storage thresholds

## Feature - Watchlist System
- [x] Create watchlist management using localStorage
- [x] Add star/bookmark icon to node cards
- [x] Create Watchlist page showing saved nodes
- [x] Add /watchlist route to App.tsx
- [ ] Add "Watchlist" link to Dashboard navigation
- [x] Persist watchlist across sessions - automatic with localStorage
- [ ] Add watchlist count badge to navigation

## Feature - Node Comparison
- [ ] Add multi-select checkboxes to node cards
- [ ] Create Compare page with side-by-side layout
- [ ] Display all metrics in comparison table
- [ ] Add performance charts overlay for selected nodes
- [ ] Limit to 4 nodes maximum for comparison
- [ ] Add "Compare Selected" button to Dashboard


## Feature - Watchlist Navigation Link
- [x] Add Watchlist link to Dashboard header navigation
- [x] Add count badge showing number of saved nodes
- [x] getWatchlistCount() function already exists in watchlist.ts
- [ ] Add Watchlist link to Rankings header navigation
- [ ] Add Watchlist link to Performance header navigation

## Feature - Total Network Storage Dashboard Stat
- [x] Calculate total network storage from all accessible nodes
- [x] Add new stat card to Dashboard (5th card with Database icon)
- [x] Format storage in TB/GB for display
- [x] Update stat automatically when nodes are scanned (reactive calculation)

## Feature - Node Comparison Page
- [ ] Create Compare.tsx page component
- [ ] Add /compare route to App.tsx
- [ ] Add comparison checkboxes to node cards
- [ ] Add "Compare Selected" floating button to Dashboard
- [ ] Create side-by-side comparison table layout
- [ ] Display all metrics (CPU, RAM, Storage, Uptime, etc.)
- [ ] Add performance charts overlay for selected nodes
- [ ] Limit selection to 4 nodes maximum
- [ ] Show toast when limit reached
- [ ] Add "Clear Selection" button


## Feature - Storage Metrics in Rankings and Performance
- [x] Add Storage column to Rankings table
- [x] Add storage sorting option to Rankings
- [x] Add Storage chart to Performance trends page
- [x] Show storage usage over time in Performance visualization
- [x] Update Performance page to track storage in history


## Feature - Storage as Ranking Factor
- [x] Update ranking algorithm to include storage as 5th factor (20 points)
- [x] Storage scoring: >1TB=20pts, 500GB-1TB=15pts, 100-500GB=10pts, <100GB=5pts
- [x] Update Rankings page tooltip to show storage score breakdown
- [x] Total score now out of 140 (was 120)

## Feature - Storage Chart in Performance Trends
- [x] Add Storage chart to Performance page (5th chart after Active Streams)
- [x] Update performance history tracking to include storage (file_size)
- [x] Update performanceCollector to capture storage in snapshots
- [x] Show storage usage over 24-hour window
- [x] Format storage values in GB for chart display
