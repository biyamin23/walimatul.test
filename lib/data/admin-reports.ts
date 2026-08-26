import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { OrderPaymentStatus } from "@/types/database";

export * from "@/types/reports";
import type {
  ParsedReportRange,
  AdminReportSummary,
  RevenueSeriesPoint,
  PaymentStatusMetrics,
  InvitationAnalyticsMetrics,
  CustomerAnalyticsMetrics,
  TemplatePerformanceItem,
  AdminReportsPageData,
} from "@/types/reports";

// ─── Malaysia Timezone (UTC+8) Date Calculation Helpers ───────────────────────

const MYT_OFFSET_HOURS = 8;
const MYT_OFFSET_MS = MYT_OFFSET_HOURS * 60 * 60 * 1000;

/** Convert a Date object to MYT YYYY-MM-DD string */
export function formatMytDateString(date: Date): string {
  const mytTime = new Date(date.getTime() + MYT_OFFSET_MS);
  const y = mytTime.getUTCFullYear();
  const m = String(mytTime.getUTCMonth() + 1).padStart(2, "0");
  const d = String(mytTime.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Construct UTC Date for 00:00:00.000 MYT on given YYYY-MM-DD */
export function parseMytStartOfDay(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  // 00:00:00 MYT is (00:00:00 - 8h) UTC of the same date
  return new Date(Date.UTC(y, m - 1, d, 0 - MYT_OFFSET_HOURS, 0, 0, 0));
}

/** Construct UTC Date for 23:59:59.999 MYT on given YYYY-MM-DD */
export function parseMytEndOfDay(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 23 - MYT_OFFSET_HOURS, 59, 59, 999));
}

/** Validate YYYY-MM-DD */
function isValidDateStr(str: string | undefined): boolean {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const [y, m, d] = str.split("-").map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const date = new Date(Date.UTC(y, m - 1, d));
  return (
    date.getUTCFullYear() === y &&
    date.getUTCMonth() === m - 1 &&
    date.getUTCDate() === d
  );
}

