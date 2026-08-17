import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Order, PaymentProof, Invitation, Template, Profile } from "@/types/database";

export interface AdminPaymentQueueItem extends Order {
  client: Pick<Profile, "id" | "full_name"> & { email: string };
  invitation: Pick<
    Invitation,
    "id" | "groom_name" | "groom_short_name" | "bride_name" | "bride_short_name" | "slug" | "status"
  >;
  template: Pick<Template, "id" | "name" | "slug">;
  latest_proof?: Pick<PaymentProof, "id" | "storage_path" | "transaction_reference" | "submitted_at"> | null;
}

export interface AdminPaymentDetail extends Order {
  client: Profile & { email: string };
  invitation: Invitation;
  template: Template;
  reviewer?: Pick<Profile, "full_name"> | null;
}

export interface AdminProofWithSignedUrl extends PaymentProof {
  signedUrl: string | null;
}

export interface AdminPaymentStats {
  pendingVerificationCount: number;
  paidCount: number;
  rejectedCount: number;
  totalCount: number;
}

/**
 * Fetch summary count metrics for admin payment queue.
 */
export async function getAdminPaymentStats(): Promise<AdminPaymentStats> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentStats: Unauthenticated claims.");
    return {
      pendingVerificationCount: 0,
      paidCount: 0,
      rejectedCount: 0,
      totalCount: 0,
    };
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("payment_status");

  if (error || !orders) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentStats query failed:", {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
    });
    return {
      pendingVerificationCount: 0,
      paidCount: 0,
      rejectedCount: 0,
      totalCount: 0,
    };
  }

  let pendingVerificationCount = 0;
  let paidCount = 0;
  let rejectedCount = 0;

  for (const o of orders) {
    if (o.payment_status === "pending_verification") pendingVerificationCount++;
    else if (o.payment_status === "paid") paidCount++;
    else if (o.payment_status === "payment_rejected") rejectedCount++;
  }

  return {
    pendingVerificationCount,
    paidCount,
    rejectedCount,
    totalCount: orders.length,
  };
}

/**
 * Fetch the list of orders for the Admin payment queue using decoupled sequential queries.
 * Guarantees zero dropped rows if related records are missing.
 */
export async function getAdminPaymentQueue(
  statusFilter?: string
): Promise<AdminPaymentQueueItem[]> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentQueue: Unauthenticated claims.");
    return [];
  }

  // ── STEP A: Fetch raw orders (no joins) ──
  let query = supabase.from("orders").select("*");

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("payment_status", statusFilter);
  }

  const { data: orders, error: ordersError } = await query.order("created_at", {
    ascending: false,
  });

  if (ordersError) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] Step A (orders query) failed:", {
      code: ordersError.code,
      message: ordersError.message,
      details: ordersError.details,
      hint: ordersError.hint,
    });
    return [];
  }

  if (!orders || orders.length === 0) {
    console.log("[WALIMATUL_ADMIN_DIAGNOSTIC] Step A returned 0 orders.");
    return [];
  }

  console.log(`[WALIMATUL_ADMIN_DIAGNOSTIC] Step A loaded ${orders.length} orders.`);

  // ── STEP B: Fetch linked invitations ──
  const invitationIds = [
    ...new Set(orders.map((o) => o.invitation_id).filter(Boolean)),
  ];
  const invitationMap = new Map<
    string,
    Pick<
      Invitation,
      | "id"
      | "groom_name"
      | "groom_short_name"
      | "bride_name"
      | "bride_short_name"
      | "slug"
      | "status"
    >
  >();

  if (invitationIds.length > 0) {
    const { data: invs, error: invsError } = await supabase
      .from("invitations")
      .select(
        "id, groom_name, groom_short_name, bride_name, bride_short_name, slug, status"
      )
      .in("id", invitationIds);

    if (invsError) {
      console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] Step B (invitations query) failed:", {
        code: invsError.code,
        message: invsError.message,
        details: invsError.details,
        hint: invsError.hint,
      });
    } else if (invs) {
      for (const inv of invs) {
        invitationMap.set(inv.id, inv);
      }
      console.log(`[WALIMATUL_ADMIN_DIAGNOSTIC] Step B loaded ${invs.length} invitations.`);
    }
  }

  // ── STEP C: Fetch client profiles ──
  const userIds = [...new Set(orders.map((o) => o.user_id).filter(Boolean))];
  const profileMap = new Map<string, Pick<Profile, "id" | "full_name">>();

  if (userIds.length > 0) {
    const { data: profiles, error: profError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    if (profError) {
      console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] Step C (profiles query) failed:", {
        code: profError.code,
        message: profError.message,
        details: profError.details,
        hint: profError.hint,
      });
    } else if (profiles) {
      for (const p of profiles) {
        profileMap.set(p.id, p);
      }
      console.log(`[WALIMATUL_ADMIN_DIAGNOSTIC] Step C loaded ${profiles.length} profiles.`);
    }
  }

  // ── STEP D: Fetch templates ──
  const templateIds = [
    ...new Set(orders.map((o) => o.template_id).filter(Boolean)),
  ];
  const templateMap = new Map<
    string,
    Pick<Template, "id" | "name" | "slug">
  >();

  if (templateIds.length > 0) {
    const { data: templates, error: tplError } = await supabase
      .from("templates")
      .select("id, name, slug")
      .in("id", templateIds);

    if (tplError) {
      console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] Step D (templates query) failed:", {
        code: tplError.code,
        message: tplError.message,
        details: tplError.details,
        hint: tplError.hint,
      });
    } else if (templates) {
      for (const t of templates) {
        templateMap.set(t.id, t);
      }
      console.log(`[WALIMATUL_ADMIN_DIAGNOSTIC] Step D loaded ${templates.length} templates.`);
    }
  }

  // ── STEP E: Compose queue with zero-drop guarantee ──
  return orders.map((o) => {
    const inv = invitationMap.get(o.invitation_id) || {
      id: o.invitation_id,
      groom_name: "Pengantin Lelaki",
      groom_short_name: "Lelaki",
      bride_name: "Pengantin Perempuan",
      bride_short_name: "Perempuan",
      slug: null,
      status: "draft" as const,
    };

    const tpl = templateMap.get(o.template_id) || {
      id: o.template_id,
      name: "Blush Garden",
      slug: "blush-garden",
    };

    const prof = profileMap.get(o.user_id);

    return {
      ...o,
      client: {
        id: o.user_id,
        full_name: prof?.full_name || "Klien",
        email: "",
      },
      invitation: inv,
      template: tpl,
    };
  });
}

