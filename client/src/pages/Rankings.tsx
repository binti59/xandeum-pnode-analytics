import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from "@/lib/exportData";
import { exportAccessibleToCSV, exportAccessibleToJSON } from "@/lib/exportRpcAccessible";
import {
  calculateNodeRanking,
  getRankBadgeColor,
  getScoreBadgeColor,
  RankedNode,
} from "@/lib/nodeRanking";
import { trpc } from "@/lib/trpc";
import { Pod } from "@/services/prpc";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileJson,
  Loader2,
  Medal,
  RefreshCw,
  Trophy,
  Zap,
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getNodeBadges } from "@/lib/badges";

const DEFAULT_RPC_ENDPOINT = "http://192.190.136.36:6000/rpc";

type SortColumn = "rank" | "score" | "version" | "location" | "rpc";
type SortDirection = "asc" | "desc";

export default function Rankings() {
  const [nodes, setNodes] = useState<Pod[]>([]);
  const [rankedNodes, setRankedNodes] = useState<RankedNode[]>([]);
  const [sortColumn, setSortColumn] = useState<SortColumn>("rank");
  const [prioritizeRpc, setPrioritizeRpc] = useState<boolean>(true); // Prioritize RPC accessible nodes by default
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filter, setFilter] = useState<"all" | "top10" | "top50" | "rpc_accessible">("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [previousSnapshots, setPreviousSnapshots] = useState<Map<string, { rank: number; score: number }>>(new Map());
  const [nodeBadges, setNodeBadges] = useState<Map<string, any[]>>(new Map());

  const endpoint = localStorage.getItem("xandeum_rpc_endpoint") || DEFAULT_RPC_ENDPOINT;

  const proxyMutation = trpc.proxy.rpc.useMutation({
    onSuccess: (data: any) => {
      if (data.result?.pods) {
        setNodes(data.result.pods);
        setLastUpdated(new Date());
      }
    },
  });

  const fetchData = () => {
    proxyMutation.mutate({
      endpoint,
      method: "get-pods",
      params: [],
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const ranked = calculateNodeRanking(nodes);
    setRankedNodes(ranked);

    // Calculate badges for each node
    const badgesMap = new Map();
    ranked.forEach((node) => {
      const badges = getNodeBadges(node, ranked);
      if (badges.length > 0) {
        badgesMap.set(node.address, badges);
      }
    });
    setNodeBadges(badgesMap);
  }, [nodes]);

  // Fetch previous snapshots for trend comparison
  const snapshotQuery = trpc.rankings.getLatestSnapshots.useQuery(undefined, {
    enabled: rankedNodes.length > 0,
  });

  useEffect(() => {
    if (snapshotQuery.data) {
      const prevMap = new Map();
      snapshotQuery.data.forEach((snapshot: any) => {
        prevMap.set(snapshot.nodeAddress, {
          rank: snapshot.rank,
          score: snapshot.score,
        });
      });
      setPreviousSnapshots(prevMap);
    }
  }, [snapshotQuery.data]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedNodes = [...rankedNodes].sort((a, b) => {
    // First, prioritize RPC accessible nodes if enabled
    if (prioritizeRpc && sortColumn !== "rpc") {
      const aRpc = a.rpcAccessible ? 1 : 0;
      const bRpc = b.rpcAccessible ? 1 : 0;
      if (aRpc !== bRpc) {
        return bRpc - aRpc; // RPC accessible nodes come first
      }
    }
    
    let aVal: any;
    let bVal: any;

    switch (sortColumn) {
      case "rank":
        aVal = a.rank;
        bVal = b.rank;
        break;
      case "score":
        aVal = a.score;
        bVal = b.score;
        break;
      case "version":
        aVal = a.version || "";
        bVal = b.version || "";
        break;
      case "location":
        aVal = a.geo?.country || "Unknown";
        bVal = b.geo?.country || "Unknown";
        break;
      case "rpc":
        aVal = a.rpcAccessible ? 1 : 0;
        bVal = b.rpcAccessible ? 1 : 0;
        break;
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const filteredNodes =
    filter === "top10"
      ? sortedNodes.slice(0, 10)
      : filter === "top50"
      ? sortedNodes.slice(0, 50)
      : filter === "rpc_accessible"
      ? sortedNodes.filter(node => node.rpcAccessible === true)
      : sortedNodes;

  const loading = proxyMutation.isPending;

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="min-h-screen text-foreground selection:bg-primary/30">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="container py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl"
        >
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow-400 fill-yellow-400/20" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  pNode Rankings
                </span>
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Ranked by version, geographic diversity, stability, RPC accessibility, and real-time performance metrics
              </p>
              <div className="flex items-center gap-3 mt-3">
              <Link href="/history">
                <Button variant="outline" size="sm">
                  <Trophy className="h-4 w-4 mr-2" />
                  History
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/performance">
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Performance
                </Button>
              </Link>
              <Link href="/rankings">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Rankings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden lg:inline-block font-mono glass-input px-3 py-1.5 rounded-lg border border-white/10">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <Button
              onClick={fetchData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="glass-input hover:bg-white/10 border-white/10 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Filters and Export */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-4 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <div className="flex gap-2 flex-wrap">
              {(["all", "top10", "top50", "rpc_accessible"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "glass-input hover:bg-white/10 border-white/10 text-white"
                  }
                >
                  {f === "all" ? "All" : f === "top10" ? "Top 10" : f === "top50" ? "Top 50" : "🔓 RPC Accessible"}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Export:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToCSV(filteredNodes)}
              className="glass-input hover:bg-white/10 border-white/10 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToJSON(filteredNodes)}
              className="glass-input hover:bg-white/10 border-white/10 text-white"
            >
              <FileJson className="h-4 w-4 mr-2" />
              JSON
            </Button>
            <div className="h-6 w-px bg-border mx-1" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportAccessibleToCSV(nodes)}
              className="glass-input hover:bg-primary/20 border-primary/30 text-primary"
              title="Export only RPC-accessible nodes"
            >
              <Download className="h-4 w-4 mr-2" />
              🔓 CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportAccessibleToJSON(nodes)}
              className="glass-input hover:bg-primary/20 border-primary/30 text-primary"
              title="Export only RPC-accessible nodes"
            >
              <FileJson className="h-4 w-4 mr-2" />
              🔓 JSON
            </Button>
          </div>
        </motion.div>

        {/* Rankings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("rank")}
                  >
                    <div className="flex items-center gap-2">
                      Rank
                      <SortIcon column="rank" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Node
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("location")}
                  >
                    <div className="flex items-center gap-2">
                      Location
                      <SortIcon column="location" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("version")}
                  >
                    <div className="flex items-center gap-2">
                      Version
                      <SortIcon column="version" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("score")}
                  >
                    <div className="flex items-center gap-2">
                      Score
                      <SortIcon column="score" />
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => handleSort("rpc")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <SortIcon column="rpc" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredNodes.map((node, index) => (
                  <motion.tr
                    key={node.address}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-mono text-sm ${getRankBadgeColor(
                            node.rank
                          )}`}
                        >
                          {node.rank <= 3 && <Medal className="h-4 w-4" />}
                          #{node.rank}
                        </div>
                        {(() => {
                          const prev = previousSnapshots.get(node.address);
                          if (!prev) return null;
                          const rankDiff = prev.rank - node.rank;
                          if (rankDiff > 0) {
                            return (
                              <div className="flex items-center gap-1 text-green-400 text-xs">
                                <TrendingUp className="h-3 w-3" />
                                <span>+{rankDiff}</span>
                              </div>
                            );
                          } else if (rankDiff < 0) {
                            return (
                              <div className="flex items-center gap-1 text-red-400 text-xs">
                                <TrendingDown className="h-3 w-3" />
                                <span>{rankDiff}</span>
                              </div>
                            );
                          } else {
                            return (
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <Minus className="h-3 w-3" />
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-white">
                        {node.address}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 font-mono">
                        {node.pubkey?.substring(0, 16)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{node.geo?.flag || "🌍"}</span>
                        <div>
                          <div className="text-sm text-white">
                            {node.geo?.city || "Unknown"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {node.geo?.country || "Unknown"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-white">
                        {node.version || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-bold text-sm ${getScoreBadgeColor(
                              node.score
                            )}`}
                            title={`Total: ${node.score} | Version: ${node.versionScore} | Geo: ${Math.round(node.geoScore)} | Stability: ${node.stabilityScore} | RPC: ${node.rpcBonus}${node.performanceScore > 0 ? ` | Performance: ${node.performanceScore}` : ''}`}
                          >
                            {node.score}
                          </div>
                          {(() => {
                            const prev = previousSnapshots.get(node.address);
                            if (!prev) return null;
                            const scoreDiff = node.score - prev.score;
                            if (scoreDiff > 0) {
                              return (
                                <div className="flex items-center gap-1 text-green-400 text-xs">
                                  <TrendingUp className="h-3 w-3" />
                                  <span>+{scoreDiff}</span>
                                </div>
                              );
                            } else if (scoreDiff < 0) {
                              return (
                                <div className="flex items-center gap-1 text-red-400 text-xs">
                                  <TrendingDown className="h-3 w-3" />
                                  <span>{scoreDiff}</span>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                        {nodeBadges.get(node.address) && (
                          <div className="flex gap-1 flex-wrap">
                            {nodeBadges.get(node.address)!.map((badge: any) => (
                              <div
                                key={badge.type}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs ${badge.color}`}
                                title={badge.description}
                              >
                                <span>{badge.icon}</span>
                                <span className="hidden lg:inline">{badge.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {node.performanceScore > 0 && (
                          <div className="text-xs text-muted-foreground space-y-0.5">
                            <div className="font-semibold text-primary">Performance:</div>
                            {node.cpuEfficiency !== undefined && (
                              <div>CPU: {node.cpuEfficiency}/5</div>
                            )}
                            {node.ramEfficiency !== undefined && (
                              <div>RAM: {node.ramEfficiency}/5</div>
                            )}
                            {node.uptimeReliability !== undefined && (
                              <div>Uptime: {node.uptimeReliability}/5</div>
                            )}
                            {node.networkActivity !== undefined && (
                              <div>Network: {node.networkActivity}/5</div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-sm text-green-400">Online</span>
                        </div>
                        {node.rpcAccessible !== undefined && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs">
                              {node.rpcAccessible ? "🔓" : "🔒"}
                            </span>
                            <span className={`text-xs ${node.rpcAccessible ? "text-green-400" : "text-gray-400"}`}>
                              {node.rpcAccessible ? "RPC Open" : "RPC Private"}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-400" />
              <div>
                <div className="text-sm text-muted-foreground">Top Score</div>
                <div className="text-2xl font-bold text-white">
                  {rankedNodes[0]?.score || 0}
                </div>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Average Score</div>
                <div className="text-2xl font-bold text-white">
                  {Math.round(
                    rankedNodes.reduce((sum, n) => sum + n.score, 0) /
                      rankedNodes.length || 0
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center gap-3">
              <Medal className="h-8 w-8 text-orange-400" />
              <div>
                <div className="text-sm text-muted-foreground">Total Nodes</div>
                <div className="text-2xl font-bold text-white">
                  {rankedNodes.length}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
