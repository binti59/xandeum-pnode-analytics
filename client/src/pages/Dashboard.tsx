import { ConnectionSettings } from "@/components/ConnectionSettings";
import { PNodeTable } from "@/components/PNodeTable";
import { StatsCards } from "@/components/StatsCards";
import { VersionChart } from "@/components/VersionChart";
import { Button } from "@/components/ui/button";
import { DEFAULT_RPC_ENDPOINT, getPods, Pod } from "@/services/prpc";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [nodes, setNodes] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Initialize endpoint from localStorage or default
  const [endpoint, setEndpoint] = useState<string>(() => {
    return localStorage.getItem("xandeum_rpc_endpoint") || DEFAULT_RPC_ENDPOINT;
  });

  const handleEndpointChange = (newEndpoint: string) => {
    setEndpoint(newEndpoint);
    localStorage.setItem("xandeum_rpc_endpoint", newEndpoint);
    // Trigger a refresh when endpoint changes
    fetchData(newEndpoint);
  };

  const fetchData = async (rpcUrl: string = endpoint) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPods(rpcUrl);
      setNodes(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(`Failed to fetch pNode data from ${rpcUrl}. Check your connection settings.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => fetchData(), 60000);
    return () => clearInterval(interval);
  }, [endpoint]); // Re-run effect if endpoint changes (though fetchData handles it)

  const uniqueVersions = new Set(nodes.map((n) => n.version)).size;
  const recentlySeen = nodes.filter((n) => {
    const oneHourAgo = Date.now() / 1000 - 3600;
    return n.last_seen_timestamp > oneHourAgo;
  }).length;

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Xandeum pNode Analytics
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Real-time discovery and monitoring of Xandeum pNodes via gossip protocol.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-muted-foreground hidden md:inline-block">
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
              className="rounded-none border-2 border-foreground"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {error ? (
          <div className="border-2 border-destructive bg-destructive/5 p-6 text-destructive">
            <h3 className="font-bold uppercase tracking-tight">Error Loading Data</h3>
            <p className="mt-2">{error}</p>
            <div className="mt-4 flex gap-4">
              <Button 
                variant="outline" 
                className="border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground rounded-none"
                onClick={() => fetchData()}
              >
                Retry
              </Button>
            </div>
          </div>
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
              {/* Version Chart - Takes up 1 column on large screens */}
              <div className="md:col-span-1">
                <VersionChart nodes={nodes} />
              </div>

              {/* Node Table - Takes up 2 columns on large screens */}
              <div className="md:col-span-2">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold tracking-tight uppercase">
                    Active Nodes
                  </h2>
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