/**
 * Fetch detailed order information using decoupled sequential queries.
 */
export async function getAdminPaymentById(
  orderId: string
): Promise<{
  order: AdminPaymentDetail;
  proofs: AdminProofWithSignedUrl[];
} | null> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentById: Unauthenticated claims.");
    return null;
  }

  // 1. Fetch raw order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentById order query failed:", {
      code: orderError?.code,
      message: orderError?.message,
      details: orderError?.details,
      hint: orderError?.hint,
    });
    return null;
  }

  // 2. Fetch linked invitation
  const { data: invData, error: invError } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", order.invitation_id)
    .single();

  if (invError) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentById invitation query error:", invError.message);
  }

  const invitation: Invitation = invData || {
    id: order.invitation_id,
    user_id: order.user_id,
    template_id: order.template_id,
    groom_name: "Pengantin Lelaki",
    groom_short_name: "Lelaki",
    bride_name: "Pengantin Perempuan",
    bride_short_name: "Perempuan",
    groom_parents: null,
    bride_parents: null,
    wedding_date: "",
    event_start_time: "",
    event_end_time: "",
    timezone: "Asia/Kuala_Lumpur",
    venue_name: "",
    venue_address: null,
    google_maps_url: null,
    waze_url: null,
    music_url: null,
    music_autoplay: false,
    custom_message: null,
    rsvp_enabled: true,
    rsvp_deadline: null,
    max_guests_per_rsvp: 5,
    slug: null,
    status: "draft",
    published_at: null,
    expires_at: null,
    created_at: order.created_at,
    updated_at: order.created_at,
  };

  // 3. Fetch linked template
  const { data: tplData, error: tplError } = await supabase
    .from("templates")
    .select("*")
    .eq("id", order.template_id)
    .single();

  if (tplError) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentById template query error:", tplError.message);
  }

  const template: Template = tplData || {
    id: order.template_id,
    name: "Blush Garden",
    slug: "blush-garden",
    description: "Standard wedding invitation template",
    price: 49.0,
    currency: "MYR",
    validity_months: 6,
    is_active: true,
    features: [],
    thumbnail_url: null,
    component_key: "blush-garden",
    created_at: order.created_at,
    updated_at: order.created_at,
  };

  // 4. Fetch client profile
  const { data: clientProfile, error: profError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", order.user_id)
    .single();

  if (profError) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentById profile query error:", profError.message);
  }

  // 5. Fetch reviewer profile if reviewed_by is set
  let reviewerProfile: Pick<Profile, "full_name"> | null = null;
  if (order.reviewed_by) {
    const { data: revData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", order.reviewed_by)
      .single();
    if (revData) {
      reviewerProfile = revData;
    }
  }

  // 6. Fetch payment proofs for this order
  const { data: proofs, error: proofsError } = await supabase
    .from("payment_proofs")
    .select("*")
    .eq("order_id", orderId)
    .order("submitted_at", { ascending: false });

  if (proofsError) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminPaymentById proofs query error:", proofsError.message);
  }

  const proofList = proofs || [];

  // 7. Generate short-lived (1 hour) signed URLs for private storage paths
  const proofsWithSignedUrls: AdminProofWithSignedUrl[] = await Promise.all(
    proofList.map(async (p) => {
      let signedUrl: string | null = null;
      if (p.storage_path) {
        const { data: signedData, error: signError } = await supabase.storage
          .from("payment-proofs")
          .createSignedUrl(p.storage_path, 3600);

        if (!signError && signedData?.signedUrl) {
          signedUrl = signedData.signedUrl;
        } else {
          console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] createSignedUrl error:", signError?.message);
        }
      }
      return {
        ...p,
        signedUrl,
      };
    })
  );

  return {
    order: {
      ...order,
      client: {
        ...(clientProfile || {
          id: order.user_id,
          full_name: "Klien",
          phone: null,
          avatar_url: null,
          role: "client",
          created_at: "",
          updated_at: "",
        }),
        email: "",
      },
      invitation,
      template,
      reviewer: reviewerProfile,
    },
    proofs: proofsWithSignedUrls,
  };
}
