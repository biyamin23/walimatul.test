"use client";

import React from "react";

export interface FloatingMusicControlProps {
  isPlaying: boolean;
  isLoading: boolean;
  hasInteracted: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Pure Presentational Floating Music Button
 * Controlled entirely by InvitationExperience (Single YouTube Player Architecture).
 */
export function FloatingMusicControl({
  isPlaying,
  isLoading,
  hasInteracted,
  onToggle,
  className = "",
}: FloatingMusicControlProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${className}`}
      style={{ WebkitTransform: "translateZ(0)" }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={isPlaying ? "Jeda muzik latar" : "Mainkan muzik latar"}
        className={`group relative flex items-center gap-2 p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg border backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-95 ${
          isPlaying
            ? "bg-[var(--primary)] text-white border-[var(--primary)] ring-4 ring-[var(--primary)]/20"
            : "bg-white/90 dark:bg-stone-900/90 text-[var(--text)] border-[var(--border)] hover:border-[var(--primary)]"
        }`}
      >
        {/* Animated sound bars or play icon */}
        {isLoading ? (
          <span className="w-5 h-5 flex items-center justify-center animate-spin">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" />
            </svg>
          </span>
        ) : isPlaying ? (
          <div className="flex items-center gap-0.5 h-4 px-0.5" aria-hidden="true">
            <span className="w-0.75 bg-current rounded-full animate-[bounce_1s_infinite_100ms] h-4" />
            <span className="w-0.75 bg-current rounded-full animate-[bounce_1s_infinite_300ms] h-2.5" />
            <span className="w-0.75 bg-current rounded-full animate-[bounce_1s_infinite_200ms] h-3.5" />
            <span className="w-0.75 bg-current rounded-full animate-[bounce_1s_infinite_400ms] h-2" />
          </div>
        ) : (
          <span className="text-base leading-none" aria-hidden="true">
            🎵
          </span>
        )}

        <span className="hidden sm:inline text-xs font-semibold font-ui tracking-wide">
          {isPlaying ? "Muzik Dimainkan" : "Muzik Latar"}
        </span>

        {/* First-time prompt pulse when not yet interacted */}
        {!hasInteracted && !isPlaying && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--primary)]" />
          </span>
        )}
      </button>
    </div>
  );
}

// Backward compatibility alias for presentational use
export const FloatingMusicPlayer = FloatingMusicControl;
