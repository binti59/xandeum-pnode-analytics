import { PNodeTable } from "@/components/PNodeTable";
import { StatsCards } from "@/components/StatsCards";
import { VersionChart } from "@/components/VersionChart";
import { Button } from "@/components/ui/button";
import { getPods, Pod } from "@/services/prpc";
import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [nodes, setNodes] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPods();
      setNodes(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch pNode data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

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
            <Button 
              onClick={fetchData} 
              disabled={loading}
              variant="outline"
              size="sm"
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
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
            <h3 className="font-semibold">Error Loading Data</h3>
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4 border-destructive/50 hover:bg-destructive/20"
              onClick={fetchData}
            >
              Retry
            </Button>
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
                  <h2 className="text-2xl font-semibold tracking-tight">
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
