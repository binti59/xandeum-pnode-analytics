import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PNode } from "@/services/prpc";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface VersionChartProps {
  nodes: PNode[];
}

export function VersionChart({ nodes }: VersionChartProps) {
  const versionCounts = nodes.reduce((acc, node) => {
    acc[node.version] = (acc[node.version] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(versionCounts)
    .map(([version, count]) => ({
      version,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="border-2 border-foreground shadow-none rounded-none h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight uppercase">Version Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="version" 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--foreground)'
                }}
              />
              <Bar 
                dataKey="count" 
                fill="var(--chart-1)" 
                radius={[0, 0, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
