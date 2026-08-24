import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/permissions";
import { getAdminInvitationDetail } from "@/lib/data/admin-invitations";
import { AdminStatusBadge } from "@/components/admin/shared/AdminStatusBadge";
import { ExtendExpiryCard } from "@/components/admin/invitations/ExtendExpiryCard";

export const metadata: Metadata = {
  title: "Admin — Butiran Jemputan | WALIMATUL",
  description: "Semakan lengkap jemputan, maklumat komersial, tetapan ciri, dan metrik RSVP.",
};

function fmtMYR(amount: number): string {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("ms-MY", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("ms-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default async function AdminInvitationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await params;
  const detail = await getAdminInvitationDetail(id);

  if (!detail) {
    notFound();
  }

  const { invitation, client, template, order, features, rsvps } = detail;

  const groomDisplay = invitation.groom_name || invitation.groom_short_name || "Pengantin Lelaki";
  const brideDisplay = invitation.bride_name || invitation.bride_short_name || "Pengantin Perempuan";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── Breadcrumb & Back Navigation ── */}
      <div>
        <Link
          href="/admin/invitations"
          className="inline-flex items-center gap-1.5 text-xs font-ui font-semibold text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors mb-2"
        >
          ← Kembali ke Senarai Jemputan
        </Link>
      </div>

      {/* ── Page Header Card ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui">
              Pusat Pemeriksaan Jemputan
            </span>
            <AdminStatusBadge
              type="invitation"
              status={invitation.status}
              expiresAt={invitation.expires_at}
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            {groomDisplay} &amp; {brideDisplay}
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Templat: <span className="font-semibold text-[var(--text)]">{template.name}</span> · Dimiliki oleh{" "}
            <Link
              href={`/admin/users/${client.id}`}
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              {client.full_name || "Pelanggan"}
            </Link>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          {invitation.slug && invitation.status === "published" && (
            <a
              href={`/${invitation.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold font-ui hover:bg-emerald-100 transition-colors shadow-xs"
            >
              Buka Jemputan Awam ↗
            </a>
          )}
          {order && (
            <Link
              href={`/admin/payments/${order.id}`}
              className="px-4 py-2 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold font-ui hover:border-stone-400 transition-colors"
            >
              Semak Pembayaran →
            </Link>
          )}
          <Link
            href={`/admin/users/${client.id}`}
            className="px-4 py-2 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold font-ui hover:border-stone-400 transition-colors"
          >
            Profil Pelanggan →
          </Link>
        </div>
      </div>

      {/* ── Section 1: Overview & Dates ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <h2 className="text-base font-bold font-display text-[var(--text)] border-b border-[var(--border)] pb-3">
            Maklumat &amp; Lokasi Majlis
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-ui">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Tarikh Majlis
              </span>
              <span className="font-semibold text-[var(--text)] text-sm mt-0.5 block">
                {formatDate(invitation.wedding_date)}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Masa Majlis
              </span>
              <span className="font-semibold text-[var(--text)] text-sm mt-0.5 block">
                {invitation.start_time ? invitation.start_time.slice(0, 5) : "—"}{" "}
                {invitation.end_time ? `– ${invitation.end_time.slice(0, 5)}` : ""}
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Nama &amp; Alamat Lokasi
              </span>
              <span className="font-semibold text-[var(--text)] block mt-0.5">
                {invitation.venue_name || "—"}
              </span>
              {invitation.venue_address && (
                <span className="text-[var(--text-muted)] text-[11px] block mt-0.5">
                  {invitation.venue_address}
                </span>
              )}
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Slug URL Awam
              </span>
              <span className="font-mono text-xs text-[var(--text)] block mt-0.5">
                {invitation.slug ? `/${invitation.slug}` : "Tiada slug"}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                ID Rekod
              </span>
              <span className="font-mono text-[11px] text-stone-400 block mt-0.5">
                {invitation.id}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <h2 className="text-base font-bold font-display text-[var(--text)] border-b border-[var(--border)] pb-3">
            Status Kitar Hayat &amp; Tarikh
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-ui">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Status Kitar Hayat
              </span>
              <div className="mt-1">
                <AdminStatusBadge
                  type="invitation"
                  status={invitation.status}
                  expiresAt={invitation.expires_at}
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Diterbitkan Pada
              </span>
              <span className="font-medium text-[var(--text)] block mt-1">
                {formatDateTime(invitation.published_at)}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Tamat Tempoh (Expires At)
              </span>
              <span className="font-bold text-[var(--primary)] text-sm block mt-0.5">
                {formatDate(invitation.expires_at)}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Dicipta Pada
              </span>
              <span className="text-[var(--text-muted)] block mt-0.5">
                {formatDateTime(invitation.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Commercial & Template Snapshots ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Templat Rekaan
            </h2>
            <Link
              href={`/admin/templates/${template.id}/edit`}
              className="text-xs font-ui text-[var(--primary)] hover:underline font-semibold"
            >
              Urus Templat →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-ui">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Nama Templat
              </span>
              <span className="font-semibold text-[var(--text)] block mt-0.5">
                {template.name}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Slug Komponen
              </span>
              <span className="font-mono text-[var(--text)] block mt-0.5">
                {template.slug}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Harga Semasa Templat
              </span>
              <span className="text-[var(--text)] block mt-0.5">
                {fmtMYR(template.price)}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                Tempoh Sah Semasa
              </span>
              <span className="text-[var(--text)] block mt-0.5">
                {template.validity_months} Bulan
              </span>
            </div>
          </div>
        </div>

        {/* Commercial Order snapshot */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
            <h2 className="text-base font-bold font-display text-[var(--text)]">
              Maklumat Pembayaran (Snapshot)
            </h2>
            {order && (
              <Link
                href={`/admin/payments/${order.id}`}
                className="text-xs font-ui text-[var(--primary)] hover:underline font-semibold"
              >
                Buka Pesanan →
              </Link>
            )}
          </div>

          {order ? (
            <div className="grid grid-cols-2 gap-4 text-xs font-ui">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Status Pembayaran
                </span>
                <div className="mt-1">
                  <AdminStatusBadge type="payment" status={order.payment_status} />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  No. Resit
                </span>
                <span className="font-mono font-semibold text-[var(--text)] block mt-0.5">
                  {order.receipt_number || "—"}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Amaun Terkunci (Snapshot)
                </span>
                <span className="font-bold text-[var(--primary)] text-sm block mt-0.5">
                  {fmtMYR(order.amount)}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Tempoh Sah Terkunci
                </span>
                <span className="text-[var(--text)] block mt-0.5">
                  {order.validity_months} Bulan
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Disahkan Pada
                </span>
                <span className="text-[var(--text-muted)] block mt-0.5">
                  {formatDateTime(order.paid_at || order.reviewed_at)}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs font-ui text-[var(--text-muted)] bg-[var(--surface-warm)] rounded-2xl">
              Tiada rekod pesanan atau pembayaran untuk jemputan ini.
            </div>
          )}
        </div>
      </div>

      {/* ── Section 3: Feature Status & RSVP Metrics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phase 10B Feature status */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <h2 className="text-base font-bold font-display text-[var(--text)] border-b border-[var(--border)] pb-3">
            Status Ciri-Ciri Jemputan (Phase 10B)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-ui">
            <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                Galeri Foto
              </span>
              <span className="font-semibold text-sm text-[var(--text)] mt-0.5 block">
                {features.photoGalleryCount} Keping
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                Live Countdown
              </span>
              <span
                className={`font-semibold text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                  features.liveCountdownEnabled
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {features.liveCountdownEnabled ? "Aktif" : "Mati"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                Ucapan Tetamu
              </span>
              <span
                className={`font-semibold text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                  features.guestWishesEnabled
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {features.guestWishesEnabled ? "Aktif" : "Mati"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                Lagu YouTube
              </span>
              <span
                className={`font-semibold text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                  features.musicEnabled
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {features.musicEnabled ? "Aktif" : "Mati"}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-warm)] border border-[var(--border)]">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                Opening Cover
              </span>
              <span
                className={`font-semibold text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${
                  features.openingCoverEnabled
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-stone-100 text-stone-600"
                }`}
              >
                {features.openingCoverEnabled ? "Aktif" : "Mati"}
              </span>
            </div>
          </div>
        </div>

        {/* RSVP Summary */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-4">
          <h2 className="text-base font-bold font-display text-[var(--text)] border-b border-[var(--border)] pb-3">
            Ringkasan Kehadiran (RSVP)
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-ui">
            <div className="p-3 rounded-xl bg-[var(--surface-warm)] text-center">
              <span className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">
                Respon
              </span>
              <span className="text-2xl font-bold font-display text-[var(--text)] mt-0.5 block">
                {rsvps.totalResponses}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-warm)] text-center">
              <span className="text-[10px] font-bold uppercase text-emerald-800 block">
                Hadir
              </span>
              <span className="text-2xl font-bold font-display text-emerald-800 mt-0.5 block">
                {rsvps.attendingCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-warm)] text-center">
              <span className="text-[10px] font-bold uppercase text-stone-500 block">
                Tidak Hadir
              </span>
              <span className="text-2xl font-bold font-display text-stone-600 mt-0.5 block">
                {rsvps.notAttendingCount}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[var(--surface-warm)] text-center">
              <span className="text-[10px] font-bold uppercase text-[var(--primary)] block">
                Jumlah Pax
              </span>
              <span className="text-2xl font-bold font-display text-[var(--primary)] mt-0.5 block">
                {rsvps.totalPax}
              </span>
            </div>
          </div>

          <p className="text-[11px] font-ui text-[var(--text-muted)]">
            * Privasi tetamu: Mesej peribadi, nombor telefon, dan alamat emel tetamu dilindungi dan hanya boleh diakses oleh pemilik jemputan.
          </p>
        </div>
      </div>

      {/* ── Section 4: Extend Expiry Control ── */}
      <ExtendExpiryCard
        invitationId={invitation.id}
        currentExpiresAt={invitation.expires_at}
        publishedAt={invitation.published_at}
        status={invitation.status}
      />
    </div>
  );
}
