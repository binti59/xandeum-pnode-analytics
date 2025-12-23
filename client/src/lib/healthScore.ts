import { Pod } from "@/services/prpc";

export interface HealthMetrics {
  availabilityScore: number; // 0-100
  versionHealthScore: number; // 0-100
  distributionScore: number; // 0-100
  overallScore: number; // 0-100
  totalNodes: number;
  onlineNodes: number;
  uniqueCountries: number;
  atRiskNodes: number;
  versionDistribution: Record<string, number>;
  latestVersion: string;
}

/**
 * Calculate network health metrics from pNodes data
 * Inspired by Xandeum Lattice scoring system
 */
export function calculateHealthMetrics(nodes: Pod[]): HealthMetrics {
  const totalNodes = nodes.length;
  const onlineNodes = nodes.length; // All returned nodes are considered online
  
  // Availability Score (40% weight)
  // 100% if all nodes are online
  const availabilityScore = totalNodes > 0 ? (onlineNodes / totalNodes) * 100 : 0;
  
  // Version Health Score (35% weight)
  // Higher score if more nodes are on version 0.8.0 (current stable)
  const versionCounts: Record<string, number> = {};
  nodes.forEach(node => {
    versionCounts[node.version] = (versionCounts[node.version] || 0) + 1;
  });
  
  // Use 0.8.0 as the current stable version
  const latestVersion = "0.8.0";
  const nodesOnLatest = versionCounts[latestVersion] || 0;
  const versionHealthScore = totalNodes > 0 ? (nodesOnLatest / totalNodes) * 100 : 0;
  
  // Distribution Score (25% weight)
  // Higher score if nodes are spread across more countries
  const countries = new Set(nodes.map(n => n.geo?.country).filter(Boolean));
  const uniqueCountries = countries.size;
  
  // Ideal distribution: 1 node per country (max 10 countries for 100%)
  const idealCountries = 10;
  const distributionScore = Math.min((uniqueCountries / idealCountries) * 100, 100);
  
  // Overall Health Score
  // Formula: (Availability × 40%) + (Version Health × 35%) + (Distribution × 25%)
  const overallScore = Math.round(
    (availabilityScore * 0.4) + 
    (versionHealthScore * 0.35) + 
    (distributionScore * 0.25)
  );
  
  // At-Risk Nodes
  // Nodes not on latest version or with missing geo data
  const atRiskNodes = nodes.filter(n => 
    n.version !== latestVersion || !n.geo
  ).length;
  
  return {
    availabilityScore: Math.round(availabilityScore),
    versionHealthScore: Math.round(versionHealthScore),
    distributionScore: Math.round(distributionScore),
    overallScore,
    totalNodes,
    onlineNodes,
    uniqueCountries,
    atRiskNodes,
    versionDistribution: versionCounts,
    latestVersion,
  };
}

/**
 * Get health status color based on score
 */
export function getHealthColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

/**
 * Get health status label
 */
export function getHealthLabel(score: number): string {
  if (score >= 80) return "Healthy";
  if (score >= 60) return "Warning";
  return "Critical";
}
