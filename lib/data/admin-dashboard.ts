import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { OrderPaymentStatus } from "@/types/database";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RecentOrderItem {
  id: string;
  created_at: string;
  payment_status: OrderPaymentStatus;
  amount: number;
  currency: string;
  invitation_name: string; // "{groom_short} & {bride_short}" or fallback
  template_name: string;
}

export interface AdminDashboardStats {
  // Users
  totalUsers: number;

  // Invitations
  totalInvitations: number;
  publishedInvitations: number;
  draftInvitations: number;

  // Orders
  totalOrders: number;
  pendingVerificationCount: number;
  paidCount: number;
  rejectedCount: number;

  // Revenue — sourced from orders.amount (snapshot column), never derived from price
  totalRevenuePaid: number; // SUM(amount) where payment_status = 'paid'
  monthlyRevenuePaid: number; // SUM(amount) paid in current MYT calendar month

  // Recent activity feed
  recentOrders: RecentOrderItem[];
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function currentMonthRangeMYT(): { start: string; end: string } {
  // Malaysia Time = UTC+8. Derive current month boundaries in ISO 8601.
  const now = new Date();
  // Shift to MYT by adding 8 hours to get the correct local date.
  const myt = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const year = myt.getUTCFullYear();
  const month = myt.getUTCMonth(); // 0-based
  // First moment of the month in UTC (MYT midnight = UTC-8h, but we use ISO
  // range filtering on the DB which stores timestamptz; using the MYT month
  // start as a UTC string is close enough for monthly reporting.)
  const start = new Date(Date.UTC(year, month, 1)).toISOString();
  const end = new Date(Date.UTC(year, month + 1, 1)).toISOString();
  return { start, end };
}

// ─── Main Query ───────────────────────────────────────────────────────────────

/**
 * getAdminDashboardStats()
 *
 * Fetches all KPIs required for the /admin dashboard page.
 * Uses flat sequential queries (no PostgREST joins) to avoid dropped rows.
 * Degrades gracefully — individual failed steps return zero/empty rather than
 * breaking the whole page.
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();

  // Auth guard at data layer
  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error(
      "[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminDashboardStats: Unauthenticated."
    );
    return emptyStats();
  }

  // Run all top-level queries in parallel for speed
  const [
    profilesResult,
    invitationsResult,
    ordersResult,
  ] = await Promise.all([
    supabase.from("profiles").select("id"),
    supabase.from("invitations").select("id, status"),
    supabase.from("orders").select("id, payment_status, amount, currency, invitation_id, template_id, created_at").order("created_at", { ascending: false }),
  ]);

  // ── Users ──────────────────────────────────────────────────────────────────
  const totalUsers = profilesResult.data?.length ?? 0;
  if (profilesResult.error) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] profiles query failed:", profilesResult.error.message);
  }

  // ── Invitations ────────────────────────────────────────────────────────────
  let totalInvitations = 0;
  let publishedInvitations = 0;
  let draftInvitations = 0;
  if (invitationsResult.error) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] invitations query failed:", invitationsResult.error.message);
  } else if (invitationsResult.data) {
    totalInvitations = invitationsResult.data.length;
    for (const inv of invitationsResult.data) {
      if (inv.status === "published") publishedInvitations++;
      else if (inv.status === "draft") draftInvitations++;
    }
  }

  // ── Orders & Revenue ───────────────────────────────────────────────────────
  let totalOrders = 0;
  let pendingVerificationCount = 0;
  let paidCount = 0;
  let rejectedCount = 0;
  let totalRevenuePaid = 0;
  let monthlyRevenuePaid = 0;
  const allOrders = ordersResult.data ?? [];

  if (ordersResult.error) {
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] orders query failed:", ordersResult.error.message);
  } else {
    const { start: monthStart, end: monthEnd } = currentMonthRangeMYT();
    totalOrders = allOrders.length;

    for (const o of allOrders) {
      const amount = typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0);
      if (o.payment_status === "pending_verification") pendingVerificationCount++;
      else if (o.payment_status === "paid") {
        paidCount++;
        totalRevenuePaid += amount;
        // Monthly: check if created_at falls in current MYT month
        if (o.created_at >= monthStart && o.created_at < monthEnd) {
          monthlyRevenuePaid += amount;
        }
      } else if (o.payment_status === "payment_rejected") {
        rejectedCount++;
      }
    }
  }

  // ── Recent Orders — enrich with invitation & template names ───────────────
  const recentRaw = allOrders.slice(0, 8);
  const recentOrders = await enrichRecentOrders(supabase, recentRaw);

  return {
    totalUsers,
    totalInvitations,
    publishedInvitations,
    draftInvitations,
    totalOrders,
    pendingVerificationCount,
    paidCount,
    rejectedCount,
    totalRevenuePaid,
    monthlyRevenuePaid,
    recentOrders,
  };
}

// ─── Enrichment helper ────────────────────────────────────────────────────────

async function enrichRecentOrders(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  orders: Array<{
    id: string;
    created_at: string;
    payment_status: string;
    amount: unknown;
    currency: string;
    invitation_id: string;
    template_id: string;
  }>
): Promise<RecentOrderItem[]> {
  if (orders.length === 0) return [];

  const invitationIds = [...new Set(orders.map((o) => o.invitation_id).filter(Boolean))];
  const templateIds = [...new Set(orders.map((o) => o.template_id).filter(Boolean))];

  const [invsResult, tplsResult] = await Promise.all([
    invitationIds.length > 0
      ? supabase
          .from("invitations")
          .select("id, groom_short_name, bride_short_name, groom_name, bride_name")
          .in("id", invitationIds)
      : Promise.resolve({ data: [], error: null }),
    templateIds.length > 0
      ? supabase
          .from("templates")
          .select("id, name")
          .in("id", templateIds)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const invMap = new Map<string, { groom_short_name: string | null; bride_short_name: string | null; groom_name: string | null; bride_name: string | null }>();
  for (const inv of invsResult.data ?? []) {
    invMap.set(inv.id, inv);
  }

  const tplMap = new Map<string, string>();
  for (const tpl of tplsResult.data ?? []) {
    tplMap.set(tpl.id, tpl.name);
  }

  return orders.map((o) => {
    const inv = invMap.get(o.invitation_id);
    const groomName = inv?.groom_short_name || inv?.groom_name || "Pengantin Lelaki";
    const brideName = inv?.bride_short_name || inv?.bride_name || "Pengantin Perempuan";
    const invitation_name = `${groomName} & ${brideName}`;
    const template_name = tplMap.get(o.template_id) || "Templat";

    return {
      id: o.id,
      created_at: o.created_at,
      payment_status: o.payment_status as OrderPaymentStatus,
      amount: typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0),
      currency: o.currency || "MYR",
      invitation_name,
      template_name,
    };
  });
}

// ─── Fallback ─────────────────────────────────────────────────────────────────

function emptyStats(): AdminDashboardStats {
  return {
    totalUsers: 0,
    totalInvitations: 0,
    publishedInvitations: 0,
    draftInvitations: 0,
    totalOrders: 0,
    pendingVerificationCount: 0,
    paidCount: 0,
    rejectedCount: 0,
    totalRevenuePaid: 0,
    monthlyRevenuePaid: 0,
    recentOrders: [],
  };
}
