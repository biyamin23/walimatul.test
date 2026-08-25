import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/types/database";

export interface AdminAnnouncementListItem extends Announcement {
  creatorName?: string | null;
}

export interface AdminAnnouncementsPageResult {
  announcements: AdminAnnouncementListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetch paginated announcements for admin listing.
 */
export async function getAdminAnnouncementsPage(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}): Promise<AdminAnnouncementsPageResult> {
  const supabase = await createClient();
  const page = Math.max(1, params.page || 1);
  const pageSize = Math.max(1, Math.min(params.pageSize || 20, 100));
  const search = params.search?.trim() || "";
  const status = params.status || "all";

  let query = supabase
    .from("announcements")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(`title.ilike.%${search}%,message.ilike.%${search}%`);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data: rawAnnouncements, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error || !rawAnnouncements) {
    console.error("[AdminAnnouncements] Query error:", error?.message);
    return { announcements: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }

  const totalCount = count ?? 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Batch resolve creator names
  const creatorIds = [...new Set(rawAnnouncements.map((a) => a.created_by).filter(Boolean))];
  const profileMap = new Map<string, string>();
  if (creatorIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", creatorIds);

    for (const p of profiles || []) {
      if (p.full_name) profileMap.set(p.id, p.full_name);
    }
  }

  const announcements: AdminAnnouncementListItem[] = rawAnnouncements.map((a) => ({
    ...a,
    creatorName: a.created_by ? profileMap.get(a.created_by) || "Admin" : "Sistem",
  }));

  return {
    announcements,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Fetch a single announcement by ID for editing.
 */
export async function getAdminAnnouncementById(
  id: string
): Promise<Announcement | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("[AdminAnnouncements] getAdminAnnouncementById error:", error?.message);
    return null;
  }

  return data as Announcement;
}

/**
 * Fetch the currently active client-facing announcement for the /dashboard banner.
 * Validates schedule: status = 'active' AND (starts_at <= now) AND (ends_at > now).
 */
export async function getActiveClientAnnouncement(): Promise<Announcement | null> {
  const supabase = await createClient();
  const nowISO = new Date().toISOString();

  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("status", "active")
    .eq("audience", "clients")
    .or(`starts_at.is.null,starts_at.lte.${nowISO}`)
    .or(`ends_at.is.null,ends_at.gt.${nowISO}`)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    if (error) {
      console.error("[ClientAnnouncement] Error fetching active announcement:", error.message);
    }
    return null;
  }

  return data as Announcement;
}
