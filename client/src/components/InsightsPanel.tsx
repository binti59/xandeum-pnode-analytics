import { HealthMetrics } from "@/lib/healthScore";
import { AlertTriangle, CheckCircle, Info, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface InsightsPanelProps {
  metrics: HealthMetrics;
}

interface Insight {
  type: "success" | "warning" | "info" | "critical";
  message: string;
  icon: React.ReactNode;
}

export function InsightsPanel({ metrics }: InsightsPanelProps) {
  const insights: Insight[] = [];

  // Availability insights
  if (metrics.availabilityScore === 100) {
    insights.push({
      type: "success",
      message: "Full network availability - All nodes are online and responsive",
      icon: <CheckCircle className="h-5 w-5" />,
    });
  }

  // Version health insights
  if (metrics.versionHealthScore === 0) {
    insights.push({
      type: "critical",
      message: `Critical: Only 1 node running latest version ${metrics.latestVersion}. Network upgrade needed.`,
      icon: <AlertTriangle className="h-5 w-5" />,
    });
  } else if (metrics.versionHealthScore < 50) {
    insights.push({
      type: "warning",
      message: `${metrics.versionHealthScore}% of nodes on latest version. Consider coordinating upgrades.`,
      icon: <TrendingDown className="h-5 w-5" />,
    });
  } else if (metrics.versionHealthScore >= 80) {
    insights.push({
      type: "success",
      message: "Excellent version health - Most nodes running current software",
      icon: <CheckCircle className="h-5 w-5" />,
    });
  }

  // Distribution insights
  if (metrics.uniqueCountries >= 15) {
    insights.push({
      type: "success",
      message: `Good geographic spread - Nodes distributed across ${metrics.uniqueCountries} countries`,
      icon: <CheckCircle className="h-5 w-5" />,
    });
  } else if (metrics.uniqueCountries < 5) {
    insights.push({
      type: "warning",
      message: `Limited geographic distribution - Only ${metrics.uniqueCountries} countries represented`,
      icon: <Info className="h-5 w-5" />,
    });
  }

  // At-risk nodes insights
  if (metrics.atRiskNodes > metrics.totalNodes * 0.5) {
    insights.push({
      type: "warning",
      message: `${metrics.atRiskNodes} nodes at risk (outdated versions or missing geo data)`,
      icon: <AlertTriangle className="h-5 w-5" />,
    });
  }

  // Overall health insights
  if (metrics.overallScore >= 80) {
    insights.push({
      type: "success",
      message: "Network is healthy - All key metrics within acceptable ranges",
      icon: <CheckCircle className="h-5 w-5" />,
    });
  } else if (metrics.overallScore < 60) {
    insights.push({
      type: "critical",
      message: "Network health declining - Immediate attention required",
      icon: <AlertTriangle className="h-5 w-5" />,
    });
  }

  const getInsightStyles = (type: Insight["type"]) => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/10",
          border: "border-green-500/30",
          text: "text-green-400",
          icon: "text-green-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          text: "text-yellow-400",
          icon: "text-yellow-500",
        };
      case "info":
        return {
          bg: "bg-blue-500/10",
          border: "border-blue-500/30",
          text: "text-blue-400",
          icon: "text-blue-500",
        };
      case "critical":
        return {
          bg: "bg-red-500/10",
          border: "border-red-500/30",
          text: "text-red-400",
          icon: "text-red-500",
        };
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-white">Insights</h3>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const styles = getInsightStyles(insight.type);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${styles.bg} ${styles.border}`}
            >
              <div className={styles.icon}>{insight.icon}</div>
              <p className={`text-sm ${styles.text} leading-relaxed`}>{insight.message}</p>
            </motion.div>
          );
        })}

        {insights.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No insights available. Waiting for network data...
          </div>
        )}
      </div>
    </div>
  );
}
