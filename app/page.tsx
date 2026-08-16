import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { BRAND, SITE_NAV } from "@/lib/constants/brand";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* ── Hero ────────────────────────────────────────────────────────────── */}
        <HeroSection />

        {/* ── How It Works ────────────────────────────────────────────────────── */}
        <HowItWorksSection />

        {/* ── Featured Templates ──────────────────────────────────────────────── */}
        <TemplatesSection />

        {/* ── Features ────────────────────────────────────────────────────────── */}
        <FeaturesSection />

        {/* ── Pricing ─────────────────────────────────────────────────────────── */}
        <PricingSection />

        {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
        <FaqSection />

        {/* ── Final CTA ───────────────────────────────────────────────────────── */}
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Hero Section
   ───────────────────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-28 lg:py-32"
      aria-labelledby="hero-heading"
      style={{ background: "linear-gradient(160deg, var(--background) 60%, var(--blush-soft) 100%)" }}
    >
      {/* Decorative floral blobs */}
      <div
        aria-hidden="true"
        className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, var(--blush) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, var(--gold-soft) 0%, transparent 70%)" }}
      />

      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 mb-6">
              <span
                className="text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-[var(--radius-pill)] border"
                style={{
                  background: "var(--gold-soft)",
                  borderColor: "var(--gold-soft)",
                  color: "var(--gold)",
                }}
              >
                ✦ For Malaysian Couples
              </span>
            </div>

            <h1
              id="hero-heading"
              className="font-display text-4xl sm:text-5xl lg:text-6xl text-[var(--text)] leading-tight mb-6"
            >
              Create a beautiful wedding invitation.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, var(--primary) 0%, #2d8060 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Share with one link.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg">
              Choose a beautiful template, enter your wedding details, and share
              your digital invitation with guests in minutes. Track RSVPs from
              your private dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={SITE_NAV.templates}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-[var(--radius-lg)] transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
                style={{ background: "var(--primary)" }}
                aria-label="Browse templates to create your wedding invitation"
              >
                Create Your Invitation
                <ArrowRightIcon />
              </Link>
              <Link
                href={SITE_NAV.templates}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-[var(--radius-lg)] border transition-all hover:bg-[var(--primary-soft)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--primary)",
                  background: "var(--surface)",
                }}
              >
                View Templates
              </Link>
            </div>

            <p className="mt-6 text-xs text-[var(--text-subtle)]">
              No credit card required to start &nbsp;·&nbsp; Publish when ready
            </p>
          </div>

          {/* Phone Mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </Container>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative animate-float" aria-hidden="true">
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-[40px] blur-2xl opacity-30"
        style={{ background: "var(--blush)" }}
      />

      {/* Phone Shell */}
      <div
        className="relative w-60 sm:w-72 rounded-[36px] border-4 overflow-hidden"
        style={{
          borderColor: "var(--text)",
          background: "var(--surface)",
          boxShadow: "0 32px 64px rgba(23, 79, 58, 0.15), 0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        {/* Notch */}
        <div
          className="w-24 h-5 mx-auto rounded-b-2xl mb-0"
          style={{ background: "var(--text)" }}
        />

        {/* Invitation Preview */}
        <div
          className="relative flex flex-col items-center justify-between min-h-[480px] px-6 py-8 text-center"
          style={{
            background: "linear-gradient(180deg, var(--background) 0%, var(--blush-soft) 100%)",
          }}
        >
          {/* Floral top */}
          <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-24 opacity-40">
            <FlowerDecoration />
          </div>

          <div className="relative z-10 flex flex-col items-center gap-4 mt-10">
            <p
              className="text-[11px] tracking-widest uppercase"
              style={{ color: "var(--gold)", fontFamily: "var(--font-inter-var)" }}
            >
              You are invited to the wedding of
            </p>

            {/* Couple Names — using display font as placeholder for script */}
            <div
              className="font-display text-3xl sm:text-4xl leading-none"
              style={{ color: "var(--primary)" }}
            >
              <div>Abu</div>
              <div className="text-lg" style={{ color: "var(--gold)" }}>
                &amp;
              </div>
              <div>Hana</div>
            </div>

            <div
              className="w-16 h-px"
              style={{ background: "var(--gold)" }}
            />

            <div>
              <p
                className="text-xs tracking-widest uppercase"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter-var)" }}
              >
                24 November 2026
              </p>
              <p
                className="text-[10px] mt-1"
                style={{ color: "var(--text-subtle)", fontFamily: "var(--font-inter-var)" }}
              >
                Dewan Seri Melati
              </p>
            </div>

            {/* CTA */}
            <div
              className="mt-4 w-full py-3 rounded-xl text-white text-xs font-semibold text-center"
              style={{ background: "var(--primary)", fontFamily: "var(--font-inter-var)" }}
            >
              Open Invitation
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center py-2">
          <div
            className="w-16 h-1 rounded-full"
            style={{ background: "var(--border)" }}
          />
        </div>
      </div>
    </div>
  );
}

