import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublishedInvitationBySlug } from "@/lib/data/public-invitations";
import { getTemplateComponent } from "@/templates/registry";
import { getSiteUrl } from "@/lib/utils/site-url";

interface PublicInvitationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Dynamic Metadata for Public Invitations
 * Generates Open Graph, canonical URLs, and privacy-preserving robots directives.
 */
export async function generateMetadata({
  params,
}: PublicInvitationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedInvitationBySlug(slug);

  if (!result) {
    return {
      title: "Jemputan Tidak Tersedia — WALIMATUL",
      description: "Jemputan perkahwinan digital eksklusif oleh WALIMATUL.",
      robots: { index: false, follow: false },
    };
  }

  const { templateData } = result;
  const groom = templateData.groomShortName || templateData.groomName;
  const bride = templateData.brideShortName || templateData.brideName;
  const coupleName = groom && bride ? `${groom} & ${bride}` : "Walimatulurus";

  const title = `${coupleName} — Jemputan Perkahwinan`;
  const description = `Jemputan perkahwinan ${coupleName}. Tekan untuk maklumat majlis, lokasi, dan RSVP.`;
  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${slug.toLowerCase()}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "WALIMATUL",
      type: "website",
      locale: "ms_MY",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

/**
 * Public Invitation Guest View Route
 *
 * Rules:
 * - Unauthenticated guest access (no login required).
 * - Only renders published, non-expired invitations.
 * - Reuses coded template from registry in mode="live".
 * - Standalone presentation with no dashboard or editor chrome.
 */
import { InvitationExperience } from "@/components/invitations/InvitationExperience";

export default async function PublicInvitationPage({
  params,
}: PublicInvitationPageProps) {
  const { slug } = await params;
  const result = await getPublishedInvitationBySlug(slug);

  if (!result) {
    notFound();
  }

  const TemplateComponent = getTemplateComponent(result.template.component_key);

  if (!TemplateComponent) {
    console.error(
      `[WALIMATUL] Template component "${result.template.component_key}" not found for published invitation ${result.invitation.id}`
    );
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <InvitationExperience
        data={result.templateData}
        mode="live"
        designConfig={result.template.design_config}
      >
        {React.createElement(TemplateComponent, {
          data: result.templateData,
          mode: "live",
          designConfig: result.template.design_config,
        })}
      </InvitationExperience>
    </main>
  );
}
