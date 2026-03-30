export default function Loading() {
  return (
    <div className="min-h-screen bg-[var(--background)] p-6 md:p-12 lg:p-16 w-full max-w-6xl mx-auto space-y-12 animate-pulse pt-32">
      {/* Header Skeleton */}
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-aubergine-dark/10 rounded-full" />
        <div className="space-y-4 flex-1">
          <div className="h-8 w-1/3 bg-aubergine-dark/10 rounded" />
          <div className="h-4 w-1/4 bg-aubergine-dark/10 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-cream/40 h-[400px] rounded-[2.5rem] p-8">
          <div className="h-8 w-1/4 bg-aubergine-dark/10 rounded mb-8" />
          <div className="flex justify-between mt-12 w-full px-8">
            <div className="w-16 h-16 bg-aubergine-dark/10 rounded-full" />
            <div className="w-16 h-16 bg-aubergine-dark/10 rounded-full" />
            <div className="w-16 h-16 bg-aubergine-dark/10 rounded-full" />
            <div className="w-16 h-16 bg-aubergine-dark/10 rounded-full" />
          </div>
        </div>
        
        <div className="lg:col-span-4 bg-cream/40 h-[400px] rounded-[2.5rem] p-8">
          <div className="h-8 w-1/2 bg-aubergine-dark/10 rounded mb-8" />
          <div className="space-y-4">
            <div className="h-20 w-full bg-aubergine-dark/10 rounded-2xl" />
            <div className="h-20 w-full bg-aubergine-dark/10 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
