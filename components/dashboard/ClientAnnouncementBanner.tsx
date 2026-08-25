import React from "react";
import { getActiveClientAnnouncement } from "@/lib/data/admin-announcements";

export async function ClientAnnouncementBanner() {
  const announcement = await getActiveClientAnnouncement();

  if (!announcement) {
    return null;
  }

  return (
    <div
      className="rounded-[var(--radius-xl)] p-5 sm:p-6 mb-6 relative overflow-hidden transition-all"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #fdf2f8 100%)",
        border: "1px solid #bbf7d0",
        boxShadow: "var(--shadow-xs)",
      }}
      role="region"
      aria-label="Pengumuman Pentadbir"
    >
      <div className="flex items-start gap-3.5">
        <div
          className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-sm shrink-0 mt-0.5"
          aria-hidden="true"
        >
          📢
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-200/60 text-emerald-900 font-ui">
              Makluman
            </span>
            <h3 className="font-display font-bold text-sm sm:text-base text-emerald-950">
              {announcement.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm font-ui text-emerald-900/90 leading-relaxed whitespace-pre-wrap">
            {announcement.message}
          </p>
        </div>
      </div>
    </div>
  );
}
