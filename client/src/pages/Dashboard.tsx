import { ConnectionSettings } from "@/components/ConnectionSettings";
import { PNodeTable } from "@/components/PNodeTable";
import { StatsCards } from "@/components/StatsCards";
import { VersionChart } from "@/components/VersionChart";
import { Button } from "@/components/ui/button";
import { DEFAULT_RPC_ENDPOINT, getPods, Pod } from "@/services/prpc";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Lock, RefreshCw, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [nodes, setNodes] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMixedContentError, setIsMixedContentError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const [endpoint, setEndpoint] = useState<string>(() => {
    return localStorage.getItem("xandeum_rpc_endpoint") || DEFAULT_RPC_ENDPOINT;
  });

  const handleEndpointChange = (newEndpoint: string) => {
    setEndpoint(newEndpoint);
    localStorage.setItem("xandeum_rpc_endpoint", newEndpoint);
    fetchData(newEndpoint);
  };

  const fetchData = async (rpcUrl: string = endpoint) => {
    setLoading(true);
    setError(null);
    setIsMixedContentError(false);
    try {
      const data = await getPods(rpcUrl);
      setNodes(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error(err);
      
      // Detect Mixed Content Error (HTTPS site fetching HTTP resource)
      if (window.location.protocol === 'https:' && rpcUrl.startsWith('http:')) {
        setIsMixedContentError(true);
        setError("Security Block: Browser blocked HTTP request from HTTPS site.");
      } else {
        setError(`Failed to fetch pNode data from ${rpcUrl}. Check your connection settings.`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, [endpoint]);

  const uniqueVersions = new Set(nodes.map((n) => n.version)).size;
  const recentlySeen = nodes.filter((n) => {
    const oneHourAgo = Date.now() / 1000 - 3600;
    return n.last_seen_timestamp > oneHourAgo;
  }).length;

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
              {isMixedContentError ? <Lock className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
              {isMixedContentError ? "Mixed Content Security Block" : "Connection Error"}
            </h3>
            
            <p className="mt-2 text-destructive-foreground/90 font-medium">{error}</p>
            
            {isMixedContentError && (
              <div className="mt-4 p-4 bg-black/40 rounded-lg border border-white/10 text-sm text-muted-foreground space-y-2">
                <p className="text-white font-semibold">Why is this happening?</p>
                <p>This dashboard is secure (HTTPS), but your RPC endpoint is insecure (HTTP). Browsers block this by default.</p>
                
                <p className="text-white font-semibold mt-4">How to fix it:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <span className="text-primary">Option 1 (Easiest):</span> Click the "lock" icon in your browser address bar &rarr; Site Settings &rarr; Allow "Insecure Content".
                  </li>
                  <li>
                    <span className="text-primary">Option 2 (Recommended):</span> Use a tunneling service like <strong>ngrok</strong> to get an HTTPS URL: <code className="bg-black/50 px-1 py-0.5 rounded">ngrok http 4000</code>
                  </li>
                </ul>
              </div>
            )}

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
            {/* Stats Cards */}
            <StatsCards
              totalNodes={nodes.length}
              uniqueVersions={uniqueVersions}
              recentlySeen={recentlySeen}
            />

            {/* Main Content Grid */}
            <div className="grid gap-8 md:grid-cols-3">
              {/* Version Chart */}
              <div className="md:col-span-1 h-full">
                <VersionChart nodes={nodes} />
              </div>

              {/* Node Table */}
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold tracking-tight text-white flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Active Nodes
                  </motion.h2>
                  <PNodeTable nodes={nodes} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
