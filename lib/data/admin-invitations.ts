import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Invitation,
  InvitationStatus,
  Profile,
  Template,
  Order,
  OrderPaymentStatus,
} from "@/types/database";

export interface AdminInvitationListItem {
  id: string;
  slug: string | null;
  groom_name: string | null;
  groom_short_name: string | null;
  bride_name: string | null;
  bride_short_name: string | null;
  wedding_date: string | null;
  status: InvitationStatus;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
  user: {
    id: string;
    full_name: string | null;
    phone: string | null;
  };
  template: {
    id: string;
    name: string;
    slug: string;
  };
  latestOrder: {
    id: string;
    payment_status: OrderPaymentStatus;
    amount: number;
  } | null;
}

export interface AdminInvitationsPageResult {
  invitations: AdminInvitationListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  availableTemplates: Array<{ id: string; name: string }>;
}

export interface AdminInvitationFeatureSummary {
  photoGalleryCount: number;
  liveCountdownEnabled: boolean;
  guestWishesEnabled: boolean;
  musicEnabled: boolean;
  musicYouTubeVideoId: string | null;
  openingCoverEnabled: boolean;
}

export interface AdminInvitationRsvpSummary {
  totalResponses: number;
  attendingCount: number;
  notAttendingCount: number;
  totalPax: number;
  wishesCount: number;
}

export interface AdminInvitationDetail {
  invitation: Invitation;
  client: Profile;
  template: Template;
  order: Order | null;
  features: AdminInvitationFeatureSummary;
  rsvps: AdminInvitationRsvpSummary;
}

/**
 * Fetch paginated invitations for /admin/invitations list.
 * Supports searching by couple names / slug, and filtering by status, template, and payment status.
 */
export async function getAdminInvitationsPage(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  templateId?: string;
  paymentStatus?: string;
}): Promise<AdminInvitationsPageResult> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(params.pageSize || 20, 100));
  const search = params.search?.trim() || "";
  const statusFilter = params.status || "all";
  const templateIdFilter = params.templateId || "all";
  const paymentFilter = params.paymentStatus || "all";

  // 1. Auth check
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error("[AdminInvitations] Unauthenticated claims.");
    return { invitations: [], totalCount: 0, page: 1, pageSize, totalPages: 0, availableTemplates: [] };
  }

  // 2. Fetch all templates for filter dropdown
  const { data: allTemplates } = await supabase
    .from("templates")
    .select("id, name")
    .order("sort_order", { ascending: true });

  const availableTemplates = allTemplates || [];

  // 3. Build query for invitations
  let query = supabase
    .from("invitations")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `groom_name.ilike.%${search}%,groom_short_name.ilike.%${search}%,bride_name.ilike.%${search}%,bride_short_name.ilike.%${search}%,slug.ilike.%${search}%`
    );
  }

  if (templateIdFilter && templateIdFilter !== "all") {
    query = query.eq("template_id", templateIdFilter);
  }

  // Status filtering logic:
  // "published": status = 'published' AND (expires_at IS NULL OR expires_at > now())
  // "expired": status = 'expired' OR (status = 'published' AND expires_at <= now())
  // "draft": status = 'draft' OR status = 'archived'
  const nowISO = new Date().toISOString();
  if (statusFilter === "published") {
    query = query.eq("status", "published").or(`expires_at.is.null,expires_at.gt.${nowISO}`);
  } else if (statusFilter === "expired") {
    query = query.or(`status.eq.expired,and(status.eq.published,expires_at.lte.${nowISO})`);
  } else if (statusFilter === "draft") {
    query = query.in("status", ["draft", "archived"]);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: rawInvs, error: invsError, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (invsError) {
    console.error("[AdminInvitations] Query invitations error:", invsError.message);
    return { invitations: [], totalCount: 0, page, pageSize, totalPages: 0, availableTemplates };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (!rawInvs || rawInvs.length === 0) {
    return { invitations: [], totalCount, page, pageSize, totalPages, availableTemplates };
  }

  // 4. Batch fetch client profiles
  const userIds = [...new Set(rawInvs.map((i) => i.user_id).filter(Boolean))];
  const profileMap = new Map<string, Pick<Profile, "id" | "full_name" | "phone">>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", userIds);

    for (const p of profiles || []) {
      profileMap.set(p.id, p);
    }
  }

  // 5. Batch fetch templates
  const templateIds = [...new Set(rawInvs.map((i) => i.template_id).filter(Boolean))];
  const templateMap = new Map<string, Pick<Template, "id" | "name" | "slug">>();
  if (templateIds.length > 0) {
    const { data: templates } = await supabase
      .from("templates")
      .select("id, name, slug")
      .in("id", templateIds);

    for (const t of templates || []) {
      templateMap.set(t.id, t);
    }
  }

  // 6. Batch fetch latest orders for these invitations
  const invitationIds = rawInvs.map((i) => i.id);
  const orderMap = new Map<string, { id: string; payment_status: OrderPaymentStatus; amount: number }>();
  if (invitationIds.length > 0) {
    const { data: orders } = await supabase
      .from("orders")
      .select("id, invitation_id, payment_status, amount, created_at")
      .in("invitation_id", invitationIds)
      .order("created_at", { ascending: false });

    for (const o of orders || []) {
      // First one seen per invitation is the latest
      if (!orderMap.has(o.invitation_id)) {
        orderMap.set(o.invitation_id, {
          id: o.id,
          payment_status: o.payment_status,
          amount: typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0),
        });
      }
    }
  }

  // 7. Compose list items with optional in-memory payment filtering if selected
  let invitations: AdminInvitationListItem[] = rawInvs.map((inv) => {
    const user = profileMap.get(inv.user_id) || {
      id: inv.user_id,
      full_name: "Pelanggan",
      phone: null,
    };

    const template = templateMap.get(inv.template_id) || {
      id: inv.template_id,
      name: "Templat",
      slug: "template",
    };

    const latestOrder = orderMap.get(inv.id) || null;

    return {
      id: inv.id,
      slug: inv.slug,
      groom_name: inv.groom_name,
      groom_short_name: inv.groom_short_name,
      bride_name: inv.bride_name,
      bride_short_name: inv.bride_short_name,
      wedding_date: inv.wedding_date,
      status: inv.status,
      published_at: inv.published_at,
      expires_at: inv.expires_at,
      created_at: inv.created_at,
      user,
      template,
      latestOrder,
    };
  });

  if (paymentFilter && paymentFilter !== "all") {
    if (paymentFilter === "no_order") {
      invitations = invitations.filter((i) => !i.latestOrder);
    } else {
      invitations = invitations.filter((i) => i.latestOrder?.payment_status === paymentFilter);
    }
  }

  return {
    invitations,
    totalCount,
    page,
    pageSize,
    totalPages,
    availableTemplates,
  };
}

