import type { Metadata } from "next";
import { BlushGardenPreviewClient } from "./PreviewClient";

export const metadata: Metadata = {
  title: "Blush Garden — Invitation Preview | WALIMATUL",
  description:
    "Preview the Blush Garden digital wedding invitation design. Romantic floral aesthetic with ivory, blush, and muted gold accents.",
};

export default function BlushGardenPreviewPage() {
  return <BlushGardenPreviewClient />;
}
