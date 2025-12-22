import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface NetworkHealthTimelineProps {
  currentScore: number;
}

type TimeRange = "1h" | "6h" | "24h";

export function NetworkHealthTimeline({ currentScore }: NetworkHealthTimelineProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("6h");

  // Generate mock historical data (in production, this would come from API)
  const generateData = (range: TimeRange) => {
    const points = range === "1h" ? 12 : range === "6h" ? 36 : 96;
    const interval = range === "1h" ? 5 : range === "6h" ? 10 : 15;
    
    const data = [];
    const now = Date.now();
    
    for (let i = points; i >= 0; i--) {
      const timestamp = now - (i * interval * 60 * 1000);
      const date = new Date(timestamp);
      
      // Simulate score variation (±5 points from current)
      const variation = Math.sin(i / 5) * 5;
      const score = Math.max(0, Math.min(100, currentScore + variation));
      
      data.push({
        time: date.toLocaleTimeString("en-US", { 
          hour: "2-digit", 
          minute: "2-digit",
          hour12: false 
        }),
        score: Math.round(score),
        status: score >= 80 ? "Healthy" : score >= 60 ? "Warning" : "Critical",
      });
    }
    
    return data;
  };

  const data = generateData(timeRange);
  const avgScore = Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length);
  const minScore = Math.min(...data.map(d => d.score));
  const maxScore = Math.max(...data.map(d => d.score));
  const trend = data[data.length - 1].score - data[0].score;

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">Network Health Over Time</h3>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-muted-foreground">
              Avg: <span className="text-white font-bold">{avgScore}</span>
            </span>
            <span className="text-muted-foreground">
              Min: <span className="text-white font-bold">{minScore}</span>
            </span>
            <span className="text-muted-foreground">
              Max: <span className="text-white font-bold">{maxScore}</span>
            </span>
            <span className={`font-bold ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)} pts
            </span>
          </div>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex gap-2">
          {(["1h", "6h", "24h"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range 
                ? "bg-primary text-primary-foreground" 
                : "glass-input hover:bg-white/10 border-white/10 text-white"
              }
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div style={{ height: "250px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a3e" />
            <XAxis 
              dataKey="time" 
              stroke="#666"
              tick={{ fill: "#999", fontSize: 11 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#666"
              tick={{ fill: "#999", fontSize: 11 }}
              domain={[0, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel p-3 border border-white/10">
                      <div className="text-xs text-muted-foreground">{data.time}</div>
                      <div className="text-lg font-bold text-white mt-1">
                        {data.score}
                      </div>
                      <div className="text-xs text-muted-foreground">{data.status}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#healthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
