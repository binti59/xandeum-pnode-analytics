import { Card } from "@/components/ui/card";
import { statsCache } from "@/lib/statsCache";
import { Pod } from "@/services/prpc";
import { motion } from "framer-motion";
import { Lock, Unlock, Trophy, RefreshCw } from "lucide-react";
import { useMemo } from "react";

interface RpcStatsPanelProps {
  nodes: Pod[];
  scanProgress?: {
    total: number;
    scanned: number;
    accessible: number;
    isScanning: boolean;
  } | null;
  onRefresh?: () => void;
}

interface RankedNode {
  node: Pod;
  score: number;
  rank: number;
}

export function RpcStatsPanel({ nodes, scanProgress, onRefresh }: RpcStatsPanelProps) {
  const accessibleNodes = useMemo(() => {
    return nodes.filter((node) => {
      const cached = statsCache.get(node.address);
      return cached?.accessible === true;
    });
  }, [nodes]);

  const topAccessibleNodes = useMemo((): RankedNode[] => {
    // Calculate scores for accessible nodes
    const rankedNodes = accessibleNodes.map((node) => {
      // Simple scoring based on version and location
      let score = 50; // Base score

      // Version scoring
      if (node.version === "1.0.0") {
        score += 30;
      } else if (node.version?.startsWith("0.8.0")) {
        score += 20;
      } else if (node.version?.startsWith("0.7")) {
        score += 10;
      }

      // Geographic diversity bonus
      if (node.geo?.city) {
        score += 10;
      }

      // RPC accessibility bonus
      score += 10;

      return { node, score, rank: 0 };
    });

    // Sort by score and assign ranks
    rankedNodes.sort((a, b) => b.score - a.score);
    rankedNodes.forEach((item, index) => {
      item.rank = index + 1;
    });

    return rankedNodes.slice(0, 5); // Top 5
  }, [accessibleNodes]);

  const accessibleCount = accessibleNodes.length;
  const totalCount = nodes.length;
  const accessiblePercentage =
    totalCount > 0 ? ((accessibleCount / totalCount) * 100).toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Unlock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">RPC Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                Nodes with open RPC ports
              </p>
            </div>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={scanProgress?.isScanning}
              className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Re-scan all nodes for RPC accessibility"
            >
              <RefreshCw
                className={`w-4 h-4 text-primary ${
                  scanProgress?.isScanning ? "animate-spin" : ""
                }`}
              />
            </button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="text-3xl font-bold text-primary">
              {accessibleCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Accessible</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="text-3xl font-bold text-muted-foreground">
              {totalCount - accessibleCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Private</div>
          </div>

          <div className="text-center p-4 rounded-lg bg-card/50 border border-border/50">
            <div className="text-3xl font-bold text-primary">
              {accessiblePercentage}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">Open Rate</div>
          </div>
        </div>

        {/* Scan Progress */}
        {scanProgress?.isScanning && (
          <div className="mb-6 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Scanning network...</span>
              <span className="text-primary font-medium">
                {scanProgress.scanned} / {scanProgress.total}
              </span>
            </div>
            <div className="w-full bg-card/50 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(scanProgress.scanned / scanProgress.total) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Top Accessible Nodes */}
        {topAccessibleNodes.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Top Accessible Nodes
            </h4>
            <div className="space-y-2">
              {topAccessibleNodes.map((item, index) => (
                <motion.div
                  key={item.node.address}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-muted-foreground w-6">
                      #{item.rank}
                    </div>
                    <div>
                      <div className="text-sm font-medium flex items-center gap-2">
                        {item.node.geo?.flag && (
                          <span className="text-base">{item.node.geo.flag}</span>
                        )}
                        {item.node.address.split(":")[0]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.node.geo?.city || "Unknown"} •{" "}
                        {item.node.version || "Unknown"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">
                        {item.score}
                      </div>
                      <div className="text-xs text-muted-foreground">score</div>
                    </div>
                    <Unlock className="w-4 h-4 text-green-500" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {topAccessibleNodes.length === 0 && !scanProgress?.isScanning && (
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              No accessible nodes found yet.
              <br />
              Click nodes to test RPC accessibility.
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
