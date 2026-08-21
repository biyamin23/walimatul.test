"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  addGalleryPhotoAction,
  deleteGalleryPhotoAction,
  reorderGalleryAction,
  replaceGalleryPhotoAction,
} from "@/app/actions/gallery";
import type { GalleryItem } from "@/templates/types";

export interface GalleryManagerProps {
  invitationId: string;
  initialGallery?: GalleryItem[];
  onChange?: (updatedGallery: GalleryItem[]) => void;
}

const MAX_PHOTOS = 12;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function GalleryManager({
  invitationId,
  initialGallery = [],
  onChange,
}: GalleryManagerProps) {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

  function notifyChange(newItems: GalleryItem[]) {
    setGallery(newItems);
    if (onChange) {
      onChange(newItems);
    }
  }

  // ── Upload Handler ──
  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setErrorMessage("");

    if (gallery.length >= MAX_PHOTOS) {
      setErrorMessage(`Had maksimum ${MAX_PHOTOS} keping gambar telah dicapai.`);
      return;
    }

    const availableSlots = MAX_PHOTOS - gallery.length;
    const filesToUpload = Array.from(files).slice(0, availableSlots);

    setIsUploading(true);
    const supabase = createClient();

    try {
      const { data: claimsData } = await supabase.auth.getClaims();
      const userId = claimsData?.claims?.sub;

      if (!userId) {
        setErrorMessage("Sila log masuk untuk memuat naik gambar.");
        setIsUploading(false);
        return;
      }

      const currentList = [...gallery];

      for (const file of filesToUpload) {
        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          setErrorMessage(`Format fail "${file.name}" tidak disokong. Sila gunakan JPG, PNG atau WebP.`);
          continue;
        }

        // Validate File Size
        if (file.size > MAX_FILE_SIZE_BYTES) {
          setErrorMessage(`Fail "${file.name}" melebihi saiz maksimum 5 MB.`);
          continue;
        }

        const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
        const fileUid = crypto.randomUUID();
        const storagePath = `${userId}/${invitationId}/${fileUid}.${ext}`;

        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("invitation-gallery")
          .upload(storagePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("[WALIMATUL] Storage upload error:", uploadError.message);
          setErrorMessage(`Gagal memuat naik "${file.name}". Sila cuba lagi.`);
          continue;
        }

        // Get public URL for display
        const { data: publicUrlData } = supabase.storage
          .from("invitation-gallery")
          .getPublicUrl(storagePath);

        const finalUrl = publicUrlData.publicUrl;

        // 2. Persist to DB via Server Action
        const result = await addGalleryPhotoAction(invitationId, finalUrl);
        if (result.success && result.data) {
          currentList.push({
            id: result.data.id,
            storagePath: result.data.storagePath,
            sortOrder: result.data.sortOrder,
          });
        } else {
          setErrorMessage(result.error || "Gagal menyimpan rekod gambar.");
        }
      }

      notifyChange(currentList);
    } catch (err) {
      console.error("[WALIMATUL] Unexpected gallery upload error:", err);
      setErrorMessage("Ralat tidak dijangka semasa memuat naik gambar.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // ── Replace Handler ──
  async function handleReplaceUpload(file: File | null) {
    if (!file || !replacingId) return;
    setErrorMessage("");

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setErrorMessage(`Format fail tidak disokong. Sila gunakan JPG, PNG atau WebP.`);
      setReplacingId(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`Fail melebihi saiz maksimum 5 MB.`);
      setReplacingId(null);
      return;
    }

    setIsUploading(true);
    const supabase = createClient();

    try {
      const { data: claimsData } = await supabase.auth.getClaims();
      const userId = claimsData?.claims?.sub;

      if (!userId) {
        setErrorMessage("Sila log masuk.");
        return;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
      const fileUid = crypto.randomUUID();
      const storagePath = `${userId}/${invitationId}/${fileUid}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("invitation-gallery")
        .upload(storagePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setErrorMessage("Gagal memuat naik gambar gantian.");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("invitation-gallery")
        .getPublicUrl(storagePath);

      const finalUrl = publicUrlData.publicUrl;

      const result = await replaceGalleryPhotoAction(invitationId, replacingId, finalUrl);
      if (result.success) {
        const updated = gallery.map((item) =>
          item.id === replacingId ? { ...item, storagePath: finalUrl } : item
        );
        notifyChange(updated);
      } else {
        setErrorMessage(result.error || "Gagal mengemaskini gambar.");
      }
    } finally {
      setIsUploading(false);
      setReplacingId(null);
      if (replaceInputRef.current) {
        replaceInputRef.current.value = "";
      }
    }
  }

  // ── Delete Handler ──
  async function handleDeleteConfirm(photoId: string) {
    setIsDeleting(true);
    setErrorMessage("");

    try {
      const result = await deleteGalleryPhotoAction(invitationId, photoId);
      if (result.success) {
        const updated = gallery.filter((p) => p.id !== photoId);
        notifyChange(updated);
      } else {
        setErrorMessage(result.error || "Gagal memadam gambar.");
      }
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  }

  // ── Move Up / Down Reorder ──
  async function handleMove(index: number, direction: "up" | "down") {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === gallery.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const items = [...gallery];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);

    const reordered = items.map((item, idx) => ({ ...item, sortOrder: idx }));
    notifyChange(reordered);

    // Save to DB
    await reorderGalleryAction(
      invitationId,
      reordered.map((item) => item.id)
    );
  }

  return (
    <div className="space-y-4 font-ui">
      {/* Top Header & Counter */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-[var(--text)] block">
            Koleksi Foto Galeri
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            Disyorkan: Nisbah potret (cth. 1200 × 1600 px), format JPG/PNG/WebP, maks 5 MB.
          </span>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            gallery.length >= MAX_PHOTOS
              ? "bg-amber-100 text-amber-800 border border-amber-300"
              : "bg-[var(--surface-warm)] text-[var(--text-muted)] border border-[var(--border)]"
          }`}
        >
          {gallery.length} / {MAX_PHOTOS}
        </span>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}

      {/* ── Photo Grid ── */}
      {gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
          {gallery.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-3/4 rounded-2xl overflow-hidden border-2 border-[var(--border)] bg-[var(--surface-warm)] shadow-xs transition-all hover:border-[var(--primary)]"
            >
              <Image
                src={photo.storagePath}
                alt={`Foto galeri ${index + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover"
                unoptimized
              />

              {/* Number Badge */}
              <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                #{index + 1}
              </span>

              {/* Action Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                {/* Top: Move Up / Move Down */}
                <div className="flex items-center justify-end gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, "up")}
                      title="Alih ke atas / kiri"
                      className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      ←
                    </button>
                  )}
                  {index < gallery.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleMove(index, "down")}
                      title="Alih ke bawah / kanan"
                      className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-black flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      →
                    </button>
                  )}
                </div>

                {/* Bottom: Replace & Delete */}
                <div className="flex items-center justify-between gap-1 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setReplacingId(photo.id);
                      replaceInputRef.current?.click();
                    }}
                    className="px-2 py-1 rounded-lg bg-white/90 hover:bg-white text-black text-[10px] font-semibold transition-all cursor-pointer"
                  >
                    Ganti
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(photo.id)}
                    className="p-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-semibold transition-all cursor-pointer"
                  >
                    Padam
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Upload Dropzone ── */}
      {gallery.length < MAX_PHOTOS && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--surface-warm)]/50 hover:bg-[var(--surface-warm)] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[var(--primary)] group-hover:scale-110 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div>
            <p className="text-xs font-bold text-[var(--text)]">
              {isUploading ? "Sedang Memuat Naik..." : "+ Muat Naik Gambar Galeri"}
            </p>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              Klik atau seret fail ke sini (Maksimum {MAX_PHOTOS} gambar)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={isUploading}
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* Hidden input for Replace single file */}
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          handleReplaceUpload(file);
        }}
        className="hidden"
      />

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold font-display text-[var(--text)]">
              Padam Gambar Galeri?
            </h3>
            <p className="text-xs text-[var(--text-muted)] font-ui leading-relaxed">
              Adakah anda pasti mahu memadamkan gambar ini daripada galeri jemputan?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-warm)] transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleDeleteConfirm(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Memadam..." : "Ya, Padam"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
