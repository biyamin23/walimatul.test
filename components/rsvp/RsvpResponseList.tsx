"use client";

import React, { useState } from "react";
import { toggleRsvpWishPublicAction } from "@/app/actions/rsvps";
import type { RSVP } from "@/types/database";

export interface RsvpResponseListProps {
  rsvps: RSVP[];
  invitationId?: string;
}

export function RsvpResponseList({ rsvps, invitationId }: RsvpResponseListProps) {
  const [items, setItems] = useState<RSVP[]>(rsvps);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-[var(--surface)] border border-[var(--border)] text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[var(--surface-warm)] text-[var(--primary)] flex items-center justify-center mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3 className="font-display text-lg font-semibold text-[var(--text)]">
          Belum Ada Maklum Balas
        </h3>
        <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] max-w-sm mx-auto">
          Maklum balas tetamu yang mengisi borang RSVP pada pautan jemputan anda akan dipaparkan di sini.
        </p>
      </div>
    );
  }

  function formatDateTime(dateStr: string) {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  async function handleTogglePublic(rsvpId: string, currentState: boolean) {
    const parentInvId = invitationId || items.find((i) => i.id === rsvpId)?.invitation_id;
    if (!parentInvId) return;

    const nextState = !currentState;
    setUpdatingId(rsvpId);

    // Optimistic UI update
    setItems((prev) =>
      prev.map((r) => (r.id === rsvpId ? { ...r, show_on_invitation: nextState } : r))
    );

    try {
      const result = await toggleRsvpWishPublicAction(parentInvId, rsvpId, nextState);
      if (!result.success) {
        // Revert on failure
        setItems((prev) =>
          prev.map((r) => (r.id === rsvpId ? { ...r, show_on_invitation: currentState } : r))
        );
      }
    } catch {
      setItems((prev) =>
        prev.map((r) => (r.id === rsvpId ? { ...r, show_on_invitation: currentState } : r))
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-[var(--text)]">
          Senarai Respon ({items.length})
        </h3>
        <span className="text-xs text-[var(--text-muted)] font-ui">
          💡 Ucapan tetamu kekal peribadi melainkan anda memilih untuk memaparkannya.
        </span>
      </div>

      {/* ── Mobile Card View (Hidden on Desktop) ── */}
      <div className="space-y-3 sm:hidden">
        {items.map((rsvp) => {
          const isAttending = rsvp.attendance === "attending";
          const isPublic = Boolean(rsvp.show_on_invitation);
          const isUpdating = updatingId === rsvp.id;

          return (
            <div
              key={rsvp.id}
              className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-ui font-semibold text-sm text-[var(--text)] truncate">
                    {rsvp.guest_name}
                  </h4>
                  <p className="text-[10px] font-ui text-[var(--text-subtle)] mt-0.5">
                    {formatDateTime(rsvp.created_at)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-ui font-semibold shrink-0 ${
                    isAttending
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  {isAttending ? `Hadir (${rsvp.pax} pax)` : "Tidak Hadir"}
                </span>
              </div>

              {rsvp.message ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] text-xs font-ui text-[var(--text)] italic leading-relaxed break-words">
                    “{rsvp.message}”
                  </div>

                  {/* Public Moderation Control */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-ui text-[var(--text-muted)]">
                      Paparan Jemputan:
                    </span>
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleTogglePublic(rsvp.id, isPublic)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold font-ui transition-all cursor-pointer ${
                        isPublic
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                          : "bg-[var(--surface-warm)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)]"
                      } ${isUpdating ? "opacity-50" : ""}`}
                    >
                      {isPublic ? "✓ Dipaparkan" : "+ Paparkan di Jemputan"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] font-ui text-[var(--text-subtle)] italic">
                  Tiada ucapan
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Desktop Table View (Hidden on Mobile) ── */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <table className="w-full text-left border-collapse font-ui text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-warm)] text-[var(--text-subtle)] text-xs font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Nama Tetamu</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Jumlah Pax</th>
              <th className="py-3.5 px-4">Ucapan / Doa</th>
              <th className="py-3.5 px-4 text-center">Paparan Awam</th>
              <th className="py-3.5 px-4 text-right">Tarikh &amp; Masa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-soft)]">
            {items.map((rsvp) => {
              const isAttending = rsvp.attendance === "attending";
              const isPublic = Boolean(rsvp.show_on_invitation);
              const isUpdating = updatingId === rsvp.id;

              return (
                <tr key={rsvp.id} className="hover:bg-[var(--surface-warm)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">
                    {rsvp.guest_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isAttending
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-stone-100 text-stone-600 border border-stone-200"
                      }`}
                    >
                      {isAttending ? "Hadir" : "Tidak Hadir"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-[var(--text)] font-semibold">
                    {isAttending ? rsvp.pax : "—"}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[var(--text-muted)] max-w-xs break-words">
                    {rsvp.message ? `“${rsvp.message}”` : "—"}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {rsvp.message ? (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleTogglePublic(rsvp.id, isPublic)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          isPublic
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200"
                            : "bg-[var(--surface-warm)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)]"
                        } ${isUpdating ? "opacity-50" : ""}`}
                      >
                        {isPublic ? "✓ Dipaparkan" : "+ Paparkan"}
                      </button>
                    ) : (
                      <span className="text-[11px] text-[var(--text-subtle)]">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right text-xs text-[var(--text-subtle)] whitespace-nowrap">
                    {formatDateTime(rsvp.created_at)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
