import React from "react";
import Link from "next/link";
import type { ActivityItem } from "@/lib/data/admin-dashboard";

interface Props {
  items: ActivityItem[];
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

function ActivityIcon({ type }: { type: ActivityItem["type"] }) {
  const iconProps = { width: 14, height: 14, viewBox: "0 0 14 14", fill: "none" };

  const icons: Record<ActivityItem["type"], React.ReactNode> = {
    new_user: (
      <svg {...iconProps} aria-hidden="true">
        <circle cx="7" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2.5 11.5c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    order_submitted: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M2 4.5h10M2 7h6M2 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    order_approved: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    order_rejected: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    invitation_published: (
      <svg {...iconProps} aria-hidden="true">
        <rect x="1.5" y="2" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4.5 6.5h5M4.5 8.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    template_updated: (
      <svg {...iconProps} aria-hidden="true">
        <path d="M8.5 2.5L11.5 5.5L5 12H2V9L8.5 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return <>{icons[type]}</>;
}

const TYPE_COLORS: Record<ActivityItem["type"], { bg: string; text: string }> = {
  new_user: { bg: "#e0f2fe", text: "#0369a1" },
  order_submitted: { bg: "#fef3c7", text: "#d97706" },
  order_approved: { bg: "#d1fae5", text: "#15803d" },
  order_rejected: { bg: "#fee2e2", text: "#dc2626" },
  invitation_published: { bg: "#ede9fe", text: "#7c3aed" },
  template_updated: { bg: "#f1f5f9", text: "#475569" },
};

/**
 * RecentActivity
 *
 * Server component — no "use client" needed.
 * Renders a timeline of platform events derived from multiple table timestamps.
 * The `timestamp` field is pre-computed relative time (e.g. "2 jam lalu").
 * No private data exposed.
 */
export function RecentActivity({ items }: Props) {
  const isEmpty = items.length === 0;

  return (
    <div
      className="rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Header */}
      <div>
        <p
          className="text-[10px] font-ui font-bold uppercase tracking-widest"
          style={{ color: "var(--text-subtle)" }}
        >
          Aktiviti Terbaru
        </p>
        <p
          className="text-base font-display font-bold mt-0.5"
          style={{ color: "var(--text)" }}
        >
          Acara Platform
        </p>
      </div>

      {isEmpty ? (
        <div
          className="flex items-center justify-center rounded-xl min-h-[100px]"
          style={{ background: "var(--surface-warm)" }}
          role="status"
        >
          <p
            className="text-xs font-ui text-center px-4"
            style={{ color: "var(--text-muted)" }}
          >
            Tiada aktiviti terkini.
          </p>
        </div>
      ) : (
        <ol
          className="space-y-1"
          aria-label="Aktiviti platform terkini"
        >
          {items.map((item) => {
            const colors = TYPE_COLORS[item.type] ?? {
              bg: "#f1f5f9",
              text: "#475569",
            };

            const Inner = (
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: colors.bg, color: colors.text }}
                  aria-hidden="true"
                >
                  <ActivityIcon type={item.type} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-ui font-semibold leading-snug"
                    style={{ color: "var(--text)" }}
                  >
                    {item.label}
                  </p>
                  <p
                    className="text-[11px] font-ui truncate mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {item.subtitle}
                  </p>
                </div>

                {/* Timestamp */}
                <span
                  className="text-[10px] font-ui shrink-0 mt-0.5"
                  style={{ color: "var(--text-subtle)" }}
                >
                  {item.timestamp}
                </span>
              </div>
            );

            return (
              <li key={item.id} className="py-1.5">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block rounded-xl px-1 -mx-1 hover:bg-[var(--surface-warm)] transition-colors"
                  >
                    {Inner}
                  </Link>
                ) : (
                  <div className="px-1 -mx-1">{Inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
