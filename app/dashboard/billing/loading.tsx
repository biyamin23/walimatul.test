import React from "react";

export default function DashboardBillingLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-pulse p-4 sm:p-0" aria-busy="true" aria-label="Memuatkan rekod pembayaran...">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-gray-200 rounded-full" />
          <div className="h-7 w-56 bg-gray-200 rounded-2xl" />
          <div className="h-4 w-72 max-w-full bg-gray-200/60 rounded-full" />
        </div>
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded-full" />
              <div className="h-4 w-20 bg-gray-200 rounded-full" />
            </div>
            <div className="h-6 w-48 bg-gray-200 rounded-xl" />
            <div className="h-3 w-28 bg-gray-200/60 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
