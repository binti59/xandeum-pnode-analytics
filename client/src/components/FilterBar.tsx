import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "./ui/badge";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  onlineCount: number;
  publicCount: number;
}

export function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  totalCount, 
  onlineCount, 
  publicCount 
}: FilterBarProps) {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search pNodes..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-12 bg-black/20 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-lg"
        />
      </div>

      {/* Filter Pills */}
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full cursor-pointer transition-colors">
          {totalCount} pNodes
        </Badge>
        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full cursor-pointer transition-colors">
          {onlineCount} online
        </Badge>
        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full cursor-pointer transition-colors">
          {publicCount} public
        </Badge>
      </div>
    </div>
  );
}
