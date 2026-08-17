import React from "react";
import Image from "next/image";
import { PAYMENT_CONFIG } from "@/lib/constants/payment";
import { BRAND } from "@/lib/constants/brand";

export function PaymentQrCard() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6 text-center">
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
          Langkah 1: Bayaran
        </span>
        <h3 className="text-xl font-bold font-display text-[var(--text)]">
          Imbas Kod QR Touch ’n Go
        </h3>
        <p className="text-xs font-ui text-[var(--text-muted)] mt-1">
          Gunakan aplikasi Touch ’n Go eWallet pada telefon pintar anda.
        </p>
      </div>

      {/* QR Code Frame */}
      <div className="inline-block p-3 rounded-2xl bg-white border border-[var(--border)] shadow-md mx-auto max-w-[260px] sm:max-w-[280px]">
        <Image
          src={PAYMENT_CONFIG.qrAssetPath}
          alt="Touch 'n Go eWallet Payment QR"
          width={280}
          height={280}
          className="w-full h-auto rounded-xl"
          priority
        />
      </div>

      {/* Step-by-step instructions */}
      <div className="text-left bg-[var(--surface-warm)] p-4 sm:p-5 rounded-2xl border border-[var(--border-soft)] space-y-2.5">
        <h4 className="text-xs font-bold font-ui uppercase tracking-wider text-[var(--primary)]">
          Panduan Pembayaran:
        </h4>
        <ol className="text-xs font-ui text-[var(--text)] space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            Buka aplikasi <strong>Touch ’n Go eWallet</strong> dan tekan <strong>Scan</strong>.
          </li>
          <li>
            Imbas kod QR di atas dan masukkan jumlah tepat <strong>{PAYMENT_CONFIG.amountDetailedDisplay}</strong>.
          </li>
          <li>
            Selesaikan bayaran dan <strong>simpan tangkap layar (screenshot)</strong> resit transaksi.
          </li>
          <li>
            Muat naik resit tersebut di bahagian <strong>Langkah 2</strong> di bawah.
          </li>
        </ol>
      </div>

      <div className="pt-1">
        <p className="text-[11px] text-[var(--text-muted)] font-ui">
          Perlukan bantuan? Hubungi khidmat sokongan WhatsApp kami di{" "}
          <a
            href={BRAND.supportWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] font-semibold hover:underline"
          >
            {BRAND.supportWhatsapp}
          </a>
        </p>
      </div>
    </div>
  );
}
