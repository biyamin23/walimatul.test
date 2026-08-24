import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { OrderPaymentStatus } from "@/types/database";

// ─── Range Types ──────────────────────────────────────────────────────────────

export type DashboardRange = "30d" | "90d" | "12m" | "all";

const VALID_RANGES: DashboardRange[] = ["30d", "90d", "12m", "all"];

/** Validate raw query param; fallback to "12m" for any invalid value. */
export function parseRange(raw: string | string[] | undefined): DashboardRange {
  const val = Array.isArray(raw) ? raw[0] : raw;
  if (val && (VALID_RANGES as string[]).includes(val)) {
    return val as DashboardRange;
  }
  return "12m";
}

export const RANGE_LABELS: Record<DashboardRange, string> = {
  "30d": "30 Hari",
  "90d": "90 Hari",
  "12m": "12 Bulan",
  all: "Semua Masa",
};

// ─── KPI Types ────────────────────────────────────────────────────────────────

export interface RecentOrderItem {
  id: string;
  created_at: string;
  payment_status: OrderPaymentStatus;
  amount: number;
  currency: string;
  invitation_name: string;
  template_name: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalInvitations: number;
  publishedInvitations: number;
  draftInvitations: number;
  totalOrders: number;
  pendingVerificationCount: number;
  paidCount: number;
  rejectedCount: number;
  totalRevenuePaid: number;
  monthlyRevenuePaid: number;
  recentOrders: RecentOrderItem[];
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface InvitationStatusBreakdown {
  published: number;
  draft: number;
  expired: number;
  total: number;
}

export interface TopTemplateItem {
  id: string;
  name: string;
  thumbnail_url: string | null;
  count: number;
  share: number; // 0–1 fraction of all invitations
}

export interface ActivityItem {
  id: string;
  type:
    | "new_user"
    | "order_submitted"
    | "order_approved"
    | "order_rejected"
    | "invitation_published"
    | "template_updated";
  label: string;
  subtitle: string;
  href: string | null;
  timestamp: string;
}

export interface AdminAnalyticsResult {
  revenueSeries: ChartDataPoint[];
  invitationStatus: InvitationStatusBreakdown;
  topTemplates: TopTemplateItem[];
  recentActivity: ActivityItem[];
  rangeRevenue: number;
  rangeLabel: string;
}

// ─── MYT Helpers ──────────────────────────────────────────────────────────────

/** Current time as a Date shifted to Malaysia Time (UTC+8). */
function nowMYT(): Date {
  const now = new Date();
  return new Date(now.getTime() + 8 * 60 * 60 * 1000);
}

function currentMonthRangeMYT(): { start: string; end: string } {
  const myt = nowMYT();
  const year = myt.getUTCFullYear();
  const month = myt.getUTCMonth();
  return {
    start: new Date(Date.UTC(year, month, 1)).toISOString(),
    end: new Date(Date.UTC(year, month + 1, 1)).toISOString(),
  };
}

/**
 * Compute the ISO start date for a given range relative to now (MYT).
 * Returns null for "all" (no lower bound).
 */
function rangeStart(range: DashboardRange): Date | null {
  const myt = nowMYT();
  // Snap to UTC midnight of myt date
  const today = new Date(
    Date.UTC(myt.getUTCFullYear(), myt.getUTCMonth(), myt.getUTCDate())
  );
  if (range === "30d") {
    return new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  if (range === "90d") {
    return new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
  }
  if (range === "12m") {
    const y = today.getUTCFullYear();
    const m = today.getUTCMonth();
    // 12 months back: first day of the same month 1 year ago
    return new Date(Date.UTC(y - 1, m, 1));
  }
  return null; // "all"
}

// ─── Revenue Series ───────────────────────────────────────────────────────────

/**
 * Generate zero-filled time-series buckets for the given range,
 * then sum paid order amounts into each bucket.
 */
function buildRevenueSeries(
  orders: Array<{ created_at: string; amount: number; payment_status: string }>,
  range: DashboardRange
): ChartDataPoint[] {
  const myt = nowMYT();
  const paidOrders = orders.filter((o) => o.payment_status === "paid");

  if (range === "30d") {
    // 30 daily buckets
    const buckets: ChartDataPoint[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(myt.getTime() - i * 24 * 60 * 60 * 1000);
      const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
      buckets.push({
        label: d.toLocaleDateString("ms-MY", {
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        }),
        value: 0,
      });
      // Add tag for lookup
      (buckets[buckets.length - 1] as ChartDataPoint & { _key: string })._key = key;
    }
    for (const o of paidOrders) {
      const key = o.created_at.slice(0, 10);
      const bucket = buckets.find(
        (b) => (b as ChartDataPoint & { _key?: string })._key === key
      );
      if (bucket) bucket.value += o.amount;
    }
    // Remove internal _key before returning
    return buckets.map(({ label, value }) => ({ label, value }));
  }

  if (range === "90d") {
    // ~13 weekly buckets (ISO week: Monday start)
    const bucketMap = new Map<string, { label: string; value: number }>();
    for (let i = 12; i >= 0; i--) {
      const d = new Date(myt.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      // Monday of that week
      const day = d.getUTCDay(); // 0=Sun
      const monday = new Date(d.getTime() - ((day === 0 ? 6 : day - 1) * 24 * 60 * 60 * 1000));
      const weekKey = monday.toISOString().slice(0, 10);
      if (!bucketMap.has(weekKey)) {
        bucketMap.set(weekKey, {
          label: monday.toLocaleDateString("ms-MY", {
            day: "numeric",
            month: "short",
            timeZone: "UTC",
          }),
          value: 0,
        });
      }
    }
    for (const o of paidOrders) {
      const d = new Date(o.created_at);
      const day = d.getUTCDay();
      const monday = new Date(d.getTime() - ((day === 0 ? 6 : day - 1) * 24 * 60 * 60 * 1000));
      const weekKey = monday.toISOString().slice(0, 10);
      const bucket = bucketMap.get(weekKey);
      if (bucket) bucket.value += o.amount;
    }
    return Array.from(bucketMap.values());
  }

  if (range === "12m") {
    // 12 monthly buckets
    const buckets: ChartDataPoint[] = [];
    const bucketKeys: string[] = [];
    for (let i = 11; i >= 0; i--) {
      let y = myt.getUTCFullYear();
      let m = myt.getUTCMonth() - i;
      while (m < 0) { m += 12; y--; }
      const key = `${y}-${String(m + 1).padStart(2, "0")}`;
      bucketKeys.push(key);
      buckets.push({
        label: new Date(Date.UTC(y, m, 1)).toLocaleDateString("ms-MY", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        }),
        value: 0,
      });
    }
    for (const o of paidOrders) {
      const key = o.created_at.slice(0, 7);
      const idx = bucketKeys.indexOf(key);
      if (idx !== -1) buckets[idx].value += o.amount;
    }
    return buckets;
  }

  // "all" — monthly since earliest order
  if (paidOrders.length === 0) return [];
  const sortedDates = paidOrders.map((o) => o.created_at).sort();
  const earliest = sortedDates[0].slice(0, 7); // "YYYY-MM"
  const [ey, em] = earliest.split("-").map(Number);
  const cy = myt.getUTCFullYear();
  const cm = myt.getUTCMonth() + 1;
  const buckets: ChartDataPoint[] = [];
  const bucketKeys: string[] = [];
  let y = ey, m = em;
  while (y < cy || (y === cy && m <= cm)) {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    bucketKeys.push(key);
    buckets.push({
      label: new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("ms-MY", {
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }),
      value: 0,
    });
    m++;
    if (m > 12) { m = 1; y++; }
  }
  for (const o of paidOrders) {
    const key = o.created_at.slice(0, 7);
    const idx = bucketKeys.indexOf(key);
    if (idx !== -1) buckets[idx].value += o.amount;
  }
  return buckets;
}

// ─── Invitation Status Breakdown ──────────────────────────────────────────────

function classifyInvitations(
  invitations: Array<{ status: string; expires_at: string | null }>
): InvitationStatusBreakdown {
  const now = new Date().toISOString();
  let published = 0, draft = 0, expired = 0;
  for (const inv of invitations) {
    if (inv.status === "expired") {
      expired++;
    } else if (
      inv.status === "published" &&
      inv.expires_at !== null &&
      inv.expires_at < now
    ) {
      // Published but past expiry — treat as expired
      expired++;
    } else if (inv.status === "published") {
      published++;
    } else {
      // draft, archived, or other — lump as draft
      draft++;
    }
  }
  return { published, draft, expired, total: invitations.length };
}

// ─── Relative Time ────────────────────────────────────────────────────────────

function relativeTimeMY(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Baru sahaja";
  if (diffMin < 60) return `${diffMin} minit lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return "Semalam";
  if (diffDay < 30) return `${diffDay} hari lalu`;
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo < 12) return `${diffMo} bulan lalu`;
  return `${Math.floor(diffMo / 12)} tahun lalu`;
}

// ─── Main KPI Query ───────────────────────────────────────────────────────────

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error(
      "[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminDashboardStats: Unauthenticated."
    );
    return emptyStats();
  }

  const [profilesResult, invitationsResult, ordersResult] = await Promise.all([
    supabase.from("profiles").select("id"),
    supabase.from("invitations").select("id, status"),
    supabase
      .from("orders")
      .select(
        "id, payment_status, amount, currency, invitation_id, template_id, created_at"
      )
      .order("created_at", { ascending: false }),
  ]);

  const totalUsers = profilesResult.data?.length ?? 0;
  if (profilesResult.error) {
    console.error(
      "[WALIMATUL_ADMIN_DIAGNOSTIC] profiles query failed:",
      profilesResult.error.message
    );
  }

  let totalInvitations = 0;
  let publishedInvitations = 0;
  let draftInvitations = 0;
  if (invitationsResult.error) {
    console.error(
      "[WALIMATUL_ADMIN_DIAGNOSTIC] invitations query failed:",
      invitationsResult.error.message
    );
  } else if (invitationsResult.data) {
    totalInvitations = invitationsResult.data.length;
    for (const inv of invitationsResult.data) {
      if (inv.status === "published") publishedInvitations++;
      else if (inv.status === "draft") draftInvitations++;
    }
  }

  let totalOrders = 0;
  let pendingVerificationCount = 0;
  let paidCount = 0;
  let rejectedCount = 0;
  let totalRevenuePaid = 0;
  let monthlyRevenuePaid = 0;
  const allOrders = ordersResult.data ?? [];

  if (ordersResult.error) {
    console.error(
      "[WALIMATUL_ADMIN_DIAGNOSTIC] orders query failed:",
      ordersResult.error.message
    );
  } else {
    const { start: monthStart, end: monthEnd } = currentMonthRangeMYT();
    totalOrders = allOrders.length;
    for (const o of allOrders) {
      const amount =
        typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0);
      if (o.payment_status === "pending_verification")
        pendingVerificationCount++;
      else if (o.payment_status === "paid") {
        paidCount++;
        totalRevenuePaid += amount;
        if (o.created_at >= monthStart && o.created_at < monthEnd) {
          monthlyRevenuePaid += amount;
        }
      } else if (o.payment_status === "payment_rejected") {
        rejectedCount++;
      }
    }
  }

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

// ─── Analytics Query ──────────────────────────────────────────────────────────

/**
 * getAdminAnalytics(range)
 *
 * Fetches all analytics panels for the given dashboard range.
 * Uses flat sequential/parallel queries — no PostgREST joins.
 * Individual panel failures degrade gracefully with empty data.
 */
export async function getAdminAnalytics(
  range: DashboardRange
): Promise<AdminAnalyticsResult> {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error(
      "[WALIMATUL_ADMIN_DIAGNOSTIC] getAdminAnalytics: Unauthenticated."
    );
    return emptyAnalytics(range);
  }

  const start = rangeStart(range);
  const startISO = start?.toISOString();

  // ── Parallel data fetches ─────────────────────────────────────────────────
  const ordersQuery = supabase
    .from("orders")
    .select("id, payment_status, amount, created_at, reviewed_at, invitation_id, user_id")
    .order("created_at", { ascending: false });

  const invitationsQuery = supabase
    .from("invitations")
    .select("id, template_id, status, expires_at, published_at, groom_short_name, bride_short_name, groom_name, bride_name, slug, user_id")
    .order("created_at", { ascending: false })
    .limit(200);

  const templatesQuery = supabase
    .from("templates")
    .select("id, name, thumbnail_url")
    .limit(50);

  const profilesActivityQuery = supabase
    .from("profiles")
    .select("id, full_name, created_at")
    .order("created_at", { ascending: false })
    .limit(10);

  const templatesActivityQuery = supabase
    .from("templates")
    .select("id, name, updated_at")
    .order("updated_at", { ascending: false })
    .limit(10);

  const [
    ordersResult,
    invitationsResult,
    templatesResult,
    profilesActResult,
    templatesActResult,
  ] = await Promise.all([
    ordersQuery,
    invitationsQuery,
    templatesQuery,
    profilesActivityQuery,
    templatesActivityQuery,
  ]);

  const allOrders = ordersResult.data ?? [];
  const allInvitations = invitationsResult.data ?? [];
  const allTemplates = templatesResult.data ?? [];

  if (ordersResult.error)
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] analytics orders:", ordersResult.error.message);
  if (invitationsResult.error)
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] analytics invitations:", invitationsResult.error.message);
  if (templatesResult.error)
    console.error("[WALIMATUL_ADMIN_DIAGNOSTIC] analytics templates:", templatesResult.error.message);

  // ── Range-filtered orders ─────────────────────────────────────────────────
  const rangeOrders = startISO
    ? allOrders.filter((o) => o.created_at >= startISO)
    : allOrders;

  // ── Revenue series ────────────────────────────────────────────────────────
  const revenueSeries = buildRevenueSeries(
    rangeOrders.map((o) => ({
      created_at: o.created_at,
      amount: typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0),
      payment_status: o.payment_status,
    })),
    range
  );

  // ── Range revenue total ───────────────────────────────────────────────────
  const rangeRevenue = rangeOrders
    .filter((o) => o.payment_status === "paid")
    .reduce(
      (sum, o) =>
        sum + (typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0)),
      0
    );

  // ── Invitation status (always lifetime) ──────────────────────────────────
  const invitationStatus = classifyInvitations(allInvitations);

  // ── Top templates ─────────────────────────────────────────────────────────
  const templateCountMap = new Map<string, number>();
  for (const inv of allInvitations) {
    if (inv.template_id) {
      templateCountMap.set(
        inv.template_id,
        (templateCountMap.get(inv.template_id) ?? 0) + 1
      );
    }
  }
  const tplInfoMap = new Map<
    string,
    { name: string; thumbnail_url: string | null }
  >();
  for (const t of allTemplates) {
    tplInfoMap.set(t.id, { name: t.name, thumbnail_url: t.thumbnail_url });
  }
  const totalInvCount = allInvitations.length || 1; // safe denominator
  const topTemplates: TopTemplateItem[] = Array.from(templateCountMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const info = tplInfoMap.get(id);
      return {
        id,
        name: info?.name ?? "Templat",
        thumbnail_url: info?.thumbnail_url ?? null,
        count,
        share: count / totalInvCount,
      };
    });

  // ── Recent activity ───────────────────────────────────────────────────────
  const activities: ActivityItem[] = [];

  // New users
  for (const p of profilesActResult.data ?? []) {
    activities.push({
      id: `user-${p.id}`,
      type: "new_user",
      label: "Pengguna baharu",
      subtitle: p.full_name || "Pengguna",
      href: null,
      timestamp: p.created_at,
    });
  }

  // Orders — submitted (pending_verification) + approved + rejected
  for (const o of allOrders.slice(0, 20)) {
    if (o.payment_status === "pending_verification" && o.created_at) {
      activities.push({
        id: `order-submitted-${o.id}`,
        type: "order_submitted",
        label: "Pembayaran dihantar",
        subtitle: `Pesanan ${o.id.slice(0, 8).toUpperCase()}`,
        href: `/admin/payments/${o.id}`,
        timestamp: o.created_at,
      });
    } else if (o.payment_status === "paid" && o.reviewed_at) {
      // Enrich with invitation name later — use a placeholder for now
      activities.push({
        id: `order-approved-${o.id}`,
        type: "order_approved",
        label: "Pembayaran diluluskan",
        subtitle: `RM ${(typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0)).toFixed(2)}`,
        href: `/admin/payments/${o.id}`,
        timestamp: o.reviewed_at,
      });
    } else if (o.payment_status === "payment_rejected" && o.reviewed_at) {
      activities.push({
        id: `order-rejected-${o.id}`,
        type: "order_rejected",
        label: "Pembayaran ditolak",
        subtitle: `Pesanan ${o.id.slice(0, 8).toUpperCase()}`,
        href: `/admin/payments/${o.id}`,
        timestamp: o.reviewed_at,
      });
    }
  }

  // Published invitations
  for (const inv of allInvitations.filter((i) => i.published_at)) {
    const groom = inv.groom_short_name || inv.groom_name || "Pengantin Lelaki";
    const bride = inv.bride_short_name || inv.bride_name || "Pengantin Perempuan";
    activities.push({
      id: `inv-published-${inv.id}`,
      type: "invitation_published",
      label: "Jemputan diterbitkan",
      subtitle: `${groom} & ${bride}`,
      href: inv.slug ? `/${inv.slug}` : null,
      timestamp: inv.published_at!,
    });
  }

  // Template updates
  for (const t of templatesActResult.data ?? []) {
    activities.push({
      id: `tpl-updated-${t.id}`,
      type: "template_updated",
      label: "Template dikemas kini",
      subtitle: t.name,
      href: `/admin/templates/${t.id}/edit`,
      timestamp: t.updated_at,
    });
  }

  // Sort descending, take top 10
  const recentActivity = activities
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10)
    .map((a) => ({
      ...a,
      // Attach relative time as a pre-computed subtitle suffix (server-only)
      _relativeTime: relativeTimeMY(a.timestamp),
    })) as (ActivityItem & { _relativeTime: string })[];

  // Re-cast to ActivityItem (relativeTime consumed in component via subtitle)
  const recentActivityFinal: ActivityItem[] = recentActivity.map((a) => ({
    id: a.id,
    type: a.type,
    label: a.label,
    subtitle: a.subtitle,
    href: a.href,
    timestamp: a._relativeTime, // replace raw ISO with computed relative label
  }));

  return {
    revenueSeries,
    invitationStatus,
    topTemplates,
    recentActivity: recentActivityFinal,
    rangeRevenue,
    rangeLabel: RANGE_LABELS[range],
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

  const invitationIds = [
    ...new Set(orders.map((o) => o.invitation_id).filter(Boolean)),
  ];
  const templateIds = [
    ...new Set(orders.map((o) => o.template_id).filter(Boolean)),
  ];

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

  const invMap = new Map<
    string,
    {
      groom_short_name: string | null;
      bride_short_name: string | null;
      groom_name: string | null;
      bride_name: string | null;
    }
  >();
  for (const inv of invsResult.data ?? []) {
    invMap.set(inv.id, inv);
  }

  const tplMap = new Map<string, string>();
  for (const tpl of tplsResult.data ?? []) {
    tplMap.set(tpl.id, tpl.name);
  }

  return orders.map((o) => {
    const inv = invMap.get(o.invitation_id);
    const groomName =
      inv?.groom_short_name || inv?.groom_name || "Pengantin Lelaki";
    const brideName =
      inv?.bride_short_name || inv?.bride_name || "Pengantin Perempuan";
    return {
      id: o.id,
      created_at: o.created_at,
      payment_status: o.payment_status as OrderPaymentStatus,
      amount:
        typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0),
      currency: o.currency || "MYR",
      invitation_name: `${groomName} & ${brideName}`,
      template_name: tplMap.get(o.template_id) || "Templat",
    };
  });
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

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

function emptyAnalytics(range: DashboardRange): AdminAnalyticsResult {
  return {
    revenueSeries: [],
    invitationStatus: { published: 0, draft: 0, expired: 0, total: 0 },
    topTemplates: [],
    recentActivity: [],
    rangeRevenue: 0,
    rangeLabel: RANGE_LABELS[range],
  };
}
