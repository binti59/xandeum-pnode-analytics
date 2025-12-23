import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getNodePerformanceHistory, getNodesWithHistory } from "@/lib/performanceHistory";
import { statsCache } from "@/lib/statsCache";
import { Activity, TrendingUp, Clock, Cpu, HardDrive, Zap, Trophy, LayoutDashboard } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface NodeOption {
  address: string;
  dataPoints: number;
}

export default function Performance() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [availableNodes, setAvailableNodes] = useState<NodeOption[]>([]);
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h">("24h");

  useEffect(() => {
    // Get all nodes with history
    const nodeAddresses = getNodesWithHistory();
    const nodes = nodeAddresses.map(address => {
      const history = getNodePerformanceHistory(address);
      return {
        address,
        dataPoints: history.length
      };
    });
    setAvailableNodes(nodes);
    
    // Auto-select first node if available
    if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(nodes[0].address);
    }
  }, []);

  const getFilteredHistory = () => {
    if (!selectedNode) return [];
    
    const history = getNodePerformanceHistory(selectedNode);
    const now = Date.now();
    
    let cutoffTime = now;
    switch (timeRange) {
      case "1h":
        cutoffTime = now - 60 * 60 * 1000;
        break;
      case "6h":
        cutoffTime = now - 6 * 60 * 60 * 1000;
        break;
      case "24h":
        cutoffTime = now - 24 * 60 * 60 * 1000;
        break;
    }
    
    return history
      .filter((snapshot) => snapshot.timestamp >= cutoffTime)
      .map((snapshot) => ({
        time: new Date(snapshot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: snapshot.timestamp,
        cpu: snapshot.cpu,
        ramPercent: (snapshot.ram / snapshot.ramTotal) * 100,
        uptime: snapshot.uptime / 3600, // Convert to hours
        activeStreams: snapshot.activeStreams,
      }));
  };

  const chartData = getFilteredHistory();

  const formatUptime = (hours: number) => {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.floor(hours % 24);
    if (days > 0) return `${days}d ${remainingHours}h`;
    return `${remainingHours}h`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white p-8">
      <div className="container py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl"
        >
          <div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                <Activity className="h-8 w-8 text-primary fill-primary/20" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  Performance Trends
                </span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Historical performance data for accessible nodes over the past 24 hours
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/rankings">
                  <Button variant="outline" size="sm">
                    <Trophy className="h-4 w-4 mr-2" />
                    Rankings
                  </Button>
                </Link>
                <Link href="/performance">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                    Performance
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6"
        >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Node Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Node
            </label>
            <select
              value={selectedNode || ""}
              onChange={(e) => setSelectedNode(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {availableNodes.length === 0 && (
                <option value="">No nodes with history data</option>
              )}
              {availableNodes.map((node) => (
                <option key={node.address} value={node.address}>
                  {node.address} ({node.dataPoints} data points)
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Time Range
            </label>
            <div className="flex gap-2">
              {(["1h", "6h", "24h"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range
                      ? "bg-purple-500 text-white"
                      : "bg-slate-900/50 text-slate-400 hover:bg-slate-800/50"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

        {/* Charts */}
        {selectedNode && chartData.length > 0 ? (
          <div className="space-y-6">
            {/* CPU Usage Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-2xl p-6"
            >
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">CPU Usage</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  label={{ value: 'CPU %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="cpu" 
                  stroke="oklch(0.65 0.22 150)" 
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.65 0.22 150)', r: 3 }}
                  name="CPU Usage (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

            {/* RAM Usage Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-2xl p-6"
            >
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-chart-2" />
              <h2 className="text-xl font-semibold">RAM Usage</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  label={{ value: 'RAM %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ramPercent" 
                  stroke="oklch(0.6 0.2 200)" 
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.6 0.2 200)', r: 3 }}
                  name="RAM Usage (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

            {/* Uptime Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-panel rounded-2xl p-6"
            >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-chart-4" />
              <h2 className="text-xl font-semibold">Uptime Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                  tickFormatter={formatUptime}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(value: number) => formatUptime(value)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="uptime" 
                  stroke="oklch(0.5 0.2 300)" 
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.5 0.2 300)', r: 3 }}
                  name="Uptime (hours)"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

            {/* Active Streams Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-panel rounded-2xl p-6"
            >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-chart-5" />
              <h2 className="text-xl font-semibold">Active Streams</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  tick={{ fill: 'rgba(255,255,255,0.7)' }}
                  label={{ value: 'Streams', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="activeStreams" 
                  stroke="oklch(0.45 0.2 350)" 
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.45 0.2 350)', r: 3 }}
                  name="Active Streams"
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-2xl p-12 text-center"
          >
          <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground/70 mb-2">
            No Performance Data Available
          </h3>
          <p className="text-muted-foreground">
            {availableNodes.length === 0
              ? "No accessible nodes have been scanned yet. Visit the dashboard to start collecting data."
              : "Select a node to view its performance trends."}
          </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
