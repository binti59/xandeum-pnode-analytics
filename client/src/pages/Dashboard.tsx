import { ConnectionSettings } from "@/components/ConnectionSettings";
import { FilterBar } from "@/components/FilterBar";
import { GlobalDistributionMap } from "@/components/GlobalDistributionMap";
import { HealthScoreCircle } from "@/components/HealthScoreCircle";
import { InsightsPanel } from "@/components/InsightsPanel";
import { NetworkHealthTimeline } from "@/components/NetworkHealthTimeline";
import { NodeCard } from "@/components/NodeCard";
import { NodeDetailsDrawer } from "@/components/NodeDetailsDrawer";
import { StatsCards } from "@/components/StatsCards";
import { VersionDistributionChart } from "@/components/VersionDistributionChart";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from "@/lib/exportData";
import { calculateHealthMetrics } from "@/lib/healthScore";
import { trpc } from "@/lib/trpc";
import { Pod } from "@/services/prpc";
import { motion } from "framer-motion";
import { AlertTriangle, Download, FileJson, Loader2, RefreshCw, Zap, Clock, Play, Pause, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

// Default to public node
const DEFAULT_RPC_ENDPOINT = "http://192.190.136.36:6000/rpc";

type FilterType = "all" | "online" | "offline";

export default function Dashboard() {
  const [nodes, setNodes] = useState<Pod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedNode, setSelectedNode] = useState<Pod | null>(null);
  
  const [endpoint, setEndpoint] = useState<string>(() => {
    return localStorage.getItem("xandeum_rpc_endpoint") || DEFAULT_RPC_ENDPOINT;
  });
  
  const [statsEndpoint, setStatsEndpoint] = useState<string>(() => {
    return localStorage.getItem("xandeum_stats_endpoint") || "";
  });
  
  const [useCustomStats, setUseCustomStats] = useState<boolean>(() => {
    return localStorage.getItem("xandeum_use_custom_stats") === "true";
  });
  
  const [autoRefresh, setAutoRefresh] = useState<boolean>(() => {
    return localStorage.getItem("xandeum_auto_refresh") !== "false"; // Default to true
  });
  
  const [refreshInterval, setRefreshInterval] = useState<number>(() => {
    return parseInt(localStorage.getItem("xandeum_refresh_interval") || "60");
  });
  
  const [countdown, setCountdown] = useState<number>(refreshInterval);

  // Use tRPC mutation for proxy requests
  const proxyMutation = trpc.proxy.rpc.useMutation({
    onSuccess: (data: any) => {
      if (data.result && data.result.pods) {
        setNodes(data.result.pods);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError("Invalid response format from RPC");
      }
    },
    onError: (err: any) => {
      console.error("Proxy error:", err);
      setError(`Failed to fetch pNode data: ${err.message}`);
    },
  });

  const handleEndpointChange = (newEndpoint: string, newStatsEndpoint?: string, newUseCustomStats?: boolean) => {
    setEndpoint(newEndpoint);
    localStorage.setItem("xandeum_rpc_endpoint", newEndpoint);
    
    if (newStatsEndpoint !== undefined) {
      setStatsEndpoint(newStatsEndpoint);
      localStorage.setItem("xandeum_stats_endpoint", newStatsEndpoint);
    }
    
    if (newUseCustomStats !== undefined) {
      setUseCustomStats(newUseCustomStats);
      localStorage.setItem("xandeum_use_custom_stats", String(newUseCustomStats));
    }
    
    fetchData(newEndpoint);
  };

  const fetchData = (rpcUrl: string = endpoint) => {
    proxyMutation.mutate({
      endpoint: rpcUrl,
      method: "get-pods",
      params: [],
    });
  };

  useEffect(() => {
    fetchData();
    
    if (!autoRefresh) return;
    
    // Reset countdown when interval changes
    setCountdown(refreshInterval);
    
    const interval = setInterval(() => {
      fetchData();
      setCountdown(refreshInterval);
    }, refreshInterval * 1000);
    
    const countdownTimer = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => {
      clearInterval(interval);
      clearInterval(countdownTimer);
    };
  }, [endpoint, autoRefresh, refreshInterval]);
  
  const handleAutoRefreshToggle = (enabled: boolean) => {
    setAutoRefresh(enabled);
    localStorage.setItem("xandeum_auto_refresh", String(enabled));
    if (enabled) {
      setCountdown(refreshInterval);
    }
  };
  
  const handleIntervalChange = (seconds: number) => {
    setRefreshInterval(seconds);
    localStorage.setItem("xandeum_refresh_interval", String(seconds));
    setCountdown(seconds);
  };

  // Calculate health metrics
  const healthMetrics = calculateHealthMetrics(nodes);

  // Filter nodes based on search query and active filter
  const filteredNodes = nodes.filter(node => {
    // Search filter
    const matchesSearch = 
      node.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.pubkey && node.pubkey.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (node.geo?.city && node.geo.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (node.geo?.country && node.geo.country.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (!matchesSearch) return false;

    // Status filter
    if (activeFilter === "online") return true; // All nodes are online
    if (activeFilter === "offline") return false; // No offline nodes in current data
    return true; // "all"
  });

  const loading = proxyMutation.isPending;

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
                <Zap className="h-8 w-8 text-primary fill-primary/20" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  Xandeum Analytics
                </span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Real-time pNode discovery & gossip monitoring
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/rankings">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Rankings
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Auto-refresh controls */}
            <div className="flex items-center gap-2 glass-input px-3 py-1.5 rounded-lg border border-white/10">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 hover:bg-white/10"
                onClick={() => handleAutoRefreshToggle(!autoRefresh)}
                title={autoRefresh ? "Pause auto-refresh" : "Resume auto-refresh"}
              >
                {autoRefresh ? (
                  <Pause className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </Button>
              <select
                value={refreshInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="bg-transparent text-xs text-white border-none outline-none cursor-pointer font-mono"
                disabled={!autoRefresh}
              >
                <option value="30" className="bg-background">30s</option>
                <option value="60" className="bg-background">1m</option>
                <option value="120" className="bg-background">2m</option>
                <option value="300" className="bg-background">5m</option>
              </select>
              {autoRefresh && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{countdown}s</span>
                </div>
              )}
            </div>
            
            {lastUpdated && (
              <span className="text-xs text-muted-foreground hidden lg:inline-block font-mono glass-input px-3 py-1.5 rounded-lg border border-white/10">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <ConnectionSettings 
              currentEndpoint={endpoint}
              currentStatsEndpoint={statsEndpoint}
              useCustomStats={useCustomStats}
              onSave={handleEndpointChange} 
            />
            <Button 
              onClick={() => fetchData()} 
              disabled={loading}
              variant="outline"
              size="sm"
              className="glass-input hover:bg-white/10 border-white/10 text-white"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4 text-primary" />
              )}
              Refresh
            </Button>
          </div>
        </motion.div>

        {error ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel border-destructive/50 bg-destructive/10 p-6 text-destructive rounded-xl"
          >
            <h3 className="font-bold uppercase tracking-tight flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Connection Error
            </h3>
            
            <p className="mt-2 text-destructive-foreground/90 font-medium">{error}</p>

            <div className="mt-6 flex gap-4">
              <Button 
                variant="outline" 
                className="border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
                onClick={() => fetchData()}
              >
                Retry Connection
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Health Score & Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <HealthScoreCircle
                  score={healthMetrics.overallScore}
                  availabilityScore={healthMetrics.availabilityScore}
                  versionHealthScore={healthMetrics.versionHealthScore}
                  distributionScore={healthMetrics.distributionScore}
                />
              </div>
              <div className="lg:col-span-2 flex flex-col gap-6">
                <StatsCards
                  totalNodes={healthMetrics.totalNodes}
                  onlineNodes={healthMetrics.onlineNodes}
                  uniqueCountries={healthMetrics.uniqueCountries}
                  atRiskNodes={healthMetrics.atRiskNodes}
                />
                <VersionDistributionChart
                  versionDistribution={healthMetrics.versionDistribution}
                  latestVersion={healthMetrics.latestVersion}
                />
              </div>
            </div>

            {/* Network Health Timeline */}
            <NetworkHealthTimeline currentScore={healthMetrics.overallScore} />

            {/* Insights & Global Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InsightsPanel metrics={healthMetrics} />
              <GlobalDistributionMap 
                nodes={nodes} 
                onNodeClick={(node) => setSelectedNode(node)} 
              />
            </div>

            {/* Filter Bar with Export Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <FilterBar 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  totalCount={nodes.length}
                  onlineCount={healthMetrics.onlineNodes}
                  publicCount={nodes.filter(n => n.is_public).length}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(nodes)}
                  className="glass-input hover:bg-white/10 border-white/10 text-white"
                >
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToJSON(nodes)}
                  className="glass-input hover:bg-white/10 border-white/10 text-white"
                >
                  <FileJson className="mr-2 h-4 w-4" />
                  JSON
                </Button>
              </div>
            </div>

            {/* Node Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNodes.map((node, index) => (
                <div key={node.address + index} onClick={() => setSelectedNode(node)}>
                  <NodeCard node={node} />
                </div>
              ))}
            </div>
            
            {filteredNodes.length === 0 && !loading && (
              <div className="text-center py-20 text-muted-foreground">
                No pNodes found matching your search.
              </div>
            )}
          </>
        )}
      </div>

      {/* Node Details Drawer */}
      <NodeDetailsDrawer 
        node={selectedNode} 
        onClose={() => setSelectedNode(null)}
        statsEndpoint={statsEndpoint}
        useCustomStats={useCustomStats} 
      />
    </div>
  );
}
