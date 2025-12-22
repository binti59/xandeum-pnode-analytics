import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Pod } from "@/services/prpc";
import { motion } from "framer-motion";
import { Copy, Globe } from "lucide-react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface NodeCardProps {
  node: Pod;
}

export function NodeCard({ node }: NodeCardProps) {
  const formatUptime = (seconds?: number) => {
    if (!seconds) return "N/A";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const formatStorage = (bytes?: number) => {
    if (!bytes) return "N/A";
    const gb = bytes / (1024 * 1024 * 1024);
    return `${Math.round(gb)}GB`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Extract IP from address (remove port)
  const ip = node.address.split(":")[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-panel border-white/5 hover:border-primary/30 transition-colors h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-lg text-white">{ip}</h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-muted-foreground hover:text-primary"
                    onClick={() => copyToClipboard(node.address)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy Address</TooltipContent>
              </Tooltip>
            </div>
            {node.is_public && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium border border-blue-500/30">
                <Globe className="h-3 w-3" />
                Public
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
            <span className="text-xs text-primary font-medium">online</span>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col gap-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 py-4 border-y border-white/5 bg-black/20 rounded-lg px-2">
            <div className="text-center">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Uptime</p>
              <p className="text-sm font-bold text-white mt-1">{formatUptime(node.uptime)}</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Storage</p>
              <p className="text-sm font-bold text-white mt-1">{formatStorage(node.storage_committed)}</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Version</p>
              <p className="text-sm font-bold text-white mt-1">{node.version}</p>
            </div>
            <div className="text-center border-l border-white/5">
              <p className="text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Port</p>
              <p className="text-sm font-bold text-white mt-1">{node.rpc_port || "N/A"}</p>
            </div>
          </div>

          {/* Pubkey Footer */}
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between bg-black/40 rounded px-3 py-2 border border-white/5 group cursor-pointer hover:border-primary/20 transition-colors"
                 onClick={() => node.pubkey && copyToClipboard(node.pubkey)}>
              <code className="text-xs text-muted-foreground font-mono truncate max-w-[200px] group-hover:text-primary/80 transition-colors">
                {node.pubkey || "No Pubkey"}
              </code>
              <Copy className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
