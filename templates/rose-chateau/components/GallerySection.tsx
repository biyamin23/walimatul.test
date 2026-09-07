"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { InvitationTemplateData } from "../../types";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { ChateauSection, ChateauSectionHeader } from "./ChateauCard";
import { ChateauReveal } from "./ChateauReveal";

interface GallerySectionProps {
  data: InvitationTemplateData;
  mode?: "live" | "preview" | "editor";
}

export function GallerySection({ data, mode = "live" }: GallerySectionProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const images = data.gallery;
  const isEditor = mode === "editor";

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <ChateauSection ariaLabel="Galeri Foto">
      <ChateauSectionHeader
        eyebrow="Memori Indah"
        title="Galeri Foto"
        disabled={isEditor}
      />

      {/* 1 Image layout */}
      {images.length === 1 && (
        <ChateauReveal variant="scale" duration={700} disabled={isEditor} className="w-full">
          <div
            onClick={() => setLightboxImage(images[0].storagePath)}
            className="w-full max-w-lg mx-auto rounded-3xl overflow-hidden border border-[#EAD6D8] shadow-sm bg-[#FBEDEA] cursor-pointer group relative"
          >
            <Image
              src={images[0].storagePath}
              alt="Foto perkahwinan"
              width={800}
              height={600}
              unoptimized
              loading="lazy"
              className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-chateau-body font-semibold bg-[#6B2333]/80 px-4 py-1.5 rounded-full backdrop-blur-xs transition-opacity shadow-md">
                🔍 Lihat Penuh
              </span>
            </div>
          </div>
        </ChateauReveal>
      )}

      {/* 2 Images layout */}
      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-lg mx-auto">
          {images.map((img, idx) => (
            <ChateauReveal
              key={img.id || idx}
              variant="scale"
              delay={idx * 140}
              duration={650}
              disabled={isEditor}
            >
              <div
                onClick={() => setLightboxImage(img.storagePath)}
                className="rounded-2xl overflow-hidden border border-[#EAD6D8] shadow-xs bg-[#FBEDEA] cursor-pointer group relative"
              >
                <Image
                  src={img.storagePath}
                  alt={`Detik indah ${idx + 1}`}
                  width={400}
                  height={500}
                  unoptimized
                  loading="lazy"
                  className="w-full h-48 sm:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-chateau-body font-semibold bg-[#6B2333]/80 px-3 py-1 rounded-full backdrop-blur-xs transition-opacity">
                    🔍 Lihat
                  </span>
                </div>
              </div>
            </ChateauReveal>
          ))}
        </div>
      )}

      {/* 3+ Images layout */}
      {images.length >= 3 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg mx-auto">
          {images.map((img, idx) => (
            <ChateauReveal
              key={img.id || idx}
              variant="scale"
              delay={Math.min(idx * 100, 400)}
              duration={650}
              disabled={isEditor}
              className={idx === 0 ? "col-span-2 sm:col-span-2" : "col-span-1"}
            >
              <div
                onClick={() => setLightboxImage(img.storagePath)}
                className={`rounded-2xl overflow-hidden border border-[#EAD6D8] shadow-xs bg-[#FBEDEA] cursor-pointer group relative ${
                  idx === 0 ? "h-56 sm:h-72" : "h-44 sm:h-72"
                }`}
              >
                <Image
                  src={img.storagePath}
                  alt={`Detik indah ${idx + 1}`}
                  width={idx === 0 ? 800 : 400}
                  height={idx === 0 ? 500 : 500}
                  unoptimized
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-chateau-body font-semibold bg-[#6B2333]/80 px-3 py-1 rounded-full backdrop-blur-xs transition-opacity">
                    🔍 Lihat
                  </span>
                </div>
              </div>
            </ChateauReveal>
          ))}
        </div>
      )}

      {/* Reusable Lightbox */}
      {lightboxImage && (
        <GalleryLightbox
          isOpen={Boolean(lightboxImage)}
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </ChateauSection>
  );
}

