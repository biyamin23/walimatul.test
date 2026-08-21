import React from "react";
import type { GuestWish } from "@/templates/types";

export interface GuestWishesSectionProps {
  wishes: GuestWish[];
  className?: string;
  theme?: {
    accentColor?: string;
    surfaceColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    borderColor?: string;
  };
}

export function GuestWishesSection({
  wishes,
  className = "",
  theme,
}: GuestWishesSectionProps) {
  if (!wishes || wishes.length === 0) {
    return null;
  }

  const accent = theme?.accentColor || "var(--gold, #B8955A)";
  const surface = theme?.surfaceColor || "rgba(255, 255, 255, 0.9)";
  const text = theme?.textColor || "var(--text, #2C2523)";
  const subText = theme?.secondaryTextColor || "var(--text-muted, #736862)";
  const border = theme?.borderColor || "var(--border, #EFE8DF)";

  return (
    <section aria-label="Ucapan Tetamu" className={`space-y-6 ${className}`}>
      <div className="text-center space-y-1">
        <span
          className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-semibold block"
          style={{ color: accent }}
        >
          Doa &amp; Bingkisan Kasih
        </span>
        <h2
          className="text-2xl sm:text-3xl font-display font-semibold"
          style={{ color: text }}
        >
          Ucapan Tetamu
        </h2>
      </div>

      <div className="space-y-3 sm:space-y-4 max-w-lg mx-auto">
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="p-4 sm:p-5 rounded-2xl border shadow-xs text-left space-y-2 transition-all hover:shadow-sm"
            style={{
              backgroundColor: surface,
              borderColor: border,
            }}
          >
            <p
              className="text-xs sm:text-sm font-ui leading-relaxed italic break-words"
              style={{ color: text }}
            >
              &ldquo;{wish.message}&rdquo;
            </p>

            <div className="flex items-center justify-between pt-1 border-t border-[var(--border-soft)]/50">
              <span
                className="text-xs font-semibold font-ui"
                style={{ color: accent }}
              >
                — {wish.guestName || "Tetamu"}
              </span>

              {wish.createdAt && (
                <span
                  className="text-[10px] font-ui opacity-75"
                  style={{ color: subText }}
                >
                  {new Date(wish.createdAt).toLocaleDateString("ms-MY", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
