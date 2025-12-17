import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PNode } from "@/services/prpc";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface PNodeTableProps {
  nodes: PNode[];
}

type SortField = "lastSeen" | "version" | "ip";
type SortDirection = "asc" | "desc";

export function PNodeTable({ nodes }: PNodeTableProps) {
  const [sortField, setSortField] = useState<SortField>("lastSeen");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedNodes = [...nodes].sort((a, b) => {
    let comparison = 0;
    if (sortField === "lastSeen") {
      comparison = a.lastSeen - b.lastSeen;
    } else if (sortField === "version") {
      comparison = a.version.localeCompare(b.version);
    } else if (sortField === "ip") {
      comparison = a.ip.localeCompare(b.ip);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const formatLastSeen = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleString();
  };

  return (
    <div className="border-2 border-foreground bg-card shadow-none rounded-none">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Identity</TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("ip")}
                className="hover:bg-transparent px-0 font-semibold"
              >
                IP Address
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("version")}
                className="hover:bg-transparent px-0 font-semibold"
              >
                Version
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button 
                variant="ghost" 
                onClick={() => handleSort("lastSeen")}
                className="hover:bg-transparent px-0 font-semibold ml-auto"
              >
                Last Seen
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedNodes.map((node) => (
            <TableRow key={node.identity}>
              <TableCell className="font-mono text-xs">
                <span className="bg-muted px-2 py-1 font-bold" title={node.identity}>
                  {node.identity.slice(0, 8)}...{node.identity.slice(-8)}
                </span>
              </TableCell>
              <TableCell className="font-mono text-sm">{node.ip}</TableCell>
              <TableCell>
                <span className="inline-flex items-center border-2 border-foreground px-2.5 py-0.5 text-xs font-bold bg-white text-foreground rounded-none">
                  {node.version}
                </span>
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums">
                {formatLastSeen(node.lastSeen)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
