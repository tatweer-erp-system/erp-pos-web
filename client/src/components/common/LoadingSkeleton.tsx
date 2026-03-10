interface LoadingSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
}

function SkeletonCell({ width = "w-full" }: { width?: string }) {
  return <div className={`h-4 ${width} bg-muted rounded animate-pulse`} />;
}

export function LoadingSkeleton({ rows = 8, columns = 4, showHeader = true }: LoadingSkeletonProps) {
  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex gap-4 px-4 py-3 border-b border-border bg-muted/50 mb-1">
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonCell key={i} width="w-24" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-4 px-4 py-4 border-b border-border">
          {Array.from({ length: columns }).map((_, col) => (
            <SkeletonCell key={col} width={col === 0 ? "w-32" : "w-full"} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-component p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="w-10 h-10 bg-muted rounded-lg" />
      </div>
      <div className="h-7 w-32 bg-muted rounded mb-2" />
      <div className="h-3 w-20 bg-muted rounded" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="h-9 w-28 bg-muted rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map((i) => <CardSkeleton key={i} />)}
      </div>
      <LoadingSkeleton rows={6} />
    </div>
  );
}
