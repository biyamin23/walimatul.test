"use client";

import React from "react";
import Link from "next/link";
import { SlugField } from "./SlugField";
import { GalleryManager } from "./GalleryManager";
import { extractYouTubeVideoId } from "@/lib/youtube";
import type { UpdateInvitationInput } from "@/lib/validation/invitation";
import type { GalleryItem } from "@/templates/types";

export interface InvitationFormProps {
  invitationId: string;
  values: UpdateInvitationInput;
  onChange: <K extends keyof UpdateInvitationInput>(
    field: K,
    value: UpdateInvitationInput[K]
  ) => void;
  initialGallery?: GalleryItem[];
  onGalleryChange?: (items: GalleryItem[]) => void;
  errors?: Record<string, string[]>;
}

export function InvitationForm({
  invitationId,
  values,
  onChange,
  initialGallery = [],
  onGalleryChange,
  errors = {},
}: InvitationFormProps) {
  // Shared styling classes for consistent field presentation & iOS zoom prevention
  const inputClass =
    "w-full max-w-full min-w-0 box-border px-3.5 py-2.5 min-h-[48px] sm:min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-base sm:text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]";

  // Dedicated iOS-safe date input class
  const iosDateInputClass =
    "w-full max-w-full min-w-0 box-border block px-3.5 py-2.5 min-h-[48px] sm:min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-base sm:text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";

  const timeInputClass =
    "w-full max-w-full min-w-0 box-border block px-3.5 py-2.5 min-h-[48px] sm:min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-base sm:text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all";

  const urlInputClass =
    "w-full max-w-full min-w-0 box-border px-3.5 py-2.5 min-h-[48px] sm:min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-base sm:text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]";

  const textareaClass =
    "w-full max-w-full min-w-0 box-border px-3.5 py-2.5 min-h-[110px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-base sm:text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)] resize-y";

  const labelClass =
    "block text-xs sm:text-xs font-semibold font-ui text-[var(--text)] mb-1.5 break-words max-w-full";

  const helperClass =
    "text-[11px] sm:text-xs text-[var(--text-subtle)] font-ui mt-1.5 leading-relaxed break-words max-w-full";

  const errorClass =
    "text-xs text-red-600 font-ui mt-1.5 font-medium break-words max-w-full";

  const fieldsetClass =
    "p-4 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-4 sm:space-y-5 w-full max-w-full min-w-0 box-border overflow-hidden";

  const parsedYoutubeId = values.musicYoutubeUrl
    ? extractYouTubeVideoId(values.musicYoutubeUrl)
    : values.musicYoutubeVideoId || null;

  return (
    <form className="space-y-6 sm:space-y-8 w-full max-w-full min-w-0 box-border" onSubmit={(e) => e.preventDefault()}>
      {/* ── Section 1: Couple Details ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          1. Maklumat Mempelai (Couple Details)
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
          {/* Groom Full Name */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="groom-name" className={labelClass}>
              Nama Penuh Pengantin Lelaki
            </label>
            <input
              id="groom-name"
              type="text"
              value={values.groomName || ""}
              onChange={(e) => onChange("groomName", e.target.value)}
              placeholder="Abu Bakar bin Abdullah"
              className={inputClass}
            />
            {errors.groomName && <p className={errorClass}>{errors.groomName[0]}</p>}
          </div>

          {/* Groom Short Name */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="groom-short-name" className={labelClass}>
              Nama Panggilan / Ringkas (Lelaki)
            </label>
            <input
              id="groom-short-name"
              type="text"
              value={values.groomShortName || ""}
              onChange={(e) => onChange("groomShortName", e.target.value)}
              placeholder="Abu"
              className={inputClass}
            />
            <p className={helperClass}>Dipaparkan besar pada muka depan jemputan.</p>
          </div>

          {/* Bride Full Name */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="bride-name" className={labelClass}>
              Nama Penuh Pengantin Perempuan
            </label>
            <input
              id="bride-name"
              type="text"
              value={values.brideName || ""}
              onChange={(e) => onChange("brideName", e.target.value)}
              placeholder="Siti Aisyah binti Rahman"
              className={inputClass}
            />
            {errors.brideName && <p className={errorClass}>{errors.brideName[0]}</p>}
          </div>

          {/* Bride Short Name */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="bride-short-name" className={labelClass}>
              Nama Panggilan / Ringkas (Perempuan)
            </label>
            <input
              id="bride-short-name"
              type="text"
              value={values.brideShortName || ""}
              onChange={(e) => onChange("brideShortName", e.target.value)}
              placeholder="Aisyah"
              className={inputClass}
            />
            <p className={helperClass}>Dipaparkan besar pada muka depan jemputan.</p>
          </div>
        </div>
      </fieldset>

      {/* ── Section 2: Event Date & Time ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          2. Tarikh &amp; Masa Majlis (Date &amp; Time)
        </legend>

        <div className="space-y-4 w-full min-w-0">
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="wedding-date" className={labelClass}>
              Tarikh Majlis Perkahwinan
            </label>
            <input
              id="wedding-date"
              type="date"
              value={values.weddingDate || ""}
              onChange={(e) => onChange("weddingDate", e.target.value)}
              className={iosDateInputClass}
            />
            {errors.weddingDate && <p className={errorClass}>{errors.weddingDate[0]}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
            <div className="space-y-1 min-w-0 w-full">
              <label htmlFor="start-time" className={labelClass}>
                Masa Mula
              </label>
              <input
                id="start-time"
                type="time"
                value={values.startTime || ""}
                onChange={(e) => onChange("startTime", e.target.value)}
                className={timeInputClass}
              />
            </div>

            <div className="space-y-1 min-w-0 w-full">
              <label htmlFor="end-time" className={labelClass}>
                Masa Tamat (Pilihan)
              </label>
              <input
                id="end-time"
                type="time"
                value={values.endTime || ""}
                onChange={(e) => onChange("endTime", e.target.value)}
                className={timeInputClass}
              />
              {errors.endTime && <p className={errorClass}>{errors.endTime[0]}</p>}
            </div>
          </div>
        </div>
      </fieldset>

      {/* ── Section 3: Venue & Location ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          3. Lokasi &amp; Peta (Venue &amp; Maps)
        </legend>

        <div className="space-y-4 w-full min-w-0">
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="venue-name" className={labelClass}>
              Nama Tempat / Dewan / Kediaman
            </label>
            <input
              id="venue-name"
              type="text"
              value={values.venueName || ""}
              onChange={(e) => onChange("venueName", e.target.value)}
              placeholder="Dewan Perdana Felda"
              className={inputClass}
            />
          </div>

          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="venue-address" className={labelClass}>
              Alamat Penuh
            </label>
            <textarea
              id="venue-address"
              rows={3}
              value={values.venueAddress || ""}
              onChange={(e) => onChange("venueAddress", e.target.value)}
              placeholder="Jalan Maktab, Kampung Datuk Keramat, 54000 Kuala Lumpur"
              className={textareaClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
            <div className="space-y-1 min-w-0 w-full">
              <label htmlFor="google-maps-url" className={labelClass}>
                Pautan Google Maps (Pilihan)
              </label>
              <input
                id="google-maps-url"
                type="url"
                value={values.googleMapsUrl || ""}
                onChange={(e) => onChange("googleMapsUrl", e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className={urlInputClass}
              />
              {errors.googleMapsUrl && <p className={errorClass}>{errors.googleMapsUrl[0]}</p>}
            </div>

            <div className="space-y-1 min-w-0 w-full">
              <label htmlFor="waze-url" className={labelClass}>
                Pautan Waze (Pilihan)
              </label>
              <input
                id="waze-url"
                type="url"
                value={values.wazeUrl || ""}
                onChange={(e) => onChange("wazeUrl", e.target.value)}
                placeholder="https://waze.com/ul/..."
                className={urlInputClass}
              />
              {errors.wazeUrl && <p className={errorClass}>{errors.wazeUrl[0]}</p>}
            </div>
          </div>
        </div>
      </fieldset>

      {/* ── Section 4: Messages ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          4. Teks &amp; Ucapan (Invitation Texts)
        </legend>

        <div className="space-y-4 w-full min-w-0">
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="opening-message" className={labelClass}>
              Teks Pembuka / Firman / Pantun
            </label>
            <textarea
              id="opening-message"
              rows={3}
              value={values.openingMessage || ""}
              onChange={(e) => onChange("openingMessage", e.target.value)}
              placeholder="Dengan izin Allah S.W.T kami menjemput..."
              className={textareaClass}
            />
          </div>

          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="invitation-message" className={labelClass}>
              Lafaz Jemputan
            </label>
            <textarea
              id="invitation-message"
              rows={3}
              value={values.invitationMessage || ""}
              onChange={(e) => onChange("invitationMessage", e.target.value)}
              placeholder="Meraikan majlis penyatuan dua jiwa..."
              className={textareaClass}
            />
          </div>

          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="closing-message" className={labelClass}>
              Ucapan Penutup / Harapan
            </label>
            <textarea
              id="closing-message"
              rows={3}
              value={values.closingMessage || ""}
              onChange={(e) => onChange("closingMessage", e.target.value)}
              placeholder="Semoga dengan kehadiran dan doa restu hadirin..."
              className={textareaClass}
            />
          </div>
        </div>
      </fieldset>

      {/* ── Section 5: RSVP Settings ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          5. Tetapan RSVP (Guest Attendance)
        </legend>

        <div className="space-y-4 w-full min-w-0">
          <label
            htmlFor="rsvp-enabled-checkbox"
            className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] gap-3 min-w-0 w-full cursor-pointer hover:border-[var(--border)] transition-colors select-none"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold font-ui text-[var(--text)] break-words">
                Aktifkan Borang RSVP
              </p>
              <p className="text-xs text-[var(--text-muted)] font-ui mt-0.5 break-words">
                Membolehkan tetamu mengesahkan kehadiran dan jumlah pax.
              </p>
            </div>
            <input
              type="checkbox"
              id="rsvp-enabled-checkbox"
              checked={values.rsvpEnabled}
              onChange={(e) => onChange("rsvpEnabled", e.target.checked)}
              className="shrink-0 w-5 h-5 accent-[var(--primary)] rounded cursor-pointer"
            />
          </label>

          {values.rsvpEnabled && (
            <div className="space-y-4 pt-1 w-full min-w-0">
              <div className="space-y-1 min-w-0 w-full">
                <label htmlFor="rsvp-deadline" className={labelClass}>
                  Tarikh Akhir RSVP
                </label>
                <input
                  id="rsvp-deadline"
                  type="date"
                  value={values.rsvpDeadline || ""}
                  onChange={(e) => onChange("rsvpDeadline", e.target.value)}
                  className={iosDateInputClass}
                />
              </div>

              <div className="space-y-1 min-w-0 w-full">
                <label htmlFor="max-pax" className={labelClass}>
                  Maksimum Pax bagi Setiap Tetamu
                </label>
                <input
                  id="max-pax"
                  type="number"
                  min={1}
                  max={20}
                  value={values.maxPax}
                  onChange={(e) => onChange("maxPax", parseInt(e.target.value, 10) || 1)}
                  className={inputClass}
                />
              </div>

              <div className="pt-1 min-w-0 w-full">
                <label
                  htmlFor="allow-guest-message-checkbox"
                  className="flex items-start gap-2.5 min-w-0 w-full cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id="allow-guest-message-checkbox"
                    checked={values.allowGuestMessage}
                    onChange={(e) => onChange("allowGuestMessage", e.target.checked)}
                    className="mt-0.5 shrink-0 w-4 h-4 accent-[var(--primary)] rounded cursor-pointer"
                  />
                  <span className="text-xs font-ui text-[var(--text)] leading-normal break-words flex-1">
                    Benarkan tetamu menulis ucapan / doa bersama borang RSVP
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </fieldset>

      {/* ── Section 6: Invitation URL (Slug) ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          6. Pautan Jemputan (Unique URL)
        </legend>

        <SlugField
          value={values.slug || ""}
          invitationId={invitationId}
          onChange={(newSlug) => onChange("slug", newSlug)}
          error={errors.slug?.[0]}
        />
      </fieldset>

      {/* ── Section 7: Photo Gallery (Phase 10B) ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          7. Galeri Foto (Photo Gallery)
        </legend>

        <GalleryManager
          invitationId={invitationId}
          initialGallery={initialGallery}
          onChange={onGalleryChange}
        />
      </fieldset>

      {/* ── Section 8: Live Countdown (Phase 10B) ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          8. Kira Detik Masa Nyata (Live Countdown)
        </legend>

        <div className="space-y-3 font-ui">
          <label
            htmlFor="countdown-enabled-checkbox"
            className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] gap-3 min-w-0 w-full cursor-pointer hover:border-[var(--border)] transition-colors select-none"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)] break-words">
                Aktifkan Kira Detik Hari Bahagia
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 break-words">
                Memaparkan kira detik hari, jam, minit, dan saat ke tarikh majlis (Waktu Malaysia / Asia/Kuala_Lumpur).
              </p>
            </div>
            <input
              type="checkbox"
              id="countdown-enabled-checkbox"
              checked={values.countdownEnabled ?? false}
              onChange={(e) => onChange("countdownEnabled", e.target.checked)}
              className="shrink-0 w-5 h-5 accent-[var(--primary)] rounded cursor-pointer"
            />
          </label>

          {values.countdownEnabled && !values.weddingDate && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              ⚠️ Sila pastikan Tarikh Majlis di Bahagian 2 telah diisi untuk membolehkan kira detik berfungsi.
            </p>
          )}
        </div>
      </fieldset>

      {/* ── Section 9: Public Guest Wishes (Phase 10B) ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          9. Paparan Ucapan Tetamu (Public Guest Wishes)
        </legend>

        <div className="space-y-4 font-ui">
          <label
            htmlFor="guest-wishes-enabled-checkbox"
            className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] gap-3 min-w-0 w-full cursor-pointer hover:border-[var(--border)] transition-colors select-none"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)] break-words">
                Paparkan Ucapan Tetamu pada Jemputan
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 break-words">
                Hanya ucapan tetamu yang diluluskan oleh anda akan dipaparkan secara umum. (Semua ucapan kekal peribadi secara lalai).
              </p>
            </div>
            <input
              type="checkbox"
              id="guest-wishes-enabled-checkbox"
              checked={values.guestWishesEnabled ?? false}
              onChange={(e) => onChange("guestWishesEnabled", e.target.checked)}
              className="shrink-0 w-5 h-5 accent-[var(--primary)] rounded cursor-pointer"
            />
          </label>

          {values.guestWishesEnabled && (
            <div className="p-3.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-semibold text-[var(--text)]">Moderasi Ucapan Tetamu</p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Urus dan pilih ucapan yang ingin dipaparkan melalui papan pemuka RSVP.
                </p>
              </div>
              <Link
                href={`/dashboard/invitations/${invitationId}/rsvp`}
                target="_blank"
                className="px-3.5 py-1.5 rounded-lg border border-[var(--primary)] text-[var(--primary)] font-semibold hover:bg-[var(--primary)] hover:text-white transition-colors shrink-0"
              >
                Urus RSVP &amp; Ucapan ↗
              </Link>
            </div>
          )}
        </div>
      </fieldset>

      {/* ── Section 10: Background Music via YouTube (Phase 10B) ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          10. Muzik Latar Belakang (Background Music via YouTube)
        </legend>

        <div className="space-y-4 font-ui">
          <label
            htmlFor="music-enabled-checkbox"
            className="flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] gap-3 min-w-0 w-full cursor-pointer hover:border-[var(--border)] transition-colors select-none"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--text)] break-words">
                Aktifkan Muzik Latar Belakang
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 break-words">
                Tetamu boleh mendengar lagu pilihan anda melalui widget muzik terapung.
              </p>
            </div>
            <input
              type="checkbox"
              id="music-enabled-checkbox"
              checked={values.musicEnabled ?? false}
              onChange={(e) => onChange("musicEnabled", e.target.checked)}
              className="shrink-0 w-5 h-5 accent-[var(--primary)] rounded cursor-pointer"
            />
          </label>

          {values.musicEnabled && (
            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <label htmlFor="music-youtube-url" className={labelClass}>
                  Pautan Lagu YouTube (YouTube URL)
                </label>
                <input
                  id="music-youtube-url"
                  type="url"
                  value={values.musicYoutubeUrl || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const extractedId = extractYouTubeVideoId(val);
                    onChange("musicYoutubeUrl", val);
                    if (extractedId) {
                      onChange("musicYoutubeVideoId", extractedId);
                    }
                  }}
                  placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className={urlInputClass}
                />
                <p className={helperClass}>
                  Format yang disokong: youtube.com/watch?v=, youtu.be/, atau youtube.com/shorts/
                </p>

                {values.musicYoutubeUrl && !parsedYoutubeId && (
                  <p className={errorClass}>
                    Pautan YouTube tidak sah. Sila semak semula format pautan anda.
                  </p>
                )}

                {parsedYoutubeId && (
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    ✓ ID Video YouTube: <span className="font-mono">{parsedYoutubeId}</span>
                  </p>
                )}
              </div>

              {/* Loop Setting */}
              <div className="pt-1">
                <label
                  htmlFor="music-loop-checkbox"
                  className="flex items-center gap-2.5 cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    id="music-loop-checkbox"
                    checked={values.musicLoop ?? false}
                    onChange={(e) => onChange("musicLoop", e.target.checked)}
                    className="shrink-0 w-4 h-4 accent-[var(--primary)] rounded cursor-pointer"
                  />
                  <span className="text-xs text-[var(--text)] font-semibold">
                    Ulang muzik secara automatik (Loop Playback)
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>
      </fieldset>
    </form>
  );
}
