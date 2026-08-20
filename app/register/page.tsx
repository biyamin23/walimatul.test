import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  title: "Create Account — WALIMATUL",
  description:
    "Create your WALIMATUL account and start building your beautiful digital wedding invitation.",
};

import { Suspense } from "react";

export default function RegisterPage() {
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
            <Suspense fallback={<div className="h-64 animate-pulse" />}>
              <RegisterForm />
            </Suspense>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
