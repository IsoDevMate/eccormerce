export default function ProductLoading() {
  return (
    <div className="grid lg:grid-cols-2" aria-busy="true">
      <div className="aspect-[4/5] animate-pulse bg-paper-2" />
      <div className="space-y-4 px-5 py-10 md:px-10">
        <div className="h-3 w-32 animate-pulse bg-line" />
        <div className="h-12 w-64 animate-pulse bg-line" />
        <div className="h-4 w-20 animate-pulse bg-line" />
        <div className="h-24 w-full animate-pulse bg-line" />
        <div className="h-12 w-full animate-pulse bg-ink/20" />
      </div>
      <p className="sr-only">Loading product</p>
    </div>
  );
}
