import { Pod } from "@/services/prpc";
import { motion } from "framer-motion";

interface NodeCardProps {
  node: Pod;
}

export function NodeCard({ node }: NodeCardProps) {
  const handleClick = () => {
    window.location.href = `/node?node=${encodeURIComponent(node.address)}`;
  };

  return (
    <motion.div
      onClick={handleClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="glass-panel p-5 rounded-xl cursor-pointer hover:border-primary/50 transition-all group"
    >
      {/* Header with Flag and Location */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {node.geo?.flag && (
            <span className="text-3xl">{node.geo.flag}</span>
          )}
          <div>
            <h3 className="text-lg font-bold text-white font-mono">
              {node.address}
            </h3>
            {node.geo?.city && (
              <p className="text-sm text-muted-foreground">
                {node.geo.city}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase">online</span>
        </div>
      </div>

      {/* Version Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">Version</span>
          <span className="text-sm text-white font-mono">{node.version}</span>
        </div>
      </div>

      {/* Click to view details hint */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-xs text-muted-foreground text-center opacity-0 group-hover:opacity-100 transition-opacity">
          Click to view detailed statistics →
        </p>
      </div>
    </motion.div>
  );
}
