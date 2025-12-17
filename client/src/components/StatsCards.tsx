import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Server, Tag } from "lucide-react";

interface StatsCardsProps {
  totalNodes: number;
  uniqueVersions: number;
  recentlySeen: number;
}

export function StatsCards({ totalNodes, uniqueVersions, recentlySeen }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-2 border-foreground shadow-none rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total pNodes
          </CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tighter text-primary">{totalNodes}</div>
          <p className="text-xs text-muted-foreground">
            Discovered via gossip
          </p>
        </CardContent>
      </Card>
      <Card className="border-2 border-foreground shadow-none rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Unique Versions
          </CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tighter text-chart-1">{uniqueVersions}</div>
          <p className="text-xs text-muted-foreground">
            Active software versions
          </p>
        </CardContent>
      </Card>
      <Card className="border-2 border-foreground shadow-none rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recently Seen
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold tracking-tighter text-foreground">{recentlySeen}</div>
          <p className="text-xs text-muted-foreground">
            Active in last 1 hour
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
