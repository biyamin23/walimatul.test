import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { BRAND } from "@/lib/constants/brand";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your WALIMATUL account to manage your digital wedding invitation.",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1 flex items-center justify-center py-16 px-5">
        <Container size="narrow">
          <Card variant="default" padding="lg" className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex flex-col items-center leading-none mb-6">
                <span className="font-display text-2xl font-bold text-[var(--primary)]">{BRAND.name}</span>
                <span className="text-[10px] tracking-widest uppercase text-[var(--gold)] font-ui">{BRAND.signature}</span>
              </Link>
              <h1 className="font-display text-2xl text-[var(--text)] mb-2">Welcome back</h1>
              <p className="text-sm text-[var(--text-muted)] font-ui">Sign in to your account</p>
            </div>

            <p className="text-center text-sm text-[var(--text-muted)] font-ui py-8 border border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
              Authentication will be implemented in Phase 2.
            </p>

            <p className="text-center text-sm text-[var(--text-muted)] mt-6 font-ui">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[var(--primary)] font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 rounded">
                Create one
              </Link>
            </p>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  );
}
