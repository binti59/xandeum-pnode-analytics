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
- [x] Test with user's nodes (62.171.135.107 and 62.171.138.27) - Direct test successful, but scanner shows as private (needs debugging) which have port 6000 open

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