function FlowerDecoration() {
  return (
    <svg viewBox="0 0 240 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Simple SVG floral motif */}
      <ellipse cx="30" cy="20" rx="18" ry="10" fill="#F5DDD6" opacity="0.7" transform="rotate(-30 30 20)" />
      <ellipse cx="50" cy="10" rx="16" ry="9" fill="#EFC8B8" opacity="0.6" transform="rotate(15 50 10)" />
      <ellipse cx="15" cy="40" rx="14" ry="8" fill="#F5DDD6" opacity="0.5" transform="rotate(-45 15 40)" />
      <circle cx="38" cy="22" r="5" fill="#B8955A" opacity="0.5" />

      <ellipse cx="210" cy="20" rx="18" ry="10" fill="#F5DDD6" opacity="0.7" transform="rotate(30 210 20)" />
      <ellipse cx="190" cy="10" rx="16" ry="9" fill="#EFC8B8" opacity="0.6" transform="rotate(-15 190 10)" />
      <ellipse cx="225" cy="40" rx="14" ry="8" fill="#F5DDD6" opacity="0.5" transform="rotate(45 225 40)" />
      <circle cx="202" cy="22" r="5" fill="#B8955A" opacity="0.5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   How It Works Section
   ───────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  {
    number: "01",
    title: "Choose Your Design",
    description:
      "Browse our curated collection of elegant wedding invitation templates. Preview how your details will look before committing.",
    color: "var(--primary-soft)",
    textColor: "var(--primary)",
  },
  {
    number: "02",
    title: "Enter Your Details",
    description:
      "Fill in your names, wedding date, venue, and a personal message. Our editor shows a live preview as you type.",
    color: "var(--blush-soft)",
    textColor: "var(--text)",
  },
  {
    number: "03",
    title: "Publish & Share",
    description:
      "Choose your unique link — like walimatul.my/abu-hana — and share it with your guests on WhatsApp, Facebook, or any platform.",
    color: "var(--gold-soft)",
    textColor: "var(--text)",
  },
  {
    number: "04",
    title: "Track Your RSVPs",
    description:
      "See who's attending in real time from your private dashboard. No spreadsheets. No phone calls.",
    color: "var(--primary-soft)",
    textColor: "var(--primary)",
  },
];

function HowItWorksSection() {
  return (
    <section
      className="py-20 sm:py-28"
      aria-labelledby="how-it-works-heading"
      style={{ background: "var(--background-soft)" }}
    >
      <Container>
        <SectionHeading
          eyebrow="Simple Process"
          title="From idea to invitation in minutes"
          subtitle="Everything you need to create, publish and track your wedding invitation — beautifully."
          id="how-it-works-heading"
          className="mb-16"
        />

        <ol
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
          aria-label="How WALIMATUL works"
        >
          {STEPS.map((step, i) => (
            <li key={step.number} className="relative flex flex-col">
              {/* Connector line (desktop only) */}
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute top-8 left-[calc(100%+12px)] w-[calc(100%-24px)] h-px opacity-30"
                  style={{ background: "var(--border)" }}
                />
              )}

              <Card variant="default" padding="lg" className="flex-1 hover:shadow-[var(--shadow-elevated)] transition-shadow">
                <div
                  className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center mb-4 text-lg font-bold font-display"
                  style={{ background: step.color, color: step.textColor }}
                >
                  {step.number}
                </div>
                <h3 className="font-semibold text-base text-[var(--text)] mb-2 font-ui">
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-ui">
                  {step.description}
                </p>
              </Card>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Templates Section
   ───────────────────────────────────────────────────────────────────────────── */

const TEMPLATE_PREVIEWS = [
  {
    id: "blush-garden",
    name: "Blush Garden",
    category: "Floral",
    palette: ["#FCF8F3", "#F5DDD6", "#174F3A", "#B8955A"],
    description: "Romantic florals with ivory and blush tones.",
    available: true,
  },
  {
    id: "royal-gold",
    name: "Royal Gold",
    category: "Elegant",
    palette: ["#1A1A1A", "#B8955A", "#D4B07A", "#F0E6D0"],
    description: "Timeless black and gold for a classic celebration.",
    available: false,
  },
  {
    id: "minimal-white",
    name: "Minimal White",
    category: "Modern",
    palette: ["#FFFFFF", "#F0F0F0", "#222222", "#888888"],
    description: "Clean lines and elegant typography.",
    available: false,
  },
];

function TemplatesSection() {
  return (
    <section
      className="py-20 sm:py-28"
      aria-labelledby="templates-heading"
      style={{ background: "var(--background)" }}
    >
      <Container>
        <SectionHeading
          eyebrow="Our Templates"
          title="Designs as unique as your love story"
          subtitle="Each template is a fully responsive digital invitation — not a static image."
          id="templates-heading"
          className="mb-16"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TEMPLATE_PREVIEWS.map((template) => (
            <article key={template.id} aria-labelledby={`template-${template.id}-name`}>
              <Card
                variant="default"
                padding="none"
                className="overflow-hidden group hover:shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-1"
              >
                {/* Template Colour Preview */}
                <div
                  className="h-56 relative flex items-center justify-center overflow-hidden"
                  style={{ background: template.palette[0] }}
                  aria-hidden="true"
                >
                  {/* Colour palette swatches */}
                  <div className="absolute top-3 right-3 flex gap-1">
                    {template.palette.map((color, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/40"
                        style={{ background: color }}
                      />
                    ))}
                  </div>

                  {/* Mock invitation card inside */}
                  <div
                    className="w-28 rounded-xl shadow-lg flex flex-col items-center py-5 px-3 text-center gap-2"
                    style={{ background: template.palette[0] === "#FFFFFF" ? "#F8F8F8" : template.palette[0], border: `1px solid ${template.palette[2]}20` }}
                  >
                    <div
                      className="font-display text-base leading-tight"
                      style={{ color: template.palette[2] }}
                    >
                      Abu &amp; Hana
                    </div>
                    <div
                      className="w-8 h-px"
                      style={{ background: template.palette[3] }}
                    />
                    <div
                      className="text-[9px] tracking-wider uppercase"
                      style={{ color: template.palette[3], fontFamily: "var(--font-inter-var)" }}
                    >
                      24 Nov 2026
                    </div>
                  </div>

                  {!template.available && (
                    <div
                      className="absolute inset-0 flex items-end justify-center pb-3"
                      style={{ background: "rgba(0,0,0,0.08)" }}
                    >
                      <span
                        className="text-xs font-medium px-3 py-1 rounded-full"
                        style={{ background: "var(--surface)", color: "var(--text-muted)" }}
                      >
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      id={`template-${template.id}-name`}
                      className="font-semibold text-base text-[var(--text)] font-ui"
                    >
                      {template.name}
                    </h3>
                    <Badge variant={template.available ? "primary" : "default"}>
                      {template.available ? "Available" : "Soon"}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mb-4 font-ui">
                    {template.description}
                  </p>

                  {template.available ? (
                    <Link
                      href={`${SITE_NAV.templates}/${template.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
                      aria-label={`Use the ${template.name} template`}
                    >
                      Use This Template <ArrowRightIcon />
                    </Link>
                  ) : (
                    <p className="text-sm text-[var(--text-subtle)] font-ui">
                      Available in a future update
                    </p>
                  )}
                </div>
              </Card>
            </article>
          ))}
        </div>

        <div className="text-center">
          <Link
            href={SITE_NAV.templates}
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold rounded-[var(--radius-lg)] border transition-all hover:bg-[var(--primary-soft)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
            style={{
              borderColor: "var(--border)",
              color: "var(--primary)",
              background: "var(--surface)",
            }}
          >
            View All Templates
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Features Section
   ───────────────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: <MobileIcon />,
    title: "Mobile-First Invitations",
    description:
      "Your guests open the invitation on their phones. Our templates are designed for mobile from the ground up.",
  },
  {
    icon: <LinkIcon />,
    title: "One Simple Link",
    description:
      "Share walimatul.my/your-name on WhatsApp, Instagram, or anywhere. No app download needed for guests.",
  },
  {
    icon: <RsvpIcon />,
    title: "Real-Time RSVP",
    description:
      "Guests RSVP directly on the invitation. You see responses instantly in your private dashboard.",
  },
  {
    icon: <GalleryIcon />,
    title: "Photo Gallery",
    description:
      "Upload your favourite photos to share moments with your guests — from engagement shoots to pre-wedding.",
  },
  {
    icon: <CountdownIcon />,
    title: "Live Countdown",
    description:
      "A beautiful live countdown timer reminds your guests exactly how many days until the big day.",
  },
  {
    icon: <MapIcon />,
    title: "Maps Integration",
    description:
      "Add Google Maps and Waze links so guests can navigate to your venue with a single tap.",
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-20 sm:py-28"
      aria-labelledby="features-heading"
      style={{ background: "linear-gradient(180deg, var(--blush-soft) 0%, var(--background-soft) 100%)" }}
    >
      <Container>
        <SectionHeading
          eyebrow="Everything You Need"
          title="Built for your special day"
          subtitle="Every feature designed with Malaysian couples in mind."
          id="features-heading"
          className="mb-16"
        />

        <ul
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none"
          role="list"
        >
          {FEATURES.map((feature) => (
            <li key={feature.title}>
              <Card variant="default" padding="lg" className="h-full hover:shadow-[var(--shadow-elevated)] transition-shadow group">
                <div
                  className="w-11 h-11 rounded-[var(--radius)] flex items-center justify-center mb-4 text-[var(--primary)] transition-colors group-hover:bg-[var(--primary)] group-hover:text-white"
                  style={{ background: "var(--primary-soft)" }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-base text-[var(--text)] mb-2 font-ui">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed font-ui">
                  {feature.description}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Pricing Section
   ───────────────────────────────────────────────────────────────────────────── */

const PRICING_PLANS = [
  {
    name: "Blush Garden",
    price: "RM49",
    period: "one-time",
    description: "Perfect for couples who want a beautiful, timeless invitation.",
    features: [
      "Blush Garden template",
      "Custom wedding URL",
      "Unlimited RSVP responses",
      "Photo gallery (up to 10 photos)",
      "Google Maps & Waze integration",
      "Live countdown timer",
      "Background music",
      "Shareable QR code",
    ],
    cta: "Use This Template",
    href: `${SITE_NAV.templates}/blush-garden`,
    highlighted: true,
  },
];

function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-20 sm:py-28"
      aria-labelledby="pricing-heading"
      style={{ background: "var(--background)" }}
    >
      <Container size="narrow">
        <SectionHeading
          eyebrow="Simple Pricing"
          title="One beautiful template, one fair price"
          subtitle="Pay once. Publish forever. No monthly fees, no hidden costs."
          id="pricing-heading"
          className="mb-16"
        />

        <div className="flex justify-center">
          {PRICING_PLANS.map((plan) => (
            <div key={plan.name} className="w-full max-w-md">
              <Card
                variant="elevated"
                padding="lg"
                className="relative overflow-hidden border-[var(--primary)]"
                style={{ borderColor: "var(--primary)", borderWidth: "2px" }}
              >
                {/* Recommended ribbon */}
                <div
                  className="absolute top-5 right-5"
                >
                  <Badge variant="primary">Most Popular</Badge>
                </div>

                <h3 className="font-display text-2xl text-[var(--text)] mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mb-6 font-ui">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="font-display text-5xl text-[var(--primary)]">
                    {plan.price}
                  </span>
                  <span className="text-sm text-[var(--text-muted)] font-ui">
                    {plan.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 list-none" role="list">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-[var(--text)] font-ui"
                    >
                      <CheckIcon />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className="block w-full text-center py-4 px-6 text-base font-semibold text-white rounded-[var(--radius-lg)] transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2"
                  style={{ background: "var(--primary)" }}
                  aria-label={`Get started with ${plan.name} for ${plan.price}`}
                >
                  {plan.cta}
                </Link>
              </Card>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[var(--text-subtle)] mt-6 font-ui">
          Need help? Contact us on{" "}
          <a
            href={BRAND.supportWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--primary)] hover:underline font-medium focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
            aria-label={`Contact WALIMATUL support on WhatsApp at ${BRAND.supportPhone}`}
          >
            WhatsApp
          </a>
        </p>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FAQ Section
   ───────────────────────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    question: "Do my guests need to create an account to RSVP?",
    answer:
      "No. Guests simply open your invitation link and submit their RSVP without creating any account. It's completely seamless for them.",
  },
  {
    question: "Can I change my wedding details after publishing?",
    answer:
      "Yes. You can update your wedding information at any time from your dashboard. Changes will reflect immediately on your live invitation.",
  },
  {
    question: "What is the unique URL?",
    answer:
      "You choose a custom slug — for example, walimatul.my/abu-hana. This is the link you share with guests. It must be unique and cannot match reserved system paths.",
  },
  {
    question: "How many guests can RSVP?",
    answer:
      "There is no limit on the number of RSVP responses. You can set a maximum pax per guest (e.g. 2 seats per RSVP) from your invitation settings.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "Payment options will include popular Malaysian methods. Full payment integration will be available at launch. Contact us on WhatsApp for early access.",
  },
  {
    question: "Can I use WALIMATUL for a Malay or Islamic wedding?",
    answer:
      "Absolutely. WALIMATUL is designed with Malaysian weddings in mind, supporting Malay names, Islamic invitation wording, and local cultural conventions.",
  },
];

function FaqSection() {
  return (
    <section
      className="py-20 sm:py-28"
      aria-labelledby="faq-heading"
      style={{ background: "var(--background-soft)" }}
    >
      <Container size="narrow">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          id="faq-heading"
          className="mb-12"
        />

        <dl className="divide-y divide-[var(--border-soft)]">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group py-5"
            >
              <summary
                className="flex items-center justify-between gap-4 cursor-pointer list-none text-[var(--text)] font-semibold text-sm sm:text-base font-ui focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
                aria-expanded="false"
              >
                <dt>{item.question}</dt>
                <span
                  className="flex-shrink-0 w-5 h-5 text-[var(--gold)] transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  <PlusIcon />
                </span>
              </summary>
              <dd className="pt-3 text-sm text-[var(--text-muted)] leading-relaxed font-ui">
                {item.answer}
              </dd>
            </details>
          ))}
        </dl>

        <p className="mt-10 text-center text-sm text-[var(--text-muted)] font-ui">
          Have another question?{" "}
          <a
            href={BRAND.supportWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--primary)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded"
            aria-label={`Ask us on WhatsApp at ${BRAND.supportPhone}`}
          >
            Ask us on WhatsApp
          </a>
        </p>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Final CTA Section
   ───────────────────────────────────────────────────────────────────────────── */

function CtaSection() {
  return (
    <section
      className="py-20 sm:py-28 relative overflow-hidden"
      aria-labelledby="cta-heading"
      style={{ background: "var(--primary)" }}
    >
      {/* Subtle floral overlay */}
      <div
        aria-hidden="true"
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
        style={{ background: "var(--blush)" }}
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full opacity-10"
        style={{ background: "var(--gold-soft)" }}
      />

      <Container size="narrow">
        <div className="text-center relative z-10">
          <p className="text-sm font-semibold tracking-widest uppercase mb-4" style={{ color: "var(--gold-soft)" }}>
            ✦ Start Today
          </p>
          <h2
            id="cta-heading"
            className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-6 leading-tight"
          >
            Your wedding deserves a beautiful invitation
          </h2>
          <p className="text-base sm:text-lg mb-10 leading-relaxed max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
            Join Malaysian couples who are sharing their special day digitally
            with {BRAND.name}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={SITE_NAV.templates}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-[var(--primary)] bg-white rounded-[var(--radius-lg)] transition-all hover:bg-[var(--blush-soft)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              aria-label="Browse templates and create your invitation now"
            >
              Create Your Invitation
              <ArrowRightIcon />
            </Link>
            <Link
              href={SITE_NAV.templates}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/30 rounded-[var(--radius-lg)] transition-all hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
            >
              View Templates
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Inline SVG Icons (lightweight, no icon library dependency for Phase 1)
   ───────────────────────────────────────────────────────────────────────────── */

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--success)", flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function RsvpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function CountdownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
