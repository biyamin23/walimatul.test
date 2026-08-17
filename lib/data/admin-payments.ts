import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Order, PaymentProof, Invitation, Template, Profile } from "@/types/database";

export interface AdminPaymentQueueItem extends Order {
  client: Pick<Profile, "id" | "full_name"> & { email: string };
  invitation: Pick<Invitation, "id" | "groom_name" | "groom_short_name" | "bride_name" | "bride_short_name" | "slug" | "status">;
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
    console.error("[WALIMATUL] getAdminPaymentStats error:", error?.message);
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
 * Fetch the list of orders for the Admin payment queue.
 */
export async function getAdminPaymentQueue(
  statusFilter?: string
): Promise<AdminPaymentQueueItem[]> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    return [];
  }

  let query = supabase
    .from("orders")
    .select(`
      *,
      invitation:invitations (id, groom_name, groom_short_name, bride_name, bride_short_name, slug, status),
      template:templates (id, name, slug)
    `);

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("payment_status", statusFilter);
  }

  const { data: orders, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error || !orders) {
    console.error("[WALIMATUL] getAdminPaymentQueue error:", error?.message);
    return [];
  }

  // Fetch client profiles for the unique user_ids
  const userIds = [...new Set(orders.map((o) => o.user_id))];
  const profileMap = new Map<string, Pick<Profile, "id" | "full_name">>();

  if (userIds.length > 0) {
    const { data: profiles, error: profileErr } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", userIds);

    if (!profileErr && profiles) {
      for (const p of profiles) {
        profileMap.set(p.id, p);
      }
    }
  }

  return orders.map((o) => {
    const rawInv = Array.isArray(o.invitation) ? o.invitation[0] : o.invitation;
    const rawTpl = Array.isArray(o.template) ? o.template[0] : o.template;
    const matchedProfile = profileMap.get(o.user_id);

    return {
      ...o,
      client: {
        id: o.user_id,
        full_name: matchedProfile?.full_name || "Klien",
        email: "",
      },
      invitation: rawInv,
      template: rawTpl,
    };
  });
}

/**
 * Fetch detailed order information and secure short-lived signed URLs for proofs.
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
    return null;
  }

  // 1. Fetch order with invitation and template
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      *,
      invitation:invitations (*),
      template:templates (*)
    `)
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("[WALIMATUL] getAdminPaymentById error:", orderError?.message);
    return null;
  }

  const rawInv = Array.isArray(order.invitation) ? order.invitation[0] : order.invitation;
  const rawTpl = Array.isArray(order.template) ? order.template[0] : order.template;

  // 2. Fetch client profile
  const { data: clientProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", order.user_id)
    .single();

  // 3. Fetch reviewer profile if reviewed_by is set
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

  // 4. Fetch payment proofs for this order
  const { data: proofs, error: proofsError } = await supabase
    .from("payment_proofs")
    .select("*")
    .eq("order_id", orderId)
    .order("submitted_at", { ascending: false });

  if (proofsError) {
    console.error("[WALIMATUL] fetch proofs error:", proofsError.message);
  }

  const proofList = proofs || [];

  // 5. Generate short-lived (1 hour) signed URLs for private storage paths
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
          console.error("[WALIMATUL] createSignedUrl error:", signError?.message);
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
      invitation: rawInv,
      template: rawTpl,
      reviewer: reviewerProfile,
    },
    proofs: proofsWithSignedUrls,
  };
}
