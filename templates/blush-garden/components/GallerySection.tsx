import React from "react";
import Image from "next/image";
import type { InvitationTemplateData } from "../../types";
import { BotanicalDivider } from "./BotanicalOrnaments";

interface GallerySectionProps {
  data: InvitationTemplateData;
}

export function GallerySection({ data }: GallerySectionProps) {
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
        <div className="rounded-3xl overflow-hidden border-2 border-[#E8DDD5] shadow-sm bg-[#FCF1EE]">
          <Image
            src={images[0].storagePath}
            alt="Wedding portrait"
            width={800}
            height={600}
            unoptimized
            className="w-full h-80 sm:h-96 object-cover object-center"
          />
        </div>
      )}

      {images.length === 2 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              className="rounded-2xl overflow-hidden border-2 border-[#E8DDD5] shadow-sm bg-[#FCF1EE]"
            >
              <Image
                src={img.storagePath}
                alt={`Wedding moment ${idx + 1}`}
                width={400}
                height={500}
                unoptimized
                className="w-full h-48 sm:h-64 object-cover object-center"
              />
            </div>
          ))}
        </div>
      )}

      {images.length >= 3 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id || idx}
              className={`rounded-2xl overflow-hidden border-2 border-[#E8DDD5] shadow-sm bg-[#FCF1EE] ${
                idx === 0 ? "col-span-2 sm:col-span-2 h-56 sm:h-72" : "col-span-1 h-44 sm:h-72"
              }`}
            >
              <Image
                src={img.storagePath}
                alt={`Wedding moment ${idx + 1}`}
                width={idx === 0 ? 800 : 400}
                height={idx === 0 ? 500 : 500}
                unoptimized
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      )}

      <BotanicalDivider className="mt-10" />
    </section>
  );
}
