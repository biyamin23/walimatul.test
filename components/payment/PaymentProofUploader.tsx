"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { submitPaymentProofAction } from "@/app/actions/payments";
import { PAYMENT_CONFIG } from "@/lib/constants/payment";

export interface PaymentProofUploaderProps {
  orderId: string;
  userId: string;
  onSuccess?: (data: {
    storagePath: string;
    transactionReference?: string | null;
  }) => void;
}

export function PaymentProofUploader({
  orderId,
  userId,
  onSuccess,
}: PaymentProofUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [submitPhase, setSubmitPhase] = useState<"idle" | "uploading" | "submitting" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBusy = submitPhase !== "idle";

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (isBusy) return;
    setErrorMessage(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 1. Validate MIME type
    if (!PAYMENT_CONFIG.allowedMimeTypes.includes(file.type as typeof PAYMENT_CONFIG.allowedMimeTypes[number])) {
      setErrorMessage("Format fail tidak disokong. Sila pilih fail JPG, PNG, WEBP, atau PDF.");
      return;
    }

    // 2. Validate size
    if (file.size > PAYMENT_CONFIG.maxSizeBytes) {
      setErrorMessage(`Saiz fail melebihi had maksimum ${PAYMENT_CONFIG.maxSizeLabel}.`);
      return;
    }

    setSelectedFile(file);

    // If image, create local object URL preview
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  function handleRemoveFile() {
    if (isBusy) return;
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isBusy) return;

    if (!selectedFile) {
      setErrorMessage("Sila pilih fail bukti pembayaran terlebih dahulu.");
      return;
    }

    setSubmitPhase("uploading");
    setErrorMessage(null);

    // Timeout guard (30 seconds) to prevent infinite pending state
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Masa muat naik tamat. Sila periksa sambungan internet anda dan cuba lagi."
            )
          ),
        30000
      )
    );

    try {
      const uploadAndSubmitPromise = async () => {
        const supabase = createClient();

        // 1. Sanitize file name
        const sanitizedName = selectedFile.name
          .toLowerCase()
          .replace(/[^a-z0-9.]/g, "-");
        const storagePath = `${userId}/${orderId}/${Date.now()}-${sanitizedName}`;

        // 2. Upload file to Supabase Storage private bucket
        const { error: uploadError } = await supabase.storage
          .from(PAYMENT_CONFIG.storageBucket)
          .upload(storagePath, selectedFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("[WALIMATUL] Storage upload error:", uploadError.message);
          throw new Error("Gagal memuat naik fail resit. Sila cuba lagi.");
        }

        // 3. Submit proof via Server Action
        setSubmitPhase("submitting");
        const result = await submitPaymentProofAction({
          orderId,
          storagePath,
          transactionReference: transactionRef.trim() || null,
        });

        if (!result.success) {
          throw new Error(result.error || "Gagal menghantar pengesahan. Sila cuba lagi.");
        }

        return { storagePath };
      };

      const { storagePath } = await Promise.race([
        uploadAndSubmitPromise(),
        timeoutPromise,
      ]);

      // 4. Immediately notify parent component and trigger refresh
      setSubmitPhase("success");
      if (onSuccess) {
        onSuccess({
          storagePath,
          transactionReference: transactionRef.trim() || null,
        });
      }
      router.refresh();
    } catch (err: unknown) {
      console.error("[WALIMATUL] Upload/submit error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Ralat tidak dijangka berlaku. Sila cuba lagi.";
      setErrorMessage(msg);
      setSubmitPhase("idle");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-6"
    >
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
          Langkah 2: Muat Naik Resit
        </span>
        <h3 className="text-xl font-bold font-display text-[var(--text)]">
          Bukti Pembayaran
        </h3>
        <p className="text-xs font-ui text-[var(--text-muted)] mt-1">
          Muat naik tangkap layar atau dokumen PDF resit transaksi anda.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-ui leading-relaxed">
          {errorMessage}
        </div>
      )}

      {/* ── File Selection Area ── */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold font-ui text-[var(--text)]">
          Fail Resit / Tangkap Layar <span className="text-red-500">*</span>
        </label>

        {!selectedFile ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 sm:p-8 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--surface-warm)] text-center cursor-pointer transition-colors space-y-2"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--primary)] flex items-center justify-center mx-auto shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold font-ui text-[var(--text)]">
                Tekan untuk pilih fail atau ambil gambar
              </p>
              <p className="text-[11px] font-ui text-[var(--text-subtle)] mt-0.5">
                Format disokong: JPG, PNG, WEBP, PDF (Maksimum {PAYMENT_CONFIG.maxSizeLabel})
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border)] space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white border border-[var(--border)] flex items-center justify-center text-[var(--primary)] shrink-0">
                  {selectedFile.type.startsWith("image/") ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold font-ui text-[var(--text)] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[11px] font-ui text-[var(--text-subtle)]">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-xs font-semibold font-ui text-red-600 hover:text-red-700 p-2"
              >
                Padam / Tukar
              </button>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="relative w-full max-h-48 sm:max-h-64 rounded-xl overflow-hidden border border-[var(--border)] bg-black/5 flex items-center justify-center">
                <Image
                  src={previewUrl}
                  alt="Pratonton Bukti Pembayaran"
                  width={400}
                  height={300}
                  className="max-h-48 sm:max-h-64 w-auto object-contain rounded-xl"
                  unoptimized
                />
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={PAYMENT_CONFIG.allowedExtensions.join(",")}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* ── Transaction Reference (Optional) ── */}
      <div className="space-y-1.5">
        <label htmlFor="transaction-ref" className="block text-xs font-semibold font-ui text-[var(--text)]">
          Nombor Rujukan / ID Transaksi (Pilihan)
        </label>
        <input
          id="transaction-ref"
          type="text"
          maxLength={100}
          disabled={isBusy}
          value={transactionRef}
          onChange={(e) => setTransactionRef(e.target.value)}
          placeholder="cth. TNG-1234567890"
          className="w-full px-3.5 py-2.5 min-h-[48px] rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-ui text-[var(--text)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all placeholder:text-[var(--text-subtle)] disabled:opacity-60 disabled:bg-gray-50"
        />
        <p className="text-[11px] font-ui text-[var(--text-subtle)]">
          Memudahkan pasukan kami memadankan transaksi anda sekiranya terdapat pertanyaan.
        </p>
      </div>

      {/* ── Submit Button ── */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!selectedFile || isBusy}
          aria-busy={isBusy}
          className="w-full py-3.5 rounded-full bg-[var(--primary)] text-white font-ui text-xs font-semibold tracking-wider uppercase hover:bg-[var(--primary-hover)] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitPhase === "uploading" ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memuat Naik Resit...
            </>
          ) : submitPhase === "submitting" ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menghantar untuk Pengesahan...
            </>
          ) : submitPhase === "success" ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Berjaya Dihantar...
            </>
          ) : (
            "Hantar untuk Pengesahan"
          )}
        </button>
      </div>
    </form>
  );
}
