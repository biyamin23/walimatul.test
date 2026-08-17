import React from "react";
import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[var(--background)]">
      <div className="max-w-md w-full text-center p-8 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md space-y-6">
        {/* Decorative floral/envelope icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
          style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
          aria-hidden="true"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 5H3a2 2 0 00-2 2v10a2 2 0 002 2h18a2 2 0 002-2V7a2 2 0 00-2-2z" />
            <polyline points="3 7 12 13 21 7" />
          </svg>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
            WALIMATUL by nasuhalias
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[var(--text)]">
            Jemputan Tidak Tersedia
          </h1>
        </div>

        <p className="text-sm font-ui text-[var(--text-muted)] leading-relaxed">
          Pautan jemputan perkahwinan ini mungkin belum diterbitkan, telah tamat
          tempoh, atau alamat pautan yang dimasukkan tidak tepat.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
          >
            Ke Laman Utama WALIMATUL →
          </Link>
        </div>
      </div>
    </main>
  );
}
