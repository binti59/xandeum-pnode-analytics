import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  onlineCount: number;
  publicCount: number;
  activeFilter: "all" | "online" | "offline";
  onFilterChange: (filter: "all" | "online" | "offline") => void;
}

export function FilterBar({ 
  searchQuery, 
  onSearchChange, 
  totalCount, 
  onlineCount, 
  publicCount,
  activeFilter,
  onFilterChange
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

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("all")}
          className={activeFilter === "all" 
            ? "bg-primary text-primary-foreground" 
            : "glass-input hover:bg-white/10 border-white/10 text-white"
          }
        >
          All
        </Button>
        <Button
          variant={activeFilter === "online" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("online")}
          className={activeFilter === "online" 
            ? "bg-green-500 text-white hover:bg-green-600" 
            : "glass-input hover:bg-white/10 border-white/10 text-white"
          }
        >
          Online
        </Button>
        <Button
          variant={activeFilter === "offline" ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("offline")}
          className={activeFilter === "offline" 
            ? "bg-red-500 text-white hover:bg-red-600" 
            : "glass-input hover:bg-white/10 border-white/10 text-white"
          }
        >
          Offline
        </Button>

        <div className="flex-1" />

        {/* Stats Pills */}
        <Badge variant="secondary" className="bg-white/10 text-white px-3 py-1.5 rounded-full">
          {totalCount} pNodes
        </Badge>
        <Badge variant="secondary" className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full border border-green-500/30">
          {onlineCount} online
        </Badge>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full border border-blue-500/30">
          {publicCount} public
        </Badge>
      </div>
    </div>
  );
}
