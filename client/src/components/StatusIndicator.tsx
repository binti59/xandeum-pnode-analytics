import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  online: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function StatusIndicator({ 
  online, 
  size = "md", 
  showLabel = false,
  className 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const dotSize = sizeClasses[size];
  const bgColor = online ? "bg-green-500" : "bg-red-500";
  const glowColor = online ? "shadow-green-500/50" : "shadow-red-500/50";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex items-center justify-center">
        {/* Pulsing outer ring for online status */}
        {online && (
          <div className={cn(
            "absolute rounded-full animate-ping opacity-75",
            dotSize,
            bgColor
          )} />
        )}
        {/* Main status dot */}
        <div className={cn(
          "relative rounded-full shadow-lg",
          dotSize,
          bgColor,
          glowColor
        )} />
      </div>
      {showLabel && (
        <span className={cn(
          "text-xs font-medium",
          online ? "text-green-400" : "text-red-400"
        )}>
          {online ? "Online" : "Offline"}
        </span>
      )}
    </div>
  );
}
