import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminTemplateById } from "@/lib/data/admin-templates";
import { TemplatePreviewContainer } from "@/components/admin/templates/TemplatePreviewContainer";

export const metadata: Metadata = {
  title: "Pratonton Rekaan Templat | WALIMATUL Admin",
};

interface TemplatePreviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TemplatePreviewPage({ params }: TemplatePreviewPageProps) {
  await requireAdmin();
  const { id } = await params;

  const template = await getAdminTemplateById(id);
  if (!template) {
    notFound();
  }

  return <TemplatePreviewContainer template={template} />;
}
