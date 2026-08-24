import React from "react";
import Link from "next/link";
import type { TopTemplateItem } from "@/lib/data/admin-dashboard";

interface Props {
  items: TopTemplateItem[];
  totalInvitations: number;
}

const RANK_COLORS = ["#b8955a", "#a09894", "#cd7f32", "#a09894", "#a09894"];

/**
 * TopTemplates
 *
 * Server component — no "use client" needed.
 * Renders ranked list (max 5) of templates by invitation usage.
 * Links to /admin/templates/{id}/edit.
 * Shows thumbnail or a safe placeholder.
 */
export function TopTemplates({ items, totalInvitations }: Props) {
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
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-[10px] font-ui font-bold uppercase tracking-widest"
            style={{ color: "var(--text-subtle)" }}
          >
            Top Template
          </p>
          <p
            className="text-base font-display font-bold mt-0.5"
            style={{ color: "var(--text)" }}
          >
            Mengikut Penggunaan
          </p>
        </div>
        <Link
          href="/admin/templates"
          className="text-[11px] font-ui font-medium hover:underline"
          style={{ color: "var(--primary)" }}
        >
          Urus →
        </Link>
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
            Belum ada penggunaan template.
          </p>
        </div>
      ) : (
        <ol
          className="space-y-3"
          aria-label="Senarai template teratas mengikut penggunaan"
        >
          {items.map((tpl, idx) => {
            const pct =
              totalInvitations > 0
                ? Math.round((tpl.count / totalInvitations) * 100)
                : 0;
            const rankColor = RANK_COLORS[idx] ?? "#a09894";

            return (
              <li key={tpl.id}>
                <Link
                  href={`/admin/templates/${tpl.id}/edit`}
                  className="flex items-center gap-3 group"
                  aria-label={`${tpl.name} — ${tpl.count} jemputan (${pct}%)`}
                >
                  {/* Rank */}
                  <span
                    className="w-5 text-center text-xs font-ui font-bold shrink-0 tabular-nums"
                    style={{ color: rankColor }}
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </span>

                  {/* Thumbnail */}
                  <div
                    className="w-9 h-9 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ background: "var(--surface-warm)", border: "1px solid var(--border-soft)" }}
                    aria-hidden="true"
                  >
                    {tpl.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={tpl.thumbnail_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="2" width="12" height="10" rx="1.5" stroke="var(--text-subtle)" strokeWidth="1.2" />
                        <path d="M2 9l4-3 3 3 2-2 3 3" stroke="var(--text-subtle)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  {/* Name + stats */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-ui font-medium truncate group-hover:underline"
                      style={{ color: "var(--text)" }}
                    >
                      {tpl.name}
                    </p>
                    {/* Progress bar */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <div
                        className="flex-1 h-1 rounded-full overflow-hidden"
                        style={{ background: "var(--border-soft)" }}
                        role="presentation"
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: "var(--primary)",
                            opacity: 0.7,
                          }}
                        />
                      </div>
                      <span
                        className="text-[10px] font-ui tabular-nums shrink-0"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {tpl.count} · {pct}%
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