/** Parse and validate report date range from query params with fallback to 30d */
export function parseReportRange(
  rawRange?: string | string[],
  rawFrom?: string | string[],
  rawTo?: string | string[]
): ParsedReportRange {
  const rangeParam = (Array.isArray(rawRange) ? rawRange[0] : rawRange) || "30d";
  const fromParam = Array.isArray(rawFrom) ? rawFrom[0] : rawFrom;
  const toParam = Array.isArray(rawTo) ? rawTo[0] : rawTo;

  const now = new Date();
  const nowMytStr = formatMytDateString(now);

  if (rangeParam === "custom") {
    if (isValidDateStr(fromParam) && isValidDateStr(toParam) && fromParam! <= toParam!) {
      const startDate = parseMytStartOfDay(fromParam!);
      const endDate = parseMytEndOfDay(toParam!);
      const durationMs = endDate.getTime() - startDate.getTime();

      const priorEndDate = new Date(startDate.getTime() - 1);
      const priorStartDate = new Date(priorEndDate.getTime() - durationMs);

      const daysDiff = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
      const grouping: "day" | "week" | "month" =
        daysDiff <= 35 ? "day" : daysDiff <= 180 ? "week" : "month";

      return {
        preset: "custom",
        startDate,
        endDate,
        priorStartDate,
        priorEndDate,
        fromStr: fromParam!,
        toStr: toParam!,
        label: `${fromParam} hingga ${toParam}`,
        grouping,
      };
    }
    // Invalid custom range -> fallback to 30d
  }

  if (rangeParam === "7d") {
    const end = parseMytEndOfDay(nowMytStr);
    const startMyt = new Date(now.getTime() + MYT_OFFSET_MS);
    startMyt.setUTCDate(startMyt.getUTCDate() - 6);
    const fromStr = formatMytDateString(new Date(startMyt.getTime() - MYT_OFFSET_MS));
    const startDate = parseMytStartOfDay(fromStr);

    const durationMs = end.getTime() - startDate.getTime();
    const priorEndDate = new Date(startDate.getTime() - 1);
    const priorStartDate = new Date(priorEndDate.getTime() - durationMs);

    return {
      preset: "7d",
      startDate,
      endDate: end,
      priorStartDate,
      priorEndDate,
      fromStr,
      toStr: nowMytStr,
      label: "7 Hari Lepas",
      grouping: "day",
    };
  }

  if (rangeParam === "90d") {
    const end = parseMytEndOfDay(nowMytStr);
    const startMyt = new Date(now.getTime() + MYT_OFFSET_MS);
    startMyt.setUTCDate(startMyt.getUTCDate() - 89);
    const fromStr = formatMytDateString(new Date(startMyt.getTime() - MYT_OFFSET_MS));
    const startDate = parseMytStartOfDay(fromStr);

    const durationMs = end.getTime() - startDate.getTime();
    const priorEndDate = new Date(startDate.getTime() - 1);
    const priorStartDate = new Date(priorEndDate.getTime() - durationMs);

    return {
      preset: "90d",
      startDate,
      endDate: end,
      priorStartDate,
      priorEndDate,
      fromStr,
      toStr: nowMytStr,
      label: "90 Hari Lepas",
      grouping: "week",
    };
  }

  if (rangeParam === "12m") {
    const end = parseMytEndOfDay(nowMytStr);
    const startMyt = new Date(now.getTime() + MYT_OFFSET_MS);
    startMyt.setUTCFullYear(startMyt.getUTCFullYear() - 1);
    startMyt.setUTCDate(startMyt.getUTCDate() + 1);
    const fromStr = formatMytDateString(new Date(startMyt.getTime() - MYT_OFFSET_MS));
    const startDate = parseMytStartOfDay(fromStr);

    const durationMs = end.getTime() - startDate.getTime();
    const priorEndDate = new Date(startDate.getTime() - 1);
    const priorStartDate = new Date(priorEndDate.getTime() - durationMs);

    return {
      preset: "12m",
      startDate,
      endDate: end,
      priorStartDate,
      priorEndDate,
      fromStr,
      toStr: nowMytStr,
      label: "12 Bulan Lepas",
      grouping: "month",
    };
  }

  if (rangeParam === "all") {
    const startDate = new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0)); // Platform inception
    const end = parseMytEndOfDay(nowMytStr);
    return {
      preset: "all",
      startDate,
      endDate: end,
      priorStartDate: null,
      priorEndDate: null,
      fromStr: "2024-01-01",
      toStr: nowMytStr,
      label: "Semua Masa",
      grouping: "month",
    };
  }

  // Default: 30d
  const end = parseMytEndOfDay(nowMytStr);
  const startMyt = new Date(now.getTime() + MYT_OFFSET_MS);
  startMyt.setUTCDate(startMyt.getUTCDate() - 29);
  const fromStr = formatMytDateString(new Date(startMyt.getTime() - MYT_OFFSET_MS));
  const startDate = parseMytStartOfDay(fromStr);

  const durationMs = end.getTime() - startDate.getTime();
  const priorEndDate = new Date(startDate.getTime() - 1);
  const priorStartDate = new Date(priorEndDate.getTime() - durationMs);

  return {
    preset: "30d",
    startDate,
    endDate: end,
    priorStartDate,
    priorEndDate,
    fromStr,
    toStr: nowMytStr,
    label: "30 Hari Lepas",
    grouping: "day",
  };
}

// ─── Helper Functions for Bucketing & Aggregations ────────────────────────────

