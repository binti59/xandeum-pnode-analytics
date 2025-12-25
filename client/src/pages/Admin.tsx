import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { performSync } from "@/lib/backgroundSync";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Database,
  Activity,
  Users,
  Download,
  RefreshCw,
  Loader2,
  Clock,
  HardDrive,
  Server,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

interface DatabaseStats {
  totalNodes: number;
  accessibleNodes: number;
  totalStorage: number;
  avgStoragePerNode: number;
  watchlistCount: number;
  lastScanTime: Date | null;
}

export default function Admin() {
  const [stats, setStats] = useState<DatabaseStats>({
    totalNodes: 0,
    accessibleNodes: 0,
    totalStorage: 0,
    avgStoragePerNode: 0,
    watchlistCount: 0,
    lastScanTime: null,
  });
  
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const allNodeStatsQuery = trpc.persistence.getAllNodeStats.useQuery();
  const watchlistQuery = trpc.persistence.getWatchlist.useQuery();

  useEffect(() => {
    if (allNodeStatsQuery.data && watchlistQuery.data) {
      const nodes = allNodeStatsQuery.data;
      const accessibleNodes = nodes.filter(n => n.accessible);
      const totalStorage = accessibleNodes.reduce((sum, n) => {
        return sum + (n.stats?.file_size || 0);
      }, 0);

      setStats({
        totalNodes: nodes.length,
        accessibleNodes: accessibleNodes.length,
        totalStorage: totalStorage / (1024 * 1024 * 1024), // Convert to GB
        avgStoragePerNode: accessibleNodes.length > 0 
          ? (totalStorage / accessibleNodes.length) / (1024 * 1024 * 1024)
          : 0,
        watchlistCount: watchlistQuery.data.length,
        lastScanTime: nodes.length > 0 
          ? new Date(Math.max(...nodes.map(n => n.timestamp)))
          : null,
      });
      setLoading(false);
    }
  }, [allNodeStatsQuery.data, watchlistQuery.data]);

  const formatStorage = (gb: number) => {
    if (gb >= 1000) {
      return `${(gb / 1000).toFixed(2)} TB`;
    }
    return `${gb.toFixed(2)} GB`;
  };

  const formatTime = (date: Date | null) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const handleRefresh = () => {
    allNodeStatsQuery.refetch();
    watchlistQuery.refetch();
  };

  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const result = await performSync();
      toast.success(`Sync complete: ${result.nodesSynced} nodes synced`);
      // Refresh stats after sync
      handleRefresh();
    } catch (error) {
      console.error("Manual sync failed:", error);
      toast.error("Sync failed. Check console for details.");
    } finally {
      setSyncing(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      {/* Subtle background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                System statistics and database management
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={loading}
                className="glass-input hover:bg-white/10 border-white/10 text-white"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-input hover:bg-white/10 border-white/10 text-white"
                >
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Nodes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Nodes</p>
                <p className="text-3xl font-bold">{stats.totalNodes}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Cached in database
            </div>
          </motion.div>

          {/* Accessible Nodes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Activity className="h-6 w-6 text-green-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Accessible</p>
                <p className="text-3xl font-bold">{stats.accessibleNodes}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.totalNodes > 0
                ? `${((stats.accessibleNodes / stats.totalNodes) * 100).toFixed(1)}% online`
                : "0% online"}
            </div>
          </motion.div>

          {/* Total Storage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-lg">
                <HardDrive className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Storage</p>
                <p className="text-3xl font-bold">
                  {formatStorage(stats.totalStorage)}
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Across accessible nodes
            </div>
          </motion.div>

          {/* Average Storage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Server className="h-6 w-6 text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Avg per Node</p>
                <p className="text-3xl font-bold">
                  {formatStorage(stats.avgStoragePerNode)}
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Average storage capacity
            </div>
          </motion.div>

          {/* Watchlist Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="glass-panel p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <Users className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Watchlist</p>
                <p className="text-3xl font-bold">{stats.watchlistCount}</p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Monitored nodes
            </div>
          </motion.div>

          {/* Last Scan Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass-panel p-6 rounded-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <Clock className="h-6 w-6 text-orange-400" />
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last Scan</p>
                <p className="text-2xl font-bold">
                  {formatTime(stats.lastScanTime)}
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Most recent RPC scan
            </div>
          </motion.div>
        </div>

        {/* Actions Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="glass-panel p-6 rounded-xl"
        >
          <h2 className="text-xl font-semibold mb-4">Database Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="glass-input hover:bg-white/10 border-white/10 text-white justify-start h-auto py-4"
              disabled
            >
              <Download className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Export Database</div>
                <div className="text-xs text-muted-foreground">
                  Download backup (Coming soon)
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-4"
              onClick={handleManualSync}
              disabled={syncing}
            >
              <RefreshCw className={`h-5 w-5 mr-3 ${syncing ? 'animate-spin' : ''}`} />
              <div className="text-left">
                <div className="font-semibold">Sync LocalStorage</div>
                <div className="text-xs text-muted-foreground">
                  {syncing ? 'Syncing...' : 'Manual sync to DB'}
                </div>
              </div>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
