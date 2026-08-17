"use client";

import React, { useState } from "react";
import { submitGuestRsvpAction } from "@/app/actions/rsvp";

export interface GuestRsvpModalProps {
  invitationId: string;
  maxPax: number;
  allowGuestMessage: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function GuestRsvpModal({
  invitationId,
  maxPax,
  allowGuestMessage,
  isOpen,
  onClose,
}: GuestRsvpModalProps) {
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<"attending" | "not_attending">("attending");
  const [pax, setPax] = useState<number>(1);
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await submitGuestRsvpAction({
      invitationId,
      guestName: guestName.trim(),
      attendance,
      pax: attendance === "attending" ? pax : 0,
      message: allowGuestMessage ? message.trim() : null,
    });

    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(result.error || "Maklum balas tidak dapat dihantar. Sila cuba lagi.");
    }
  }

  function handleResetAndClose() {
    setIsSubmitted(false);
    setGuestName("");
    setAttendance("attending");
    setPax(1);
    setMessage("");
    setErrorMessage(null);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#FCF8F3] border border-[#B8955A]/40 shadow-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto box-border">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-[#746F6B] hover:text-[#174F3A] hover:bg-[#F5EDE6] transition-colors focus-visible:outline-2 focus-visible:outline-[#174F3A]"
          aria-label="Tutup borang RSVP"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {isSubmitted ? (
          /* ── Success Confirmation Screen ── */
          <div className="text-center py-6 sm:py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#174F3A]/10 text-[#174F3A] flex items-center justify-center mx-auto">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <p className="font-cormorant text-xs font-semibold tracking-[0.2em] uppercase text-[#B8955A]">
              Maklum Balas Diterima
            </p>

            <h3 id="rsvp-modal-title" className="font-cormorant text-2xl sm:text-3xl font-bold text-[#174F3A]">
              Terima Kasih, {guestName}!
            </h3>

            <p className="font-inter text-sm text-[#746F6B] leading-relaxed max-w-sm mx-auto">
              {attendance === "attending"
                ? `Maklum balas kehadiran anda (${pax} pax) telah berjaya direkodkan. Kami amat berbesar hati menanti kehadiran anda.`
                : "Maklum balas dan ingatan tulus anda telah berjaya direkodkan. Terima kasih atas doa restu anda."}
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-8 py-3 rounded-full bg-[#174F3A] text-white font-inter text-xs font-semibold tracking-wide hover:bg-[#123e2d] transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-[#174F3A]"
              >
                Selesai
              </button>
            </div>
          </div>
        ) : (
          /* ── Interactive Guest RSVP Form ── */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="text-center pb-1">
              <p className="font-cormorant text-xs font-semibold tracking-[0.25em] uppercase text-[#B8955A] mb-1">
                Pengesahan Kehadiran
              </p>
              <h3 id="rsvp-modal-title" className="font-cormorant text-2xl sm:text-3xl font-bold text-[#174F3A]">
                Borang RSVP
              </h3>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-inter leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* Guest Name */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="guest-name-input" className="block text-xs font-semibold font-inter text-[#174F3A]">
                Nama Penuh Anda <span className="text-red-500">*</span>
              </label>
              <input
                id="guest-name-input"
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="cth. Ahmad Faiz bin Ismail"
                className="w-full px-3.5 py-2.5 min-h-[48px] rounded-xl border border-[#E8DDD5] bg-white text-sm font-inter text-[#174F3A] focus:outline-none focus:border-[#174F3A] focus:ring-2 focus:ring-[#174F3A]/20 transition-all placeholder:text-[#746F6B]/50"
              />
            </div>

            {/* Attendance Choice */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-semibold font-inter text-[#174F3A]">
                Status Kehadiran <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttendance("attending")}
                  className={`p-3.5 rounded-xl border font-inter text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    attendance === "attending"
                      ? "border-[#174F3A] bg-[#174F3A] text-white shadow-sm"
                      : "border-[#E8DDD5] bg-white text-[#746F6B] hover:border-[#174F3A]/50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${attendance === "attending" ? "bg-[#B8955A]" : "bg-transparent border border-current"}`} />
                  Hadir
                </button>
                <button
                  type="button"
                  onClick={() => setAttendance("not_attending")}
                  className={`p-3.5 rounded-xl border font-inter text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    attendance === "not_attending"
                      ? "border-[#174F3A] bg-[#174F3A] text-white shadow-sm"
                      : "border-[#E8DDD5] bg-white text-[#746F6B] hover:border-[#174F3A]/50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${attendance === "not_attending" ? "bg-[#B8955A]" : "bg-transparent border border-current"}`} />
                  Tidak Hadir
                </button>
              </div>
            </div>

            {/* Pax Count (only if attending) */}
            {attendance === "attending" && (
              <div className="space-y-1.5 text-left animate-fadeIn">
                <label htmlFor="pax-select" className="block text-xs font-semibold font-inter text-[#174F3A]">
                  Jumlah Tetamu (Termasuk Anda) <span className="text-red-500">*</span>
                </label>
                <select
                  id="pax-select"
                  value={pax}
                  onChange={(e) => setPax(parseInt(e.target.value, 10))}
                  className="w-full px-3.5 py-2.5 min-h-[48px] rounded-xl border border-[#E8DDD5] bg-white text-sm font-inter text-[#174F3A] focus:outline-none focus:border-[#174F3A] focus:ring-2 focus:ring-[#174F3A]/20 transition-all cursor-pointer"
                >
                  {Array.from({ length: maxPax }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Orang (Anda Sahaja)" : "Orang"}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] font-inter text-[#746F6B]">
                  Maksimum had dibenarkan: {maxPax} orang bagi setiap jemputan.
                </p>
              </div>
            )}

            {/* Guest Message / Doa */}
            {allowGuestMessage && (
              <div className="space-y-1.5 text-left">
                <label htmlFor="guest-message-input" className="block text-xs font-semibold font-inter text-[#174F3A]">
                  Ucapan / Doa untuk Pengantin (Pilihan)
                </label>
                <textarea
                  id="guest-message-input"
                  rows={3}
                  maxLength={500}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Titipkan ucapan tahniah dan doa buat kedua-dua mempelai..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DDD5] bg-white text-sm font-inter text-[#174F3A] focus:outline-none focus:border-[#174F3A] focus:ring-2 focus:ring-[#174F3A]/20 transition-all placeholder:text-[#746F6B]/50 resize-y"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-[#174F3A] text-white font-inter text-xs font-semibold tracking-wider uppercase hover:bg-[#123e2d] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menghantar...
                  </>
                ) : (
                  "Hantar RSVP"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
