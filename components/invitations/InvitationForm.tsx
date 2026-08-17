"use client";

import React from "react";
import { SlugField } from "./SlugField";
import type { UpdateInvitationInput } from "@/lib/validation/invitation";

export interface InvitationFormProps {
  invitationId: string;
  values: UpdateInvitationInput;
  onChange: <K extends keyof UpdateInvitationInput>(
    field: K,
    value: UpdateInvitationInput[K]
  ) => void;
  errors?: Record<string, string[]>;
}

export function InvitationForm({
  invitationId,
  values,
  onChange,
  errors = {},
}: InvitationFormProps) {
  // Shared styling classes for consistent field presentation & iOS zoom prevention
  const inputClass =
    "w-full max-w-full min-w-0 box-border px-3.5 py-2.5 min-h-[48px] sm:min-h-[44px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-base sm:text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]";

  const dateTimeInputClass =
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
              placeholder="Siti Hana binti Roslan"
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
              placeholder="Hana"
              className={inputClass}
            />
            <p className={helperClass}>Dipaparkan besar pada muka depan jemputan.</p>
          </div>
        </div>
      </fieldset>

      {/* ── Section 2: Date & Time ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          2. Tarikh &amp; Masa (Date &amp; Time)
        </legend>

        <div className="space-y-4 w-full min-w-0">
          {/* Wedding Date (Full-width row) */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="wedding-date" className={labelClass}>
              Tarikh Majlis
            </label>
            <input
              id="wedding-date"
              type="date"
              value={values.weddingDate || ""}
              onChange={(e) => onChange("weddingDate", e.target.value)}
              className={dateTimeInputClass}
            />
            {errors.weddingDate && <p className={errorClass}>{errors.weddingDate[0]}</p>}
          </div>

          {/* Time Row (Stacked on mobile, 2-column on desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
            {/* Start Time */}
            <div className="space-y-1 min-w-0 w-full">
              <label htmlFor="start-time" className={labelClass}>
                Masa Mula
              </label>
              <input
                id="start-time"
                type="time"
                value={values.startTime || ""}
                onChange={(e) => onChange("startTime", e.target.value)}
                className={dateTimeInputClass}
              />
            </div>

            {/* End Time */}
            <div className="space-y-1 min-w-0 w-full">
              <label htmlFor="end-time" className={labelClass}>
                Masa Tamat
              </label>
              <input
                id="end-time"
                type="time"
                value={values.endTime || ""}
                onChange={(e) => onChange("endTime", e.target.value)}
                className={dateTimeInputClass}
              />
              {errors.endTime && <p className={errorClass}>{errors.endTime[0]}</p>}
            </div>
          </div>
        </div>
      </fieldset>

      {/* ── Section 3: Venue & Location ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          3. Lokasi Majlis (Venue &amp; Location)
        </legend>

        <div className="space-y-4 w-full min-w-0">
          {/* Venue Name */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="venue-name" className={labelClass}>
              Nama Tempat / Dewan / Kediaman
            </label>
            <input
              id="venue-name"
              type="text"
              value={values.venueName || ""}
              onChange={(e) => onChange("venueName", e.target.value)}
              placeholder="Dewan Seri Melati"
              className={inputClass}
            />
          </div>

          {/* Venue Address */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="venue-address" className={labelClass}>
              Alamat Penuh
            </label>
            <textarea
              id="venue-address"
              rows={3}
              value={values.venueAddress || ""}
              onChange={(e) => onChange("venueAddress", e.target.value)}
              placeholder="Jalan Tuanku Abdul Rahman, 50100 Kuala Lumpur, Malaysia"
              className={textareaClass}
            />
          </div>

          {/* Google Maps URL (Full-width row on all breakpoints) */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="maps-url" className={labelClass}>
              Pautan Google Maps (Pilihan)
            </label>
            <input
              id="maps-url"
              type="url"
              value={values.googleMapsUrl || ""}
              onChange={(e) => onChange("googleMapsUrl", e.target.value)}
              placeholder="https://maps.google.com/..."
              className={urlInputClass}
            />
            {errors.googleMapsUrl && (
              <p className={errorClass}>{errors.googleMapsUrl[0]}</p>
            )}
          </div>

          {/* Waze URL (Full-width row on all breakpoints) */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="waze-url" className={labelClass}>
              Pautan Waze (Pilihan)
            </label>
            <input
              id="waze-url"
              type="url"
              value={values.wazeUrl || ""}
              onChange={(e) => onChange("wazeUrl", e.target.value)}
              placeholder="https://waze.com/..."
              className={urlInputClass}
            />
            {errors.wazeUrl && (
              <p className={errorClass}>{errors.wazeUrl[0]}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Section 4: Messages ── */}
      <fieldset className={fieldsetClass}>
        <legend className="text-sm sm:text-base font-semibold font-display text-[var(--primary)] px-2 max-w-full break-words">
          4. Ucapan &amp; Mesej (Invitation Messages)
        </legend>

        <div className="space-y-4 w-full min-w-0">
          {/* Opening Quote */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="opening-message" className={labelClass}>
              Kata Aluan / Ayat Al-Quran / Doa Permulaan
            </label>
            <textarea
              id="opening-message"
              rows={3}
              value={values.openingMessage || ""}
              onChange={(e) => onChange("openingMessage", e.target.value)}
              placeholder="“Dan di antara tanda-tanda kebesaran-Nya...”"
              className={textareaClass}
            />
          </div>

          {/* Formal Invitation Text */}
          <div className="space-y-1 min-w-0 w-full">
            <label htmlFor="invitation-message" className={labelClass}>
              Teks Jemputan Rasmi
            </label>
            <textarea
              id="invitation-message"
              rows={3}
              value={values.invitationMessage || ""}
              onChange={(e) => onChange("invitationMessage", e.target.value)}
              placeholder="Dengan penuh kesyukuran ke hadrat Ilahi, kami menjemput..."
              className={textareaClass}
            />
          </div>

          {/* Closing Message */}
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
          {/* RSVP Toggle Card */}
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
              {/* RSVP Deadline (Full-width row on all breakpoints) */}
              <div className="space-y-1 min-w-0 w-full">
                <label htmlFor="rsvp-deadline" className={labelClass}>
                  Tarikh Akhir RSVP
                </label>
                <input
                  id="rsvp-deadline"
                  type="date"
                  value={values.rsvpDeadline || ""}
                  onChange={(e) => onChange("rsvpDeadline", e.target.value)}
                  className={dateTimeInputClass}
                />
              </div>

              {/* Max Pax (Full-width row on all breakpoints) */}
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

              {/* Allow Guest Message */}
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
    </form>
  );
}
