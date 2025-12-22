import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface VersionDistributionChartProps {
  versionDistribution: Record<string, number>;
  latestVersion: string;
}

const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

export function VersionDistributionChart({
  versionDistribution,
  latestVersion,
}: VersionDistributionChartProps) {
  const data = Object.entries(versionDistribution).map(([version, count]) => ({
    version,
    count,
    isLatest: version === latestVersion,
  }));

  const totalNodes = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <h3 className="text-lg font-bold text-white mb-4">Version Distribution</h3>
      
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={2}
                dataKey="count"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="stroke-background stroke-2"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="glass-panel p-2 text-xs border border-white/10">
                        <div className="font-bold">{data.version}</div>
                        <div className="text-muted-foreground">{data.count} nodes</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-2xl font-bold text-white">{data.length}</div>
            <div className="text-xs text-muted-foreground">
              {data.length === 1 ? "version" : "versions"}
            </div>
          </div>
        </div>

        {/* Version List */}
        <div className="flex-1 space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.count / totalNodes) * 100).toFixed(1);
            return (
              <div
                key={item.version}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-mono text-white">
                    {item.version}
                    {item.isLatest && (
                      <span className="ml-2 text-xs text-green-500">(current)</span>
                    )}
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {item.count} ({percentage}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
