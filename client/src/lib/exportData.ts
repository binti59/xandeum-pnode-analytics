import { Pod } from "@/services/prpc";

/**
 * Export pNodes data to CSV format
 */
export function exportToCSV(nodes: Pod[]): void {
  const headers = [
    "Address",
    "Version",
    "Last Seen",
    "Country",
    "City",
    "Pubkey",
    "Is Public",
    "RPC Port",
  ];

  const rows = nodes.map(node => [
    node.address,
    node.version,
    node.last_seen,
    node.geo?.country || "N/A",
    node.geo?.city || "N/A",
    node.pubkey || "N/A",
    node.is_public ? "Yes" : "No",
    node.rpc_port?.toString() || "N/A",
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
  ].join("\n");

  downloadFile(csvContent, "xandeum-pnodes.csv", "text/csv");
}

/**
 * Export pNodes data to JSON format
 */
export function exportToJSON(nodes: Pod[]): void {
  const jsonContent = JSON.stringify(nodes, null, 2);
  downloadFile(jsonContent, "xandeum-pnodes.json", "application/json");
}

/**
 * Trigger file download in browser
 */
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
