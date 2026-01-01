import { RankedNode } from "./nodeRanking";

export type BadgeType =
  | "stable_champion"
  | "latest_version"
  | "geographic_pioneer"
  | "uptime_hero";

export interface Badge {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const BADGE_DEFINITIONS: Record<BadgeType, Omit<Badge, "type">> = {
  stable_champion: {
    name: "Stable Champion",
    description: "Maintained top 10 ranking for 7+ consecutive days",
    icon: "🏆",
    color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  },
  latest_version: {
    name: "Latest Version",
    description: "Running the most recent pNode software version",
    icon: "⚡",
    color: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  },
  geographic_pioneer: {
    name: "Geographic Pioneer",
    description: "Only pNode in this country, expanding network reach",
    icon: "🌍",
    color: "text-green-400 bg-green-400/10 border-green-400/30",
  },
  uptime_hero: {
    name: "Uptime Hero",
    description: "99.9%+ uptime over the past 30 days",
    icon: "💪",
    color: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  },
};

/**
 * Determine which badges a node should earn based on current data
 */
export function calculateEarnedBadges(
  node: RankedNode,
  allNodes: RankedNode[],
  historicalRanks?: { rank: number; date: Date }[]
): BadgeType[] {
  const badges: BadgeType[] = [];

  // Latest Version badge (1.2.0 is current stable)
  if (node.version === "1.2.0") {
    badges.push("latest_version");
  }

  // Geographic Pioneer badge
  const nodesInCountry = allNodes.filter(
    (n) => n.geo?.country === node.geo?.country
  );
  if (nodesInCountry.length === 1 && node.geo?.country) {
    badges.push("geographic_pioneer");
  }

  // Stable Champion badge (requires historical data)
  if (historicalRanks && historicalRanks.length >= 7) {
    const allTop10 = historicalRanks.every((h) => h.rank <= 10);
    if (allTop10) {
      badges.push("stable_champion");
    }
  }

  // Uptime Hero badge (will be available when uptime API is ready)
  // if (node.uptime && node.uptime > 0.999) {
  //   badges.push("uptime_hero");
  // }

  return badges;
}

/**
 * Get badge details by type
 */
export function getBadgeDetails(type: BadgeType): Badge {
  return {
    type,
    ...BADGE_DEFINITIONS[type],
  };
}

/**
 * Get all badges for a node
 */
export function getNodeBadges(
  node: RankedNode,
  allNodes: RankedNode[],
  historicalRanks?: { rank: number; date: Date }[]
): Badge[] {
  const earnedTypes = calculateEarnedBadges(node, allNodes, historicalRanks);
  return earnedTypes.map(getBadgeDetails);
}
