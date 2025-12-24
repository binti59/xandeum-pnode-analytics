import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Star, ArrowLeft } from "lucide-react";
import { getWatchlist, clearWatchlist } from "@/lib/watchlist";
import { NodeCard } from "@/components/NodeCard";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Pod, getPods } from "@/services/prpc";

export default function Watchlist() {
  const [watchlistAddresses, setWatchlistAddresses] = useState<string[]>([]);
  const [nodes, setNodes] = useState<Pod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const watchlist = getWatchlist();
      const addresses = watchlist.map(item => item.address);
      setWatchlistAddresses(addresses);

      // Fetch all nodes from RPC
      const allNodes = await getPods();
      const watchlistNodes = allNodes.filter((node: Pod) => 
        addresses.includes(node.address)
      );
      setNodes(watchlistNodes);
    } catch (error) {
      console.error('Failed to load watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearWatchlist = () => {
    if (confirm('Are you sure you want to clear your entire watchlist?')) {
      clearWatchlist();
      loadWatchlist();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="glass-panel border-b border-white/10 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                <h1 className="text-2xl font-bold text-white">
                  Watchlist
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/rankings">
                <Button variant="ghost">Rankings</Button>
              </Link>
              <Link href="/performance">
                <Button variant="ghost">Performance</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {nodes.length} {nodes.length === 1 ? 'node' : 'nodes'} in your watchlist
          </p>
          {nodes.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearWatchlist}
              className="text-red-400 hover:text-red-300 hover:border-red-400"
            >
              Clear Watchlist
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading watchlist...</p>
            </div>
          </div>
        ) : nodes.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No nodes in watchlist"
            description="Start adding nodes to your watchlist by clicking the star icon on any node card"
            action={{
              label: "Browse Nodes",
              onClick: () => window.location.href = "/"
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((node) => (
              <NodeCard key={node.address} node={node} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
