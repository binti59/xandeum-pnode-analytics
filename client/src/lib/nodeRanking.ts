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
}

/**
 * Calculate node ranking score based on available metrics
 * Score range: 0-100
 */
export function calculateNodeRanking(nodes: Pod[]): RankedNode[] {
  const LATEST_VERSION = "1.0.0";
  const CURRENT_TIME = Date.now() / 1000;
  
  // Count nodes per country for geographic diversity scoring
  const countryCount = new Map<string, number>();
  nodes.forEach(node => {
    const country = node.geo?.country || "Unknown";
    countryCount.set(country, (countryCount.get(country) || 0) + 1);
  });
  
  const rankedNodes: RankedNode[] = nodes.map(node => {
    // Version Score (40 points)
    // Latest version (1.0.0) = 40 points
    // 0.8.0 = 30 points
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
    
    // Total Score
    const score = Math.round(versionScore + geoScore + stabilityScore + rpcBonus);
    
    return {
      ...node,
      rank: 0, // Will be assigned after sorting
      score,
      versionScore,
      geoScore,
      stabilityScore,
      rpcAccessible,
      rpcBonus,
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
