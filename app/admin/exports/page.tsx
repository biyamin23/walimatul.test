import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/permissions";
import { parseReportRange } from "@/lib/data/admin-reports";
import { ReportRangeSelector } from "@/components/admin/reports/ReportRangeSelector";
import { ExportCard } from "@/components/admin/exports/ExportCard";

export const metadata: Metadata = {
  title: "Pusat Eksport Data (CSV) | WALIMATUL Admin",
  description: "Muat turun laporan data operasi dalam format CSV berstruktur dan selamat.",
};

interface Props {
  searchParams: Promise<{
    range?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AdminExportsPage({ searchParams }: Props) {
  await requireAdmin();
  const { range, from, to } = await searchParams;

  const parsedRange = parseReportRange(range, from, to);

  const rangeParams =
    parsedRange.preset === "custom"
      ? `range=custom&from=${parsedRange.fromStr}&to=${parsedRange.toStr}`
      : `range=${parsedRange.preset}`;

  const exportTypes = [
    {
      id: "users",
      title: "Eksport Pengguna",
      description: "Senarai pendaftaran akaun pelanggan dan ringkasan nilai sepanjang hayat.",
      icon: "👥",
      endpoint: "/admin/exports/users",
      fields: [
        "client_id",
        "full_name",
        "phone",
        "joined_at",
        "invitation_count",
        "paid_order_count",
        "lifetime_spend",
      ],
    },
    {
      id: "invitations",
      title: "Eksport Jemputan",
      description: "Data jemputan perkahwinan, nama mempelai, slug, templat, tarikh majlis, dan status.",
      icon: "💌",
      endpoint: "/admin/exports/invitations",
      fields: [
        "invitation_id",
        "client_id",
        "groom_name",
        "bride_name",
        "slug",
        "template",
        "wedding_date",
        "status",
        "published_at",
        "expires_at",
        "created_at",
      ],
    },
    {
      id: "orders",
      title: "Eksport Pembayaran & Pesanan",
      description: "Semua rekod transaksi pesanan, jumlah bayaran, nombor resit, dan status pengesahan.",
      icon: "🧾",
      endpoint: "/admin/exports/orders",
      fields: [
        "order_id",
        "client_id",
        "invitation_id",
        "template",
        "amount",
        "validity_months",
        "payment_status",
        "receipt_number",
        "created_at",
        "paid_at",
        "reviewed_at",
      ],
    },
    {
      id: "rsvps",
      title: "Eksport Ringkasan RSVP",
      description: "Statistik kehadiran tetamu dan ucapan awam bagi setiap jemputan (privasi terjamin).",
      icon: "📊",
      endpoint: "/admin/exports/rsvps",
      fields: [
        "invitation_id",
        "couple",
        "slug",
        "total_responses",
        "attending",
        "not_attending",
        "total_pax",
        "public_wishes_count",
      ],
    },
    {
      id: "templates",
      title: "Eksport Prestasi Templat",
      description: "Metrik komersial, jumlah penggunaan, pesanan berbayar, dan perolehan setiap templat.",
      icon: "🎨",
      endpoint: "/admin/exports/templates",
      fields: [
        "template_id",
        "template_name",
        "status",
        "invitation_count",
        "paid_order_count",
        "revenue",
        "revenue_share",
      ],
    },
    {
      id: "audit-logs",
      title: "Eksport Log Audit",
      description: "Rekod ringkasan aktiviti pentadbir bagi tujuan pematuhan dan jejak audit keselamatan.",
      icon: "🛡️",
      endpoint: "/admin/exports/audit-logs",
      fields: [
        "timestamp",
        "admin_id",
        "action",
        "entity_type",
        "entity_id",
      ],
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Page Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/reports"
              className="text-xs font-semibold font-ui text-[var(--gold)] hover:underline inline-flex items-center gap-1"
            >
              ← Laporan &amp; Analitik
            </Link>
            <span className="text-[var(--text-muted)] text-xs">•</span>
            <span className="text-xs font-medium font-ui text-[var(--text-muted)]">
              {parsedRange.label}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Pusat Eksport Data (CSV)
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Muat turun rekod operasi dan kewangan dalam format CSV yang serasi dengan perisian hamparan (Excel/Sheets).
          </p>
        </div>

        {/* Date Range Selector */}
        <div className="w-full md:w-auto">
          <ReportRangeSelector currentRange={parsedRange} />
        </div>
      </div>

      {/* ── Security & Privacy Notice ── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 flex items-start gap-3 text-xs font-ui">
        <span className="text-base shrink-0 mt-0.5">🔒</span>
        <div className="space-y-1">
          <span className="font-bold block">Pematuhan Privasi &amp; Keselamatan Data:</span>
          <p className="text-emerald-900/90 leading-relaxed">
            Semua fail eksport dijana di bahagian pelayan (server-side) dengan pengekodan UTF-8 BOM dan sanitasi suntikan formula. Maklumat sensitif seperti kata laluan, kunci rahsia, nombor telefon tetamu RSVP peribadi, dan bukti pembayaran asal dilindungi dan tidak dieksport.
          </p>
        </div>
      </div>

      {/* ── Export Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exportTypes.map((card) => (
          <ExportCard
            key={card.id}
            id={card.id}
            title={card.title}
            description={card.description}
            icon={card.icon}
            endpoint={card.endpoint}
            fields={card.fields}
            rangeParams={rangeParams}
          />
        ))}
      </div>
    </div>
  );
}
