"use client";

import React, { useState, useTransition } from "react";
import type { PlatformSettingsMap } from "@/lib/data/admin-settings";
import {
  updateSupportSettingsAction,
  updateInvitationSettingsAction,
  updateGallerySettingsAction,
  updatePaymentSettingsAction,
  updateMaintenanceSettingsAction,
} from "@/app/actions/admin-settings";

interface SettingsFormProps {
  initialSettings: PlatformSettingsMap;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  // Support state
  const [supportPhone, setSupportPhone] = useState(initialSettings.support_whatsapp.phone);
  const [supportDisplay, setSupportDisplay] = useState(initialSettings.support_whatsapp.display);
  const [supportFeedback, setSupportFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isSupportPending, startSupportTransition] = useTransition();

  // Validity state
  const [validityMonths, setValidityMonths] = useState(initialSettings.default_invitation_validity_months);
  const [validityFeedback, setValidityFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isValidityPending, startValidityTransition] = useTransition();

  // Gallery limit state
  const [maxPhotos, setMaxPhotos] = useState(initialSettings.max_gallery_photos);
  const [galleryFeedback, setGalleryFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isGalleryPending, startGalleryTransition] = useTransition();

  // Payment instructions state
  const [paymentText, setPaymentText] = useState(initialSettings.manual_payment_instructions.text);
  const [paymentFeedback, setPaymentFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPaymentPending, startPaymentTransition] = useTransition();

  // Maintenance notice state
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(initialSettings.maintenance_notice.enabled);
  const [maintenanceText, setMaintenanceText] = useState(initialSettings.maintenance_notice.text);
  const [maintenanceFeedback, setMaintenanceFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isMaintenancePending, startMaintenanceTransition] = useTransition();

  function handleSaveSupport(e: React.FormEvent) {
    e.preventDefault();
    setSupportFeedback(null);
    startSupportTransition(async () => {
      const res = await updateSupportSettingsAction({ phone: supportPhone, display: supportDisplay });
      if (res.success) {
        setSupportFeedback({ type: "success", msg: "Tetapan WhatsApp sokongan berjaya dikemas kini." });
      } else {
        setSupportFeedback({ type: "error", msg: res.error || "Gagal mengemas kini tetapan." });
      }
    });
  }

  function handleSaveValidity(e: React.FormEvent) {
    e.preventDefault();
    setValidityFeedback(null);
    startValidityTransition(async () => {
      const res = await updateInvitationSettingsAction({ validityMonths });
      if (res.success) {
        setValidityFeedback({ type: "success", msg: "Tempoh sah jemputan lalai berjaya dikemas kini." });
      } else {
        setValidityFeedback({ type: "error", msg: res.error || "Gagal mengemas kini tetapan." });
      }
    });
  }

  function handleSaveGallery(e: React.FormEvent) {
    e.preventDefault();
    setGalleryFeedback(null);
    startGalleryTransition(async () => {
      const res = await updateGallerySettingsAction({ maxPhotos });
      if (res.success) {
        setGalleryFeedback({ type: "success", msg: "Had gambar galeri berjaya dikemas kini." });
      } else {
        setGalleryFeedback({ type: "error", msg: res.error || "Gagal mengemas kini tetapan." });
      }
    });
  }

  function handleSavePayment(e: React.FormEvent) {
    e.preventDefault();
    setPaymentFeedback(null);
    startPaymentTransition(async () => {
      const res = await updatePaymentSettingsAction({ instructionsText: paymentText });
      if (res.success) {
        setPaymentFeedback({ type: "success", msg: "Arahan pembayaran manual berjaya dikemas kini." });
      } else {
        setPaymentFeedback({ type: "error", msg: res.error || "Gagal mengemas kini tetapan." });
      }
    });
  }

  function handleSaveMaintenance(e: React.FormEvent) {
    e.preventDefault();
    setMaintenanceFeedback(null);
    startMaintenanceTransition(async () => {
      const res = await updateMaintenanceSettingsAction({ enabled: maintenanceEnabled, text: maintenanceText });
      if (res.success) {
        setMaintenanceFeedback({ type: "success", msg: "Notis sistem berjaya dikemas kini." });
      } else {
        setMaintenanceFeedback({ type: "error", msg: res.error || "Gagal mengemas kini tetapan." });
      }
    });
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Section 1: WhatsApp Support ── */}
      <form
        onSubmit={handleSaveSupport}
        className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4"
      >
        <div className="border-b border-[var(--border)] pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Bantuan &amp; Sokongan WhatsApp
            </h2>
            <p className="text-xs font-ui text-[var(--text-muted)]">
              Nombor telefon dan pautan bantuan rasmi untuk pertanyaan pelanggan.
            </p>
          </div>
        </div>

