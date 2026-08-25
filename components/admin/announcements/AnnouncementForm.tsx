"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Announcement, AnnouncementStatus } from "@/types/database";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
  archiveAnnouncementAction,
} from "@/app/actions/admin-announcements";

interface AnnouncementFormProps {
  initialData?: Announcement | null;
}

function toLocalDateTimeInputString(isoString: string | null | undefined): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function AnnouncementForm({ initialData }: AnnouncementFormProps) {
  const isEditing = Boolean(initialData);
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [message, setMessage] = useState(initialData?.message || "");
  const [status, setStatus] = useState<AnnouncementStatus>(initialData?.status || "draft");
  const [startsAt, setStartsAt] = useState(toLocalDateTimeInputString(initialData?.starts_at));
  const [endsAt, setEndsAt] = useState(toLocalDateTimeInputString(initialData?.ends_at));

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    startTransition(async () => {
      const payload = {
        title,
        message,
        status,
        startsAt: startsAt ? new Date(startsAt).toISOString() : null,
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      };

      if (isEditing && initialData) {
        const res = await updateAnnouncementAction(initialData.id, payload);
        if (res.success) {
          setFeedback({ type: "success", msg: "Pengumuman berjaya dikemas kini!" });
          router.refresh();
        } else {
          setFeedback({ type: "error", msg: res.error || "Gagal mengemas kini pengumuman." });
        }
      } else {
        const res = await createAnnouncementAction(payload);
        if (res.success && res.data?.id) {
          router.push(`/admin/announcements`);
        } else {
          setFeedback({ type: "error", msg: res.error || "Gagal mencipta pengumuman." });
        }
      }
    });
  }

  function handleArchive() {
    if (!initialData || !confirm("Adakah anda pasti ingin mengarkibkan pengumuman ini?")) return;

    startTransition(async () => {
      const res = await archiveAnnouncementAction(initialData.id);
      if (res.success) {
        router.push("/admin/announcements");
      } else {
        setFeedback({ type: "error", msg: res.error || "Gagal mengarkibkan pengumuman." });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ── Form Column (2 Cols) ── */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
          <h2 className="text-base font-bold font-display text-[var(--text)]">
            {isEditing ? "Kemaskini Pengumuman" : "Maklumat Pengumuman Baharu"}
          </h2>
          {isEditing && (
            <span className="text-[10px] text-stone-400 font-mono">
              ID: {initialData?.id.slice(0, 8)}...
            </span>
          )}
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-ui ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {feedback.msg}
          </div>
        )}

        {/* Title */}
        <div className="text-xs font-ui">
          <label className="font-semibold text-[var(--text)] block mb-1">
            Tajuk Pengumuman
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Penambahbaikan Templat Hybrid & Pakej Baharu"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs font-semibold"
            required
          />
        </div>

        {/* Message */}
        <div className="text-xs font-ui">
          <label className="font-semibold text-[var(--text)] block mb-1">
            Kandungan Mesej (Teks Biasa)
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tuliskan makluman yang ingin disampaikan kepada pelanggan di papan pemuka mereka..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs resize-y"
            required
          />
        </div>

        {/* Status */}
        <div className="text-xs font-ui">
          <label className="font-semibold text-[var(--text)] block mb-1">
            Status Paparan
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as AnnouncementStatus)}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs font-semibold"
          >
            <option value="draft">Draf (Tidak dipaparkan kepada klien)</option>
            <option value="active">Aktif (Dipaparkan mengikut jadual)</option>
            <option value="archived">Diarkib (Tamat dan disimpan)</option>
          </select>
        </div>

        {/* Schedule dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-ui pt-1">
          <div>
            <label className="font-semibold text-[var(--text)] block mb-1">
              Tarikh &amp; Masa Mula (Pilihan)
            </label>
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs"
            />
            <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
              Kosongkan jika ingin paparkan serta-merta apabila diaktifkan.
            </span>
          </div>

          <div>
            <label className="font-semibold text-[var(--text)] block mb-1">
              Tarikh &amp; Masa Tamat (Pilihan)
            </label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs"
            />
            <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
              Kosongkan jika pengumuman berterusan tanpa had masa.
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[var(--border)]">
          <div>
            {isEditing && status !== "archived" && (
              <button
                type="button"
                onClick={handleArchive}
                disabled={isPending}
                className="text-xs font-ui text-red-600 hover:text-red-800 font-semibold transition-colors"
              >
                Arkibkan Pengumuman
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Link
              href="/admin/announcements"
              className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-ui font-semibold text-[var(--text)] hover:bg-[var(--surface-warm)] transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-xs transition-colors disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : isEditing ? "Kemas Kini" : "Cipta Pengumuman"}
            </button>
          </div>
        </div>
      </form>

      {/* ── Preview Column (1 Col) ── */}
      <div className="space-y-4">
        <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Pratonton Papan Pemuka Klien
          </span>
          <p className="text-xs font-ui text-[var(--text-muted)]">
            Beginilah rupa pengumuman ini apabila dipaparkan di bahagian atas <code>/dashboard</code> pelanggan.
          </p>

          <div
            className="rounded-2xl p-5 border border-emerald-200 bg-emerald-50/70 text-emerald-950 space-y-2 mt-3"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
              <h4 className="font-display font-bold text-sm text-emerald-900">
                {title || "Tajuk Pengumuman..."}
              </h4>
            </div>
            <p className="text-xs font-ui text-emerald-800 leading-relaxed whitespace-pre-wrap">
              {message || "Kandungan mesej pengumuman akan dipaparkan di sini..."}
            </p>
          </div>

          <div className="pt-2 text-[11px] font-ui text-[var(--text-muted)] space-y-1">
            <p>
              Status: <strong className="text-[var(--text)] uppercase">{status}</strong>
            </p>
            {startsAt && <p>Mula: {new Date(startsAt).toLocaleString("ms-MY")}</p>}
            {endsAt && <p>Tamat: {new Date(endsAt).toLocaleString("ms-MY")}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
