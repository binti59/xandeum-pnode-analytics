import { Pod } from "@/services/prpc";
import { statsCache } from "./statsCache";

/**
 * Check if a node has accessible RPC port based on cache
 */
function checkRpcAccessibility(nodeAddress: string): boolean {
  const cached = statsCache.get(nodeAddress);
  return cached?.accessible === true;
}

export interface RankedNode extends Pod {
  rank: number;
  score: number;
  versionScore: number;
  geoScore: number;
  stabilityScore: number;
  rpcAccessible?: boolean;
  rpcBonus: number;
  performanceScore: number;
  cpuEfficiency?: number;
  ramEfficiency?: number;
  uptimeReliability?: number;
  networkActivity?: number;
}

/**
 * Calculate node ranking score based on available metrics
 * Score range: 0-100
 */
export function calculateNodeRanking(nodes: Pod[]): RankedNode[] {
  const LATEST_VERSION = "0.8.0";
  const CURRENT_TIME = Date.now() / 1000;
  
  // Count nodes per country for geographic diversity scoring
  const countryCount = new Map<string, number>();
  nodes.forEach(node => {
    const country = node.geo?.country || "Unknown";
    countryCount.set(country, (countryCount.get(country) || 0) + 1);
  });
  
  const rankedNodes: RankedNode[] = nodes.map(node => {
    // Version Score (40 points)
    // Latest version (0.8.0) = 40 points
    // 0.7.x = 20 points
    // Others = 10 points
    let versionScore = 10;
    if (node.version === LATEST_VERSION) {
      versionScore = 40;
    } else if (node.version?.startsWith("0.8")) {
      versionScore = 30;
    } else if (node.version?.startsWith("0.7")) {
      versionScore = 20;
    }
    
    // Geographic Diversity Score (30 points)
    // Nodes in underrepresented countries score higher
    // Formula: 30 * (1 - (country_node_count / total_nodes))
    const country = node.geo?.country || "Unknown";
    const nodesInCountry = countryCount.get(country) || 1;
    const geoScore = 30 * (1 - (nodesInCountry / nodes.length));
    
    // Stability Score (30 points)
    // Based on how recently the node was seen
    // Seen in last 60s = 30 points
    // Seen in last 5min = 20 points
    // Seen in last 30min = 10 points
    // Older = 5 points
    const lastSeen = typeof node.last_seen === 'number' ? node.last_seen : 0;
    const timeSinceLastSeen = CURRENT_TIME - lastSeen;
    let stabilityScore = 5;
    if (timeSinceLastSeen < 60) {
      stabilityScore = 30;
    } else if (timeSinceLastSeen < 300) {
      stabilityScore = 20;
    } else if (timeSinceLastSeen < 1800) {
      stabilityScore = 10;
    }
    
    // RPC Accessibility Bonus (10 points)
    // Check cache to see if this node has accessible RPC port
    const rpcAccessible = checkRpcAccessibility(node.address);
    const rpcBonus = rpcAccessible ? 10 : 0;
    
    // Performance Score (20 points) - Only for accessible nodes with stats
    let performanceScore = 0;
    let cpuEfficiency, ramEfficiency, uptimeReliability, networkActivity;
    
    if (rpcAccessible) {
      const cached = statsCache.get(node.address);
      const stats = cached?.stats;
      
      if (stats) {
        // CPU Efficiency (5 points): Lower CPU usage = better
        // 0-25% CPU = 5 points, 25-50% = 3 points, 50-75% = 1 point, >75% = 0 points
        const cpuUsage = stats.stats?.cpu_percent || 0;
        if (cpuUsage < 25) {
          cpuEfficiency = 5;
        } else if (cpuUsage < 50) {
          cpuEfficiency = 3;
        } else if (cpuUsage < 75) {
          cpuEfficiency = 1;
        } else {
          cpuEfficiency = 0;
        }
        
        // RAM Efficiency (5 points): Lower RAM usage percentage = better
        // <50% = 5 points, 50-70% = 3 points, 70-90% = 1 point, >90% = 0 points
        const ramTotal = stats.stats?.ram_total || 0;
        const ramUsed = stats.stats?.ram_used || 0;
        const ramUsagePercent = ramTotal > 0 ? (ramUsed / ramTotal) * 100 : 0;
        if (ramUsagePercent < 50) {
          ramEfficiency = 5;
        } else if (ramUsagePercent < 70) {
          ramEfficiency = 3;
        } else if (ramUsagePercent < 90) {
          ramEfficiency = 1;
        } else {
          ramEfficiency = 0;
        }
        
        // Uptime Reliability (5 points): Longer uptime = more reliable
        // >7 days = 5 points, 3-7 days = 3 points, 1-3 days = 2 points, <1 day = 1 point
        const uptimeSeconds = stats.stats?.uptime || 0;
        const uptimeDays = uptimeSeconds / 86400;
        if (uptimeDays > 7) {
          uptimeReliability = 5;
        } else if (uptimeDays > 3) {
          uptimeReliability = 3;
        } else if (uptimeDays > 1) {
          uptimeReliability = 2;
        } else {
          uptimeReliability = 1;
        }
        
        // Network Activity (5 points): Active streams + packet throughput
        // High activity = 5 points, medium = 3 points, low = 1 point
        const activeStreams = stats.stats?.active_streams || 0;
        const totalPackets = (stats.stats?.packets_received || 0) + (stats.stats?.packets_sent || 0);
        if (activeStreams >= 5 || totalPackets > 10000000) {
          networkActivity = 5;
        } else if (activeStreams >= 2 || totalPackets > 1000000) {
          networkActivity = 3;
        } else {
          networkActivity = 1;
        }
        
        performanceScore = cpuEfficiency + ramEfficiency + uptimeReliability + networkActivity;
      }
    }
    
    // Total Score (now out of 120 instead of 100)
    const score = Math.round(versionScore + geoScore + stabilityScore + rpcBonus + performanceScore);
    
    return {
      ...node,
      rank: 0, // Will be assigned after sorting
      score,
      versionScore,
      geoScore,
      stabilityScore,
      rpcAccessible,
      rpcBonus,
      performanceScore,
      cpuEfficiency,
      ramEfficiency,
      uptimeReliability,
      networkActivity,
    };
  });
  
  // Sort by score (descending) and assign ranks
  rankedNodes.sort((a, b) => b.score - a.score);
  rankedNodes.forEach((node, index) => {
    node.rank = index + 1;
  });
  
  return rankedNodes;
}

/**
 * Get score badge color based on score value
 */
export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return "text-green-400 bg-green-400/10 border-green-400/20";
  if (score >= 60) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
  if (score >= 40) return "text-orange-400 bg-orange-400/10 border-orange-400/20";
  return "text-red-400 bg-red-400/10 border-red-400/20";
}

/**
 * Get rank badge color based on rank position
 */
export function getRankBadgeColor(rank: number): string {
  if (rank === 1) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"; // Gold
  if (rank === 2) return "text-gray-300 bg-gray-300/10 border-gray-300/20"; // Silver
  if (rank === 3) return "text-orange-400 bg-orange-400/10 border-orange-400/20"; // Bronze
  if (rank <= 10) return "text-blue-400 bg-blue-400/10 border-blue-400/20"; // Top 10
  return "text-muted-foreground bg-muted/10 border-border";
}
