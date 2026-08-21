"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";

export interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

export function GalleryLightbox({
  isOpen,
  onClose,
  imageUrl,
  alt = "Galeri perkahwinan",
}: GalleryLightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Paparan Penuh Gambar"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup paparan imej"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg font-bold transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-white cursor-pointer z-10"
      >
        ✕
      </button>

      {/* Image container */}
      <div
        className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain rounded-xl shadow-2xl"
            unoptimized
            priority
          />
        </div>
      </div>
    </div>
  );
}
