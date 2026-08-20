"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createTemplateAction, updateTemplateAction } from "@/app/actions/admin-templates";
import {
  APPROVED_FONTS,
  ANIMATION_PRESETS,
  normalizeTemplateDesignConfig,
  type TemplateDesignConfig,
  type FontFamilyKey,
} from "@/lib/templates/template-design";
import { TemplateAssetUploader } from "./TemplateAssetUploader";
import type { AdminTemplateDetail } from "@/lib/data/admin-templates";

export interface TemplateFormProps {
  initialTemplate?: AdminTemplateDetail | null;
}

export function TemplateForm({ initialTemplate }: TemplateFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(initialTemplate);

  // Basic Details
  const [name, setName] = useState(initialTemplate?.name || "");
  const [slug, setSlug] = useState(initialTemplate?.slug || "");
  const [description, setDescription] = useState(initialTemplate?.description || "");
  const [category, setCategory] = useState(initialTemplate?.category || "Wedding");
  const [componentKey, setComponentKey] = useState(
    initialTemplate?.component_key || "hybrid-editorial"
  );
  const [price, setPrice] = useState<number>(initialTemplate?.price ?? 49);
  const [validityMonths, setValidityMonths] = useState<number>(
    initialTemplate?.validity_months ?? 6
  );
  const [status, setStatus] = useState<"draft" | "active" | "archived">(
    initialTemplate?.status || "draft"
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(
    initialTemplate?.is_featured || false
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    initialTemplate?.thumbnail_url || null
  );

  // Design Config State
  const initialConfig = normalizeTemplateDesignConfig(
    initialTemplate?.design_config
  );
  const [designConfig, setDesignConfig] = useState<TemplateDesignConfig>(initialConfig);

  // Form error & feedback
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Auto-generate slug when name changes (for new template)
  function handleNameChange(val: string) {
    setName(val);
    if (!isEditing && !slug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  }

  function handleSave(submitStatus?: "draft" | "active" | "archived") {
    const finalStatus = submitStatus || status;
    setFormError(null);
    setFieldErrors({});

    startTransition(async () => {
      if (isEditing && initialTemplate) {
        const res = await updateTemplateAction({
          id: initialTemplate.id,
          name,
          slug,
          description,
          category,
          component_key: componentKey,
          price,
          validity_months: validityMonths,
          status: finalStatus,
          is_featured: isFeatured,
          thumbnail_url: thumbnailUrl,
          design_config: designConfig,
        });

        if (res.success && res.data) {
          router.push(`/admin/templates`);
          router.refresh();
        } else {
          setFormError(res.error || "Gagal mengemaskini templat.");
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        }
      } else {
        const res = await createTemplateAction({
          name,
          slug,
          description,
          category,
          component_key: componentKey,
          price,
          validity_months: validityMonths,
          status: finalStatus,
          is_featured: isFeatured,
          thumbnail_url: thumbnailUrl,
          design_config: designConfig,
        });

        if (res.success && res.data) {
          router.push(`/admin/templates`);
          router.refresh();
        } else {
          setFormError(res.error || "Gagal mencipta templat.");
          if (res.fieldErrors) setFieldErrors(res.fieldErrors);
        }
      }
    });
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Active in-use warning */}
      {isEditing && (initialTemplate?.usedByCount ?? 0) > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-ui space-y-1">
          <p className="font-bold">
            ⚠️ Perhatian: Templat Sedang Digunakan ({initialTemplate?.usedByCount} Jemputan)
          </p>
          <p className="text-amber-800 leading-relaxed">
            Sebarang perubahan pada warna, tipografi, atau rekaan latar belakang akan turut memberi kesan kepada paparan jemputan klien sedia ada yang menggunakan templat ini.
          </p>
        </div>
      )}

      {formError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-ui">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* ── 1. Maklumat Asas ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
                Bahagian 1
              </span>
              <h2 className="text-xl font-bold font-display text-[var(--text)]">
                Maklumat Asas Templat
              </h2>
            </div>

            <div className="space-y-4 font-ui">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Nama Templat <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="cth. Royal Gold"
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
                {fieldErrors.name && (
                  <p className="text-[11px] text-red-600 mt-1">{fieldErrors.name[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Slug URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="royal-gold"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  />
                  {fieldErrors.slug && (
                    <p className="text-[11px] text-red-600 mt-1">{fieldErrors.slug[0]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Wedding / Editorial / Traditional"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Penerangan Ringkas
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="cth. Rekaan diraja dengan sentuhan emas mewah dan motif songket..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Enjin Renderer
                </label>
                <select
                  value={componentKey}
                  onChange={(e) => setComponentKey(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="hybrid-editorial">Hybrid Editorial (Configurable &amp; Uploadable)</option>
                  <option value="blush-garden">Blush Garden (Coded Renderer)</option>
                </select>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Templat Hybrid membolehkan anda memuat naik background, palet warna, dan animasi tanpa menyentuh kod React.
                </p>
              </div>
            </div>
          </div>

          {/* ── 2. Penetapan Harga & Tempoh Akses ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
                Bahagian 2
              </span>
              <h2 className="text-xl font-bold font-display text-[var(--text)]">
                Harga &amp; Tempoh Sah
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-ui">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Harga Pesanan (MYR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[var(--text-muted)]">
                    RM
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <p className="text-[10px] text-[var(--text-subtle)] mt-1">
                  cth. 49, 69, atau 79
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Tempoh Sah Akses (Bulan) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  required
                  value={validityMonths}
                  onChange={(e) => setValidityMonths(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-bold text-[var(--text)] focus:outline-none focus:border-[var(--primary)]"
                />
                <p className="text-[10px] text-[var(--text-subtle)] mt-1">
                  cth. 6 bulan atau 12 bulan
                </p>
              </div>
            </div>
          </div>

          {/* ── 3. Muat Naik Aset Rekaan ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
                Bahagian 3
              </span>
              <h2 className="text-xl font-bold font-display text-[var(--text)]">
                Aset Grafik &amp; Rekaan
              </h2>
            </div>

            <div className="space-y-4">
              <TemplateAssetUploader
                label="Thumbnail Katalog (Wajib)"
                description="Imej kad templat yang dipaparkan dalam senarai pilihan klien."
                recommendedSize="Cadangan saiz: 800 × 1200 px (Portrait)"
                value={thumbnailUrl}
                onChange={setThumbnailUrl}
                templateSlug={slug || "new"}
                assetFolder="thumbnail"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TemplateAssetUploader
                  label="Gambar Latar Mobile (Portrait)"
                  description="Imej latar belakang untuk paparan telefon pintar."
                  recommendedSize="Cadangan saiz: 1080 × 1920 px (Portrait)"
                  value={designConfig.background.mobileImageUrl}
                  onChange={(url) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        mobileImageUrl: url,
                        imageUrl: url || prev.background.imageUrl,
                      },
                    }))
                  }
                  templateSlug={slug || "new"}
                  assetFolder="background"
                />

                <TemplateAssetUploader
                  label="Gambar Latar Desktop (Landscape)"
                  description="Imej latar belakang untuk paparan komputer & tablet."
                  recommendedSize="Cadangan saiz: 1920 × 1080 px (Landscape)"
                  value={designConfig.background.desktopImageUrl}
                  onChange={(url) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      background: {
                        ...prev.background,
                        desktopImageUrl: url,
                      },
                    }))
                  }
                  templateSlug={slug || "new"}
                  assetFolder="background"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TemplateAssetUploader
                  label="Ornamen Atas (Top Ornament)"
                  description="Grafik hiasan di bahagian atas jemputan."
                  recommendedSize="Format PNG telus (Transparent)"
                  value={designConfig.ornaments.topOrnamentUrl}
                  onChange={(url) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      ornaments: { ...prev.ornaments, topOrnamentUrl: url },
                    }))
                  }
                  templateSlug={slug || "new"}
                  assetFolder="ornaments"
                />

                <TemplateAssetUploader
                  label="Ornamen Bawah (Bottom Ornament)"
                  description="Grafik hiasan di bahagian penutup jemputan."
                  recommendedSize="Format PNG telus (Transparent)"
                  value={designConfig.ornaments.bottomOrnamentUrl}
                  onChange={(url) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      ornaments: { ...prev.ornaments, bottomOrnamentUrl: url },
                    }))
                  }
                  templateSlug={slug || "new"}
                  assetFolder="ornaments"
                />
              </div>
            </div>
          </div>

          {/* ── 4. Palet Warna Rekaan ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
                Bahagian 4
              </span>
              <h2 className="text-xl font-bold font-display text-[var(--text)]">
                Palet Warna Rekaan
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-ui">
              {[
                { key: "background", label: "Warna Latar", value: designConfig.colors.background },
                { key: "surfaceCard", label: "Warna Kad", value: designConfig.colors.surfaceCard },
                { key: "primaryText", label: "Teks Utama", value: designConfig.colors.primaryText },
                { key: "secondaryText", label: "Teks Kedua", value: designConfig.colors.secondaryText },
                { key: "accent", label: "Warna Aksen", value: designConfig.colors.accent },
                { key: "buttonBg", label: "Butang Utama", value: designConfig.colors.buttonBg },
                { key: "buttonText", label: "Teks Butang", value: designConfig.colors.buttonText },
                { key: "border", label: "Warna Garisan", value: designConfig.colors.border },
              ].map((item) => (
                <div key={item.key} className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-[var(--text-muted)]">
                    {item.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={item.value.startsWith("#") ? item.value : "#9C7A4A"}
                      onChange={(e) =>
                        setDesignConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, [item.key]: e.target.value },
                        }))
                      }
                      className="w-8 h-8 rounded-lg border border-[var(--border)] cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) =>
                        setDesignConfig((prev) => ({
                          ...prev,
                          colors: { ...prev.colors, [item.key]: e.target.value },
                        }))
                      }
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[11px] font-mono text-[var(--text)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 5. Tipografi ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
                Bahagian 5
              </span>
              <h2 className="text-xl font-bold font-display text-[var(--text)]">
                Pilihan Tipografi &amp; Font
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-ui">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Font Tajuk (Heading)
                </label>
                <select
                  value={designConfig.typography.headingFont}
                  onChange={(e) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      typography: {
                        ...prev.typography,
                        headingFont: e.target.value as FontFamilyKey,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)]"
                >
                  {Object.values(APPROVED_FONTS).map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Font Nama Pasangan (Script)
                </label>
                <select
                  value={designConfig.typography.scriptFont}
                  onChange={(e) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      typography: {
                        ...prev.typography,
                        scriptFont: e.target.value as FontFamilyKey,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)]"
                >
                  {Object.values(APPROVED_FONTS).map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Font Teks Kandungan (Body)
                </label>
                <select
                  value={designConfig.typography.bodyFont}
                  onChange={(e) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      typography: {
                        ...prev.typography,
                        bodyFont: e.target.value as FontFamilyKey,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)]"
                >
                  {Object.values(APPROVED_FONTS).map((f) => (
                    <option key={f.key} value={f.key}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── 6. Animasi & Hiasan Overlay ── */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block mb-1">
                Bahagian 6
              </span>
              <h2 className="text-xl font-bold font-display text-[var(--text)]">
                Animasi &amp; Hiasan Terapung
              </h2>
            </div>

            <div className="space-y-4 font-ui">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="overlay-enabled"
                  checked={designConfig.overlay.enabled}
                  onChange={(e) =>
                    setDesignConfig((prev) => ({
                      ...prev,
                      overlay: { ...prev.overlay, enabled: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 rounded text-[var(--primary)]"
                />
                <label htmlFor="overlay-enabled" className="text-xs font-bold text-[var(--text)]">
                  Aktifkan Lapisan Animasi Overlay
                </label>
              </div>

              {designConfig.overlay.enabled && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text)] mb-1.5">
                      Pilihan Preset Animasi
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {ANIMATION_PRESETS.map((p) => {
                        const currentPreset =
                          designConfig.overlay.preset ||
                          designConfig.overlay.animationPreset ||
                          "none";
                        const isSelected = currentPreset === p.key;

                        return (
                          <button
                            key={p.key}
                            type="button"
                            onClick={() =>
                              setDesignConfig((prev) => ({
                                ...prev,
                                overlay: {
                                  ...prev.overlay,
                                  preset: p.key,
                                  animationPreset: p.key,
                                },
                              }))
                            }
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-xs"
                                : "bg-[var(--surface-warm)] border-[var(--border-soft)] text-[var(--text)] hover:border-[var(--primary)]"
                            }`}
                          >
                            <p className="text-xs font-bold">{p.label}</p>
                            <p
                              className={`text-[10px] mt-0.5 ${
                                isSelected
                                  ? "text-white/80"
                                  : "text-[var(--text-muted)]"
                              }`}
                            >
                              {p.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--text)] mb-1">
                        Kelajuan Animasi
                      </label>
                      <select
                        value={designConfig.overlay.speed}
                        onChange={(e) =>
                          setDesignConfig((prev) => ({
                            ...prev,
                            overlay: {
                              ...prev.overlay,
                              speed: e.target.value as "slow" | "normal" | "fast",
                            },
                          }))
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)]"
                      >
                        <option value="slow">Perlahan (Slow / 14s)</option>
                        <option value="normal">Sederhana (Normal / 9s)</option>
                        <option value="fast">Pantas (Fast / 6s)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[var(--text)] mb-1">
                        Keamatan / Kejelasan ({Math.round(designConfig.overlay.opacity * 100)}%)
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.05"
                        value={designConfig.overlay.opacity}
                        onChange={(e) =>
                          setDesignConfig((prev) => ({
                            ...prev,
                            overlay: { ...prev.overlay, opacity: Number(e.target.value) },
                          }))
                        }
                        className="w-full accent-[var(--primary)] mt-2"
                      />
                    </div>
                  </div>

                  <TemplateAssetUploader
                    label="Imej Partikel Khas (Pilihan)"
                    description="Muat naik imej kecil PNG (cth. kelopak bunga / bintang) untuk digunakan dalam animasi."
                    recommendedSize="Saiz disyorkan: 64 × 64 px PNG telus"
                    value={designConfig.overlay.customAssetUrl}
                    onChange={(url) =>
                      setDesignConfig((prev) => ({
                        ...prev,
                        overlay: { ...prev.overlay, customAssetUrl: url },
                      }))
                    }
                    templateSlug={slug || "new"}
                    assetFolder="overlays"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Status & Publish Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-5 font-ui">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] block mb-1">
                Tindakan
              </span>
              <h3 className="text-lg font-bold font-display text-[var(--text)]">
                Status &amp; Terbitan
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Status Templat
                </label>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "draft" | "active" | "archived")
                  }
                  className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text)] font-semibold"
                >
                  <option value="draft">Draf (Tidak kelihatan kepada klien)</option>
                  <option value="active">Aktif (Tersedia untuk dibeli)</option>
                  <option value="archived">Arkib (Tersedia untuk jemputan lama sahaja)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="template-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[var(--primary)]"
                />
                <label htmlFor="template-featured" className="text-xs font-semibold text-[var(--text)]">
                  Pilihan Utama (Featured)
                </label>
              </div>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[var(--border-soft)]">
              <button
                type="button"
                onClick={() => handleSave(status)}
                disabled={isPending}
                className="w-full py-3.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
              >
                {isPending ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Cipta Templat"}
              </button>

              {isEditing && (
                <Link
                  href={`/admin/templates/${initialTemplate?.id}/preview`}
                  target="_blank"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-full bg-[var(--surface-warm)] border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)] transition-colors"
                >
                  <span>Pratonton Rekaan ↗</span>
                </Link>
              )}

              <Link
                href="/admin/templates"
                className="w-full inline-flex items-center justify-center py-2.5 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                Batal &amp; Kembali
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
