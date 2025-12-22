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
