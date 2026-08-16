import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for your WALIMATUL digital wedding invitation. Pay once, publish forever.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1">
        <section
          className="py-20 sm:py-28"
          style={{ background: "linear-gradient(160deg, var(--background) 60%, var(--blush-soft) 100%)" }}
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
                Pay once. No monthly fees. No subscriptions. Your invitation
                stays live for as long as you need it.
              </p>
            </div>

            <Card variant="elevated" padding="lg" className="border-2" style={{ borderColor: "var(--primary)" }}>
              <p className="text-center text-sm text-[var(--text-muted)] font-ui">
                Detailed pricing plans will be published here soon. Contact us on{" "}
                <a
                  href="https://wa.me/60148412018"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
                >
                  WhatsApp
                </a>{" "}
                for early access.
              </p>
            </Card>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
