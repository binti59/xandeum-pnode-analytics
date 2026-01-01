import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { statsCache } from "@/lib/statsCache";
import { AlertTriangle, HardDrive, Cpu, MemoryStick, WifiOff, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export interface Alert {
  id: string;
  type: "cpu" | "ram" | "storage" | "offline" | "version";
  severity: "critical" | "warning";
  nodeIp: string;
  message: string;
  value?: number;
  timestamp: Date;
}

interface PerformanceAlertsProps {
  nodes: any[];
}

export function PerformanceAlerts({ nodes }: PerformanceAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Check all nodes for alert conditions
    const newAlerts: Alert[] = [];

    nodes.forEach((node) => {
      const cached = statsCache.get(node.address);
      
      if (!cached || !cached.accessible) {
        // Node is offline or inaccessible
        newAlerts.push({
          id: `${node.address}-offline`,
          type: "offline",
          severity: "critical",
          nodeIp: node.address,
          message: `Node ${node.address} is offline or inaccessible`,
          timestamp: new Date(),
        });
        return;
      }

      const nodeStats = cached.stats;
      if (!nodeStats || !nodeStats.stats) return;

      const stats = nodeStats.stats;

      // CPU Alert (>80%)
      if (stats.cpu_percent && stats.cpu_percent > 80) {
        newAlerts.push({
          id: `${node.address}-cpu`,
          type: "cpu",
          severity: stats.cpu_percent > 90 ? "critical" : "warning",
          nodeIp: node.address,
          message: `High CPU usage on ${node.address}`,
          value: stats.cpu_percent,
          timestamp: new Date(),
        });
      }

      // RAM Alert (>90%)
      if (stats.ram_used && stats.ram_total) {
        const ramPercent = (stats.ram_used / stats.ram_total) * 100;
        if (ramPercent > 90) {
          newAlerts.push({
            id: `${node.address}-ram`,
            type: "ram",
            severity: ramPercent > 95 ? "critical" : "warning",
            nodeIp: node.address,
            message: `High RAM usage on ${node.address}`,
            value: ramPercent,
            timestamp: new Date(),
          });
        }
      }

      // Storage Alert (>85%)
      if (stats.disk_used && stats.disk_total) {
        const storagePercent = (stats.disk_used / stats.disk_total) * 100;
        if (storagePercent > 85) {
          newAlerts.push({
            id: `${node.address}-storage`,
            type: "storage",
            severity: storagePercent > 95 ? "critical" : "warning",
            nodeIp: node.address,
            message: `Low storage space on ${node.address}`,
            value: storagePercent,
            timestamp: new Date(),
          });
        }
      }

      // Version Alert (outdated)
      if (node.version !== "1.2.0") {
        newAlerts.push({
          id: `${node.address}-version`,
          type: "version",
          severity: "warning",
          nodeIp: node.address,
          message: `Outdated version on ${node.address} (${node.version})`,
          timestamp: new Date(),
        });
      }
    });

    // Sort by severity (critical first) and timestamp (newest first)
    newAlerts.sort((a, b) => {
      if (a.severity !== b.severity) {
        return a.severity === "critical" ? -1 : 1;
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    // Keep only last 5 alerts
    setAlerts(newAlerts.slice(0, 5));
  }, [nodes]);

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "cpu":
        return <Cpu className="w-4 h-4" />;
      case "ram":
        return <MemoryStick className="w-4 h-4" />;
      case "storage":
        return <HardDrive className="w-4 h-4" />;
      case "offline":
        return <WifiOff className="w-4 h-4" />;
      case "version":
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getAlertColor = (severity: Alert["severity"]) => {
    return severity === "critical" ? "text-red-500" : "text-yellow-500";
  };

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  if (alerts.length === 0) {
    return (
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-green-500" />
            Performance Alerts
          </h3>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            All Clear
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          No active alerts. All nodes are performing within normal parameters.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          Performance Alerts
        </h3>
        <div className="flex items-center gap-2">
          {criticalCount > 0 && (
            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
              {criticalCount} Critical
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              {warningCount} Warning
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className={`mt-0.5 ${getAlertColor(alert.severity)}`}>
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {alert.message}
                </p>
                {alert.value !== undefined && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Current: {alert.value.toFixed(1)}%
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">
                  {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <Link href="/performance">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2"
                >
                  View
                </Button>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {alerts.length >= 5 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <Link href="/performance">
            <Button variant="outline" size="sm" className="w-full">
              View All Alerts
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
