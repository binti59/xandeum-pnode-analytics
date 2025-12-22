import { Pod } from "@/services/prpc";
import { statsCache } from "./statsCache";

/**
 * Filter nodes to only include those with accessible RPC ports
 */
export function filterAccessibleNodes(nodes: Pod[]): Pod[] {
  return nodes.filter((node) => {
    const cached = statsCache.get(node.address);
    return cached?.accessible === true;
  });
}

/**
 * Export RPC-accessible nodes to CSV format
 */
export function exportAccessibleToCSV(nodes: Pod[]): void {
  const accessibleNodes = filterAccessibleNodes(nodes);

  if (accessibleNodes.length === 0) {
    alert("No RPC-accessible nodes found. Click nodes to test RPC accessibility first.");
    return;
  }

  const headers = [
    "Address",
    "IP",
    "Port",
    "RPC Port",
    "Version",
    "Country",
    "City",
    "Status",
    "Public",
  ];

  const rows = accessibleNodes.map((node) => [
    node.address,
    node.address.split(":")[0],
    node.address.split(":")[1] || "9001",
    "6000", // RPC port
    node.version || "Unknown",
    node.geo?.country || "Unknown",
    node.geo?.city || "Unknown",
    "Online", // All nodes in the list are online
    node.is_public ? "Yes" : "No",
  ]);

  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `xandeum-rpc-accessible-nodes-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Export RPC-accessible nodes to JSON format
 */
export function exportAccessibleToJSON(nodes: Pod[]): void {
  const accessibleNodes = filterAccessibleNodes(nodes);

  if (accessibleNodes.length === 0) {
    alert("No RPC-accessible nodes found. Click nodes to test RPC accessibility first.");
    return;
  }

  const exportData = {
    exportDate: new Date().toISOString(),
    totalAccessibleNodes: accessibleNodes.length,
    nodes: accessibleNodes.map((node) => ({
      address: node.address,
      ip: node.address.split(":")[0],
      gossipPort: node.address.split(":")[1] || "9001",
      rpcPort: "6000",
      rpcEndpoint: `http://${node.address.split(":")[0]}:6000/rpc`,
      version: node.version || "Unknown",
      country: node.geo?.country || "Unknown",
      city: node.geo?.city || "Unknown",
      // countryCode not available in Pod interface
      flag: node.geo?.flag || "",
      status: "online", // All nodes in the list are online
      isPublic: node.is_public,
    })),
  };

  const json = JSON.stringify(exportData, null, 2);

  const blob = new Blob([json], { type: "application/json" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `xandeum-rpc-accessible-nodes-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
