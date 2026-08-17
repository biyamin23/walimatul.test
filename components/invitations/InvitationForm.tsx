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
  return (
    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
      {/* ── Section 1: Couple Details ── */}
      <fieldset className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
        <legend className="text-base font-semibold font-display text-[var(--primary)] px-2">
          1. Maklumat Mempelai (Couple Details)
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Groom Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="groom-name"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Nama Penuh Pengantin Lelaki
            </label>
            <input
              id="groom-name"
              type="text"
              value={values.groomName || ""}
              onChange={(e) => onChange("groomName", e.target.value)}
              placeholder="Abu Bakar bin Abdullah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
            {errors.groomName && (
              <p className="text-xs text-red-600 font-ui">{errors.groomName[0]}</p>
            )}
          </div>

          {/* Groom Short Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="groom-short-name"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Nama Panggilan / Ringkas (Lelaki)
            </label>
            <input
              id="groom-short-name"
              type="text"
              value={values.groomShortName || ""}
              onChange={(e) => onChange("groomShortName", e.target.value)}
              placeholder="Abu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
            <p className="text-[11px] text-[var(--text-subtle)] font-ui">
              Dipaparkan besar pada muka depan jemputan.
            </p>
          </div>

          {/* Bride Full Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="bride-name"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Nama Penuh Pengantin Perempuan
            </label>
            <input
              id="bride-name"
              type="text"
              value={values.brideName || ""}
              onChange={(e) => onChange("brideName", e.target.value)}
              placeholder="Siti Hana binti Roslan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
            {errors.brideName && (
              <p className="text-xs text-red-600 font-ui">{errors.brideName[0]}</p>
            )}
          </div>

          {/* Bride Short Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="bride-short-name"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Nama Panggilan / Ringkas (Perempuan)
            </label>
            <input
              id="bride-short-name"
              type="text"
              value={values.brideShortName || ""}
              onChange={(e) => onChange("brideShortName", e.target.value)}
              placeholder="Hana"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
            <p className="text-[11px] text-[var(--text-subtle)] font-ui">
              Dipaparkan besar pada muka depan jemputan.
            </p>
          </div>
        </div>
      </fieldset>

      {/* ── Section 2: Date & Time ── */}
      <fieldset className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
        <legend className="text-base font-semibold font-display text-[var(--primary)] px-2">
          2. Tarikh &amp; Masa (Date &amp; Time)
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Wedding Date */}
          <div className="space-y-1.5">
            <label
              htmlFor="wedding-date"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Tarikh Majlis
            </label>
            <input
              id="wedding-date"
              type="date"
              value={values.weddingDate || ""}
              onChange={(e) => onChange("weddingDate", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
            {errors.weddingDate && (
              <p className="text-xs text-red-600 font-ui">{errors.weddingDate[0]}</p>
            )}
          </div>

          {/* Start Time */}
          <div className="space-y-1.5">
            <label
              htmlFor="start-time"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Masa Mula
            </label>
            <input
              id="start-time"
              type="time"
              value={values.startTime || ""}
              onChange={(e) => onChange("startTime", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
          </div>

          {/* End Time */}
          <div className="space-y-1.5">
            <label
              htmlFor="end-time"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Masa Tamat
            </label>
            <input
              id="end-time"
              type="time"
              value={values.endTime || ""}
              onChange={(e) => onChange("endTime", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
            />
            {errors.endTime && (
              <p className="text-xs text-red-600 font-ui">{errors.endTime[0]}</p>
            )}
          </div>
        </div>
      </fieldset>

      {/* ── Section 3: Venue & Location ── */}
      <fieldset className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
        <legend className="text-base font-semibold font-display text-[var(--primary)] px-2">
          3. Lokasi Majlis (Venue &amp; Location)
        </legend>

        <div className="space-y-4">
          {/* Venue Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="venue-name"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Nama Tempat / Dewan / Kediaman
            </label>
            <input
              id="venue-name"
              type="text"
              value={values.venueName || ""}
              onChange={(e) => onChange("venueName", e.target.value)}
              placeholder="Dewan Seri Melati"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
          </div>

          {/* Venue Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="venue-address"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Alamat Penuh
            </label>
            <textarea
              id="venue-address"
              rows={3}
              value={values.venueAddress || ""}
              onChange={(e) => onChange("venueAddress", e.target.value)}
              placeholder="Jalan Tuanku Abdul Rahman, 50100 Kuala Lumpur, Malaysia"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label
                htmlFor="maps-url"
                className="block text-xs font-semibold font-ui text-[var(--text)]"
              >
                Pautan Google Maps (Pilihan)
              </label>
              <input
                id="maps-url"
                type="url"
                value={values.googleMapsUrl || ""}
                onChange={(e) => onChange("googleMapsUrl", e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
              />
              {errors.googleMapsUrl && (
                <p className="text-xs text-red-600 font-ui">
                  {errors.googleMapsUrl[0]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="waze-url"
                className="block text-xs font-semibold font-ui text-[var(--text)]"
              >
                Pautan Waze (Pilihan)
              </label>
              <input
                id="waze-url"
                type="url"
                value={values.wazeUrl || ""}
                onChange={(e) => onChange("wazeUrl", e.target.value)}
                placeholder="https://waze.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
              />
              {errors.wazeUrl && (
                <p className="text-xs text-red-600 font-ui">{errors.wazeUrl[0]}</p>
              )}
            </div>
          </div>
        </div>
      </fieldset>

      {/* ── Section 4: Messages ── */}
      <fieldset className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
        <legend className="text-base font-semibold font-display text-[var(--primary)] px-2">
          4. Ucapan &amp; Mesej (Invitation Messages)
        </legend>

        <div className="space-y-4">
          {/* Opening Quote */}
          <div className="space-y-1.5">
            <label
              htmlFor="opening-message"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Kata Aluan / Ayat Al-Quran / Doa Permulaan
            </label>
            <textarea
              id="opening-message"
              rows={3}
              value={values.openingMessage || ""}
              onChange={(e) => onChange("openingMessage", e.target.value)}
              placeholder="“Dan di antara tanda-tanda kebesaran-Nya...”"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
          </div>

          {/* Formal Invitation Text */}
          <div className="space-y-1.5">
            <label
              htmlFor="invitation-message"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Teks Jemputan Rasmi
            </label>
            <textarea
              id="invitation-message"
              rows={3}
              value={values.invitationMessage || ""}
              onChange={(e) => onChange("invitationMessage", e.target.value)}
              placeholder="Dengan penuh kesyukuran ke hadrat Ilahi, kami menjemput..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
          </div>

          {/* Closing Message */}
          <div className="space-y-1.5">
            <label
              htmlFor="closing-message"
              className="block text-xs font-semibold font-ui text-[var(--text)]"
            >
              Ucapan Penutup / Harapan
            </label>
            <textarea
              id="closing-message"
              rows={3}
              value={values.closingMessage || ""}
              onChange={(e) => onChange("closingMessage", e.target.value)}
              placeholder="Semoga dengan kehadiran dan doa restu hadirin..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)]"
            />
          </div>
        </div>
      </fieldset>

      {/* ── Section 5: RSVP Settings ── */}
      <fieldset className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
        <legend className="text-base font-semibold font-display text-[var(--primary)] px-2">
          5. Tetapan RSVP (Guest Attendance)
        </legend>

        <div className="space-y-4">
          {/* RSVP Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
            <div>
              <p className="text-sm font-semibold font-ui text-[var(--text)]">
                Aktifkan Borang RSVP
              </p>
              <p className="text-xs text-[var(--text-muted)] font-ui">
                Membolehkan tetamu mengesahkan kehadiran dan jumlah pax.
              </p>
            </div>
            <input
              type="checkbox"
              id="rsvp-enabled-checkbox"
              checked={values.rsvpEnabled}
              onChange={(e) => onChange("rsvpEnabled", e.target.checked)}
              className="w-5 h-5 accent-[var(--primary)] rounded cursor-pointer"
            />
          </div>

          {values.rsvpEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* RSVP Deadline */}
              <div className="space-y-1.5">
                <label
                  htmlFor="rsvp-deadline"
                  className="block text-xs font-semibold font-ui text-[var(--text)]"
                >
                  Tarikh Akhir Pengesahan (RSVP Deadline)
                </label>
                <input
                  id="rsvp-deadline"
                  type="date"
                  value={values.rsvpDeadline || ""}
                  onChange={(e) => onChange("rsvpDeadline", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                />
              </div>

              {/* Max Pax */}
              <div className="space-y-1.5">
                <label
                  htmlFor="max-pax"
                  className="block text-xs font-semibold font-ui text-[var(--text)]"
                >
                  Maksimum Pax bagi Setiap Tetamu
                </label>
                <input
                  id="max-pax"
                  type="number"
                  min={1}
                  max={20}
                  value={values.maxPax}
                  onChange={(e) => onChange("maxPax", parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                />
              </div>

              {/* Allow Guest Message */}
              <div className="sm:col-span-2 flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="allow-guest-message-checkbox"
                  checked={values.allowGuestMessage}
                  onChange={(e) => onChange("allowGuestMessage", e.target.checked)}
                  className="w-4 h-4 accent-[var(--primary)] rounded cursor-pointer"
                />
                <label
                  htmlFor="allow-guest-message-checkbox"
                  className="text-xs font-ui text-[var(--text)] cursor-pointer select-none"
                >
                  Benarkan tetamu menulis ucapan / doa bersama borang RSVP
                </label>
              </div>
            </div>
          )}
        </div>
      </fieldset>

      {/* ── Section 6: Invitation URL (Slug) ── */}
      <fieldset className="p-5 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
        <legend className="text-base font-semibold font-display text-[var(--primary)] px-2">
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
