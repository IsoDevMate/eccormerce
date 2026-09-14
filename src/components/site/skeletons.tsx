import { cn } from "@/lib/cn";

export function Skeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("animate-pulse bg-paper-2", className)}
      aria-hidden
    />
  );
}

/** SKIMS-style PLP loading: title block + chip row + product grid */
export function PlpSkeleton({
  cards = 8,
  showChips = true,
  dense = false,
}: {
  cards?: number;
  showChips?: boolean;
  dense?: boolean;
}) {
  return (
    <div aria-busy="true" aria-label="Loading">
      <section className="px-4 py-5 md:px-6 md:py-6">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="mt-3 h-8 w-48 md:h-9 md:w-56" />
        <Skeleton className="mt-3 h-3 w-72 max-w-full" />
        <Skeleton className="mt-2 h-3 w-56 max-w-full" />
      </section>

      {showChips ? (
        <div className="border-y border-line px-4 py-3 md:px-6">
          <div className="flex gap-3 overflow-hidden">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-14 w-14 shrink-0 rounded-sm md:h-16 md:w-16"
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="border-b border-line px-4 py-3 md:px-6">
        <div className="flex gap-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-2.5 w-12" />
          ))}
        </div>
      </div>

      <div
        className={cn(
          "grid gap-x-2 gap-y-8 px-2 pb-16 pt-4 md:gap-x-3 md:px-3",
          dense ? "grid-cols-3 md:grid-cols-6" : "grid-cols-2 md:grid-cols-4",
        )}
      >
        {Array.from({ length: cards }).map((_, index) => (
          <div key={index}>
            <Skeleton className={dense ? "aspect-square" : "aspect-[4/5]"} />
            <Skeleton className="mt-3 h-2.5 w-16" />
            {!dense ? (
              <>
                <Skeleton className="mt-2 h-3 w-28" />
                <Skeleton className="mt-2 h-3 w-12" />
              </>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PdpSkeleton() {
  return (
    <div className="grid lg:grid-cols-2" aria-busy="true" aria-label="Loading product">
      <div>
        <Skeleton className="aspect-[4/5]" />
        <div className="flex gap-2 border-t border-line px-4 py-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-12 shrink-0" />
          ))}
        </div>
      </div>
      <div className="flex flex-col px-5 py-8 md:px-10 lg:py-12">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="mt-3 h-9 w-64 max-w-full" />
        <Skeleton className="mt-3 h-4 w-16" />
        <Skeleton className="mt-8 h-3 w-28" />
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-8 rounded-full" />
          ))}
        </div>
        <Skeleton className="mt-8 h-2.5 w-12" />
        <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-11" />
          ))}
        </div>
        <Skeleton className="mt-8 h-12 w-full bg-ink/15" />
        <Skeleton className="mt-10 h-10 w-full" />
        <Skeleton className="mt-2 h-10 w-full" />
        <Skeleton className="mt-2 h-10 w-full" />
      </div>
    </div>
  );
}
