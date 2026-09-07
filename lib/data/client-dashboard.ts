import "server-only";

import { createClient } from "@/lib/supabase/server";
import { getAuthenticatedUser } from "@/lib/auth/get-user";
import { getPlatformSettings } from "@/lib/data/platform-settings";
import { BRAND } from "@/lib/constants/brand";
import { deriveClientInvitationLifecycle } from "@/lib/invitations/client-lifecycle";
import type {
  ClientDashboardData,
  ClientDashboardSummary,
  ClientInvitationWithDetails,
  ClientNextActionItem,
} from "@/types/client-lifecycle";
import type { Invitation, Order, Template } from "@/types/database";

/**
 * Pick the canonical / latest relevant order for an invitation.
 * The newest order (by created_at DESC) drives the current lifecycle state.
 */
export function pickRelevantOrder(orders: Order[]): Order | null {
  if (!orders || orders.length === 0) return null;
  // Array is ordered by created_at DESC
  return orders[0];
}

/**
 * Fetch all client dashboard data with explicit auth scoping (user_id = auth.uid()).
 * Optimized with request-cached auth, parallelized independent queries, and reduced payload projections.
 */
export async function getClientDashboardData(): Promise<ClientDashboardData | null> {
  // Reuse request-cached authenticated user & profile (0ms if already called in layout)
  const authData = await getAuthenticatedUser();
  if (!authData?.userId) {
    return null;
  }
  const userId = authData.userId;
  const clientName = authData.profile?.full_name || null;

  const supabase = await createClient();

  // 1. Parallelize Tier 1: Platform settings (cached) + Client invitations
  const [settings, invRes] = await Promise.all([
    getPlatformSettings(),
    supabase
      .from("invitations")
      .select("id, user_id, template_id, slug, groom_name, groom_short_name, bride_name, bride_short_name, wedding_date, venue_name, status, expires_at, created_at, updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const supportPhone = settings.support_whatsapp?.display || BRAND.supportPhone;
  const supportWhatsappUrl = settings.support_whatsapp?.phone
    ? `https://wa.me/${settings.support_whatsapp.phone.replace(/[^0-9]/g, "")}`
    : BRAND.supportWhatsappUrl;

  if (invRes.error || !invRes.data) {
    console.error("[WALIMATUL] Error loading client invitations:", invRes.error?.message);
    return {
      clientName,
      summary: {
        totalInvitations: 0,
        activeInvitations: 0,
        draftInvitations: 0,
        expiredInvitations: 0,
        underReviewCount: 0,
      },
      invitations: [],
      nextAction: null,
      supportPhone,
      supportWhatsappUrl,
    };
  }

  const invitations = invRes.data as unknown as Invitation[];
  const invIds = invitations.map((i) => i.id);
  const templateIds = Array.from(new Set(invitations.map((i) => i.template_id).filter(Boolean)));

  // 2. Batch fetch templates & orders for these invitations in parallel (avoiding N+1 loops)
  const [templatesRes, ordersRes] = await Promise.all([
    templateIds.length > 0
      ? supabase.from("templates").select("id, name, slug, thumbnail_url, price").in("id", templateIds)
      : { data: [] },
    invIds.length > 0
      ? supabase
          .from("orders")
          .select("id, invitation_id, user_id, payment_status, amount, created_at, receipt_number, rejection_reason, validity_months")
          .eq("user_id", userId)
          .in("invitation_id", invIds)
          .order("created_at", { ascending: false })
      : { data: [] },
  ]);

  const templateMap = new Map<string, Pick<Template, "id" | "name" | "slug" | "thumbnail_url">>();
  for (const t of (templatesRes.data || []) as Template[]) {
    templateMap.set(t.id, t);
  }

  const ordersByInvMap = new Map<string, Order[]>();
  for (const o of (ordersRes.data || []) as unknown as Order[]) {
    const list = ordersByInvMap.get(o.invitation_id) || [];
    list.push(o);
    ordersByInvMap.set(o.invitation_id, list);
  }

  // 4. Derive lifecycle state for each invitation
  const detailedInvitations: ClientInvitationWithDetails[] = invitations.map((inv) => {
    const tpl = templateMap.get(inv.template_id) || null;
    const invOrders = ordersByInvMap.get(inv.id) || [];
    const latestOrder = pickRelevantOrder(invOrders);

    const lifecycle = deriveClientInvitationLifecycle({
      invitation: inv,
      latestOrder,
      supportWhatsappUrl,
    });

    return {
      invitation: inv,
      template: tpl,
      latestOrder,
      lifecycle,
    };
  });

  // 5. Compute summary metric counts
  let activeInvitations = 0;
  let draftInvitations = 0;
  let expiredInvitations = 0;
  let underReviewCount = 0;

  for (const item of detailedInvitations) {
    if (item.lifecycle.stage === "published") {
      activeInvitations += 1;
    } else if (item.lifecycle.stage === "expired") {
      expiredInvitations += 1;
    } else if (item.lifecycle.stage === "under_review") {
      underReviewCount += 1;
      draftInvitations += 1;
    } else if (
      item.lifecycle.stage === "draft" ||
      item.lifecycle.stage === "awaiting_payment" ||
      item.lifecycle.stage === "payment_rejected"
    ) {
      draftInvitations += 1;
    }
  }

  const summary: ClientDashboardSummary = {
    totalInvitations: detailedInvitations.length,
    activeInvitations,
    draftInvitations,
    expiredInvitations,
    underReviewCount,
  };

  // 6. Select prioritized Next-Action item across all invitations
  const stagePriorityWeight: Record<string, number> = {
    payment_rejected: 1,
    awaiting_payment: 2,
    draft: 3,
    under_review: 4,
    expired: 5,
    published: 6,
    archived: 7,
  };

  const actionItems: ClientNextActionItem[] = detailedInvitations.map((item) => {
    const groom = item.invitation.groom_short_name || item.invitation.groom_name;
    const bride = item.invitation.bride_short_name || item.invitation.bride_name;
    const coupleDisplay =
      groom && bride ? `${groom} & ${bride}` : groom || bride || "Jemputan Anda";

    const priority = stagePriorityWeight[item.lifecycle.stage] ?? 99;

    let icon = "📝";
    if (item.lifecycle.stage === "payment_rejected") icon = "⚠️";
    else if (item.lifecycle.stage === "awaiting_payment") icon = "💳";
    else if (item.lifecycle.stage === "under_review") icon = "⏳";
    else if (item.lifecycle.stage === "published") icon = "✨";
    else if (item.lifecycle.stage === "expired") icon = "⌛";

    return {
      invitationId: item.invitation.id,
      coupleDisplay,
      templateName: item.template?.name || "Blush Garden",
      slug: item.invitation.slug,
      stage: item.lifecycle.stage,
      priority,
      badgeLabel: item.lifecycle.badgeLabel,
      title: item.lifecycle.nextAction.label,
      description: item.lifecycle.nextAction.description,
      ctaText: item.lifecycle.nextAction.ctaText,
      ctaHref: item.lifecycle.nextAction.ctaHref,
      ctaVariant: item.lifecycle.nextAction.ctaVariant,
      icon,
    };
  });

  // Sort by priority (lowest number first)
  actionItems.sort((a, b) => a.priority - b.priority);
  const nextAction = actionItems.length > 0 ? actionItems[0] : null;

  return {
    clientName,
    summary,
    invitations: detailedInvitations,
    nextAction,
    supportPhone,
    supportWhatsappUrl,
  };
}
