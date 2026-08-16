import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wedding Invitation Templates",
  description:
    "Browse beautiful digital wedding invitation templates. Choose your design and create your invitation in minutes.",
};

const TEMPLATES = [
  {
    id: "blush-garden",
    name: "Blush Garden",
    category: "Floral",
    price: "RM49",
    palette: ["#FCF8F3", "#F5DDD6", "#174F3A", "#B8955A"],
    description:
      "A romantic floral design with ivory backgrounds, blush tones, and muted gold accents. Perfect for an elegant garden wedding.",
    available: true,
  },
  {
    id: "royal-gold",
    name: "Royal Gold",
    category: "Elegant",
    price: "RM49",
    palette: ["#1A1A1A", "#B8955A", "#D4B07A", "#F0E6D0"],
    description: "A timeless black and gold design for a classic, sophisticated celebration.",
    available: false,
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    category: "Modern",
    price: "RM49",
    palette: ["#FFFFFF", "#F0F0F0", "#222222", "#888888"],
    description: "Clean lines, elegant typography, and purposeful whitespace for the modern couple.",
    available: false,
  },
  {
    id: "malay-heritage",
    name: "Malay Heritage",
    category: "Traditional",
    price: "RM49",
    palette: ["#F5F0E8", "#8B0000", "#D4AF37", "#2E4A2E"],
    description: "A traditional Malay-inspired design with songket motifs and rich heritage colours.",
    available: false,
  },
];

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section
          className="py-16 sm:py-20"
          style={{ background: "linear-gradient(160deg, var(--background) 60%, var(--blush-soft) 100%)" }}
          aria-labelledby="templates-page-heading"
        >
          <Container>
            <SectionHeading
              eyebrow="Our Templates"
              title="Choose your invitation design"
              subtitle="Each template is a fully responsive digital wedding invitation. Select one to preview and create."
              id="templates-page-heading"
              className="mb-16"
            />

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 list-none" role="list">
              {TEMPLATES.map((template) => (
                <li key={template.id}>
                  <article
                    aria-labelledby={`tpl-${template.id}-name`}
                    className="h-full"
                  >
                    <Card
                      variant="default"
                      padding="none"
                      className="overflow-hidden h-full flex flex-col group hover:shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-1"
                    >
                      {/* Preview */}
                      <div
                        className="h-52 relative flex items-center justify-center"
                        style={{ background: template.palette[0] }}
                        aria-hidden="true"
                      >
                        <div className="absolute top-3 right-3 flex gap-1">
                          {template.palette.map((color, i) => (
                            <div key={i} className="w-3.5 h-3.5 rounded-full border border-white/40" style={{ background: color }} />
                          ))}
                        </div>
                        <div
                          className="w-24 rounded-xl shadow-md flex flex-col items-center py-4 px-3 text-center gap-1.5 border"
                          style={{ background: `${template.palette[0]}dd`, borderColor: `${template.palette[2]}20` }}
                        >
                          <div className="font-display text-sm leading-tight" style={{ color: template.palette[2] }}>Abu &amp; Hana</div>
                          <div className="w-6 h-px" style={{ background: template.palette[3] }} />
                          <div className="text-[8px] tracking-wider uppercase font-ui" style={{ color: template.palette[3] }}>24 Nov 2026</div>
                        </div>

                        {!template.available && (
                          <div className="absolute inset-0 flex items-end justify-center pb-3" style={{ background: "rgba(0,0,0,0.08)" }}>
                            <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: "var(--surface)", color: "var(--text-muted)" }}>
                              Coming Soon
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h2 id={`tpl-${template.id}-name`} className="font-semibold text-[var(--text)] font-ui">
                            {template.name}
                          </h2>
                          <Badge variant={template.available ? "gold" : "default"}>
                            {template.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] mb-3 font-ui leading-relaxed flex-1">
                          {template.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-soft)]">
                          <span className="font-display text-lg text-[var(--primary)]">{template.price}</span>
                          {template.available ? (
                            <Link
                              href={`/templates/${template.id}`}
                              className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
                              aria-label={`Use the ${template.name} template`}
                            >
                              Use This Template →
                            </Link>
                          ) : (
                            <span className="text-xs text-[var(--text-subtle)] font-ui">Coming soon</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </article>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
