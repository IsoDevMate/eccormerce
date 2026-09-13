export default function Loading() {
  return (
    <div className="px-4 py-16 md:px-6" aria-busy="true" aria-live="polite">
      <div className="h-3 w-24 animate-pulse bg-line" />
      <div className="mt-4 h-12 w-48 animate-pulse bg-line" />
      <div className="mt-10 grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-[4/5] animate-pulse bg-paper-2" />
        ))}
      </div>
      <p className="sr-only">Loading the shop</p>
    </div>
  );
}
