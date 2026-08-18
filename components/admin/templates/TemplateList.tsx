"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  setTemplateStatusAction,
  deleteTemplateAction,
} from "@/app/actions/admin-templates";
import type { AdminTemplateListItem } from "@/lib/data/admin-templates";

export interface TemplateListProps {
  initialTemplates: AdminTemplateListItem[];
}

export function TemplateList({ initialTemplates }: TemplateListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<"all" | "active" | "draft" | "archived">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Deletion modal state
  const [deleteModalTemplate, setDeleteModalTemplate] = useState<AdminTemplateListItem | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const filteredTemplates = initialTemplates.filter((t) => {
    if (activeTab !== "all" && t.status !== activeTab) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.component_key.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleStatusToggle(id: string, newStatus: "draft" | "active" | "archived") {
    setActionError(null);
    startTransition(async () => {
      const res = await setTemplateStatusAction(id, newStatus);
      if (!res.success) {
        setActionError(res.error || "Gagal menukar status templat.");
      } else {
        router.refresh();
      }
    });
  }

  function handleConfirmDelete() {
    if (!deleteModalTemplate) return;
    setActionError(null);
    startTransition(async () => {
      const res = await deleteTemplateAction(deleteModalTemplate.id);
      if (!res.success) {
        setActionError(res.error || "Gagal memadam templat.");
      } else {
        setDeleteModalTemplate(null);
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* ── Top Bar / Tabs & Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
          {[
            { key: "all", label: "Semua", count: initialTemplates.length },
            {
              key: "active",
              label: "Aktif",
              count: initialTemplates.filter((t) => t.status === "active").length,
            },
            {
              key: "draft",
              label: "Draf",
              count: initialTemplates.filter((t) => t.status === "draft").length,
            },
            {
              key: "archived",
              label: "Diarkib",
              count: initialTemplates.filter((t) => t.status === "archived").length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-ui transition-all ${
                activeTab === tab.key
                  ? "bg-[var(--surface)] text-[var(--text)] shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari nama atau slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-ui text-[var(--text)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>

      {actionError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-ui">
          {actionError}
        </div>
      )}

      {/* ── Templates Grid ── */}
      {filteredTemplates.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-3 font-ui">
          <p className="text-sm font-semibold text-[var(--text)]">
            Tiada templat ditemui.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Cuba tukar carian anda atau cipta templat baharu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const isBlush = template.component_key === "blush-garden";
            const canDelete =
              template.usedByCount === 0 &&
              template.orderCount === 0 &&
              template.status === "draft";

            return (
              <div
                key={template.id}
                className="rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                {/* Thumbnail & Badges */}
                <div className="relative aspect-4/3 w-full bg-[var(--surface-warm)] border-b border-[var(--border-soft)]">
                  {template.thumbnail_url ? (
                    <Image
                      src={template.thumbnail_url}
                      alt={template.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-subtle)] gap-2 p-4 text-center">
                      <span className="text-3xl">🎨</span>
                      <span className="text-[11px] font-ui font-semibold">
                        Tiada Thumbnail
                      </span>
                    </div>
                  )}

                  {/* Status Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-ui border shadow-2xs ${
                        template.status === "active"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : template.status === "draft"
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-stone-100 text-stone-600 border-stone-300"
                      }`}
                    >
                      {template.status === "active"
                        ? "Aktif"
                        : template.status === "draft"
                        ? "Draf"
                        : "Diarkib"}
                    </span>

                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-ui bg-white/90 text-[var(--text)] border border-[var(--border)] shadow-2xs backdrop-blur-xs">
                      {isBlush ? "Coded (React)" : "Hybrid Editorial"}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between font-ui">
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-lg font-bold font-display text-[var(--text)]">
                        {template.name}
                      </h3>
                      <span className="text-sm font-bold text-[var(--primary)] font-display">
                        RM{template.price}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {template.description || "Tiada penerangan templat."}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[var(--text-subtle)] pt-1">
                      <span>Slug: <code className="font-mono text-[var(--text)]">{template.slug}</code></span>
                      <span>•</span>
                      <span>Akses: {template.validity_months} Bulan</span>
                    </div>

                    <div className="pt-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-semibold border ${
                          template.usedByCount > 0
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-[var(--surface-warm)] text-[var(--text-muted)] border-[var(--border-soft)]"
                        }`}
                      >
                        <span>💍 Digunakan oleh {template.usedByCount} jemputan</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-4 border-t border-[var(--border-soft)] space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/admin/templates/${template.id}/edit`}
                        className="py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-warm)] hover:border-[var(--primary)] text-center text-xs font-semibold text-[var(--text)] transition-colors"
                      >
                        Edit Rekaan
                      </Link>

                      <Link
                        href={`/admin/templates/${template.id}/preview`}
                        target="_blank"
                        className="py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] text-center text-xs font-semibold text-[var(--text)] transition-colors"
                      >
                        Pratonton ↗
                      </Link>
                    </div>

                    {/* Quick Status / Delete Bar */}
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      {template.status === "draft" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleStatusToggle(template.id, "active")}
                          className="font-semibold text-emerald-700 hover:text-emerald-800 underline"
                        >
                          Aktifkan
                        </button>
                      )}

                      {template.status === "active" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleStatusToggle(template.id, "draft")}
                          className="font-semibold text-amber-700 hover:text-amber-800 underline"
                        >
                          Tukar ke Draf
                        </button>
                      )}

                      {template.status !== "archived" && (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleStatusToggle(template.id, "archived")}
                          className="font-semibold text-stone-600 hover:text-stone-800 underline"
                        >
                          Arkibkan
                        </button>
                      )}

                      {canDelete ? (
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => setDeleteModalTemplate(template)}
                          className="font-semibold text-red-600 hover:text-red-700 underline ml-auto"
                        >
                          Padam
                        </button>
                      ) : (
                        <span
                          className="text-[10px] text-[var(--text-subtle)] ml-auto"
                          title="Templat yang sedang digunakan atau diarkibkan tidak boleh dipadam demi memelihara integriti jemputan sedia ada."
                        >
                          Dilindungi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Safe Deletion Modal ── */}
      {deleteModalTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-ui">
          <div className="w-full max-w-md rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display text-[var(--text)]">
                Sahkan Pemadaman Templat
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Adakah anda pasti mahu memadam templat draf{" "}
                <span className="font-bold text-[var(--text)]">
                  &ldquo;{deleteModalTemplate.name}&rdquo;
                </span>
                ? Tindakan ini tidak boleh diundur.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setDeleteModalTemplate(null)}
                className="px-4 py-2 rounded-full border border-[var(--border)] text-xs font-semibold text-[var(--text)] hover:bg-[var(--surface-warm)]"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md"
              >
                {isPending ? "Memadam..." : "Ya, Padam Templat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
