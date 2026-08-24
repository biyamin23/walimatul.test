"use client";

import React, { useState, useTransition } from "react";
import { extendInvitationExpiryAction } from "@/app/actions/admin-invitations";

interface ExtendExpiryCardProps {
  invitationId: string;
  currentExpiresAt: string | null;
  publishedAt: string | null;
  status: string;
}

export function ExtendExpiryCard({
  invitationId,
  currentExpiresAt,
  publishedAt,
  status,
}: ExtendExpiryCardProps) {
  const isDraft = status === "draft" || !publishedAt;
  const [selectedMonths, setSelectedMonths] = useState<number | null>(3);
  const [customDate, setCustomDate] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const baseDate = currentExpiresAt ? new Date(currentExpiresAt) : new Date();

  // Compute preview of new expiry
  let previewDate: Date | null = null;
  if (isCustom && customDate) {
    const d = new Date(customDate);
    if (!isNaN(d.getTime())) {
      previewDate = d;
    }
  } else if (!isCustom && selectedMonths) {
    const d = new Date(baseDate);
    d.setMonth(d.getMonth() + selectedMonths);
    previewDate = d;
  }

  function formatDate(d: Date | null): string {
    if (!d) return "—";
    try {
      return new Intl.DateTimeFormat("ms-MY", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kuala_Lumpur",
      }).format(d);
    } catch {
      return "—";
    }
  }

  function handleExtend() {
    setFeedback(null);

    startTransition(async () => {
      const res = await extendInvitationExpiryAction({
        invitationId,
        extensionMonths: isCustom ? undefined : (selectedMonths || 3),
        customDate: isCustom ? customDate : undefined,
      });

      if (res.success) {
        setFeedback({
          type: "success",
          message: "Tarikh luput jemputan berjaya dilanjutkan!",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Ralat semasa melanjutkan tarikh luput.",
        });
      }
    });
  }

  return (
    <div
      className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Kawalan Sokongan Admin
          </span>
          <h3 className="text-lg font-bold font-display text-[var(--text)]">
            Lanjutan Tempoh Sah Jemputan
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
            Lanjutkan tarikh tamat tempoh jemputan pelanggan ini secara manual.
          </p>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-ui ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
              : "bg-red-50 border border-red-200 text-red-900"
          }`}
          role="alert"
        >
          {feedback.message}
        </div>
      )}

      {isDraft ? (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-ui space-y-1">
          <p className="font-semibold">Jemputan Belum Diterbitkan (Draf)</p>
          <p className="text-[11px] text-amber-800">
            Jemputan ini masih berstatus Draf dan belum mempunyai tarikh luput aktif. Tempoh sah akan diaktifkan secara automatik sebaik sahaja pembayaran disahkan oleh Admin di menu Pembayaran.
          </p>
        </div>
      ) : (
        <>
          {/* Preset selector */}
          <div className="space-y-3">
        <label className="text-xs font-ui font-semibold text-[var(--text)] block">
          Pilihan Tempoh Lanjutan:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[1, 3, 6, 12].map((months) => {
            const isSelected = !isCustom && selectedMonths === months;
            return (
              <button
                key={months}
                type="button"
                onClick={() => {
                  setIsCustom(false);
                  setSelectedMonths(months);
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-ui font-semibold transition-all ${
                  isSelected
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                    : "bg-[var(--surface-warm)] border-[var(--border)] text-[var(--text)] hover:border-stone-400"
                }`}
              >
                +{months} Bulan
              </button>
            );
          })}
        </div>

        {/* Custom date option */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsCustom(!isCustom)}
            className="text-xs font-ui text-[var(--primary)] hover:underline font-medium inline-flex items-center gap-1"
          >
            {isCustom ? "Gunakan pilihan bulan standard ↑" : "Pilih tarikh tersuai ↓"}
          </button>

          {isCustom && (
            <div className="mt-2">
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="px-3 py-2 rounded-xl text-xs font-ui bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Expiry comparison box */}
      <div className="p-4 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] font-ui block">
            Tarikh Luput Semasa
          </span>
          <span className="text-xs sm:text-sm font-ui font-semibold text-[var(--text)]">
            {currentExpiresAt ? formatDate(new Date(currentExpiresAt)) : "Tiada Tarikh Luput"}
          </span>
        </div>

        <div className="text-stone-400 font-bold hidden sm:block">→</div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 font-ui block">
            Tarikh Luput Baharu (Cadangan)
          </span>
          <span className="text-xs sm:text-sm font-ui font-bold text-emerald-800">
            {previewDate ? formatDate(previewDate) : "—"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleExtend}
          disabled={isPending || (isCustom && !customDate)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-xs transition-colors disabled:opacity-50"
        >
          {isPending ? "Sedang Mengemaskini..." : "Sahkan & Lanjutkan"}
        </button>
      </div>
    </>
  )}
</div>
  );
}
