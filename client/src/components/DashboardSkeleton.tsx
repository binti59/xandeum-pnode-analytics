import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Health Score & Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Circle */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center">
          <Skeleton className="w-48 h-48 rounded-full" />
          <div className="mt-6 w-full space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </div>

        {/* Stats Cards & Version Chart */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-panel p-4 rounded-xl">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>

          {/* Version Distribution Chart */}
          <div className="glass-panel p-6 rounded-2xl">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex items-center justify-center">
              <Skeleton className="w-48 h-48 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Network Health Timeline */}
      <div className="glass-panel p-6 rounded-2xl">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>

      {/* Alerts & Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* RPC Stats & Map Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>

      {/* Node Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="glass-panel p-4 rounded-xl">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-24 mb-3" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
