import { checkPaymentEligibility } from "@/lib/validation/payment";
import type { Invitation, Order } from "@/types/database";
import type {
  ClientInvitationLifecycle,
  ClientInvitationStage,
  ExpiryState,
  TimelineStep,
} from "@/types/client-lifecycle";

interface DeriveLifecycleOptions {
  invitation: Invitation;
  latestOrder: Order | null;
  supportWhatsappUrl?: string;
}

/**
 * Format date in Malaysian locale (MYT).
 */
function formatMytDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat("ms-MY", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
    }).format(d);
  } catch {
    return isoDate;
  }
}

/**
 * Pure helper to derive the comprehensive client-facing lifecycle state.
 */
export function deriveClientInvitationLifecycle({
  invitation,
  latestOrder,
  supportWhatsappUrl = "https://wa.me/601156281691",
}: DeriveLifecycleOptions): ClientInvitationLifecycle {
  const nowMs = Date.now();
  const eligibility = checkPaymentEligibility(invitation);

  // 1. Expiry Evaluation
  let isExpired = invitation.status === "expired";
  let daysRemaining: number | null = null;
  let expiryDateFormatted: string | null = null;

  if (invitation.expires_at) {
    expiryDateFormatted = formatMytDate(invitation.expires_at);
    const expiresAtMs = new Date(invitation.expires_at).getTime();
    const diffMs = expiresAtMs - nowMs;
    daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffMs <= 0) {
      isExpired = true;
      daysRemaining = 0;
    }
  }

  let warningLevel: ExpiryState["warningLevel"] = "none";
  let expiryMessage: string | null = null;

  if (isExpired) {
    warningLevel = "expired";
    expiryMessage = "Jemputan telah tamat tempoh.";
  } else if (daysRemaining !== null && daysRemaining <= 7) {
    warningLevel = "urgent";
    expiryMessage = `Akan tamat dalam ${daysRemaining} hari (${expiryDateFormatted}).`;
  } else if (daysRemaining !== null && daysRemaining <= 30) {
    warningLevel = "subtle";
    expiryMessage = `Akan tamat pada ${expiryDateFormatted}.`;
  }

  const expiry: ExpiryState = {
    isExpired,
    daysRemaining,
    expiryDateFormatted,
    warningLevel,
    message: expiryMessage,
  };

  // 2. Stage Determination (Canonical Priority)
  let stage: ClientInvitationStage = "draft";
  const isPublished = !isExpired && invitation.status === "published";

  if (isExpired) {
    stage = "expired";
  } else if (invitation.status === "archived") {
    stage = "archived";
  } else if (isPublished) {
    stage = "published";
  } else if (latestOrder?.payment_status === "payment_rejected") {
    stage = "payment_rejected";
  } else if (
    latestOrder?.payment_status === "pending_verification" ||
    (latestOrder?.payment_status === "paid" && !isPublished)
  ) {
    stage = "under_review";
  } else if (latestOrder?.payment_status === "pending_payment") {
    stage = "awaiting_payment";
  } else if (eligibility.eligible) {
    stage = "awaiting_payment";
  } else {
    stage = "draft";
  }

  // 3. 5-Step Timeline Derivation
  const detailsComplete = Boolean(
    invitation.groom_name?.trim() &&
    invitation.bride_name?.trim() &&
    invitation.wedding_date?.trim() &&
    invitation.venue_name?.trim()
  );

  const slugComplete = Boolean(invitation.slug?.trim());

  const isPaymentDone =
    latestOrder?.payment_status === "pending_verification" ||
    latestOrder?.payment_status === "paid" ||
    isPublished;

  const isPaymentRejected = latestOrder?.payment_status === "payment_rejected";

  const isReviewDone =
    latestOrder?.payment_status === "paid" || isPublished;

  const timeline: TimelineStep[] = [
    {
      key: "details",
      stepNumber: 1,
      label: "Butiran",
      shortLabel: "Butiran",
      status: detailsComplete ? "completed" : "current",
      description: detailsComplete ? "Lengkap" : "Perlu dilengkapkan",
    },
    {
      key: "slug",
      stepNumber: 2,
      label: "Pautan URL",
      shortLabel: "URL",
      status: slugComplete
        ? "completed"
        : detailsComplete
        ? "current"
        : "upcoming",
      description: slugComplete ? `/${invitation.slug}` : "Pilih pautan unik",
    },
    {
      key: "payment",
      stepNumber: 3,
      label: "Bayaran",
      shortLabel: "Bayaran",
      status: isPaymentRejected
        ? "rejected"
        : isPaymentDone
        ? "completed"
        : detailsComplete && slugComplete
        ? "current"
        : "upcoming",
      description: isPaymentRejected
        ? "Bayaran ditolak"
        : isPaymentDone
        ? "Bukti dihantar"
        : "RM 29.00",
    },
    {
      key: "review",
      stepNumber: 4,
      label: "Semakan",
      shortLabel: "Semakan",
      status: isReviewDone
        ? "completed"
        : latestOrder?.payment_status === "pending_verification"
        ? "current"
        : "upcoming",
      description:
        latestOrder?.payment_status === "pending_verification"
          ? "Sedang disemak"
          : isReviewDone
          ? "Disahkan"
          : "Oleh Admin",
    },
    {
      key: "published",
      stepNumber: 5,
      label: "Diterbitkan",
      shortLabel: "Terbit",
      status: isExpired
        ? "warning"
        : isPublished
        ? "completed"
        : "upcoming",
      description: isExpired
        ? "Tamat tempoh"
        : isPublished
        ? "Aktif & boleh diakses"
        : "Belum aktif",
    },
  ];

  // Calculate integer progress step (1 to 5)
  let progressStep = 1;
  if (isPublished || isExpired) progressStep = 5;
  else if (latestOrder?.payment_status === "pending_verification" || latestOrder?.payment_status === "paid") progressStep = 4;
  else if (latestOrder?.payment_status === "pending_payment" || isPaymentRejected) progressStep = 3;
  else if (slugComplete) progressStep = 2;
  else progressStep = 1;

  // 4. Client Copy & Contextual Next Action
  let badgeLabel = "Draf";
  let badgeVariant: ClientInvitationLifecycle["badgeVariant"] = "default";
  let title = "Draf Jemputan";
  let description = "Lengkapkan butiran pengantin dan majlis anda untuk meneruskan.";
  let needsAttention = true;

  let nextAction: ClientInvitationLifecycle["nextAction"] = {
    label: "Lengkapkan Butiran",
    description: "Sila isi butiran majlis dan pilih pautan URL jemputan anda.",
    ctaText: "Edit Jemputan",
    ctaHref: `/dashboard/invitations/${invitation.id}/edit`,
    ctaVariant: "primary",
  };

  switch (stage) {
    case "expired":
      badgeLabel = "Tamat Tempoh";
      badgeVariant = "danger";
      title = "Jemputan Tamat Tempoh";
      description = `Jemputan ini telah melepasi tarikh luput (${expiryDateFormatted || "Tamat"}).`;
      needsAttention = true;
      nextAction = {
        label: "Lanjutkan Tempoh Sah",
        description: "Hubungi pasukan sokongan WALIMATUL untuk mengaktifkan semula jemputan anda.",
        ctaText: "Hubungi Sokongan",
        ctaHref: supportWhatsappUrl,
        ctaVariant: "warning",
      };
      break;

    case "published":
      badgeLabel = "Diterbitkan";
      badgeVariant = "success";
      title = "Jemputan Aktif";
      description = `Jemputan anda sedang aktif dan boleh diakses secara langsung di walimatul.my/${invitation.slug || ""}.`;
      needsAttention = warningLevel === "urgent";
      nextAction = {
        label: "Jemputan Sedang Aktif",
        description: "Kongsi pautan jemputan anda kepada tetamu atau pantau senarai kehadiran RSVP.",
        ctaText: "Lihat Jemputan",
        ctaHref: `/${invitation.slug || ""}`,
        ctaVariant: "primary",
      };
      break;

    case "payment_rejected":
      badgeLabel = "Bayaran Ditolak";
      badgeVariant = "danger";
      title = "Pengesahan Bayaran Ditolak";
      description =
        latestOrder?.rejection_reason ||
        "Bukti pembayaran tidak dapat disahkan. Sila semak semula dan muat naik resit yang sah.";
      needsAttention = true;
      nextAction = {
        label: "Hantar Semula Bukti Bayaran",
        description: "Sila hantar semula bukti pemindahan Touch 'n Go eWallet yang jelas.",
        ctaText: "Semak & Bayar Semula",
        ctaHref: `/dashboard/invitations/${invitation.id}/payment`,
        ctaVariant: "danger",
      };
      break;

    case "under_review":
      badgeLabel = "Dalam Semakan";
      badgeVariant = "info";
      title = "Bukti Bayaran Sedang Disemak";
      description = "Admin sedang menyemak bukti pembayaran anda. Jemputan akan diaktifkan secara automatik sebaik sahaja disahkan.";
      needsAttention = false;
      nextAction = {
        label: "Menunggu Pengesahan Admin",
        description: "Pengesahan biasanya mengambil masa kurang daripada 24 jam.",
        ctaText: "Semak Status Bayaran",
        ctaHref: `/dashboard/invitations/${invitation.id}/payment`,
        ctaVariant: "secondary",
      };
      break;

    case "awaiting_payment":
      badgeLabel = "Menunggu Bayaran";
      badgeVariant = "warning";
      title = "Sedia untuk Pembayaran";
      description = "Butiran jemputan anda sudah lengkap. Teruskan pembayaran untuk mengaktifkan jemputan perkahwinan anda.";
      needsAttention = true;
      nextAction = {
        label: "Buat Pembayaran Pengaktifan",
        description: "Buat pemindahan Touch 'n Go eWallet dan muat naik resit pembayaran.",
        ctaText: "Buat Bayaran Sekarang",
        ctaHref: `/dashboard/invitations/${invitation.id}/payment`,
        ctaVariant: "primary",
      };
      break;

    case "archived":
      badgeLabel = "Diarkib";
      badgeVariant = "default";
      title = "Jemputan Diarkibkan";
      description = "Jemputan ini telah disimpan dalam arkib.";
      needsAttention = false;
      nextAction = {
        label: "Jemputan Diarkibkan",
        description: "Jemputan ini tidak aktif dan disimpan untuk rekod anda.",
        ctaText: "Lihat Draf",
        ctaHref: `/dashboard/invitations/${invitation.id}/edit`,
        ctaVariant: "secondary",
      };
      break;

    case "draft":
    default:
      badgeLabel = "Draf";
      badgeVariant = "default";
      title = "Draf Belum Lengkap";
      description =
        eligibility.missingFields.length > 0
          ? `Perlu dilengkapkan: ${eligibility.missingFields.slice(0, 2).join(", ")}${
              eligibility.missingFields.length > 2 ? " dan lain-lain" : ""
            }.`
          : "Lengkapkan butiran pengantin dan pilih pautan URL jemputan anda.";
      needsAttention = true;
      nextAction = {
        label: "Lengkapkan Butiran Jemputan",
        description: "Isi nama mempelai, tarikh majlis, lokasi dan pautan URL.",
        ctaText: "Lengkapkan Sekarang",
        ctaHref: `/dashboard/invitations/${invitation.id}/edit`,
        ctaVariant: "primary",
      };
      break;
  }

  return {
    stage,
    badgeLabel,
    badgeVariant,
    title,
    description,
    timeline,
    progressStep,
    totalSteps: 5,
    isPublished,
    isExpired,
    needsAttention,
    expiry,
    nextAction,
  };
}
