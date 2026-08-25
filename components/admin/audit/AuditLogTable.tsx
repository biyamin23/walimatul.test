"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { AdminAuditLogListItem } from "@/lib/data/admin-audit-logs";

interface AuditLogTableProps {
  logs: AdminAuditLogListItem[];
}

const ACTION_MAP: Record<string, { label: string; badgeClass: string }> = {
  "settings.updated": { label: "Tetapan Dikemas Kini", badgeClass: "bg-blue-50 text-blue-800 border-blue-200" },
  "announcement.created": { label: "Pengumuman Dicipta", badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  "announcement.updated": { label: "Pengumuman Dikemas Kini", badgeClass: "bg-purple-50 text-purple-800 border-purple-200" },
  "announcement.archived": { label: "Pengumuman Diarkib", badgeClass: "bg-stone-100 text-stone-700 border-stone-200" },
  "invitation.expiry_extended": { label: "Tempoh Sah Dilanjutkan", badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  "payment.approved": { label: "Pembayaran Diluluskan", badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  "payment.rejected": { label: "Pembayaran Ditolak", badgeClass: "bg-red-50 text-red-800 border-red-200" },
  "template.created": { label: "Templat Dicipta", badgeClass: "bg-teal-50 text-teal-800 border-teal-200" },
  "template.updated": { label: "Templat Dikemas Kini", badgeClass: "bg-indigo-50 text-indigo-800 border-indigo-200" },
  "template.archived": { label: "Templat Diarkib", badgeClass: "bg-stone-100 text-stone-700 border-stone-200" },
};

function formatDateTime(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat("ms-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function getEntityLink(entityType: string, entityId: string | null): string | null {
  if (!entityId) return null;
  if (entityType === "invitation") return `/admin/invitations/${entityId}`;
  if (entityType === "order" || entityType === "payment") return `/admin/payments/${entityId}`;
  if (entityType === "template") return `/admin/templates/${entityId}/edit`;
  if (entityType === "announcement") return `/admin/announcements/${entityId}/edit`;
  if (entityType === "settings") return `/admin/settings`;
  return null;
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-warm)] text-[10px] font-ui font-bold uppercase tracking-wider text-[var(--text-muted)]">
              <th className="py-3.5 px-5">Masa (MYT)</th>
              <th className="py-3.5 px-4">Admin</th>
              <th className="py-3.5 px-4">Tindakan</th>
              <th className="py-3.5 px-4">Entiti</th>
              <th className="py-3.5 px-5 text-right">Perincian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)] text-xs font-ui">
            {logs.map((log) => {
              const isExpanded = expandedId === log.id;
              const actionMeta = ACTION_MAP[log.action] || {
                label: log.action,
                badgeClass: "bg-stone-100 text-stone-700 border-stone-200",
              };
              const entityLink = getEntityLink(log.entity_type, log.entity_id);

              return (
                <React.Fragment key={log.id}>
                  <tr
                    className={`hover:bg-[var(--surface-warm)]/60 transition-colors cursor-pointer ${
                      isExpanded ? "bg-[var(--surface-warm)]/40" : ""
                    }`}
                    onClick={() => toggleExpand(log.id)}
                  >
                    {/* Timestamp */}
                    <td className="py-4 px-5 text-[var(--text)] font-mono text-[11px] whitespace-nowrap">
                      {formatDateTime(log.created_at)}
                    </td>

                    {/* Admin Name */}
                    <td className="py-4 px-4 font-semibold text-[var(--text)]">
                      {log.adminName}
                    </td>

                    {/* Action Badge */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-ui font-semibold uppercase tracking-wider border ${actionMeta.badgeClass}`}
                      >
                        {actionMeta.label}
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="py-4 px-4">
                      <span className="capitalize font-semibold text-[var(--text)]">
                        {log.entity_type}
                      </span>
                      {log.entity_id && (
                        <span className="text-[10px] text-stone-400 font-mono block">
                          {log.entity_id.slice(0, 10)}...
                        </span>
                      )}
                    </td>

                    {/* Toggle Button */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-[11px] font-ui font-semibold text-[var(--primary)] hover:underline"
                      >
                        {isExpanded ? "Tutup ▲" : "Perincian ▼"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <tr className="bg-[var(--surface-warm)]/30">
                      <td colSpan={5} className="p-5 border-t border-b border-[var(--border)]">
                        <div className="space-y-3 bg-[var(--surface)] p-4 rounded-2xl border border-[var(--border)] text-xs font-ui">
                          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                            <span className="font-semibold text-[var(--text)]">
                              Perincian Perubahan ({log.action})
                            </span>
                            {entityLink && (
                              <Link
                                href={entityLink}
                                className="text-[11px] font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                              >
                                Buka Rekod Entiti →
                              </Link>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Before Data */}
                            <div>
                              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block mb-1">
                                Sebelum (Before Data)
                              </span>
                              <pre className="p-3 rounded-xl bg-[var(--surface-warm)] text-[11px] font-mono text-[var(--text)] overflow-x-auto max-h-48 border border-[var(--border-soft)]">
                                {log.before_data ? JSON.stringify(log.before_data, null, 2) : "— Tiada (Entiti Baharu)"}
                              </pre>
                            </div>

                            {/* After Data */}
                            <div>
                              <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">
                                Selepas (After Data)
                              </span>
                              <pre className="p-3 rounded-xl bg-emerald-50/50 text-[11px] font-mono text-emerald-950 overflow-x-auto max-h-48 border border-emerald-200">
                                {log.after_data ? JSON.stringify(log.after_data, null, 2) : "— Tiada"}
                              </pre>
                            </div>
                          </div>

                          {log.metadata && (
                            <div className="pt-2 border-t border-[var(--border-soft)]">
                              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block mb-1">
                                Metadata Tambahan
                              </span>
                              <pre className="p-2.5 rounded-xl bg-[var(--surface-warm)] text-[11px] font-mono text-[var(--text)] overflow-x-auto border border-[var(--border-soft)]">
                                {JSON.stringify(log.metadata, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Cards */}
      <div className="md:hidden space-y-3">
        {logs.map((log) => {
          const isExpanded = expandedId === log.id;
          const actionMeta = ACTION_MAP[log.action] || {
            label: log.action,
            badgeClass: "bg-stone-100 text-stone-700 border-stone-200",
          };
          const entityLink = getEntityLink(log.entity_type, log.entity_id);

          return (
            <div
              key={log.id}
              className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono text-[10px] text-[var(--text-muted)] block">
                    {formatDateTime(log.created_at)}
                  </span>
                  <p className="font-semibold text-xs text-[var(--text)] mt-0.5">
                    Oleh: {log.adminName}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-ui font-semibold uppercase tracking-wider border ${actionMeta.badgeClass}`}
                >
                  {actionMeta.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-ui p-2.5 rounded-xl bg-[var(--surface-warm)]">
                <span className="text-[var(--text-muted)]">
                  Entiti: <strong className="text-[var(--text)] capitalize">{log.entity_type}</strong>
                </span>
                {entityLink && (
                  <Link
                    href={entityLink}
                    className="text-[var(--primary)] font-semibold hover:underline text-[11px]"
                  >
                    Buka Entiti →
                  </Link>
                )}
              </div>

              <button
                type="button"
                onClick={() => toggleExpand(log.id)}
                className="w-full py-1.5 rounded-xl border border-[var(--border)] text-xs font-ui font-semibold text-[var(--text)] hover:bg-[var(--surface-warm)] transition-colors"
              >
                {isExpanded ? "Tutup Perincian ▲" : "Lihat Perincian Perubahan ▼"}
              </button>

              {isExpanded && (
                <div className="space-y-3 pt-2 text-xs font-ui">
                  {/* Before */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block mb-1">
                      Sebelum
                    </span>
                    <pre className="p-2.5 rounded-xl bg-[var(--surface-warm)] text-[10px] font-mono text-[var(--text)] overflow-x-auto max-h-36 border border-[var(--border-soft)]">
                      {log.before_data ? JSON.stringify(log.before_data, null, 2) : "— Tiada (Entiti Baharu)"}
                    </pre>
                  </div>

                  {/* After */}
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">
                      Selepas
                    </span>
                    <pre className="p-2.5 rounded-xl bg-emerald-50 text-[10px] font-mono text-emerald-950 overflow-x-auto max-h-36 border border-emerald-200">
                      {log.after_data ? JSON.stringify(log.after_data, null, 2) : "— Tiada"}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
