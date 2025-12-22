import { Pod } from "@/services/prpc";
import { motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

interface GlobalDistributionMapProps {
  nodes: Pod[];
  onNodeClick: (node: Pod) => void;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Convert country code to coordinates (approximate center)
const countryCoordinates: Record<string, [number, number]> = {
  US: [-95, 37],
  DE: [10, 51],
  GB: [-2, 54],
  NL: [5, 52],
  CA: [-106, 56],
  AT: [14, 47],
  FR: [2, 46],
  IT: [12, 42],
  ES: [-4, 40],
  PL: [19, 52],
  SE: [15, 62],
  NO: [10, 60],
  FI: [26, 64],
  DK: [10, 56],
  BE: [4, 50],
  CH: [8, 47],
  AU: [133, -27],
  JP: [138, 36],
  SG: [104, 1],
  IN: [79, 22],
};

export function GlobalDistributionMap({ nodes, onNodeClick }: GlobalDistributionMapProps) {
  // Group nodes by country
  const nodesByCountry = nodes.reduce((acc, node) => {
    const country = node.geo?.country || "unknown";
    if (!acc[country]) acc[country] = [];
    acc[country].push(node);
    return acc;
  }, {} as Record<string, Pod[]>);

  // Get markers for each country with node count
  const markers = Object.entries(nodesByCountry)
    .filter(([code]) => code !== "unknown" && countryCoordinates[code])
    .map(([code, countryNodes]) => ({
      code,
      coordinates: countryCoordinates[code],
      count: countryNodes.length,
      nodes: countryNodes,
    }));

  return (
    <div className="glass-panel p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Global Distribution</h3>
        <div className="text-sm text-muted-foreground">
          Locations: <span className="text-purple-400 font-bold">{markers.length}</span>
        </div>
      </div>

      <div className="relative bg-black/20 rounded-xl overflow-hidden" style={{ height: "400px" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 140,
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }: any) =>
              geographies.map((geo: any) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#1a1a2e"
                  stroke="#2a2a3e"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none", fill: "#252540" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map((marker) => (
            <Marker key={marker.code} coordinates={marker.coordinates}>
              <motion.g
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: Math.random() * 0.5 }}
              >
                {/* Pulsing ring */}
                <motion.circle
                  r={8 + marker.count / 10}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  opacity={0.3}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                {/* Main marker */}
                <circle
                  r={4 + marker.count / 20}
                  fill="#10b981"
                  stroke="#fff"
                  strokeWidth={1.5}
                  className="cursor-pointer"
                  onClick={() => onNodeClick(marker.nodes[0])}
                  style={{ cursor: "pointer" }}
                />
                {/* Count label */}
                <text
                  textAnchor="middle"
                  y={-12}
                  style={{
                    fontFamily: "system-ui",
                    fill: "#fff",
                    fontSize: "10px",
                    fontWeight: "bold",
                    pointerEvents: "none",
                  }}
                >
                  {marker.count}
                </text>
              </motion.g>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Active Node</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500/20 border-2 border-green-500" />
          <span>Pulse indicates activity</span>
        </div>
      </div>
    </div>
  );
}
