import React from 'react';

export default function GlobalSkeleton() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans">
      {/* Fake Header */}
      <header className="fixed top-0 w-full bg-canvas/80 backdrop-blur-md z-50 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-20 flex items-center justify-between">
          <div className="w-40 h-6 bg-zinc-200 animate-pulse rounded"></div>
          <div className="hidden md:flex gap-8 items-center">
            <div className="w-16 h-4 bg-zinc-200 animate-pulse rounded"></div>
            <div className="w-16 h-4 bg-zinc-200 animate-pulse rounded"></div>
            <div className="w-16 h-4 bg-zinc-200 animate-pulse rounded"></div>
            <div className="w-16 h-4 bg-zinc-200 animate-pulse rounded"></div>
            <div className="w-32 h-10 bg-zinc-200 animate-pulse rounded-full ml-4"></div>
          </div>
        </div>
      </header>

      {/* Fake Main Content */}
      <main className="pt-32 flex-grow px-6 sm:px-12 max-w-7xl mx-auto w-full">
        {/* Fake Breadcrumbs */}
        <div className="w-32 h-4 bg-zinc-200 animate-pulse rounded mb-12"></div>
        
        {/* Fake Hero */}
        <div className="max-w-3xl mb-16">
          <div className="w-3/4 h-12 md:h-16 bg-zinc-200 animate-pulse rounded mb-4"></div>
          <div className="w-1/2 h-12 md:h-16 bg-zinc-200 animate-pulse rounded mb-8"></div>
          <div className="w-full h-4 bg-zinc-200 animate-pulse rounded mb-3"></div>
          <div className="w-5/6 h-4 bg-zinc-200 animate-pulse rounded"></div>
        </div>

        {/* Fake Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="w-full aspect-[4/5] bg-zinc-200 animate-pulse rounded-xl"></div>
              <div className="w-2/3 h-5 bg-zinc-200 animate-pulse rounded"></div>
              <div className="w-1/3 h-4 bg-zinc-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
