import { Button } from "@/components/ui/button";
import { Pod } from "@/services/prpc";
import { Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface NodeDetailsDrawerProps {
  node: Pod | null;
  onClose: () => void;
}

export function NodeDetailsDrawer({ node, onClose }: NodeDetailsDrawerProps) {
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
                {/* Identity Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Identity</h3>
                  <div className="space-y-0">
                    <DetailRow label="Node ID" value={node.pubkey || "N/A"} copyable />
                    <DetailRow label="Gossip" value={node.address} copyable />
                    <DetailRow label="RPC" value={node.rpc_port ? `${node.address.split(":")[0]}:${node.rpc_port}` : "N/A"} copyable />
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

                {/* Network Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Network</h3>
                  <div className="space-y-0">
                    <DetailRow label="Public Node" value={node.is_public ? "Yes" : "No"} />
                  </div>
                </div>

                {/* Performance Section (if data available) */}
                {node.uptime && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Performance</h3>
                    <div className="space-y-0">
                      <DetailRow label="Uptime" value={`${Math.floor(node.uptime / 86400)}d ${Math.floor((node.uptime % 86400) / 3600)}h`} />
                    </div>
                  </div>
                )}

                {/* Raw Data Section */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wide">Raw Data (14 fields)</h3>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-muted-foreground overflow-x-auto">
                    <pre>{JSON.stringify(node, null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