/**
 * Fetch full details for a single invitation in /admin/invitations/[id].
 */
export async function getAdminInvitationDetail(
  invitationId: string
): Promise<AdminInvitationDetail | null> {
  const supabase = await createClient();

  // 1. Auth check
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error("[AdminInvitationDetail] Unauthenticated claims.");
    return null;
  }

  // 2. Fetch invitation
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", invitationId)
    .single();

  if (invError || !invitation) {
    console.error("[AdminInvitationDetail] Invitation not found:", invError?.message);
    return null;
  }

  // 3. Parallel fetch client profile, template, order, gallery count, and RSVPs
  const [
    profileResult,
    templateResult,
    ordersResult,
    galleryResult,
    rsvpsResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("id", invitation.user_id)
      .single(),
    supabase
      .from("templates")
      .select("*")
      .eq("id", invitation.template_id)
      .single(),
    supabase
      .from("orders")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false })
      .limit(1),
    supabase
      .from("invitation_gallery")
      .select("id", { count: "exact", head: true })
      .eq("invitation_id", invitationId),
    supabase
      .from("rsvps")
      .select("attendance, pax, message")
      .eq("invitation_id", invitationId),
  ]);

  const client: Profile = profileResult.data || {
    id: invitation.user_id,
    full_name: "Pelanggan",
    phone: null,
    avatar_url: null,
    role: "client",
    created_at: invitation.created_at,
    updated_at: invitation.updated_at,
  };

  const template: Template = templateResult.data || {
    id: invitation.template_id,
    name: "Blush Garden",
    slug: "blush-garden",
    description: null,
    category: null,
    component_key: "blush-garden",
    thumbnail_url: null,
    preview_url: null,
    price: 49,
    validity_months: 6,
    is_active: true,
    is_featured: false,
    sort_order: 0,
    status: "active",
    created_at: invitation.created_at,
    updated_at: invitation.updated_at,
  };

  const order: Order | null = ordersResult.data?.[0]
    ? {
        ...ordersResult.data[0],
        amount: typeof ordersResult.data[0].amount === "number"
          ? ordersResult.data[0].amount
          : Number(ordersResult.data[0].amount ?? 0),
      }
    : null;

  const photoGalleryCount = galleryResult.count ?? 0;

  // Aggregate RSVP summary safely
  let totalResponses = 0;
  let attendingCount = 0;
  let notAttendingCount = 0;
  let totalPax = 0;
  let wishesCount = 0;

  for (const r of rsvpsResult.data || []) {
    totalResponses++;
    if (r.attendance === "attending") {
      attendingCount++;
      totalPax += r.pax || 1;
    } else {
      notAttendingCount++;
    }
    if (r.message && r.message.trim().length > 0) {
      wishesCount++;
    }
  }

  const features: AdminInvitationFeatureSummary = {
    photoGalleryCount,
    liveCountdownEnabled: invitation.countdown_enabled ?? false,
    guestWishesEnabled: invitation.guest_wishes_enabled ?? false,
    musicEnabled: invitation.music_enabled ?? false,
    musicYouTubeVideoId: invitation.music_youtube_video_id ?? null,
    openingCoverEnabled: invitation.opening_cover_enabled ?? false,
  };

  const rsvps: AdminInvitationRsvpSummary = {
    totalResponses,
    attendingCount,
    notAttendingCount,
    totalPax,
    wishesCount,
  };

  return {
    invitation,
    client,
    template,
    order,
    features,
    rsvps,
  };
}
