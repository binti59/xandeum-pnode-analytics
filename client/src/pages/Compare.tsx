import { useEffect, useState } from "react";
import { Link } from "wouter";
import { getPods, Pod } from "@/services/prpc";
import { getComparisonNodes, clearComparison } from "@/lib/comparison";
import { statsCache } from "@/lib/statsCache";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ArrowLeft, X, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Compare() {
  const [nodes, setNodes] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonAddresses, setComparisonAddresses] = useState<string[]>([]);

  useEffect(() => {
    loadComparison();
  }, []);

  const loadComparison = async () => {
    try {
      const addresses = getComparisonNodes();
      setComparisonAddresses(addresses);

      if (addresses.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch all nodes
      const allNodes = await getPods();
      const comparisonNodes = allNodes.filter((node: Pod) =>
        addresses.includes(node.address)
      );
      setNodes(comparisonNodes);
    } catch (error) {
      console.error("Failed to load comparison:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearComparison = () => {
    if (confirm("Clear all nodes from comparison?")) {
      clearComparison();
      setNodes([]);
      setComparisonAddresses([]);
    }
  };

  const formatBytes = (bytes?: number): string => {
    if (!bytes) return "N/A";
    const gb = bytes / (1024 ** 3);
    if (gb >= 1000) {
      return `${(gb / 1024).toFixed(2)} TB`;
    }
    return `${gb.toFixed(2)} GB`;
  };

  const formatUptime = (seconds?: number): string => {
    if (!seconds) return "N/A";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days}d ${hours}h`;
  };

  const getNodeStats = (address: string) => {
    const cached = statsCache.get(address);
    return cached && cached.accessible ? cached.stats : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading comparison...</div>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <Zap className="h-8 w-8 text-primary" />
                Node Comparison
              </h1>
              <p className="text-muted-foreground mt-2">
                Compare multiple nodes side-by-side
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <EmptyState
            icon={X}
            title="No nodes selected for comparison"
            description="Select nodes from the Dashboard to compare their metrics side-by-side"
          />
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Address", key: "address" },
    { label: "Version", key: "version" },
    { label: "CPU Usage", key: "stats.cpu_percent", format: (v: number) => `${v}%` },
    { label: "RAM Usage", key: "ram" },
    { label: "Storage", key: "file_size", format: formatBytes },
    { label: "Uptime", key: "stats.uptime", format: formatUptime },
    { label: "Active Streams", key: "stats.active_streams" },
    { label: "Packets Received", key: "stats.packets_received" },
    { label: "Packets Sent", key: "stats.packets_sent" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <Zap className="h-8 w-8 text-primary" />
              Node Comparison
            </h1>
            <p className="text-muted-foreground mt-2">
              Comparing {nodes.length} node{nodes.length > 1 ? "s" : ""} side-by-side
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleClearComparison}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear All
            </Button>
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-2xl overflow-x-auto"
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">
                  Metric
                </th>
                {nodes.map((node) => (
                  <th
                    key={node.address}
                    className="text-left py-4 px-4 text-white font-semibold"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-primary">Node</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {node.address.split(":")[0]}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr
                  key={metric.label}
                  className={index % 2 === 0 ? "bg-white/5" : ""}
                >
                  <td className="py-3 px-4 text-muted-foreground font-medium">
                    {metric.label}
                  </td>
                  {nodes.map((node) => {
                    const stats = getNodeStats(node.address);
                    let value: any;

                    if (metric.key === "address") {
                      value = node.address;
                    } else if (metric.key === "version") {
                      value = node.version || "Unknown";
                    } else if (metric.key === "ram") {
                      if (stats && stats.stats && stats.stats.ram_used && stats.stats.ram_total) {
                        value = `${((stats.stats.ram_used / stats.stats.ram_total) * 100).toFixed(1)}%`;
                      } else {
                        value = "N/A";
                      }
                    } else if (stats) {
                      // Handle nested stats fields
                      if (metric.key.startsWith('stats.')) {
                        const nestedKey = metric.key.split('.')[1];
                        const rawValue = stats.stats ? (stats.stats as any)[nestedKey] : null;
                        value = rawValue !== null && rawValue !== undefined
                          ? (metric.format ? metric.format(rawValue) : rawValue)
                          : "N/A";
                      } else if (metric.key in stats) {
                        const rawValue = (stats as any)[metric.key];
                        value = metric.format
                          ? metric.format(rawValue)
                          : rawValue || "N/A";
                      } else {
                        value = "N/A";
                      }
                    } else {
                      value = "N/A";
                    }

                    return (
                      <td key={node.address} className="py-3 px-4 text-white">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
