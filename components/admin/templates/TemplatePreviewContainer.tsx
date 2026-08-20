"use client";

import React, { useState } from "react";
import Link from "next/link";
import { getTemplateComponent } from "@/templates/registry";
import { HybridEditorialTemplate } from "@/templates/hybrid-editorial/Template";
import { SAMPLE_PREVIEW_INVITATION_DATA } from "@/lib/templates/sample-data";
import { normalizeTemplateDesignConfig } from "@/lib/templates/template-design";
import type { Template } from "@/types/database";

export interface TemplatePreviewContainerProps {
  template: Template;
}

export function TemplatePreviewContainer({
  template,
}: TemplatePreviewContainerProps) {
  const [viewport, setViewport] = useState<"mobile-standard" | "mobile-large" | "desktop">(
    "mobile-standard"
  );
  const [replayKey, setReplayKey] = useState(0);

  const designConfig = normalizeTemplateDesignConfig(template.design_config);

  // Adapt background specifically for active preview mode
  const effectiveDesignConfig = {
    ...designConfig,
    background: {
      ...designConfig.background,
      mobileImageUrl:
        viewport === "desktop"
          ? designConfig.background.desktopImageUrl || designConfig.background.mobileImageUrl
          : designConfig.background.mobileImageUrl,
      desktopImageUrl:
        viewport === "desktop"
          ? designConfig.background.desktopImageUrl
          : designConfig.background.mobileImageUrl || designConfig.background.desktopImageUrl,
    },
  };

  const viewportWidth =
    viewport === "mobile-standard"
      ? "max-w-[390px]"
      : viewport === "mobile-large"
      ? "max-w-[430px]"
      : "max-w-4xl";

  return (
    <div className="min-h-screen bg-[var(--surface-warm)] flex flex-col font-ui">
      {/* ── Preview Toolbar ── */}
      <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/templates/${template.id}/edit`}
            className="px-3.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-warm)] text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)] transition-colors"
          >
            ← Kembali ke Editor
          </Link>

          <div>
            <span className="text-xs font-bold text-[var(--text)] block">
              {template.name}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              {template.component_key} · RM{template.price} · {designConfig.animation.cardPreset}
            </span>
          </div>
        </div>

        {/* Viewport Width Toggles & Replay Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReplayKey((k) => k + 1)}
            className="px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-warm)] hover:bg-[var(--surface)] text-xs font-semibold text-[var(--text)] hover:border-[var(--primary)] transition-all flex items-center gap-1.5 cursor-pointer"
            title="Main semula animasi kemunculan kad"
          >
            <span aria-hidden="true">🔄</span>
            <span>Main Semula</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--surface-warm)] border border-[var(--border-soft)]">
            <button
              type="button"
              onClick={() => setViewport("mobile-standard")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewport === "mobile-standard"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              📱 390px
            </button>

            <button
              type="button"
              onClick={() => setViewport("mobile-large")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewport === "mobile-large"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              📱 430px
            </button>

            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                viewport === "desktop"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              💻 Desktop
            </button>
          </div>
        </div>
      </header>

      {/* ── Viewport Stage ── */}
      <main className="flex-1 flex justify-center p-0 sm:p-6 overflow-y-auto">
        <div
          key={replayKey}
          className={`w-full ${viewportWidth} transition-all duration-300 shadow-2xl rounded-none sm:rounded-3xl overflow-hidden border border-[var(--border)]`}
        >
          {React.createElement(
            getTemplateComponent(template.component_key) || HybridEditorialTemplate,
            {
              data: SAMPLE_PREVIEW_INVITATION_DATA,
              mode: "preview",
              designConfig: effectiveDesignConfig,
            }
          )}
        </div>
      </main>
    </div>
  );
}
