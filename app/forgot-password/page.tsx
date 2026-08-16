import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password — WALIMATUL",
  description:
    "Reset your WALIMATUL account password. Enter your email and we'll send you a link.",
};

export default function ForgotPasswordPage() {
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
            <ForgotPasswordForm />
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
