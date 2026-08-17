import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — WALIMATUL",
  description:
    "Simple, transparent pricing for your WALIMATUL digital wedding invitation. RM49 — one payment, no recurring fees. Valid for 6 months.",
};

const FEATURES = [
  "Fully responsive digital invitation",
  "Unique invitation link (walimatul.my/yourname)",
  "Invitation QR code for sharing",
  "Photo gallery",
  "RSVP management",
  "Google Maps & Waze directions",
  "Background music",
  "6 months invitation access",
  "No recurring fees",
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section
          className="py-20 sm:py-28"
          style={{
            background:
              "linear-gradient(160deg, var(--background) 60%, var(--blush-soft) 100%)",
          }}
          aria-labelledby="pricing-page-heading"
        >
          <Container size="narrow">
            <div className="text-center mb-16">
              <p className="text-sm font-semibold tracking-widest uppercase text-[var(--gold)] mb-3 font-ui">
                Simple Pricing
              </p>
              <h1
                id="pricing-page-heading"
                className="font-display text-4xl sm:text-5xl text-[var(--text)] leading-tight mb-4"
              >
                One template, one fair price
              </h1>
              <p className="text-base text-[var(--text-muted)] font-ui max-w-lg mx-auto">
                One payment. No monthly fees. No subscriptions.
              </p>
            </div>

            {/* Pricing card */}
            <Card
              variant="elevated"
              padding="none"
              className="border-2 overflow-hidden"
              style={{ borderColor: "var(--primary)" }}
            >
              {/* Header */}
              <div
                className="px-8 pt-10 pb-8 text-center border-b border-[var(--border-soft)]"
                style={{
                  background:
                    "linear-gradient(160deg, var(--background) 0%, var(--blush-soft) 100%)",
                }}
              >
                <p className="text-sm font-semibold tracking-widest uppercase text-[var(--gold)] mb-3 font-ui">
                  Blush Garden
                </p>
                <div className="flex items-end justify-center gap-1 mb-2">
                  <span
                    className="font-display text-6xl sm:text-7xl leading-none"
                    style={{ color: "var(--primary)" }}
                  >
                    RM49
                  </span>
                </div>
                <p className="text-sm text-[var(--text-muted)] font-ui">
                  One payment · 6 months access · No recurring fees
                </p>
              </div>

              {/* Features */}
              <div className="px-8 py-8">
                <ul className="space-y-3" role="list">
                  {FEATURES.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 font-ui text-sm text-[var(--text)]"
                    >
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "var(--primary)" }}
                        aria-hidden="true"
                      >
                        ✓
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Payment method note */}
                <div
                  className="mt-8 p-4 rounded-xl text-sm font-ui text-center"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border-soft)",
                  }}
                >
                  <p className="text-[var(--text-muted)] mb-1">
                    Payment via
                  </p>
                  <p className="font-semibold text-[var(--text)]">
                    Touch &apos;n Go eWallet
                  </p>
                  <p className="text-xs text-[var(--text-subtle)] mt-1">
                    Scan the payment QR, upload your payment proof, and our team
                    will activate your invitation within 24 hours.
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                  <Link
                    href="/templates"
                    id="pricing-create-cta"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-white font-ui transition-all hover:opacity-90 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
                    style={{ background: "var(--primary)" }}
                  >
                    Create Your Invitation
                  </Link>
                  <p className="mt-4 text-xs text-[var(--text-subtle)] font-ui">
                    Questions?{" "}
                    <a
                      href="https://wa.me/60148412018"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary)] font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
                    >
                      Chat with us on WhatsApp
                    </a>
                  </p>
                </div>
              </div>
            </Card>

            {/* FAQ note */}
            <div className="mt-12 text-center">
              <p className="text-sm text-[var(--text-muted)] font-ui">
                After 6 months, your invitation link will expire.{" "}
                <a
                  href="https://wa.me/60148412018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] font-semibold hover:underline"
                >
                  Contact us
                </a>{" "}
                to discuss renewal options.
              </p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
