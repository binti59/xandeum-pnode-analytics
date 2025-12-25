import { Pod } from "@/services/prpc";
import { motion, AnimatePresence } from "framer-motion";
import { statsCache } from "@/lib/statsCache";
import { addPerformanceSnapshot } from "@/lib/performanceHistory";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronDown, ChevronUp, RefreshCw, Database, Star } from "lucide-react";
import { isInWatchlist, toggleWatchlist } from "@/lib/watchlist";
import { StatusIndicator } from "@/components/StatusIndicator";

interface NodeCardProps {
  node: Pod;
}

export function NodeCard({ node }: NodeCardProps) {
  const [rpcAccessible, setRpcAccessible] = useState<boolean | undefined>(undefined);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(isInWatchlist(node.address));
  
  useEffect(() => {
    const cached = statsCache.get(node.address);
    if (cached) {
      setRpcAccessible(cached.accessible);
    }
    
    // Load stats from localStorage if available
    const cachedStats = localStorage.getItem(`node_stats_${node.address}`);
    if (cachedStats) {
      try {
        const parsed = JSON.parse(cachedStats);
        // Check if cache is less than 5 minutes old
        if (parsed.timestamp && Date.now() - parsed.timestamp < 5 * 60 * 1000) {
          setStats(parsed.data);
        } else {
          // Clear expired cache
          localStorage.removeItem(`node_stats_${node.address}`);
        }
      } catch (e) {
        console.error('Failed to parse cached stats:', e);
      }
    }
  }, [node.address]);
  
  const handleTestRpc = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setTesting(true);
    setTestResult(null);
    
    try {
      const nodeIP = node.address.split(':')[0];
      const endpoint = `http://${nodeIP}:6000/rpc`;
      
      const response = await fetch("/api/proxy-rpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          method: "get-stats",
          timeout: 10000,
        }),
      });
      
      if (response.ok) {
        const rpcResponse = await response.json();
        
        if (rpcResponse && !rpcResponse.error && rpcResponse.result) {
          setTestResult("✅ RPC Accessible!");
          setRpcAccessible(true);
          statsCache.set(node.address, {} as any, true);
        } else {
          setTestResult("❌ Invalid response");
          setRpcAccessible(false);
        }
      } else {
        const errorText = await response.text();
        setTestResult(`❌ HTTP ${response.status}`);
        setRpcAccessible(false);
      }
    } catch (error: any) {
      setTestResult(`❌ ${error.message}`);
      setRpcAccessible(false);
    } finally {
      setTesting(false);
    }
  };
  
  const handleCardClick = async () => {
    if (!rpcAccessible) {
      // Don't expand for private nodes
      return;
    }
    
    setExpanded(!expanded);
    
    // Fetch stats if expanding and don't have stats yet
    if (!expanded && !stats) {
      setLoadingStats(true);
      try {
        const nodeIP = node.address.split(':')[0];
        const endpoint = `http://${nodeIP}:6000/rpc`;
        
        const response = await fetch("/api/proxy-rpc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            endpoint,
            method: "get-stats",
            timeout: 10000,
          }),
        });
        
        if (response.ok) {
          const rpcResponse = await response.json();
          if (rpcResponse && rpcResponse.result) {
            setStats(rpcResponse.result);
            // Cache stats in localStorage with timestamp
            localStorage.setItem(`node_stats_${node.address}`, JSON.stringify({
              data: rpcResponse.result,
              timestamp: Date.now()
            }));
            
            // Add to performance history
            if (rpcResponse.result.uptime !== undefined) {
              addPerformanceSnapshot(node.address, {
                cpu: rpcResponse.result.cpu_percent || 0,
                ram: rpcResponse.result.ram_used || 0,
                ramTotal: rpcResponse.result.ram_total || 4294967296,
                uptime: rpcResponse.result.uptime || 0,
                activeStreams: rpcResponse.result.active_streams || 0,
                packetsReceived: rpcResponse.result.packets_received || 0,
                packetsSent: rpcResponse.result.packets_sent || 0,
              });
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoadingStats(false);
      }
    }
  };
  
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };
  
  const formatBytes = (bytes: number) => {
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(2)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };
  
  const handleRefreshStats = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card collapse
    setLoadingStats(true);
    try {
      const nodeIP = node.address.split(':')[0];
      const endpoint = `http://${nodeIP}:6000/rpc`;
      
      const response = await fetch("/api/proxy-rpc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint,
          method: "get-stats",
          timeout: 10000,
        }),
      });
      
      if (response.ok) {
        const rpcResponse = await response.json();
        if (rpcResponse && rpcResponse.result) {
          setStats(rpcResponse.result);
          // Update cache
          localStorage.setItem(`node_stats_${node.address}`, JSON.stringify({
            data: rpcResponse.result,
            timestamp: Date.now()
          }));
        }
      }
    } catch (error) {
      console.error("Failed to refresh stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className={`glass-panel p-5 rounded-xl transition-all group ${
        rpcAccessible ? 'cursor-pointer hover:border-primary/50' : 'cursor-default'
      }`}
    >
      {/* Header with Flag and Location */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <StatusIndicator online={true} size="md" />
          {node.geo?.flag && (
            <span className="text-3xl">{node.geo.flag}</span>
          )}
          <div>
            {node.pubkey && (
              <div className="mb-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Public Key</p>
                <h3 className="text-sm font-bold text-primary font-mono break-all">
                  {node.pubkey}
                </h3>
              </div>
            )}
            <div className="mt-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                IP Address
              </p>
              <p className="text-sm font-semibold text-white/80 font-mono">
                {node.address}
              </p>
            </div>
            {node.geo?.city && (
              <p className="text-sm text-muted-foreground mt-1">
                {node.geo.city}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            const newState = toggleWatchlist(node.address);
            setInWatchlist(newState);
          }}
          className="shrink-0"
        >
          <Star className={`h-5 w-5 ${inWatchlist ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
        </Button>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase">online</span>
        </div>
        {rpcAccessible !== undefined && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
            rpcAccessible 
              ? "bg-green-500/20 text-green-400 border-green-500/30" 
              : "bg-gray-500/20 text-gray-400 border-gray-500/30"
          }`}>
            <span className="text-xs">{rpcAccessible ? "🔓" : "🔒"}</span>
            <span className="text-xs font-semibold uppercase">
              {rpcAccessible ? "RPC Open" : "RPC Private"}
            </span>
          </div>
        )}
      </div>

      {/* Version Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Version</span>
          <span className="text-sm text-white font-mono">{node.version}</span>
        </div>
      </div>

      {/* Test RPC Button */}
      <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
        <Button
          onClick={handleTestRpc}
          disabled={testing}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Testing RPC...
            </>
          ) : (
            "🔍 Test RPC Port"
          )}
        </Button>
        {testResult && (
          <p className="text-xs text-center font-medium">
            {testResult}
          </p>
        )}
        {rpcAccessible && (
          <div className="flex items-center justify-center gap-1 text-xs font-medium text-primary/80">
            {expanded ? (
              <><ChevronUp className="h-3 w-3" /> Click to collapse</>
            ) : (
              <><ChevronDown className="h-3 w-3" /> Click to view detailed statistics</>
            )}
          </div>
        )}
      </div>

      {/* Expandable Stats Section */}
      <AnimatePresence>
        {expanded && rpcAccessible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
              {/* Refresh Button */}
              <div className="flex justify-end">
                <Button
                  onClick={handleRefreshStats}
                  disabled={loadingStats}
                  size="sm"
                  variant="ghost"
                  className="text-xs h-7 px-2"
                >
                  {loadingStats ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <><RefreshCw className="h-3 w-3 mr-1" /> Refresh</>
                  )}
                </Button>
              </div>
              {loadingStats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading stats...</span>
                </div>
              ) : stats ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Uptime</span>
                    <p className="text-sm font-mono text-white">{formatUptime(stats.uptime)}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">CPU Usage</span>
                    <p className="text-sm font-mono text-white">{stats.cpu_percent?.toFixed(2)}%</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">RAM Usage</span>
                    <p className="text-sm font-mono text-white">
                      {formatBytes(stats.ram_used)} / {formatBytes(stats.ram_total)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Active Streams</span>
                    <p className="text-sm font-mono text-white">{stats.active_streams}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Packets Received</span>
                    <p className="text-sm font-mono text-white">{stats.packets_received?.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">Packets Sent</span>
                    <p className="text-sm font-mono text-white">{stats.packets_sent?.toLocaleString()}</p>
                  </div>
                  {stats.file_size && (
                    <div className="space-y-1 col-span-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                        <Database className="h-3 w-3" />
                        Storage Size
                      </span>
                      <p className="text-sm font-mono text-white">
                        {formatBytes(stats.file_size)}
                      </p>
                    </div>
                  )}
                  {stats.disk_used && stats.disk_total && (
                    <div className="space-y-1 col-span-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">Disk Usage</span>
                      <p className="text-sm font-mono text-white">
                        {formatBytes(stats.disk_used)} / {formatBytes(stats.disk_total)}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({((stats.disk_used / stats.disk_total) * 100).toFixed(1)}%)
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-center text-muted-foreground py-4">Failed to load stats</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
