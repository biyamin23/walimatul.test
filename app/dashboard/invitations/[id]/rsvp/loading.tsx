import React from "react";

export default function InvitationRsvpsLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto animate-pulse p-4 sm:p-0" aria-busy="true" aria-label="Memuatkan senarai kehadiran RSVP...">
      {/* Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-28 bg-gray-200 rounded-full" />
          <div className="h-7 w-64 bg-gray-200 rounded-2xl" />
          <div className="h-4 w-80 max-w-full bg-gray-200/60 rounded-full" />
        </div>
      </div>

      {/* RSVP Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-2">
            <div className="h-3 w-20 bg-gray-200 rounded-full" />
            <div className="h-7 w-12 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded-md" />
        <div className="h-48 w-full bg-gray-100/60 rounded-2xl flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-[var(--primary)] animate-spin" />
        </div>
      </div>
    </div>
  );
}
