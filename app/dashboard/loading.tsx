import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 animate-pulse" aria-busy="true" aria-label="Memuatkan papan pemuka...">
      {/* Header Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-gray-200/80 rounded-full" />
          <div className="h-7 w-64 bg-gray-200 rounded-2xl" />
          <div className="h-4 w-80 max-w-full bg-gray-200/60 rounded-full" />
        </div>
        <div className="h-11 w-44 bg-gray-200 rounded-2xl shrink-0" />
      </div>

      {/* 4 Summary Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 sm:p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 bg-gray-200/80 rounded-full" />
              <div className="w-8 h-8 rounded-2xl bg-gray-200/60" />
            </div>
            <div className="space-y-1.5">
              <div className="h-7 w-12 bg-gray-200 rounded-xl" />
              <div className="h-3 w-28 bg-gray-200/50 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Next Action Banner Skeleton */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 bg-gray-200 rounded-full" />
            <div className="h-4 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="h-6 w-72 bg-gray-200 rounded-xl" />
          <div className="h-3.5 w-96 max-w-full bg-gray-200/60 rounded-full" />
        </div>
        <div className="h-11 w-40 bg-gray-200 rounded-2xl shrink-0" />
      </div>

      {/* Invitation Cards Grid Skeleton */}
      <div className="space-y-4">
        <div className="h-5 w-48 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded-full" />
                <div className="h-3 w-24 bg-gray-200/70 rounded-full" />
              </div>
              <div className="h-6 w-48 bg-gray-200 rounded-xl" />
              <div className="h-3 w-32 bg-gray-200/60 rounded-full" />
              <div className="h-10 w-full bg-gray-100 rounded-2xl pt-2" />
              <div className="pt-3 border-t border-[var(--border-soft)] flex justify-between">
                <div className="h-8 w-24 bg-gray-200 rounded-xl" />
                <div className="h-8 w-16 bg-gray-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