        {supportFeedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-ui ${
              supportFeedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {supportFeedback.msg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-ui">
          <div>
            <label className="font-semibold text-[var(--text)] block mb-1">
              Nombor WhatsApp (Format Antarabangsa tanpa +)
            </label>
            <input
              type="text"
              value={supportPhone}
              onChange={(e) => setSupportPhone(e.target.value)}
              placeholder="60148412018"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] font-mono text-xs"
              required
            />
            <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
              Pautan dijana: https://wa.me/{supportPhone.replace(/[^0-9]/g, "")}
            </span>
          </div>

          <div>
            <label className="font-semibold text-[var(--text)] block mb-1">
              Format Paparan UI
            </label>
            <input
              type="text"
              value={supportDisplay}
              onChange={(e) => setSupportDisplay(e.target.value)}
              placeholder="+60148412018"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs"
              required
            />
            <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
              Dipaparkan pada footer dan bahagian bantuan klien.
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSupportPending}
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-xs transition-colors disabled:opacity-50"
          >
            {isSupportPending ? "Menyimpan..." : "Simpan Sokongan"}
          </button>
        </div>
      </form>

      {/* ── Section 2: Default Invitation Validity & Gallery Limit ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Validity */}
        <form
          onSubmit={handleSaveValidity}
          className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4"
        >
          <div className="border-b border-[var(--border)] pb-3">
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Tempoh Sah Jemputan Lalai
            </h2>
            <p className="text-xs font-ui text-[var(--text-muted)]">
              Tempoh sah dalam bulan bagi jemputan pakej baharu.
            </p>
          </div>

          {validityFeedback && (
            <div
              className={`p-3.5 rounded-xl text-xs font-ui ${
                validityFeedback.type === "success"
                  ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                  : "bg-red-50 text-red-900 border border-red-200"
              }`}
            >
              {validityFeedback.msg}
            </div>
          )}

          <div className="text-xs font-ui">
            <label className="font-semibold text-[var(--text)] block mb-1">
              Bilangan Bulan
            </label>
            <input
              type="number"
              min="1"
              max="36"
              value={validityMonths}
              onChange={(e) => setValidityMonths(parseInt(e.target.value, 10) || 6)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs font-semibold"
              required
            />
            <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
              * Perubahan ini hanya terpakai untuk jemputan masa hadapan; rekod pesanan terdahulu kekal mengikut nilai snapshot.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isValidityPending}
              className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-xs transition-colors disabled:opacity-50"
            >
              {isValidityPending ? "Menyimpan..." : "Simpan Tempoh Sah"}
            </button>
          </div>
        </form>

        {/* Gallery */}
        <form
          onSubmit={handleSaveGallery}
          className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4"
        >
          <div className="border-b border-[var(--border)] pb-3">
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Had Gambar Galeri Foto
            </h2>
            <p className="text-xs font-ui text-[var(--text-muted)]">
              Maksimum kepingan foto yang boleh dimuat naik bagi setiap jemputan.
            </p>
          </div>

          {galleryFeedback && (
            <div
              className={`p-3.5 rounded-xl text-xs font-ui ${
                galleryFeedback.type === "success"
                  ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                  : "bg-red-50 text-red-900 border border-red-200"
              }`}
            >
              {galleryFeedback.msg}
            </div>
          )}

          <div className="text-xs font-ui">
            <label className="font-semibold text-[var(--text)] block mb-1">
              Had Gambar (Keping)
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={maxPhotos}
              onChange={(e) => setMaxPhotos(parseInt(e.target.value, 10) || 12)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs font-semibold"
              required
            />
            <span className="text-[10px] text-[var(--text-muted)] mt-1 block">
              Had standard WALIMATUL ialah 12 keping bagi menjamin kelajuan muat turun kad jemputan tetamu.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isGalleryPending}
              className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-xs transition-colors disabled:opacity-50"
            >
              {isGalleryPending ? "Menyimpan..." : "Simpan Had Galeri"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Section 3: Manual Payment Instructions ── */}
      <form
        onSubmit={handleSavePayment}
        className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4"
      >
        <div className="border-b border-[var(--border)] pb-3">
          <h2 className="text-base font-bold font-display text-[var(--text)]">
            Arahan Pembayaran Manual Touch ’n Go
          </h2>
          <p className="text-xs font-ui text-[var(--text-muted)]">
            Teks panduan ringkas yang dipaparkan kepada pelanggan di portal bayaran.
          </p>
        </div>

        {paymentFeedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-ui ${
              paymentFeedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {paymentFeedback.msg}
          </div>
        )}

        <div className="text-xs font-ui">
          <label className="font-semibold text-[var(--text)] block mb-1">
            Teks Arahan (Teks Biasa Sahaja)
          </label>
          <textarea
            rows={3}
            value={paymentText}
            onChange={(e) => setPaymentText(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs resize-y"
            required
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isPaymentPending}
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-xs transition-colors disabled:opacity-50"
          >
            {isPaymentPending ? "Menyimpan..." : "Simpan Arahan Bayaran"}
          </button>
        </div>
      </form>

      {/* ── Section 4: System Maintenance Notice ── */}
      <form
        onSubmit={handleSaveMaintenance}
        className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4"
      >
        <div className="border-b border-[var(--border)] pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Notis Penyelenggaraan Sistem
            </h2>
            <p className="text-xs font-ui text-[var(--text-muted)]">
              Paparkan makluman penyelenggaraan berjadual kepada pelanggan.
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={maintenanceEnabled}
              onChange={(e) => setMaintenanceEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span className="text-xs font-ui font-semibold text-[var(--text)]">
              Aktifkan Notis
            </span>
          </label>
        </div>

        {maintenanceFeedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-ui ${
              maintenanceFeedback.type === "success"
                ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                : "bg-red-50 text-red-900 border border-red-200"
            }`}
          >
            {maintenanceFeedback.msg}
          </div>
        )}

        <div className="text-xs font-ui">
          <label className="font-semibold text-[var(--text)] block mb-1">
            Mesej Penyelenggaraan
          </label>
          <input
            type="text"
            value={maintenanceText}
            onChange={(e) => setMaintenanceText(e.target.value)}
            placeholder="Contoh: Penyelenggaraan sistem dijadualkan pada 28 Ogos 2026 jam 2:00 pagi – 4:00 pagi."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--primary)] text-xs"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isMaintenancePending}
            className="px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold font-ui shadow-xs transition-colors disabled:opacity-50"
          >
            {isMaintenancePending ? "Menyimpan..." : "Simpan Notis Penyelenggaraan"}
          </button>
        </div>
      </form>
    </div>
  );
}
