"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { InvitationTemplateData } from "@/templates/types";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { ToileDiamondDivider } from "./ToileOrnaments";

interface ToileGalleryProps {
  data: InvitationTemplateData;
}

export function ToileGallery({ data }: ToileGalleryProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const images = data.gallery;

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section aria-label="Galeri Foto" className="w-full py-10 px-4 sm:px-6 bg-[#FAF7F2] text-[#581825] border-b border-[#E8D9D2]">
      <div className="max-w-lg mx-auto text-center mb-6">
        <span className="font-toile-serif text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#6E2835] block mb-1">
          Memori Indah
        </span>
        <h2 className="font-toile-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#581825]">
          Galeri Foto
        </h2>
        <ToileDiamondDivider className="my-3 opacity-60 w-28" color="#581825" />
      </div>

      {/* Grid of Images with Toile Engraved Framing */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
        {images.map((img, idx) => (
          <div
            key={img.id || idx}
            onClick={() => setLightboxImage(img.storagePath)}
            className={`rounded-2xl overflow-hidden border border-[#581825]/25 shadow-xs bg-white cursor-pointer group relative ${
              idx === 0 && images.length >= 3 ? "col-span-2 sm:col-span-2 h-56 sm:h-64" : "col-span-1 h-44 sm:h-52"
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
              <span className="opacity-0 group-hover:opacity-100 text-white text-[11px] font-toile-body font-semibold bg-[#581825]/90 px-3 py-1 rounded-full backdrop-blur-xs transition-opacity shadow-sm">
                🔍 Lihat
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <GalleryLightbox
          isOpen={Boolean(lightboxImage)}
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </section>
  );
}
