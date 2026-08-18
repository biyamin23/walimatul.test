import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import type { Metadata } from "next";
import { getActiveTemplates } from "@/lib/data/templates";
import { isTemplateComponentAvailable } from "@/templates/registry";
import { CreateDraftButton } from "@/components/invitations/CreateDraftButton";
import type { Template } from "@/types/database";

export const metadata: Metadata = {
  title: "Wedding Invitation Templates — WALIMATUL",
  description:
    "Browse beautiful digital wedding invitation templates. Choose your design and create your invitation in minutes. One payment, no recurring fees.",
};

/** Brand palette for each template — fallback when no thumbnail exists */
const TEMPLATE_PALETTES: Record<string, string[]> = {
  "blush-garden": ["#FCF8F3", "#F5DDD6", "#174F3A", "#B8955A"],
  "royal-gold": ["#1A1A1A", "#B8955A", "#D4B07A", "#F0E6D0"],
  "minimal-white": ["#FFFFFF", "#F0F0F0", "#222222", "#888888"],
  "malay-heritage": ["#F5F0E8", "#8B0000", "#D4AF37", "#2E4A2E"],
};

const FALLBACK_PALETTE = ["#FCF8F3", "#E8E0D8", "#3A3A3A", "#888888"];

import Image from "next/image";

function TemplateCard({ template }: { template: Template }) {
  const palette = TEMPLATE_PALETTES[template.slug] ?? FALLBACK_PALETTE;
  // A template is actionable only if it has a code component registered
  const isAvailable = isTemplateComponentAvailable(template.component_key);
  const priceDisplay = `RM${Number(template.price).toFixed(0)}`;

  return (
    <article aria-labelledby={`tpl-${template.slug}-name`} className="h-full">
      <Card
        variant="default"
        padding="none"
        className="overflow-hidden h-full flex flex-col group hover:shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-1"
      >
        {/* Visual preview */}
        <div
          className="h-52 relative flex items-center justify-center overflow-hidden"
          style={{ background: palette[0] }}
          aria-hidden="true"
        >
          {template.thumbnail_url ? (
            <Image
              src={template.thumbnail_url}
              alt={template.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <>
              {/* Palette dots */}
              <div className="absolute top-3 right-3 flex gap-1 z-10">
                {palette.map((color, i) => (
                  <div
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-white/40"
                    style={{ background: color }}
                  />
                ))}
              </div>

              {/* Mini invitation preview card */}
              <div
                className="w-24 rounded-xl shadow-md flex flex-col items-center py-4 px-3 text-center gap-1.5 border"
                style={{
                  background: `${palette[0]}dd`,
                  borderColor: `${palette[2]}20`,
                }}
              >
                <div
                  className="font-display text-sm leading-tight"
                  style={{ color: palette[2] }}
                >
                  Abu &amp; Hana
                </div>
                <div
                  className="w-6 h-px"
                  style={{ background: palette[3] }}
                />
                <div
                  className="text-[8px] tracking-wider uppercase font-ui"
                  style={{ color: palette[3] }}
                >
                  24 Nov 2026
                </div>
              </div>
            </>
          )}

          {/* Unavailable overlay */}
          {!isAvailable && (
            <div
              className="absolute inset-0 flex items-end justify-center pb-3"
              style={{ background: "rgba(0,0,0,0.08)" }}
            >
              <span
                className="text-xs font-medium px-3 py-1 rounded-full"
                style={{
                  background: "var(--surface)",
                  color: "var(--text-muted)",
                }}
              >
                Coming Soon
              </span>
            </div>
          )}

          {/* Featured badge */}
          {template.is_featured && isAvailable && (
            <div className="absolute top-3 left-3">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full font-ui tracking-wide"
                style={{
                  background: "var(--gold)",
                  color: "#fff",
                }}
              >
                Featured
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h2
              id={`tpl-${template.slug}-name`}
              className="font-semibold text-[var(--text)] font-ui"
            >
              {template.name}
            </h2>
            <Badge variant={isAvailable ? "gold" : "default"}>
              {template.category ?? "Template"}
            </Badge>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-3 font-ui leading-relaxed flex-1">
            {template.description}
          </p>

          {/* Validity note */}
          <p className="text-[10px] text-[var(--text-subtle)] font-ui mb-3">
            {template.validity_months} months access · One payment
          </p>

          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-soft)]">
            <span className="font-display text-lg text-[var(--primary)]">
              {priceDisplay}
            </span>
            {isAvailable ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/templates/${template.slug}/preview`}
                  className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
                  aria-label={`Preview the ${template.name} template`}
                >
                  Preview
                </Link>
                <CreateDraftButton
                  templateSlug={template.slug}
                  label="Select →"
                  loadingLabel="Creating..."
                  className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
                />
              </div>
            ) : (
              <span className="text-xs text-[var(--text-subtle)] font-ui">
                Coming soon
              </span>
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}

export default async function TemplatesPage() {
  const templates = await getActiveTemplates();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <section
          className="py-16 sm:py-20"
          style={{
            background:
              "linear-gradient(160deg, var(--background) 60%, var(--blush-soft) 100%)",
          }}
          aria-labelledby="templates-page-heading"
        >
          <Container>
            <SectionHeading
              eyebrow="Our Templates"
              title="Choose your invitation design"
              subtitle="Each template is a fully responsive digital wedding invitation. One payment. No recurring fees. Valid for 6 months."
              id="templates-page-heading"
              className="mb-16"
            />

            {templates.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--text-muted)] font-ui">
                  Templates are loading. If this persists, please{" "}
                  <a
                    href="https://wa.me/60148412018"
                    className="text-[var(--primary)] font-semibold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    contact us on WhatsApp
                  </a>
                  .
                </p>
              </div>
            ) : (
              <ul
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 list-none"
                role="list"
              >
                {templates.map((template) => (
                  <li key={template.id}>
                    <TemplateCard template={template} />
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