function calculateDiffPct(current: number, previous: number | null): number | null {
  if (previous === null || previous === 0) {
    return null; // Return null to indicate no valid comparison baseline
  }
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

/** Generate continuous date bucket keys between two UTC dates */
function generateBuckets(
  start: Date,
  end: Date,
  grouping: "day" | "week" | "month"
): { key: string; label: string }[] {
  const buckets: { key: string; label: string }[] = [];
  const curr = new Date(start.getTime());

  if (grouping === "day") {
    while (curr <= end) {
      const key = formatMytDateString(curr);
      const parts = key.split("-");
      const label = `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}`;
      buckets.push({ key, label });
      curr.setUTCDate(curr.getUTCDate() + 1);
    }
  } else if (grouping === "week") {
    while (curr <= end) {
      const key = formatMytDateString(curr);
      const parts = key.split("-");
      const label = `M${parts[1]}-${parseInt(parts[2], 10)}`;
      buckets.push({ key, label });
      curr.setUTCDate(curr.getUTCDate() + 7);
    }
  } else {
    // month
    const endMyt = new Date(end.getTime() + MYT_OFFSET_MS);
    const currMyt = new Date(start.getTime() + MYT_OFFSET_MS);
    currMyt.setUTCDate(1);

    while (currMyt <= endMyt) {
      const y = currMyt.getUTCFullYear();
      const m = String(currMyt.getUTCMonth() + 1).padStart(2, "0");
      const key = `${y}-${m}`;
      const monthNames = ["Jan", "Feb", "Mac", "Apr", "Mei", "Jun", "Jul", "Ogo", "Sep", "Okt", "Nov", "Dis"];
      const label = `${monthNames[currMyt.getUTCMonth()]} ${String(y).slice(2)}`;
      buckets.push({ key, label });
      currMyt.setUTCMonth(currMyt.getUTCMonth() + 1);
    }
  }

  return buckets;
}

function getBucketKey(isoString: string, grouping: "day" | "week" | "month"): string {
  const date = new Date(isoString);
  const mytStr = formatMytDateString(date);

  if (grouping === "day") {
    return mytStr;
  }
  if (grouping === "month") {
    return mytStr.slice(0, 7); // YYYY-MM
  }
  // week: find the week start bucket
  return mytStr;
}

// ─── Main Reports Query Loader ────────────────────────────────────────────────

export async function getAdminReportsData(
  rangeParam?: string,
  fromParam?: string,
  toParam?: string
): Promise<AdminReportsPageData> {
  const range = parseReportRange(rangeParam, fromParam, toParam);
  const supabase = await createClient();

  const startIso = range.startDate.toISOString();
  const endIso = range.endDate.toISOString();
  const priorStartIso = range.priorStartDate?.toISOString() || null;
  const priorEndIso = range.priorEndDate?.toISOString() || null;

  // 1. Fetch current period Orders (all statuses)
  const { data: periodOrders } = await supabase
    .from("orders")
    .select("id, user_id, invitation_id, template_id, amount, payment_status, created_at, paid_at")
    .gte("created_at", startIso)
    .lte("created_at", endIso);

  // 2. Fetch paid orders within range (authoritative for revenue using paid_at)
  const { data: periodPaidOrders } = await supabase
    .from("orders")
    .select("id, user_id, invitation_id, template_id, amount, payment_status, paid_at")
    .eq("payment_status", "paid")
    .gte("paid_at", startIso)
    .lte("paid_at", endIso);

  // 3. Fetch prior period paid orders for comparison
  let priorPaidRevenue: number | null = null;
  let priorPaidCount: number | null = null;
  if (priorStartIso && priorEndIso) {
    const { data: priorPaid } = await supabase
      .from("orders")
      .select("amount")
      .eq("payment_status", "paid")
      .gte("paid_at", priorStartIso)
      .lte("paid_at", priorEndIso);

    if (priorPaid) {
      priorPaidRevenue = priorPaid.reduce((acc, o) => acc + (Number(o.amount) || 0), 0);
      priorPaidCount = priorPaid.length;
    }
  }

  // 4. Fetch current period Invitations
  const { data: periodInvitations } = await supabase
    .from("invitations")
    .select("id, user_id, template_id, status, created_at, published_at, expires_at")
    .gte("created_at", startIso)
    .lte("created_at", endIso);

  // 5. Fetch invitations published within range
  const { data: periodPublishedInvitations } = await supabase
    .from("invitations")
    .select("id, published_at")
    .not("published_at", "is", null)
    .gte("published_at", startIso)
    .lte("published_at", endIso);

  // 6. Fetch prior period invitations for comparison
  let priorNewInvitations: number | null = null;
  let priorPublishedInvitations: number | null = null;
  if (priorStartIso && priorEndIso) {
    const [invRes, pubRes] = await Promise.all([
      supabase
        .from("invitations")
        .select("id")
        .gte("created_at", priorStartIso)
        .lte("created_at", priorEndIso),
      supabase
        .from("invitations")
        .select("id")
        .not("published_at", "is", null)
        .gte("published_at", priorStartIso)
        .lte("published_at", priorEndIso),
    ]);
    if (invRes.data) priorNewInvitations = invRes.data.length;
    if (pubRes.data) priorPublishedInvitations = pubRes.data.length;
  }

  // 7. Fetch current period client profiles (exclude admins)
  const { data: periodUsers } = await supabase
    .from("profiles")
    .select("id, created_at, role")
    .eq("role", "client")
    .gte("created_at", startIso)
    .lte("created_at", endIso);

  // 8. Fetch prior period client profiles
  let priorNewUsers: number | null = null;
  if (priorStartIso && priorEndIso) {
    const { data: priorUsers } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "client")
      .gte("created_at", priorStartIso)
      .lte("created_at", priorEndIso);
    if (priorUsers) priorNewUsers = priorUsers.length;
  }

  // 9. Fetch Lifetime Snapshot Metrics
  const [lifetimeProfilesRes, lifetimeInvitationsRes, lifetimePaidOrdersRes, templatesRes] =
    await Promise.all([
      supabase.from("profiles").select("id, role").eq("role", "client"),
      supabase.from("invitations").select("id, status, template_id, expires_at"),
      supabase.from("orders").select("id, user_id, template_id, amount, payment_status").eq("payment_status", "paid"),
      supabase.from("templates").select("id, name, slug, status, thumbnail_url, is_active"),
    ]);

  // ── Calculate Summary KPIs ──
  const paidOrders = periodPaidOrders || [];
  const currentRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
  const currentPaidCount = paidOrders.length;
  const currentNewUsers = periodUsers?.length || 0;
  const currentNewInvitations = periodInvitations?.length || 0;
  const currentPublishedInvitations = periodPublishedInvitations?.length || 0;

  const currentAov = currentPaidCount > 0 ? currentRevenue / currentPaidCount : 0;
  const priorAov =
    priorPaidCount && priorPaidCount > 0 && priorPaidRevenue !== null
      ? priorPaidRevenue / priorPaidCount
      : null;

  const summary: AdminReportSummary = {
    revenue: currentRevenue,
    revenueDiffPct: calculateDiffPct(currentRevenue, priorPaidRevenue),
    paidOrders: currentPaidCount,
    paidOrdersDiffPct: calculateDiffPct(currentPaidCount, priorPaidCount),
    newUsers: currentNewUsers,
    newUsersDiffPct: calculateDiffPct(currentNewUsers, priorNewUsers),
    newInvitations: currentNewInvitations,
    newInvitationsDiffPct: calculateDiffPct(currentNewInvitations, priorNewInvitations),
    publishedInvitations: currentPublishedInvitations,
    publishedInvitationsDiffPct: calculateDiffPct(currentPublishedInvitations, priorPublishedInvitations),
    averageOrderValue: currentAov,
    averageOrderValueDiffPct: calculateDiffPct(currentAov, priorAov),
  };

  // ── Build Revenue Bucket Series ──
  const revenueBuckets = generateBuckets(range.startDate, range.endDate, range.grouping);
  const revenueBucketMap: Record<string, { revenue: number; paidOrders: number }> = {};

  for (const b of revenueBuckets) {
    revenueBucketMap[b.key] = { revenue: 0, paidOrders: 0 };
  }

  for (const order of paidOrders) {
    if (!order.paid_at) continue;
    const bKey = getBucketKey(order.paid_at, range.grouping);
    if (revenueBucketMap[bKey]) {
      revenueBucketMap[bKey].revenue += Number(order.amount) || 0;
      revenueBucketMap[bKey].paidOrders += 1;
    }
  }

  const revenueSeries: RevenueSeriesPoint[] = revenueBuckets.map((b) => ({
    label: b.label,
    dateKey: b.key,
    revenue: revenueBucketMap[b.key]?.revenue || 0,
    paidOrders: revenueBucketMap[b.key]?.paidOrders || 0,
  }));

  // ── Payment Status Breakdown ──
  const allPeriodOrders = periodOrders || [];
  const statusCounts: Record<OrderPaymentStatus, number> = {
    paid: 0,
    pending_verification: 0,
    pending_payment: 0,
    payment_rejected: 0,
    cancelled: 0,
    refunded: 0,
  };

  for (const order of allPeriodOrders) {
    const st = order.payment_status as OrderPaymentStatus;
    if (statusCounts[st] !== undefined) {
      statusCounts[st] += 1;
    }
  }

  const totalOrdersInPeriod = allPeriodOrders.length;
  const paymentMetrics: PaymentStatusMetrics = {
    ...statusCounts,
    totalOrdersInPeriod,
    conversionRate:
      totalOrdersInPeriod > 0
        ? Math.round((statusCounts.paid / totalOrdersInPeriod) * 1000) / 10
        : 0,
  };

  // ── Invitation Analytics ──
  const invBucketMap: Record<string, { created: number; published: number }> = {};
  for (const b of revenueBuckets) {
    invBucketMap[b.key] = { created: 0, published: 0 };
  }

  for (const inv of periodInvitations || []) {
    const bKey = getBucketKey(inv.created_at, range.grouping);
    if (invBucketMap[bKey]) {
      invBucketMap[bKey].created += 1;
    }
  }

  for (const pub of periodPublishedInvitations || []) {
    if (!pub.published_at) continue;
    const bKey = getBucketKey(pub.published_at, range.grouping);
    if (invBucketMap[bKey]) {
      invBucketMap[bKey].published += 1;
    }
  }

  const invitationSeries = revenueBuckets.map((b) => ({
    label: b.label,
    dateKey: b.key,
    created: invBucketMap[b.key]?.created || 0,
    published: invBucketMap[b.key]?.published || 0,
  }));

  // Mutually-exclusive current status snapshot (checking expires_at)
  const nowIso = new Date().toISOString();
  const lifetimeInvitations = lifetimeInvitationsRes.data || [];
  let draftCount = 0;
  let publishedCount = 0;
  let expiredCount = 0;
  let archivedCount = 0;

  for (const inv of lifetimeInvitations) {
    if (inv.status === "archived") {
      archivedCount++;
    } else if (inv.status === "draft") {
      draftCount++;
    } else if (inv.status === "expired" || (inv.expires_at && inv.expires_at < nowIso)) {
      expiredCount++;
    } else if (inv.status === "published") {
      publishedCount++;
    }
  }

  const invitationMetrics: InvitationAnalyticsMetrics = {
    series: invitationSeries,
    currentStatus: {
      draft: draftCount,
      published: publishedCount,
      expired: expiredCount,
      archived: archivedCount,
      total: lifetimeInvitations.length,
    },
    periodCreated: currentNewInvitations,
    periodPublished: currentPublishedInvitations,
  };

  // ── Customer Analytics ──
  const userBucketMap: Record<string, number> = {};
  for (const b of revenueBuckets) {
    userBucketMap[b.key] = 0;
  }

  for (const u of periodUsers || []) {
    const bKey = getBucketKey(u.created_at, range.grouping);
    if (userBucketMap[bKey] !== undefined) {
      userBucketMap[bKey] += 1;
    }
  }

  const customerSeries = revenueBuckets.map((b) => ({
    label: b.label,
    dateKey: b.key,
    count: userBucketMap[b.key] || 0,
  }));

  // Period repeat customers (clients with >1 paid order in period)
  const periodUserPaidMap: Record<string, number> = {};
  for (const o of paidOrders) {
    periodUserPaidMap[o.user_id] = (periodUserPaidMap[o.user_id] || 0) + 1;
  }
  const periodPaidCustomers = Object.keys(periodUserPaidMap).length;
  const periodRepeatCustomers = Object.values(periodUserPaidMap).filter((cnt) => cnt > 1).length;

  // Lifetime customer metrics
  const lifetimePaidOrders = lifetimePaidOrdersRes.data || [];
  const lifetimeUserPaidMap: Record<string, number> = {};
  for (const o of lifetimePaidOrders) {
    lifetimeUserPaidMap[o.user_id] = (lifetimeUserPaidMap[o.user_id] || 0) + 1;
  }
  const lifetimeTotalClients = lifetimeProfilesRes.data?.length || 0;
  const lifetimePaidClients = Object.keys(lifetimeUserPaidMap).length;
  const lifetimeRepeatClients = Object.values(lifetimeUserPaidMap).filter((cnt) => cnt > 1).length;

  const customerMetrics: CustomerAnalyticsMetrics = {
    series: customerSeries,
    periodNewUsers: currentNewUsers,
    periodPaidCustomers,
    periodRepeatCustomers,
    lifetimeTotalClients,
    lifetimePaidClients,
    lifetimeRepeatClients,
  };

  // ── Template Performance Report ──
  const templates = templatesRes.data || [];
  const templateMap: Record<string, TemplatePerformanceItem> = {};

  for (const t of templates) {
    templateMap[t.id] = {
      id: t.id,
      name: t.name,
      slug: t.slug,
      status: t.status || (t.is_active ? "active" : "archived"),
      thumbnail_url: t.thumbnail_url,
      invitationsCount: 0,
      paidOrdersCount: 0,
      revenue: 0,
      revenueShare: 0,
      conversionRate: 0,
    };
  }

  // Count invitations created with each template in period
  for (const inv of periodInvitations || []) {
    if (inv.template_id && templateMap[inv.template_id]) {
      templateMap[inv.template_id].invitationsCount += 1;
    }
  }

  // Aggregate paid orders and revenue from orders.amount in period
  for (const order of paidOrders) {
    if (order.template_id && templateMap[order.template_id]) {
      templateMap[order.template_id].paidOrdersCount += 1;
      templateMap[order.template_id].revenue += Number(order.amount) || 0;
    }
  }

  const templateList = Object.values(templateMap);
  for (const item of templateList) {
    item.revenueShare = currentRevenue > 0 ? item.revenue / currentRevenue : 0;
    item.conversionRate =
      item.invitationsCount > 0
        ? Math.round((item.paidOrdersCount / item.invitationsCount) * 1000) / 10
        : 0;
  }

  // Default rank by revenue descending
  templateList.sort((a, b) => b.revenue - a.revenue || b.paidOrdersCount - a.paidOrdersCount);

  return {
    range,
    summary,
    revenueSeries,
    paymentMetrics,
    invitationMetrics,
    customerMetrics,
    templatePerformance: templateList,
  };
}
