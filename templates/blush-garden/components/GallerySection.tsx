"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { InvitationTemplateData } from "../../types";
import { BotanicalDivider } from "./BotanicalOrnaments";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";

interface GallerySectionProps {
  data: InvitationTemplateData;
}

export function GallerySection({ data }: GallerySectionProps) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const images = data.gallery;

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section aria-label="Photo Gallery" className="relative px-4 sm:px-6 py-10 sm:py-14 max-w-xl mx-auto text-center">
      <p className="font-cormorant text-xs font-semibold tracking-[0.25em] uppercase text-[#B8955A] mb-3">
        Memori
      </p>
      <h3 className="font-cormorant text-2xl sm:text-3xl font-semibold text-[#174F3A] mb-8">
        Galeri Foto
      </h3>

      {/* Responsive Gallery Grid Layout */}
      {images.length === 1 && (
        <div
          onClick={() => setLightboxImage(images[0].storagePath)}
          className="rounded-3xl overflow-hidden border-2 border-[#E8DDD5] shadow-sm bg-[#FCF1EE] cursor-pointer group relative"
        >
          <Image
            src={images[0].storagePath}
            alt="Wedding portrait"
            width={800}
            height={600}
            unoptimized
            className="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs transition-opacity">
              🔍 Lihat Penuh
            </span>
          </div>
        </div>
      )}

      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setLightboxImage(img.storagePath)}
              className="rounded-2xl overflow-hidden border-2 border-[#E8DDD5] shadow-sm bg-[#FCF1EE] cursor-pointer group relative"
            >
              <Image
                src={img.storagePath}
                alt={`Wedding moment ${idx + 1}`}
                width={400}
                height={500}
                unoptimized
                className="w-full h-48 sm:h-64 object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-full backdrop-blur-xs transition-opacity">
                  🔍 Lihat
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length >= 3 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setLightboxImage(img.storagePath)}
              className={`rounded-2xl overflow-hidden border-2 border-[#E8DDD5] shadow-sm bg-[#FCF1EE] cursor-pointer group relative ${
                idx === 0 ? "col-span-2 sm:col-span-2 h-56 sm:h-72" : "col-span-1 h-44 sm:h-72"
              }`}
            >
              <Image
                src={img.storagePath}
                alt={`Wedding moment ${idx + 1}`}
                width={idx === 0 ? 800 : 400}
                height={idx === 0 ? 500 : 500}
                unoptimized
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded-full backdrop-blur-xs transition-opacity">
                  🔍 Lihat
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <GalleryLightbox
        isOpen={Boolean(lightboxImage)}
        imageUrl={lightboxImage || ""}
        onClose={() => setLightboxImage(null)}
      />

      <BotanicalDivider className="mt-10" />
    </section>
  );
}
