import { Button } from "@/components/ui/button";
import { Pod, NodeStats, formatUptime, formatStorage, formatRAM } from "@/services/prpc";
import { Copy, X, Loader2, AlertCircle, RefreshCw, Lock, Unlock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { statsCache } from "@/lib/statsCache";
import { trpc } from "@/lib/trpc";

interface NodeDetailsDrawerProps {
  node: Pod | null;
  onClose: () => void;
}

export function NodeDetailsDrawer({ node, onClose }: NodeDetailsDrawerProps) {
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rpcAccessible, setRpcAccessible] = useState<boolean | null>(null);

  const fetchNodeStats = async (forceRefresh = false) => {
    if (!node) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = statsCache.get(node.address);
        if (cached) {
          setStats(cached.stats);
          setRpcAccessible(cached.accessible);
          setLoading(false);
          return;
        }
      }

      // Extract IP from address (format: "IP:PORT")
      const ip = node.address.split(":")[0];
      const endpoint = `http://${ip}:6000/rpc`;

      // Attempt to fetch stats directly from the node with 5-second timeout
      const utils = trpc.useUtils();
      const response = await utils.client.proxy.rpc.mutate({
        endpoint,
        method: "get-stats",
        timeout: 5000,
      });

      if (response.result) {
        const nodeStats = response.result as NodeStats;
        setStats(nodeStats);
        setRpcAccessible(true);
        statsCache.set(node.address, nodeStats, true);
      } else {
        throw new Error("No result in response");
      }
    } catch (err: any) {
      console.error("Failed to fetch node stats:", err);
      
      // Check if it's a timeout or network error
      if (err.message?.includes("timeout") || err.message?.includes("Network Error")) {
        setError("RPC port private or unreachable");
        setRpcAccessible(false);
        statsCache.setInaccessible(node.address);
      } else {
        setError("Failed to load node statistics");
        setRpcAccessible(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!node) {
      setStats(null);
      setError(null);
      setRpcAccessible(null);
      return;
    }

    fetchNodeStats();
  }, [node]);

  if (!node) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const DetailRow = ({ label, value, copyable = false }: { label: string; value: string; copyable?: boolean }) => (
    <div className="flex items-start justify-between py-3 border-b border-white/5">
      <span className="text-sm text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-white font-mono text-right max-w-xs truncate">{value}</span>
        {copyable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-primary"
            onClick={() => copyToClipboard(value, label)}
          >
            <Copy className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-background border-l border-white/10 z-50 overflow-y-auto"
          >
            <div className="glass-panel h-full">
              {/* Header */}
              <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-white/10 p-6 z-10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {node.geo?.flag && (
                        <span className="text-2xl">{node.geo.flag}</span>
                      )}
                      <h2 className="text-xl font-bold text-white font-mono break-all">
                        {node.address}
                      </h2>
                    </div>
                    {node.geo?.city && (
                      <p className="text-muted-foreground">
                        {node.geo.city}, {node.geo.country}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-muted-foreground hover:text-white flex-shrink-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Status Badges */}
                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold">Online</span>
                  </div>
                  
                  {rpcAccessible !== null && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
                      rpcAccessible 
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                      {rpcAccessible ? (
                        <Unlock className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      <span className="text-sm font-semibold">
                        {rpcAccessible ? "RPC Accessible" : "RPC Private"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Querying node RPC endpoint...</p>
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <AlertCircle className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-lg font-semibold text-white mb-2">{error}</p>
                      <p className="text-sm text-muted-foreground max-w-sm">
                        This node's RPC port (6000) is not publicly accessible. Most nodes keep this port private for security.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchNodeStats(true)}
                      className="glass-input hover:bg-white/10 border-white/10 text-white gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </Button>
                  </div>
                )}

                {!loading && !error && stats && stats.stats && (
                  <>
                    {/* Success Banner */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-3">
                        <Unlock className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-green-300 font-semibold mb-1">
                            RPC Port Accessible
                          </p>
                          <p className="text-xs text-green-300/80">
                            This node has its RPC port (6000) publicly accessible. Stats shown below are queried directly from this node in real-time.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Refresh Button */}
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchNodeStats(true)}
                        disabled={loading}
                        className="glass-input hover:bg-white/10 border-white/10 text-white gap-2"
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh Stats
                      </Button>
                    </div>

                    {/* Identity Section */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Identity</h3>
                      <div className="space-y-0">
                        <DetailRow label="Node ID" value={node.pubkey || "N/A"} copyable />
                        <DetailRow label="Gossip" value={node.address} copyable />
                        <DetailRow label="RPC" value={`${node.address.split(":")[0]}:6000`} copyable />
                      </div>
                    </div>

                    {/* Software Section */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Software</h3>
                      <div className="space-y-0">
                        <DetailRow label="Version" value={node.version} />
                        <DetailRow label="Last Seen" value={node.last_seen} />
                      </div>
                    </div>

                    {/* Performance Section */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Performance</h3>
                      <div className="space-y-0">
                        <DetailRow label="Uptime" value={formatUptime(stats.stats.uptime)} />
                        <DetailRow label="CPU Usage" value={`${stats.stats.cpu_percent.toFixed(2)}%`} />
                        <DetailRow 
                          label="RAM Usage" 
                          value={`${formatRAM(stats.stats.ram_used)} / ${formatRAM(stats.stats.ram_total)} (${((stats.stats.ram_used / stats.stats.ram_total) * 100).toFixed(1)}%)`} 
                        />
                        <DetailRow label="Storage" value={formatStorage(stats.file_size)} />
                      </div>
                    </div>

                    {/* Network Section */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Network</h3>
                      <div className="space-y-0">
                        <DetailRow label="Active Streams" value={stats.stats.active_streams.toString()} />
                        <DetailRow label="Packets Received" value={stats.stats.packets_received.toLocaleString()} />
                        <DetailRow label="Packets Sent" value={stats.stats.packets_sent.toLocaleString()} />
                      </div>
                    </div>

                    {/* Storage Details */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Storage Details</h3>
                      <div className="space-y-0">
                        <DetailRow label="Total Bytes" value={stats.metadata.total_bytes.toLocaleString()} />
                        <DetailRow label="Total Pages" value={stats.metadata.total_pages.toLocaleString()} />
                        {stats.metadata.current_index !== undefined && (
                          <DetailRow label="Current Index" value={stats.metadata.current_index.toString()} />
                        )}
                        <DetailRow 
                          label="Last Updated" 
                          value={new Date(stats.metadata.last_updated * 1000).toLocaleString()} 
                        />
                      </div>
                    </div>

                    {/* Raw Data Section */}
                    <div>
                      <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Raw Data</h3>
                      <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-muted-foreground overflow-x-auto">
                        <pre>{JSON.stringify({ node, stats }, null, 2)}</pre>
                      </div>
                    </div>
                  </>
                )}

                {!loading && !error && !stats && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <p className="text-muted-foreground">No stats available</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
