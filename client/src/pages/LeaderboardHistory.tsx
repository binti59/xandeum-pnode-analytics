import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  Medal,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function LeaderboardHistory() {
  const [days, setDays] = useState(30);

  const historyQuery = trpc.rankings.getLeaderboardHistory.useQuery({ days });

  const handleDaysChange = (newDays: number) => {
    setDays(Math.max(7, Math.min(90, newDays)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-8 w-8 text-green-400" />
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    Leaderboard History
                  </h1>
                  <p className="text-sm text-gray-400">
                    Daily top 10 snapshots over time
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Date Range Selector */}
        <Card className="p-6 mb-8 bg-white/5 backdrop-blur-xl border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-white font-medium">Viewing past {days} days</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDaysChange(days - 7)}
                disabled={days <= 7}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-2">
                {[7, 14, 30, 60, 90].map((d) => (
                  <Button
                    key={d}
                    variant={days === d ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDays(d)}
                  >
                    {d}d
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDaysChange(days + 7)}
                disabled={days >= 90}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Loading State */}
        {historyQuery.isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-400" />
          </div>
        )}

        {/* History Timeline */}
        {historyQuery.data && (
          <div className="space-y-6">
            {historyQuery.data.length === 0 ? (
              <Card className="p-12 text-center bg-white/5 backdrop-blur-xl border-white/10">
                <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No Historical Data Yet
                </h3>
                <p className="text-gray-400">
                  Ranking snapshots will appear here once data is collected.
                </p>
              </Card>
            ) : (
              historyQuery.data.map((snapshot: any, index: number) => (
                <motion.div
                  key={snapshot.date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        {new Date(snapshot.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h3>
                      <span className="text-sm text-gray-400">
                        Top {snapshot.nodes.length} nodes
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      {snapshot.nodes.map((node: any) => (
                        <div
                          key={node.id}
                          className="p-4 rounded-lg bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {node.rank <= 3 && (
                              <Medal
                                className={`h-4 w-4 ${
                                  node.rank === 1
                                    ? "text-yellow-400"
                                    : node.rank === 2
                                    ? "text-gray-300"
                                    : "text-amber-600"
                                }`}
                              />
                            )}
                            <span className="font-mono text-sm text-gray-400">
                              #{node.rank}
                            </span>
                          </div>
                          <div className="text-sm font-medium text-white mb-1 truncate">
                            {node.nodeAddress}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400">
                              {node.country && `${node.country} ${node.city || ""}`}
                            </span>
                            <span className="font-bold text-green-400">
                              {node.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
