import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getBadgeDetails } from "@/lib/badges";
import { trpc } from "@/lib/trpc";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Calendar,
  Globe,
  Loader2,
  MapPin,
  TrendingUp,
  Trophy,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocation } from "wouter";

export default function NodeHistory() {
  const [, setLocation] = useLocation();
  const [nodeAddress, setNodeAddress] = useState<string>("");

  useEffect(() => {
    // Get node address from URL query parameter
    const params = new URLSearchParams(window.location.search);
    const address = params.get("node");
    if (address) {
      setNodeAddress(decodeURIComponent(address));
    }
  }, []);

  const snapshotsQuery = trpc.rankings.getSnapshots.useQuery(
    { nodeAddress, days: 30 },
    { enabled: !!nodeAddress }
  );

  const badgesQuery = trpc.rankings.getNodeBadges.useQuery(
    { nodeAddress },
    { enabled: !!nodeAddress }
  );

  if (!nodeAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <Card className="p-12 text-center bg-white/5 backdrop-blur-xl border-white/10">
          <h3 className="text-xl font-semibold text-white mb-2">
            No Node Selected
          </h3>
          <p className="text-gray-400 mb-4">
            Please select a node from the dashboard or rankings page.
          </p>
          <Button onClick={() => setLocation("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const snapshots = snapshotsQuery.data || [];
  const badges = badgesQuery.data || [];

  // Calculate statistics
  const stats = {
    averageScore: snapshots.length
      ? Math.round(
          snapshots.reduce((sum, s) => sum + s.score, 0) / snapshots.length
        )
      : 0,
    bestRank: snapshots.length
      ? Math.min(...snapshots.map((s) => s.rank))
      : 0,
    daysTracked: snapshots.length,
    currentScore: snapshots[0]?.score || 0,
    currentRank: snapshots[0]?.rank || 0,
  };

  // Prepare chart data (reverse to show oldest first)
  const chartData = [...snapshots].reverse().map((s) => ({
    date: new Date(s.snapshotDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: s.score,
    rank: s.rank,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Node Performance History
                </h1>
                <p className="text-sm text-gray-400 font-mono">{nodeAddress}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {snapshotsQuery.isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-green-400" />
          </div>
        ) : snapshots.length === 0 ? (
          <Card className="p-12 text-center bg-white/5 backdrop-blur-xl border-white/10">
            <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Historical Data Yet
            </h3>
            <p className="text-gray-400">
              Performance data will appear here once snapshots are collected.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Current Score</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.currentScore}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <div className="flex items-center gap-3">
                  <Trophy className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Best Rank</p>
                    <p className="text-2xl font-bold text-white">
                      #{stats.bestRank}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Average Score</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.averageScore}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Days Tracked</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.daysTracked}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-orange-400" />
                  <div>
                    <p className="text-sm text-gray-400">Badges Earned</p>
                    <p className="text-2xl font-bold text-white">
                      {badges.length}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Timeline */}
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Score Timeline
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#scoreGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Rank Progression */}
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Rank Progression
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="date" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" reversed />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rank"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Badges and Geographic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Badges */}
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-400" />
                  Achievement Badges
                </h3>
                {badges.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    No badges earned yet. Keep improving!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {badges.map((badge: any) => {
                      const details = getBadgeDetails(badge.badgeType);
                      return (
                        <motion.div
                          key={badge.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-lg border ${details.color}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{details.icon}</span>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">
                                {details.name}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {details.description}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Earned{" "}
                                {new Date(badge.earnedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </Card>

              {/* Geographic Info */}
              <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-400" />
                  Geographic Information
                </h3>
                {snapshots[0] && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                      <MapPin className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="text-white font-medium">
                          {snapshots[0].city || "Unknown"},{" "}
                          {snapshots[0].country || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                      <Globe className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Node Address</p>
                        <p className="text-white font-mono text-sm break-all">
                          {nodeAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5">
                      <TrendingUp className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-sm text-gray-400">Current Version</p>
                        <p className="text-white font-medium">
                          {snapshots[0].version || "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
