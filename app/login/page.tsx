import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In — WALIMATUL",
  description:
    "Sign in to your WALIMATUL account to manage and share your digital wedding invitation.",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center py-16 px-5 min-h-[calc(100vh-4rem)]"
        style={{ background: "var(--bg-cream)" }}
      >
        <div className="w-full max-w-md">
          <Card variant="default" padding="lg">
            {/* LoginForm uses useSearchParams — wrap in Suspense */}
            <Suspense fallback={<div className="h-64 animate-pulse" />}>
              <LoginForm />
            </Suspense>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
