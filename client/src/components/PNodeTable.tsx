import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pod } from "@/services/prpc";
import { motion } from "framer-motion";
import { ArrowUpDown, Clock, Globe, Tag } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface PNodeTableProps {
  nodes: Pod[];
}

type SortField = "lastSeen" | "version" | "address";
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
      comparison = a.last_seen_timestamp - b.last_seen_timestamp;
    } else if (sortField === "version") {
      comparison = a.version.localeCompare(b.version);
    } else if (sortField === "address") {
      comparison = a.address.localeCompare(b.address);
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-xl overflow-hidden"
    >
      <Table>
        <TableHeader className="bg-black/20">
          <TableRow className="hover:bg-transparent border-white/5">
            <TableHead className="w-[300px]">
               <Button 
                variant="ghost" 
                onClick={() => handleSort("address")}
                className="hover:bg-white/5 hover:text-primary px-2 font-semibold text-muted-foreground transition-colors"
              >
                <Globe className="mr-2 h-4 w-4" />
                Address
                <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
              </Button>
            </TableHead>
            <TableHead>
              <Button 
                variant="ghost" 
                onClick={() => handleSort("version")}
                className="hover:bg-white/5 hover:text-blue-400 px-2 font-semibold text-muted-foreground transition-colors"
              >
                <Tag className="mr-2 h-4 w-4" />
                Version
                <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button 
                variant="ghost" 
                onClick={() => handleSort("lastSeen")}
                className="hover:bg-white/5 hover:text-purple-400 px-2 font-semibold text-muted-foreground transition-colors ml-auto"
              >
                <Clock className="mr-2 h-4 w-4" />
                Last Seen
                <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedNodes.map((node, index) => (
            <TableRow 
              key={node.address} 
              className="border-white/5 hover:bg-white/5 transition-colors group"
            >
              <TableCell className="font-mono text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                  <span className="text-foreground/90 group-hover:text-primary transition-colors">
                    {node.address}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {node.version}
                </span>
              </TableCell>
              <TableCell className="text-right text-muted-foreground tabular-nums group-hover:text-foreground transition-colors">
                {formatLastSeen(node.last_seen_timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
