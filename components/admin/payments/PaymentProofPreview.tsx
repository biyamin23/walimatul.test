import React from "react";
import Image from "next/image";
import type { AdminProofWithSignedUrl } from "@/lib/data/admin-payments";

export interface PaymentProofPreviewProps {
  proofs: AdminProofWithSignedUrl[];
  paymentReference?: string | null;
}

export function PaymentProofPreview({
  proofs,
  paymentReference,
}: PaymentProofPreviewProps) {
  const latestProof = proofs[0] || null;

  function formatDateTime(dateStr: string | null) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  const isPdf = latestProof?.storage_path?.toLowerCase().endsWith(".pdf");

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
            Bukti Pembayaran
          </span>
          <h3 className="text-xl font-bold font-display text-[var(--text)]">
            Resit Transaksi
          </h3>
        </div>

        {proofs.length > 1 && (
          <span className="text-xs font-ui px-2.5 py-1 rounded-full bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text-subtle)]">
            {proofs.length} rekod bukti
          </span>
        )}
      </div>

      {paymentReference && (
        <div className="p-3.5 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)] flex items-center justify-between text-xs font-ui">
          <span className="text-[var(--text-muted)] font-semibold">No. Rujukan Klien:</span>
          <span className="font-mono font-bold text-[var(--primary)]">{paymentReference}</span>
        </div>
      )}

      {/* ── Latest Proof Display ── */}
      {latestProof ? (
        <div className="space-y-3">
          {latestProof.signedUrl ? (
            isPdf ? (
              <div className="p-8 rounded-2xl bg-[var(--surface-warm)] border-2 border-dashed border-[var(--border)] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mx-auto">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold font-ui text-[var(--text)]">
                    Dokumen Resit PDF
                  </p>
                  <p className="text-[11px] font-ui text-[var(--text-subtle)] mt-0.5">
                    Dihantar pada {formatDateTime(latestProof.submitted_at)}
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href={latestProof.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
                  >
                    Buka Dokumen PDF ↗
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative w-full max-h-96 rounded-2xl overflow-hidden border border-[var(--border)] bg-black/5 flex items-center justify-center p-2">
                  <Image
                    src={latestProof.signedUrl}
                    alt="Bukti Pembayaran Touch 'n Go"
                    width={600}
                    height={800}
                    className="max-h-96 w-auto object-contain rounded-xl shadow-xs"
                    unoptimized
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-ui text-[var(--text-subtle)] px-1">
                  <span>Masa Dihantar: {formatDateTime(latestProof.submitted_at)}</span>
                  <a
                    href={latestProof.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] font-semibold hover:underline"
                  >
                    Buka Saiz Penuh ↗
                  </a>
                </div>
              </div>
            )
          ) : (
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-ui text-center">
              Pautan bukti pembayaran tidak dapat dijana atau telah luput. Sila muat semula halaman.
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border)] text-center text-xs font-ui text-[var(--text-muted)]">
          Tiada fail bukti pembayaran dijumpai.
        </div>
      )}

      {/* ── Proof History (if more than 1) ── */}
      {proofs.length > 1 && (
        <div className="pt-4 border-t border-[var(--border-soft)] space-y-2.5">
          <h4 className="text-xs font-bold font-ui text-[var(--text-subtle)] uppercase tracking-wider">
            Sejarah Bukti Pembayaran Terdahulu
          </h4>
          <div className="space-y-2">
            {proofs.slice(1).map((p, idx) => (
              <div
                key={p.id}
                className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--border-soft)] flex items-center justify-between text-xs font-ui"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[var(--border)] text-[var(--text-muted)] flex items-center justify-center text-[10px] font-bold">
                    {proofs.length - idx - 1}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {formatDateTime(p.submitted_at)}
                  </span>
                </div>

                {p.signedUrl && (
                  <a
                    href={p.signedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary)] font-semibold hover:underline"
                  >
                    Lihat ↗
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
