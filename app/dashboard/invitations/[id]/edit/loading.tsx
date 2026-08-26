import React from "react";

export default function EditInvitationLoading() {
  return (
    <div className="space-y-6 animate-pulse max-w-7xl mx-auto w-full p-4 sm:p-6" aria-busy="true" aria-label="Memuatkan editor jemputan...">
      {/* Top Bar Skeleton */}
      <div className="h-16 w-full rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
          <div className="h-5 w-48 bg-gray-200 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-20 bg-gray-200 rounded-md hidden sm:block" />
          <div className="h-8 w-24 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="h-28 w-full bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5" />
          <div className="h-96 w-full bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 space-y-4">
            <div className="h-5 w-32 bg-gray-200 rounded-lg" />
            <div className="h-10 w-full bg-gray-100 rounded-xl" />
            <div className="h-10 w-full bg-gray-100 rounded-xl" />
            <div className="h-10 w-full bg-gray-100 rounded-xl" />
          </div>
        </div>

        {/* Right Preview Skeleton */}
        <div className="lg:col-span-7 h-[600px] bg-[#1A2E26]/70 rounded-3xl border border-[var(--border)] p-6 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          <span className="text-xs font-ui text-white/60">Memuatkan paparan langsung...</span>
        </div>
      </div>
    </div>
  );
}
