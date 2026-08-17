import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminPaymentQueue, getAdminPaymentStats } from "@/lib/data/admin-payments";
import { PaymentQueue } from "@/components/admin/payments/PaymentQueue";

export const metadata: Metadata = {
  title: "Admin — Pengurusan Pembayaran | WALIMATUL",
  description: "Semakan dan pengesahan pembayaran Touch 'n Go eWallet.",
};

export default async function AdminPaymentsPage() {
  await requireAdmin();

  const [orders, stats] = await Promise.all([
    getAdminPaymentQueue(),
    getAdminPaymentStats(),
  ]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Pengurusan Kewangan
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Semakan Pembayaran Klien
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Sahkan resit pemindahan Touch ’n Go eWallet dan aktifkan jemputan perkahwinan klien.
          </p>
        </div>

        <Link
          href="/admin"
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-warm)] text-xs font-semibold font-ui text-[var(--text)] hover:border-[var(--primary)] transition-colors"
        >
          ← Kembali ke Dashboard Admin
        </Link>
      </div>

      {/* ── Queue Component ── */}
      <PaymentQueue initialOrders={orders} stats={stats} />
    </div>
  );
}
