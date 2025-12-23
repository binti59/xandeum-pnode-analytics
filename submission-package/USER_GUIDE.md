# Xandeum pNode Analytics Platform - User Guide

**Complete guide to using the Xandeum pNode Analytics Platform**

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Rankings System](#rankings-system)
4. [Performance Monitoring](#performance-monitoring)
5. [Search and Filtering](#search-and-filtering)
6. [Data Export](#data-export)
7. [Settings and Configuration](#settings-and-configuration)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Getting Started

### Accessing the Platform

The Xandeum pNode Analytics Platform is accessible via web browser at:

**https://xandeum-pnode-analytics.manus.space**

No installation, registration, or configuration is required. Simply navigate to the URL and the platform will automatically connect to the Xandeum network and begin displaying pNode data.

### System Requirements

The platform works on any modern web browser:

- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+, Samsung Internet 14+
- **Internet**: Broadband connection recommended for real-time updates
- **Screen**: Minimum 1024x768 resolution (responsive down to 320px width)

### First Visit

When you first visit the platform, you'll see:

1. **Loading Screen**: Brief loading indicator while fetching initial data
2. **Dashboard View**: Main overview with network health score and statistics
3. **Auto-Refresh**: Countdown timer showing when data will next refresh (default: 1 minute)

The platform automatically saves your preferences (auto-refresh settings, custom endpoints) to your browser's local storage, so they persist across visits.

---

## Dashboard Overview

The Dashboard is the main view providing a comprehensive overview of the Xandeum pNode network.

### Network Health Score

The large circular indicator at the top left shows the overall network health score (0-100):

- **92-100 (Green)**: Healthy network with good availability, version currency, and geographic distribution
- **70-91 (Yellow)**: Moderate health with some areas needing attention
- **0-69 (Red)**: Critical issues requiring immediate investigation

The health score is calculated from three components:

- **Availability (40%)**: Percentage of nodes currently online and responding
- **Version Health (35%)**: Percentage of nodes running current or recent software versions
- **Distribution (25%)**: Geographic diversity measured by number of countries represented

Below the score, you'll see three sub-scores:
- **Availability**: Percentage of nodes successfully responding to queries
- **Version Health**: Percentage of nodes running recommended versions
- **Distribution**: Geographic spread across countries

### Statistics Cards

Four key metrics are displayed prominently:

**Total Nodes**: Complete count of pNodes appearing in gossip. This number updates in real-time as nodes join or leave the network.

**Online**: Percentage and count of nodes currently responding. In a healthy network, this should be close to 100%.

**Countries**: Number of unique countries where nodes are located. Higher numbers indicate better geographic decentralization.

**At Risk**: Count of nodes that may have issues (outdated versions, poor performance, or accessibility problems). Click to see details.

### Version Distribution Chart

The donut chart shows the breakdown of software versions across all nodes:

- **Current Version (Green)**: Nodes running the latest recommended version (0.8.0)
- **Recent Versions (Blue/Purple)**: Nodes running recent but not latest versions
- **Outdated Versions (Orange/Red)**: Nodes running significantly outdated versions
- **Unknown (Gray)**: Nodes with unrecognized version strings

Hover over chart segments to see exact node counts and percentages. The center displays the total number of unique versions detected.

### Network Health Timeline

The line chart shows network health trends over time with three configurable time ranges:

- **1h**: Last hour with 5-minute intervals (12 data points)
- **6h**: Last 6 hours with 30-minute intervals (12 data points)
- **24h**: Last 24 hours with 2-hour intervals (12 data points)

The chart updates automatically as new data arrives. Green areas indicate healthy periods, yellow shows moderate health, and red highlights critical periods.

### Geographic Distribution Map

The interactive world map displays node locations with clickable markers:

**Viewing Locations**: Each marker represents one or more nodes at a specific location. Marker size indicates the number of nodes at that location.

**Clicking Markers**: Click any marker to see a popup with:
- City and country name
- Number of nodes at this location
- List of node IP addresses
- Average health score for nodes at this location

**Map Controls**: Use mouse wheel or pinch gestures to zoom. Drag to pan. Double-click to zoom to a specific location.

**Country List**: The sidebar shows node distribution by country with flag emojis and node counts. Click a country to zoom the map to that region.

### Insights Panel

The Insights panel provides automated analysis and recommendations:

**Network Alerts**: Automatically generated alerts highlight:
- Version diversity issues (too many versions or outdated versions)
- Geographic concentration risks (too many nodes in one location)
- Accessibility problems (low percentage of nodes with open RPC ports)
- Performance degradation (declining health scores over time)

**Recommendations**: Actionable suggestions for network improvement:
- Upgrade paths for outdated nodes
- Geographic expansion opportunities
- Performance optimization tips
- RPC accessibility improvements

Alerts are color-coded by severity (red = critical, yellow = warning, blue = informational).

### Node Cards

The bottom section displays individual node cards in a responsive grid:

**Card Information**:
- **IP Address**: Node's public IP address and port
- **Location**: City and country with flag emoji
- **Version**: Software version with color coding (green = current, yellow = recent, red = outdated)
- **Status**: Online indicator (green dot)
- **RPC Status**: 🔓 (accessible) or 🔒 (private) icon

**Expandable Cards**: Nodes with accessible RPC ports (🔓 icon) can be expanded by clicking:
- **CPU Usage**: Current CPU utilization percentage
- **RAM Usage**: Memory consumption and total available
- **Uptime**: How long the node has been running
- **Active Streams**: Number of active network connections
- **Packets**: Sent and received packet counts
- **Refresh Button**: Manually fetch latest statistics

**Search and Filter**: Use the search box above the cards to filter by IP address, location, or version. Use the filter buttons (All/Online/Offline) to show specific subsets.

---

## Rankings System

The Rankings page provides comparative analysis of all pNodes with intelligent scoring and achievement badges.

### Accessing Rankings

Click "Rankings" in the top navigation bar to access the rankings view.

### Understanding the Score

Each node receives a score from 0-100 based on multiple factors:

**Base Score (50 points)**: All nodes start with 50 points to ensure positive scores.

**Version Currency (20 points)**:
- Latest version (0.8.0): +20 points
- One version behind: +15 points
- Two versions behind: +10 points
- Three+ versions behind: +5 points

**RPC Accessibility (10 points)**:
- RPC port accessible (port 6000 open): +10 points
- RPC port private (port 6000 closed): +0 points

**Performance Metrics (20 points)** - Only for nodes with accessible RPC:
- **CPU Efficiency (5 points)**: Lower CPU usage scores higher (100% = 0 points, 0% = 5 points)
- **RAM Efficiency (5 points)**: Lower RAM usage scores higher (100% = 0 points, 0% = 5 points)
- **Uptime Reliability (5 points)**: Longer uptime scores higher (capped at 30 days for max points)
- **Network Activity (5 points)**: More active streams and higher packet throughput score higher

**Hover for Details**: Hover over any score to see the detailed breakdown showing points earned in each category.

### Achievement Badges

Nodes can earn special badges for excellence:

**🏆 Stable Champion**: Node has maintained top 10 ranking for 7+ consecutive days. Demonstrates consistent high performance and reliability.

**⚡ Latest Version**: Node is running the most current software version (0.8.0). Shows commitment to staying updated.

**🌍 Geographic Pioneer**: Node is the only representative in its country. Contributes to network decentralization.

**⏱️ Uptime Hero**: Node has maintained 99.9%+ uptime over 30 days. (Requires future implementation when uptime tracking is available)

Badges appear next to node names in the rankings table and provide visual recognition of achievements.

### Rank Trends

Each node shows a trend indicator next to its rank:

- **↑ (Green Arrow)**: Rank improved compared to previous snapshot (moving up the leaderboard)
- **↓ (Red Arrow)**: Rank declined compared to previous snapshot (moving down the leaderboard)
- **→ (Gray Arrow)**: Rank unchanged or minimal change (stable position)

Trend indicators help identify nodes with improving or declining performance over time.

### Sorting and Filtering

**Sort Options**: Click column headers to sort by:
- **Rank**: Default sort showing highest-ranked nodes first
- **Score**: Sort by total score (same as rank but shows ties)
- **Node**: Alphabetical sort by IP address
- **Location**: Sort by country then city
- **Version**: Sort by software version (latest first)

**Filter Options**: Use the filter buttons to show:
- **Top 10**: Only the top 10 ranked nodes
- **Top 50**: Top 50 ranked nodes
- **All**: Complete list of all nodes

**Search**: Use the search box to find specific nodes by IP address, location, or version.

### Leaderboard History

Click "History" to view past daily snapshots of the top 10 rankings:

**Date Selector**: Choose a date to view the top 10 nodes from that day.

**Historical Comparison**: See how rankings have changed over time and identify consistently high-performing nodes.

**Badge Timeline**: Track when nodes earned achievement badges and how long they've maintained them.

### Exporting Rankings

Click the "Export CSV" or "Export JSON" button to download the complete rankings table:

**CSV Format**: Comma-separated values suitable for Excel, Google Sheets, or other spreadsheet applications.

**JSON Format**: Structured data suitable for programmatic analysis or integration with other tools.

Exports include all columns (rank, score, node, location, version, badges, trends) for the currently filtered view.

---

## Performance Monitoring

The Performance page displays historical performance trends for accessible nodes.

### Accessing Performance

Click "Performance" in the top navigation bar to access the performance monitoring view.

### Node Selection

Use the dropdown menu to select a node for detailed analysis:

**Available Nodes**: Only nodes with accessible RPC ports (🔓 icon) and historical data appear in the list.

**Data Points**: The number in parentheses shows how many performance snapshots have been collected for each node.

**Automatic Collection**: The platform automatically queries accessible nodes every 5 minutes, so historical data accumulates over time without manual intervention.

### Time Range Selection

Choose a time range to analyze:

- **1h**: Last hour of data with 5-minute granularity
- **6h**: Last 6 hours of data with 5-minute granularity
- **24h**: Last 24 hours of data with 5-minute granularity

The charts automatically filter data to show only the selected time range.

### Performance Charts

Four interactive charts display different performance metrics:

**CPU Usage Chart**:
- **Y-Axis**: CPU utilization percentage (0-100%)
- **X-Axis**: Time
- **Interpretation**: Lower and more stable is better. Spikes may indicate heavy workload or inefficiency.

**RAM Usage Chart**:
- **Y-Axis**: Memory utilization percentage (0-100%)
- **X-Axis**: Time
- **Interpretation**: Steady usage is normal. Gradual increases may indicate memory leaks. Sudden drops may indicate restarts.

**Uptime Trend Chart**:
- **Y-Axis**: Uptime in hours
- **X-Axis**: Time
- **Interpretation**: Steadily increasing line indicates stable operation. Drops to zero indicate restarts or downtime.

**Active Streams Chart**:
- **Y-Axis**: Number of active network connections
- **X-Axis**: Time
- **Interpretation**: Higher numbers indicate more network activity. Fluctuations are normal based on network demand.

**Chart Interactions**:
- **Hover**: Hover over data points to see exact values and timestamps
- **Zoom**: Click and drag to zoom into specific time periods
- **Legend**: Click legend items to show/hide specific data series

### Interpreting Trends

**Healthy Patterns**:
- CPU usage below 50% with minimal variation
- RAM usage stable without gradual increases
- Uptime steadily increasing over days/weeks
- Active streams varying based on network activity

**Warning Signs**:
- CPU consistently above 80% (may need optimization or hardware upgrade)
- RAM gradually increasing over time (potential memory leak)
- Frequent uptime drops (instability or frequent restarts)
- Active streams consistently zero (connectivity issues)

### No Data Available

If you see "No Performance Data Available":

**Cause**: No accessible nodes have been scanned yet, or the selected node doesn't have historical data.

**Solution**: Visit the Dashboard to trigger the initial RPC scan. The platform will automatically begin collecting performance data from accessible nodes. Return to the Performance page after 5-10 minutes to see initial data.

---

## Search and Filtering

The platform provides powerful search and filtering capabilities across all views.

### Real-Time Search

The search box at the top of node lists provides instant filtering:

**Search Scope**: Searches across:
- IP addresses (e.g., "192.168")
- Geographic locations (e.g., "Germany", "Berlin")
- Software versions (e.g., "0.8.0")
- Node identifiers (pubkeys)

**Search Behavior**:
- **Instant Results**: Results update as you type with no delay
- **Case Insensitive**: Searches ignore case differences
- **Partial Matching**: Matches anywhere in the field (not just beginning)
- **Multiple Fields**: Searches all relevant fields simultaneously

**Examples**:
- Search "192.190" to find all nodes with IPs starting with 192.190
- Search "United States" to find all US-based nodes
- Search "0.8.0" to find all nodes running version 0.8.0
- Search "Berlin" to find all nodes in Berlin

### Filter Buttons

Quick filter buttons provide one-click access to common views:

**All**: Shows all nodes without filtering (default view)

**Online**: Shows only nodes currently responding to queries (typically 100% in healthy network)

**Offline**: Shows only nodes that are not responding (useful for troubleshooting)

**Top 10** (Rankings only): Shows only the top 10 ranked nodes

**Top 50** (Rankings only): Shows only the top 50 ranked nodes

**RPC Accessible** (Dashboard only): Shows only nodes with open RPC ports (🔓 icon)

### Combining Search and Filters

Search and filters work together:

1. Apply a filter (e.g., "Top 10")
2. Then search within those results (e.g., "Germany")
3. Result: Top 10 nodes located in Germany

This enables powerful multi-criteria filtering without complex query syntax.

---

## Data Export

The platform supports exporting node data in multiple formats for external analysis.

### Export Formats

**CSV (Comma-Separated Values)**:
- Opens in Excel, Google Sheets, Numbers, or any spreadsheet application
- Preserves all data fields with proper escaping
- Includes header row with column names
- Suitable for data analysis, reporting, and visualization

**JSON (JavaScript Object Notation)**:
- Structured data format for programmatic access
- Preserves data types (numbers, strings, booleans)
- Includes nested objects for complex data
- Suitable for API integration, custom scripts, and data pipelines

### Exporting from Dashboard

Click the "Export CSV" or "Export JSON" button in the Dashboard header:

**Exported Data**:
- Node IP addresses and ports
- Geographic locations (city, country, coordinates)
- Software versions
- Status (online/offline)
- RPC accessibility status
- Health scores
- Last seen timestamps

**Filtered Exports**: If you've applied search or filters, only the visible nodes are exported. This allows exporting specific subsets (e.g., only German nodes, only accessible nodes).

### Exporting from Rankings

Click the "Export CSV" or "Export JSON" button in the Rankings header:

**Exported Data**:
- All fields from Dashboard export
- Plus: Rank, Score, Score breakdown, Badges, Trend indicators

**Use Cases**:
- Identify top performers for delegation or partnership
- Track ranking changes over time by comparing exports
- Analyze scoring patterns to optimize your own node
- Generate custom reports for stakeholders

### Exporting RPC-Accessible Nodes Only

Click the "Export Accessible Nodes" button (if available) to export only nodes with open RPC ports:

**Purpose**: Quickly get a list of nodes that can be queried directly for detailed statistics.

**Use Cases**:
- Build custom monitoring tools
- Perform detailed performance analysis
- Identify nodes suitable for public API access
- Verify RPC endpoint availability

---

## Settings and Configuration

The platform provides several configuration options accessible via the settings icon (⚙️) in the header.

### Connection Settings

**RPC Endpoint**:
- **Default**: `http://192.190.136.36:6000/rpc` (official Xandeum public node)
- **Custom**: Enter your own RPC endpoint URL if you're running a local node or prefer a different endpoint
- **Format**: Must be a valid HTTP/HTTPS URL ending in `/rpc`

**Stats Endpoint** (Optional):
- **Purpose**: Alternative endpoint for fetching detailed node statistics
- **Use Case**: If you're running your own pNode with custom stats API
- **Format**: Full HTTP/HTTPS URL to your stats endpoint

**Use Custom Stats**:
- **Toggle**: Enable to use the custom stats endpoint instead of querying nodes directly
- **Purpose**: Reduces load on individual nodes by centralizing stats queries

**Saving Settings**: Click "Save Settings" to apply changes. The platform will immediately reconnect using the new endpoints.

### Auto-Refresh Configuration

**Enable/Disable**:
- Click the pause/play button (⏸️/▶️) in the header to toggle auto-refresh
- When enabled, data automatically refreshes at the configured interval
- When disabled, data only updates when you manually click "Refresh"

**Refresh Interval**:
- **30 seconds**: Very frequent updates for active monitoring (may increase server load)
- **1 minute**: Default setting balancing freshness and performance
- **2 minutes**: Moderate update frequency for casual monitoring
- **5 minutes**: Infrequent updates to minimize server load

**Countdown Timer**: The timer next to the interval selector shows seconds remaining until the next automatic refresh.

**Persistent Settings**: Your auto-refresh preferences are saved to browser local storage and restored when you return to the platform.

### Resetting to Defaults

To reset all settings to defaults:

1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear Local Storage for the platform domain
4. Refresh the page

This will restore:
- Default RPC endpoint
- Auto-refresh enabled at 1-minute interval
- No custom stats endpoint

---

## Troubleshooting

### Common Issues and Solutions

**Issue: "Failed to fetch pNode data"**

**Cause**: Cannot connect to the RPC endpoint.

**Solutions**:
1. Check your internet connection
2. Verify the RPC endpoint is accessible (try opening it in a browser)
3. Check if the endpoint is temporarily down (try again in a few minutes)
4. Try resetting to the default endpoint in settings

**Issue: "No nodes with history data" in Performance page**

**Cause**: Performance data hasn't been collected yet.

**Solutions**:
1. Visit the Dashboard to trigger the initial RPC scan
2. Wait 5-10 minutes for the first performance collection cycle
3. Ensure at least some nodes have accessible RPC ports (🔓 icon)
4. Check browser console for errors that might prevent data collection

**Issue: Node cards not expanding when clicked**

**Cause**: Node doesn't have accessible RPC port or statistics fetch failed.

**Solutions**:
1. Verify the node has a 🔓 icon (accessible RPC)
2. Check if the node is actually online and responding
3. Try clicking "Refresh Stats" if the card does expand but shows no data
4. Check browser console for network errors

**Issue: Map not displaying or markers not appearing**

**Cause**: Geographic data not loaded or map library error.

**Solutions**:
1. Refresh the page to reload map resources
2. Check browser console for JavaScript errors
3. Ensure browser allows loading of external map resources
4. Try a different browser if the issue persists

**Issue: Charts not rendering or showing blank**

**Cause**: Chart library not loaded or data format issue.

**Solutions**:
1. Refresh the page to reload chart libraries
2. Check browser console for JavaScript errors
3. Ensure browser supports modern JavaScript features
4. Try clearing browser cache and reloading

**Issue: Slow performance or laggy interface**

**Cause**: Too many nodes, slow device, or browser resource constraints.

**Solutions**:
1. Increase auto-refresh interval to reduce update frequency
2. Use search/filters to show fewer nodes at once
3. Close other browser tabs to free up memory
4. Try a different browser (Chrome generally performs best)
5. Upgrade device if performance is consistently poor

### Browser Compatibility

**Recommended Browsers**:
- Chrome 90+ (best performance)
- Firefox 88+ (good performance)
- Safari 14+ (good performance on macOS/iOS)
- Edge 90+ (good performance)

**Known Issues**:
- Internet Explorer: Not supported (use Edge instead)
- Older browsers: May have rendering or functionality issues

### Getting Help

If you encounter issues not covered here:

1. **Check Browser Console**: Press F12 and look for error messages in the Console tab
2. **Try Incognito/Private Mode**: Rules out browser extension conflicts
3. **Clear Cache**: Force refresh with Ctrl+Shift+R (Cmd+Shift+R on Mac)
4. **Different Browser**: Try accessing the platform in a different browser
5. **Contact Support**: Join the Xandeum Discord at https://discord.gg/uqRSmmM5m for assistance

---

## FAQ

**Q: How often does the platform update node data?**

A: By default, the platform refreshes node data every 1 minute. You can configure this interval in settings (30s, 1m, 2m, or 5m). Background processes like RPC scanning (every 30 minutes) and performance collection (every 5 minutes) run independently.

**Q: What does the health score mean?**

A: The health score (0-100) summarizes overall network status based on three factors: availability (40%), version health (35%), and geographic distribution (25%). Scores above 90 indicate a healthy network, 70-90 is moderate, and below 70 requires attention.

**Q: How are nodes ranked?**

A: Nodes are ranked using a multi-factor scoring system (0-100 points) that evaluates version currency (20 pts), RPC accessibility (10 pts), performance metrics (20 pts), and a base score (50 pts). Higher scores indicate better overall node quality.

**Q: What do the badges mean?**

A: Badges recognize special achievements: 🏆 Stable Champion (top 10 for 7+ days), ⚡ Latest Version (running current software), 🌍 Geographic Pioneer (only node in country), ⏱️ Uptime Hero (99.9%+ uptime for 30 days).

**Q: Why can't I see performance data for some nodes?**

A: Performance data is only available for nodes with accessible RPC ports (🔓 icon). Nodes with private RPC ports (🔒 icon) cannot be queried directly for detailed statistics. Additionally, data accumulates over time, so newly discovered nodes may not have historical data yet.

**Q: How long is performance data stored?**

A: Performance data is stored in your browser's local storage for 24 hours. Data older than 24 hours is automatically deleted to prevent storage bloat. For long-term analysis, export data regularly.

**Q: Can I monitor my own node?**

A: Yes! If your node appears in the gossip network, it will automatically appear in the platform. To see detailed performance data, ensure your RPC port (6000) is publicly accessible. You can search for your node by IP address or location.

**Q: Is my data private?**

A: All data displayed by the platform is public information from the Xandeum gossip network. No personal information is collected or stored. Your browser settings (auto-refresh interval, custom endpoints) are stored locally in your browser and never transmitted to servers.

**Q: Can I use this platform for commercial purposes?**

A: The platform is provided as-is for the Xandeum community. For commercial use cases, please contact the platform maintainers or join the Xandeum Discord to discuss licensing and support options.

**Q: How can I contribute or report bugs?**

A: The platform is open source. You can contribute code, report bugs, or suggest features via the GitHub repository. For general questions or community discussion, join the Xandeum Discord at https://discord.gg/uqRSmmM5m.

---

**Need more help?** Join the Xandeum Discord community at https://discord.gg/uqRSmmM5m

**Platform URL**: https://xandeum-pnode-analytics.manus.space
