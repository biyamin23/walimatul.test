import React from "react";

export default function InvitationPaymentLoading() {
  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-pulse p-4 sm:p-0" aria-busy="true" aria-label="Memuatkan halaman bayaran...">
      {/* Top Breadcrumb Skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-36 bg-gray-200 rounded-md" />
        <div className="h-4 w-28 bg-gray-200 rounded-md" />
      </div>

      {/* Main Payment Checkout Shell */}
      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Summary Card Skeleton */}
        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="h-4 w-24 bg-gray-200 rounded-full" />
          <div className="h-7 w-48 bg-gray-200 rounded-xl" />
          <div className="h-4 w-64 bg-gray-200/60 rounded-full" />
          <div className="pt-3 border-t border-[var(--border-soft)] flex justify-between">
            <div className="h-4 w-20 bg-gray-200 rounded-md" />
            <div className="h-6 w-24 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* QR / Upload Skeleton */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-gray-200 rounded-full" />
            <div className="h-6 w-52 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-48 w-full bg-[var(--surface-warm)] border-2 border-dashed border-[var(--border)] rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-300 border-t-[var(--primary)] animate-spin" />
          </div>
          <div className="h-12 w-full bg-gray-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
