"use client";

import React, { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export interface TemplateAssetUploaderProps {
  label: string;
  description?: string;
  recommendedSize?: string;
  value: string | null;
  onChange: (url: string | null) => void;
  templateSlug?: string;
  assetFolder: "thumbnail" | "background" | "ornaments" | "overlays";
}

export function TemplateAssetUploader({
  label,
  description,
  recommendedSize,
  value,
  onChange,
  templateSlug = "temp",
  assetFolder,
}: TemplateAssetUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Saiz fail melebihi had 5 MB.");
      return;
    }

    // Validate MIME
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Hanya format JPG, PNG, atau WebP dibenarkan.");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const supabase = createClient();
      const cleanSlug = templateSlug.replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
      const ext = file.name.split(".").pop() || "png";
      const filename = `${cleanSlug}-${Date.now()}.${ext}`;
      const path = `${cleanSlug}/${assetFolder}/${filename}`;

      const { error: uploadErr } = await supabase.storage
        .from("template-assets")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadErr) {
        throw new Error(uploadErr.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("template-assets")
        .getPublicUrl(path);

      onChange(publicUrlData.publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memuat naik fail.";
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)] space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <label className="block text-xs font-bold font-ui text-[var(--text)]">
            {label}
          </label>
          {description && (
            <p className="text-[11px] font-ui text-[var(--text-muted)] mt-0.5">
              {description}
            </p>
          )}
          {recommendedSize && (
            <span className="inline-block text-[10px] font-ui font-semibold text-[var(--gold)] mt-0.5">
              {recommendedSize}
            </span>
          )}
        </div>

        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-[11px] font-ui text-red-600 hover:text-red-700 font-semibold underline shrink-0"
          >
            Padam Aset
          </button>
        )}
      </div>

      {uploadError && (
        <p className="text-[11px] font-ui text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {uploadError}
        </p>
      )}

      {value ? (
        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[var(--border)] bg-black/5 flex items-center justify-center">
          <Image
            src={value}
            alt={label}
            fill
            className="object-contain p-2"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center p-2">
            <label className="cursor-pointer px-4 py-2 rounded-full bg-white text-[var(--text)] text-xs font-semibold font-ui shadow-md hover:bg-[var(--surface-warm)] transition-colors">
              <span>Ganti Gambar</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileSelected}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] rounded-xl p-6 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-[var(--surface)] transition-colors">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--text-subtle)]"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <span className="text-xs font-semibold font-ui text-[var(--primary)]">
            {isUploading ? "Memuat naik..." : "Pilih fail imej (PNG/JPG/WebP)"}
          </span>
          <span className="text-[10px] font-ui text-[var(--text-subtle)]">
            Maksimum 5 MB
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileSelected}
            disabled={isUploading}
          />
        </label>
      )}
    </div>
  );
}
