import type { Metadata } from "next";
import { BlushGardenPreviewClient } from "./PreviewClient";
import { createDraftAndRedirect } from "@/app/actions/invitations";

export const metadata: Metadata = {
  title: "Blush Garden — Invitation Preview | WALIMATUL",
  description:
    "Preview the Blush Garden digital wedding invitation design. Romantic floral aesthetic with ivory, blush, and muted gold accents.",
};

interface BlushGardenPreviewPageProps {
  searchParams?: Promise<{
    create?: string;
  }>;
}

export default async function BlushGardenPreviewPage({
  searchParams,
}: BlushGardenPreviewPageProps) {
  const params = searchParams ? await searchParams : {};
  if (params.create === "1") {
    await createDraftAndRedirect("blush-garden");
  }

  return <BlushGardenPreviewClient />;
}
