import React from "react";
import { getRuntimePlatformSetting } from "@/lib/data/platform-settings";

export async function MaintenanceNoticeBanner() {
  const notice = await getRuntimePlatformSetting("maintenance_notice");

  if (!notice || !notice.enabled || !notice.text) {
    return null;
  }

  return (
    <div
      className="rounded-[var(--radius-xl)] p-4 sm:p-5 mb-6 relative overflow-hidden transition-all border border-amber-300 bg-amber-50/90 text-amber-950 shadow-xs"
      role="alert"
      aria-label="Notis Penyelenggaraan Sistem"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-full bg-amber-200 border border-amber-300 text-amber-900 flex items-center justify-center text-xs shrink-0 mt-0.5"
          aria-hidden="true"
        >
          🛠️
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-ui">
              Penyelenggaraan
            </span>
            <h4 className="font-display font-bold text-xs sm:text-sm text-amber-950">
              Notis Penyelenggaraan Sistem
            </h4>
          </div>
          <p className="text-xs font-ui text-amber-900/90 leading-relaxed whitespace-pre-wrap">
            {notice.text}
          </p>
        </div>
      </div>
    </div>
  );
}
