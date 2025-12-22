import { ConnectionSettings } from "@/components/ConnectionSettings";
import { FilterBar } from "@/components/FilterBar";
import { HealthScoreCircle } from "@/components/HealthScoreCircle";
import { NodeCard } from "@/components/NodeCard";
import { StatsCards } from "@/components/StatsCards";
import { VersionDistributionChart } from "@/components/VersionDistributionChart";
import { Button } from "@/components/ui/button";
import { exportToCSV, exportToJSON } from "@/lib/exportData";
import { calculateHealthMetrics } from "@/lib/healthScore";
import { trpc } from "@/lib/trpc";
import { Pod } from "@/services/prpc";
import { motion } from "framer-motion";
import { AlertTriangle, Download, FileJson, Loader2, RefreshCw, Zap } from "lucide-react";
import { useEffect, useState } from "react";

// Default to public node
const DEFAULT_RPC_ENDPOINT = "http://192.190.136.36:6000/rpc";

export default function Dashboard() {
  const [nodes, setNodes] = useState<Pod[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [endpoint, setEndpoint] = useState<string>(() => {
    return localStorage.getItem("xandeum_rpc_endpoint") || DEFAULT_RPC_ENDPOINT;
  });

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

  const handleEndpointChange = (newEndpoint: string) => {
    setEndpoint(newEndpoint);
    localStorage.setItem("xandeum_rpc_endpoint", newEndpoint);
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
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, [endpoint]);

  // Calculate health metrics
  const healthMetrics = calculateHealthMetrics(nodes);

  // Filter nodes based on search query
  const filteredNodes = nodes.filter(node => 
    node.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (node.pubkey && node.pubkey.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (node.geo?.city && node.geo.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (node.geo?.country && node.geo.country.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
            <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
              <Zap className="h-8 w-8 text-primary fill-primary/20" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                Xandeum Analytics
              </span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Real-time pNode discovery & gossip monitoring
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-muted-foreground hidden md:inline-block font-mono">
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <ConnectionSettings 
              currentEndpoint={endpoint} 
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

            {/* Filter Bar with Export Buttons */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <FilterBar 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  totalCount={nodes.length}
                  onlineCount={healthMetrics.onlineNodes}
                  publicCount={nodes.filter(n => n.is_public).length}
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
                <NodeCard key={node.address + index} node={node} />
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
    </div>
  );
}
