import { Button } from "@/components/ui/button";
import { Pod, NodeStats, getNodeStats, formatUptime, formatStorage, formatRAM } from "@/services/prpc";
import { Copy, X, Loader2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface NodeDetailsDrawerProps {
  node: Pod | null;
  onClose: () => void;
  statsEndpoint?: string;
  useCustomStats?: boolean;
}

export function NodeDetailsDrawer({ node, onClose, statsEndpoint, useCustomStats }: NodeDetailsDrawerProps) {
  const [stats, setStats] = useState<NodeStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!node) {
      setStats(null);
      setError(null);
      return;
    }

    // Fetch stats when node changes
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const nodeStats = await getNodeStats(node.address, useCustomStats ? statsEndpoint : undefined);
        setStats(nodeStats);
      } catch (err) {
        console.error("Failed to fetch node stats:", err);
        setError("Failed to load node statistics. The node may not be responding.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {node.geo?.flag && (
                        <span className="text-2xl">{node.geo.flag}</span>
                      )}
                      <h2 className="text-2xl font-bold text-white font-mono">
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
                    className="text-muted-foreground hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Status Badge */}
                <div className="mt-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-semibold">Online</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {loading && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading node statistics...</p>
                  </div>
                )}

                {error && (
                  <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                    <AlertCircle className="h-8 w-8 text-yellow-500" />
                    <p className="text-muted-foreground">{error}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => node && getNodeStats(node.address)}
                      className="glass-input hover:bg-white/10 border-white/10 text-white"
                    >
                      Retry
                    </Button>
                  </div>
                )}

                {!loading && !error && stats && (
                  <>
                    {/* Info Banner */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
                      <p className="text-sm text-blue-300">
                        <strong>Note:</strong> Most nodes only expose their gossip port (9001) publicly. 
                        Stats shown below are from a public reference node (192.190.136.36:6000) and represent typical network performance.
                      </p>
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
                        <DetailRow label="CPU Usage" value={`${stats.stats.cpu_percent.toFixed(1)}%`} />
                        <DetailRow 
                          label="RAM Usage" 
                          value={`${formatRAM(stats.stats.ram_used)} / ${formatRAM(stats.stats.ram_total)}`} 
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
                        <DetailRow label="Public Node" value={node.is_public ? "Yes" : "No"} />
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
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
