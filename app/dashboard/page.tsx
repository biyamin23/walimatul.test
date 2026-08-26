import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requireClient } from "@/lib/auth/permissions";
import { getClientDashboardData } from "@/lib/data/client-dashboard";
import { ClientAnnouncementBanner } from "@/components/dashboard/ClientAnnouncementBanner";
import { MaintenanceNoticeBanner } from "@/components/dashboard/MaintenanceNoticeBanner";
import { DashboardSummaryCards } from "@/components/dashboard/DashboardSummaryCards";
import { ClientNextAction } from "@/components/dashboard/ClientNextAction";
import { ClientInvitationCard } from "@/components/dashboard/ClientInvitationCard";
import { ClientNewUserOnboarding } from "@/components/dashboard/ClientNewUserOnboarding";

export const metadata: Metadata = {
  title: "Dashboard Klien — WALIMATUL",
  description: "Urus jemputan perkahwinan digital, pantau kemajuan, dan semak status pembayaran.",
};

export default async function DashboardPage() {
  await requireClient();
  const data = await getClientDashboardData();

  if (!data) {
    return null;
  }

  const greetingName = data.clientName ? `${data.clientName}` : "";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ── System Maintenance Notice (if enabled) ── */}
      <MaintenanceNoticeBanner />

      {/* ── Active Admin Announcement Banner (if scheduled active) ── */}
      <ClientAnnouncementBanner />

      {/* ── Personalized Header ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
            Dashboard Pengantin
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--text)]">
            Selamat datang{greetingName ? `, ${greetingName}` : ""} ✨
          </h1>
          <p className="text-xs sm:text-sm font-ui text-[var(--text-muted)]">
            Urus jemputan perkahwinan digital anda dan pantau tindakan seterusnya.
          </p>
        </div>

        <Link
          id="btn-create-new-invitation"
          href="/templates"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold font-ui hover:bg-[var(--primary-hover)] transition-all shadow-xs shrink-0 self-start sm:self-auto"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Cipta Jemputan Baharu</span>
        </Link>
      </div>

      {/* ── Summary Metric Cards ── */}
      <DashboardSummaryCards summary={data.summary} />

      {/* ── Prominent Next-Action Section ── */}
      {data.nextAction && <ClientNextAction action={data.nextAction} />}

      {/* ── Invitations List or New-User Onboarding ── */}
      {data.invitations.length === 0 ? (
        <ClientNewUserOnboarding clientName={data.clientName} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-[var(--text)]">
                Semua Jemputan Anda ({data.invitations.length})
              </h2>
              <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
                Pantau status pengaktifan dan akses pantas ke setiap jemputan.
              </p>
            </div>

            <Link
              href="/dashboard/invitations"
              className="text-xs font-semibold font-ui text-[var(--primary)] hover:underline"
            >
              Urus Penuh →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.invitations.map((item) => (
              <ClientInvitationCard
                key={item.invitation.id}
                data={item}
                supportWhatsappUrl={data.supportWhatsappUrl}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Help / WhatsApp Support Section ── */}
      <div className="p-6 rounded-3xl bg-[var(--surface)] border border-dashed border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base font-display text-[var(--text)]">
            Perlukan bantuan teknikal atau pengesahan?
          </h3>
          <p className="text-xs font-ui text-[var(--text-muted)] leading-relaxed max-w-xl">
            Pasukan sokongan WALIMATUL sedia membantu anda melalui WhatsApp ({data.supportPhone}) untuk sebarang pertanyaan berkaitan tetapan jemputan, pelanjutan tempoh sah, atau pembayaran.
          </p>
        </div>
        <a
          id="link-whatsapp-dashboard-footer"
          href={data.supportWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold font-ui hover:bg-[#20bb5a] transition-colors shrink-0 shadow-2xs"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Hubungi WhatsApp
        </a>
      </div>
    </div>
  );
}
