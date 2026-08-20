import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getTemplateBySlug } from "@/lib/data/templates";
import { getTemplateComponent } from "@/templates/registry";
import { HybridEditorialTemplate } from "@/templates/hybrid-editorial/Template";
import { SAMPLE_PREVIEW_INVITATION_DATA } from "@/lib/templates/sample-data";
import { normalizeTemplateDesignConfig } from "@/lib/templates/template-design";
import { CreateDraftButton } from "@/components/invitations/CreateDraftButton";

import { createDraftAndRedirect } from "@/app/actions/invitations";

interface DynamicTemplatePreviewPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    create?: string;
  }>;
}

export async function generateMetadata({
  params,
}: DynamicTemplatePreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplateBySlug(slug);

  if (!template) {
    return {
      title: "Pratonton Templat | WALIMATUL",
    };
  }

  return {
    title: `${template.name} — Pratonton Templat Kad Kahwin | WALIMATUL`,
    description:
      template.description ||
      `Pratonton rekaan templat perkahwinan ${template.name} oleh WALIMATUL.`,
  };
}

export default async function DynamicTemplatePreviewPage({
  params,
  searchParams,
}: DynamicTemplatePreviewPageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};

  if (query.create === "1") {
    await createDraftAndRedirect(slug);
  }

  const template = await getTemplateBySlug(slug);

  if (!template) {
    notFound();
  }

  const designConfig = normalizeTemplateDesignConfig(template.design_config);
  const TemplateComponent =
    getTemplateComponent(template.component_key) || HybridEditorialTemplate;

  return (
    <div className="min-h-screen bg-[var(--surface-warm)] flex flex-col font-ui relative">
      {/* ── Top Header Notice ── */}
      <header className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <Link
          href="/templates"
          className="text-xs font-semibold text-[var(--gold)] hover:underline inline-flex items-center gap-1"
        >
          ← Kembali ke Semua Rekaan
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[var(--text)] hidden sm:inline">
            {template.name}
          </span>
          <span className="text-xs font-bold text-[var(--primary)]">
            RM{template.price}
          </span>
        </div>
      </header>

      {/* ── Template Viewport ── */}
      <main className="flex-1 flex justify-center pb-24">
        {React.createElement(TemplateComponent, {
          data: SAMPLE_PREVIEW_INVITATION_DATA,
          mode: "preview",
          designConfig,
        })}
      </main>

      {/* ── Bottom Fixed CTA Bar ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--border)] px-4 py-3 flex items-center justify-between sm:justify-center gap-4 shadow-lg">
        <div className="sm:hidden">
          <p className="text-xs font-bold text-[var(--text)]">{template.name}</p>
          <p className="text-[11px] text-[var(--primary)] font-bold">
            RM{template.price} · {template.validity_months} Bulan Akses
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CreateDraftButton
            templateSlug={template.slug}
            label={`Gunakan Rekaan Ini (RM${template.price}) →`}
            loadingLabel="Mencipta Draf..."
            className="px-6 py-2.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold shadow-md transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
