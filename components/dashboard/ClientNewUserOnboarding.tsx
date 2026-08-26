import React from "react";
import Link from "next/link";

interface Props {
  clientName: string | null;
}

export function ClientNewUserOnboarding({ clientName }: Props) {
  const greeting = clientName ? `Hai, ${clientName} 👋` : "Selamat Datang ke WALIMATUL 👋";

  const steps = [
    {
      num: "1",
      title: "Pilih Template Rekaan",
      desc: "Pilih rekaan kad jemputan digital yang sesuai dengan tema majlis perkahwinan anda.",
      icon: "🎨",
    },
    {
      num: "2",
      title: "Isi Butiran & Pautan URL",
      desc: "Masukkan maklumat pengantin, tarikh, masa, lokasi acara, dan tentukan pautan unik walimatul.my.",
      icon: "✍️",
    },
    {
      num: "3",
      title: "Aktifkan & Kongsi",
      desc: "Buat pengaktifan Touch 'n Go eWallet dan kongsi pautan jemputan digital kepada sanak saudara dan tetamu.",
      icon: "💌",
    },
  ];

  return (
    <div className="p-6 sm:p-10 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-8">
      <div className="max-w-2xl space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
          Langkah Permulaan
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
          {greeting}
        </h2>
        <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)] leading-relaxed">
          Anda belum mempunyai sebarang jemputan digital. Mulakan hari ini dalam 3 langkah mudah di bawah untuk mencipta kad perkahwinan digital eksklusif anda.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((st) => (
          <div
            key={st.num}
            className="p-5 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)] space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{st.icon}</span>
              <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold font-ui flex items-center justify-center">
                {st.num}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm font-display text-[var(--text)]">
                {st.title}
              </h3>
              <p className="text-xs font-ui text-[var(--text-muted)] mt-1 leading-relaxed">
                {st.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
        <Link
          id="btn-onboarding-browse-templates"
          href="/templates"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[var(--primary)] text-white text-sm font-bold font-ui hover:bg-[var(--primary-hover)] transition-all shadow-md"
        >
          <span>Pilih Template Sekarang</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
        <span className="text-xs font-ui text-[var(--text-muted)]">
          ✨ Termasuk RSVP Percuma, Galeri Gambar, Pengiraan Detik &amp; Muzik Latar.
        </span>
      </div>
    </div>
  );
}
