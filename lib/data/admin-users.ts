import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Profile, Invitation, Order, Template } from "@/types/database";

export interface AdminUserListItem {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  invitationCount: number;
  paidOrderCount: number;
  lifetimeSpend: number;
  latestActivity: string | null;
}

export interface AdminUsersPageResult {
  users: AdminUserListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminUserDetailInvitation extends Invitation {
  template: Pick<Template, "id" | "name" | "slug">;
}

export interface AdminUserDetailOrder extends Order {
  template: Pick<Template, "id" | "name" | "slug">;
  invitation: Pick<Invitation, "id" | "groom_name" | "groom_short_name" | "bride_name" | "bride_short_name" | "slug" | "status">;
}

export interface AdminUserDetail {
  profile: Profile;
  metrics: {
    invitationCount: number;
    paidOrderCount: number;
    lifetimeSpend: number;
  };
  invitations: AdminUserDetailInvitation[];
  orders: AdminUserDetailOrder[];
}

/**
 * Fetch paginated clients for /admin/users list.
 * Excludes admin role from customer list.
 * Uses sequential queries to prevent N+1 and avoid fragile joins.
 */
export async function getAdminUsersPage(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<AdminUsersPageResult> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(params.pageSize || 20, 100));
  const search = params.search?.trim() || "";

  // 1. Auth & claims check
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error("[AdminUsers] Unauthenticated claims.");
    return { users: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
  }

  // 2. Fetch profiles (excluding admin accounts)
  let query = supabase
    .from("profiles")
    .select("id, full_name, phone, avatar_url, role, created_at, updated_at", { count: "exact" })
    .neq("role", "admin");

  if (search) {
    // Search by full_name or phone
    query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: profiles, error: profError, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (profError) {
    console.error("[AdminUsers] Query profiles error:", profError.message);
    return { users: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (!profiles || profiles.length === 0) {
    return { users: [], totalCount, page, pageSize, totalPages };
  }

  const userIds = profiles.map((p) => p.id);

  // 3. Batch fetch invitations for these user IDs
  const { data: userInvs, error: invsError } = await supabase
    .from("invitations")
    .select("id, user_id, status, created_at, updated_at")
    .in("user_id", userIds);

  if (invsError) {
    console.error("[AdminUsers] Query user invitations error:", invsError.message);
  }

  // 4. Batch fetch orders for these user IDs
  const { data: userOrders, error: ordersError } = await supabase
    .from("orders")
    .select("id, user_id, amount, payment_status, created_at, updated_at")
    .in("user_id", userIds);

  if (ordersError) {
    console.error("[AdminUsers] Query user orders error:", ordersError.message);
  }

  // 5. Aggregate metrics in-memory per user
  const invsByUser = new Map<string, Array<{ created_at: string; updated_at: string }>>();
  for (const inv of userInvs || []) {
    const list = invsByUser.get(inv.user_id) || [];
    list.push(inv);
    invsByUser.set(inv.user_id, list);
  }

  const ordersByUser = new Map<string, Array<{ amount: number; payment_status: string; created_at: string; updated_at: string }>>();
  for (const o of userOrders || []) {
    const list = ordersByUser.get(o.user_id) || [];
    list.push({
      amount: typeof o.amount === "number" ? o.amount : Number(o.amount ?? 0),
      payment_status: o.payment_status,
      created_at: o.created_at,
      updated_at: o.updated_at,
    });
    ordersByUser.set(o.user_id, list);
  }

  const users: AdminUserListItem[] = profiles.map((p) => {
    const invs = invsByUser.get(p.id) || [];
    const orders = ordersByUser.get(p.id) || [];

    const invitationCount = invs.length;
    let paidOrderCount = 0;
    let lifetimeSpend = 0;

    for (const o of orders) {
      if (o.payment_status === "paid") {
        paidOrderCount++;
        lifetimeSpend += o.amount;
      }
    }

    // Find latest activity timestamp from profile, invitations, or orders
    const timestamps = [
      p.created_at,
      p.updated_at,
      ...invs.map((i) => i.updated_at || i.created_at),
      ...orders.map((o) => o.updated_at || o.created_at),
    ].filter(Boolean);

    timestamps.sort((a, b) => b.localeCompare(a));
    const latestActivity = timestamps[0] || p.created_at;

    return {
      id: p.id,
      full_name: p.full_name,
      phone: p.phone,
      avatar_url: p.avatar_url,
      role: p.role,
      created_at: p.created_at,
      invitationCount,
      paidOrderCount,
      lifetimeSpend,
      latestActivity,
    };
  });

  return {
    users,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Fetch complete details for a single client in /admin/users/[id].
 */
export async function getAdminUserDetail(
  userId: string
): Promise<AdminUserDetail | null> {
  const supabase = await createClient();

  // 1. Auth check
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) {
    console.error("[AdminUserDetail] Unauthenticated claims.");
    return null;
  }

  // 2. Fetch Profile
  const { data: profile, error: profError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profError || !profile) {
    console.error("[AdminUserDetail] Profile not found:", profError?.message);
    return null;
  }

  // 3. Fetch Invitations and Orders in parallel
  const [invsResult, ordersResult] = await Promise.all([
    supabase
      .from("invitations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
  ]);

  const rawInvs: Invitation[] = invsResult.data || [];
  const rawOrders: Order[] = ordersResult.data || [];

  // 4. Collect Template IDs & Invitation IDs for relation mapping
  const templateIds = [
    ...new Set([
      ...rawInvs.map((i) => i.template_id),
      ...rawOrders.map((o) => o.template_id),
    ].filter(Boolean)),
  ];

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

  const invitationMap = new Map<
    string,
    Pick<Invitation, "id" | "groom_name" | "groom_short_name" | "bride_name" | "bride_short_name" | "slug" | "status">
  >();
  for (const inv of rawInvs) {
    invitationMap.set(inv.id, {
      id: inv.id,
      groom_name: inv.groom_name,
      groom_short_name: inv.groom_short_name,
      bride_name: inv.bride_name,
      bride_short_name: inv.bride_short_name,
      slug: inv.slug,
      status: inv.status,
    });
  }

  // 5. Build enriched invitations
  const enrichedInvitations: AdminUserDetailInvitation[] = rawInvs.map((inv) => ({
    ...inv,
    template: templateMap.get(inv.template_id) || {
      id: inv.template_id,
      name: "Templat",
      slug: "template",
    },
  }));

  // 6. Build enriched orders & calculate metrics
  let paidOrderCount = 0;
  let lifetimeSpend = 0;

  const enrichedOrders: AdminUserDetailOrder[] = rawOrders.map((ord) => {
    const amount = typeof ord.amount === "number" ? ord.amount : Number(ord.amount ?? 0);
    if (ord.payment_status === "paid") {
      paidOrderCount++;
      lifetimeSpend += amount;
    }

    return {
      ...ord,
      amount,
      template: templateMap.get(ord.template_id) || {
        id: ord.template_id,
        name: "Templat",
        slug: "template",
      },
      invitation: invitationMap.get(ord.invitation_id) || {
        id: ord.invitation_id,
        groom_name: "Pengantin",
        groom_short_name: null,
        bride_name: "Pengantin",
        bride_short_name: null,
        slug: null,
        status: "draft",
      },
    };
  });

  return {
    profile,
    metrics: {
      invitationCount: rawInvs.length,
      paidOrderCount,
      lifetimeSpend,
    },
    invitations: enrichedInvitations,
    orders: enrichedOrders,
  };
}
