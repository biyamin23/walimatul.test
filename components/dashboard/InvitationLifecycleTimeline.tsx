import React from "react";
import type { TimelineStep } from "@/types/client-lifecycle";

interface Props {
  timeline: TimelineStep[];
  compact?: boolean;
}

export function InvitationLifecycleTimeline({ timeline, compact = false }: Props) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Continuous background connector line */}
        <div
          className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-0.5 bg-gray-200 -z-0"
          aria-hidden="true"
        />

        {timeline.map((step) => {
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";
          const isRejected = step.status === "rejected";
          const isWarning = step.status === "warning";

          let circleStyle = "bg-gray-100 border-gray-300 text-gray-400";
          let labelStyle = "text-gray-400 font-medium";

          if (isCompleted) {
            circleStyle = "bg-emerald-600 border-emerald-600 text-white shadow-xs";
            labelStyle = "text-emerald-800 font-bold";
          } else if (isCurrent) {
            circleStyle = "bg-[var(--primary)] border-[var(--primary)] text-white shadow-xs animate-pulse";
            labelStyle = "text-[var(--primary)] font-bold";
          } else if (isRejected) {
            circleStyle = "bg-rose-600 border-rose-600 text-white shadow-xs";
            labelStyle = "text-rose-700 font-bold";
          } else if (isWarning) {
            circleStyle = "bg-amber-500 border-amber-500 text-white shadow-xs";
            labelStyle = "text-amber-700 font-bold";
          }

          return (
            <div
              key={step.key}
              className="flex flex-col items-center relative z-10 text-center"
              style={{ minWidth: compact ? "48px" : "56px" }}
            >
              {/* Step Circle Node */}
              <div
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold font-ui border transition-all ${circleStyle}`}
                title={`${step.stepNumber}. ${step.label} — ${step.description || ""}`}
              >
                {isCompleted ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : isRejected ? (
                  <span>✕</span>
                ) : isWarning ? (
                  <span>!</span>
                ) : (
                  <span>{step.stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-[9px] sm:text-[11px] font-ui mt-1.5 line-clamp-1 select-none ${labelStyle}`}
              >
                {compact ? step.shortLabel : step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
