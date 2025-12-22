import { Card } from "@/components/ui/card";
import { AlertTriangle, Globe, Server, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  totalNodes: number;
  onlineNodes: number;
  uniqueCountries: number;
  atRiskNodes: number;
}

export function StatsCards({
  totalNodes,
  onlineNodes,
  uniqueCountries,
  atRiskNodes,
}: StatsCardsProps) {
  const onlinePercentage = totalNodes > 0 ? Math.round((onlineNodes / totalNodes) * 100) : 0;

  const stats = [
    {
      label: "Total Nodes",
      value: totalNodes.toString(),
      icon: Server,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Online",
      value: `${onlinePercentage}%`,
      subtitle: `${onlineNodes} nodes`,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Countries",
      value: uniqueCountries.toString(),
      icon: Globe,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "At Risk",
      value: atRiskNodes.toString(),
      icon: AlertTriangle,
      color: atRiskNodes > 0 ? "text-yellow-500" : "text-green-500",
      bgColor: atRiskNodes > 0 ? "bg-yellow-500/10" : "bg-green-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel border-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                    {stat.label}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.subtitle}
                    </p>
                  )}
                </div>
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
