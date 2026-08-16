import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import type { Metadata } from "next";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set New Password — WALIMATUL",
  description: "Choose a new password for your WALIMATUL account.",
};

export default function ResetPasswordPage() {
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
            <ResetPasswordForm />
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
