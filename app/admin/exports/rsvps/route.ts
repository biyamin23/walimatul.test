import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { createClient } from "@/lib/supabase/server";
import { parseReportRange } from "@/lib/data/admin-reports";
import { generateCsvString } from "@/lib/admin/csv";
import { recordAdminAudit } from "@/lib/admin/audit";

export async function GET(request: Request) {
  let admin;
  try {
    admin = await requireAdmin();
  } catch {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const range = parseReportRange(
    searchParams.get("range") || undefined,
    searchParams.get("from") || undefined,
    searchParams.get("to") || undefined
  );

  const supabase = await createClient();
  const startIso = range.startDate.toISOString();
  const endIso = range.endDate.toISOString();

  // 1. Fetch invitations within range (or all)
  let invQuery = supabase
    .from("invitations")
    .select("id, groom_name, bride_name, slug, created_at")
    .order("created_at", { ascending: false })
    .limit(10000);

  if (range.preset !== "all") {
    invQuery = invQuery.gte("created_at", startIso).lte("created_at", endIso);
  }

  const { data: invitations, error: invError } = await invQuery;

  if (invError || !invitations) {
    return new NextResponse("Gagal memuat turun data ringkasan RSVP", { status: 500 });
  }

  const invIds = invitations.map((i) => i.id);

  // 2. Fetch RSVPs and Wishes aggregate metrics for these invitations
  const [rsvpsRes, wishesRes] = await Promise.all([
    invIds.length > 0
      ? supabase.from("rsvps").select("id, invitation_id, attendance, pax").in("invitation_id", invIds)
      : { data: [] },
    invIds.length > 0
      ? supabase.from("invitation_wishes").select("id, invitation_id, is_approved").in("invitation_id", invIds)
      : { data: [] },
  ]);

  const rsvpStatsMap: Record<
    string,
    { total: number; attending: number; notAttending: number; totalPax: number }
  > = {};

  for (const r of rsvpsRes.data || []) {
    if (!rsvpStatsMap[r.invitation_id]) {
      rsvpStatsMap[r.invitation_id] = { total: 0, attending: 0, notAttending: 0, totalPax: 0 };
    }
    rsvpStatsMap[r.invitation_id].total += 1;
    if (r.attendance === "attending") {
      rsvpStatsMap[r.invitation_id].attending += 1;
      rsvpStatsMap[r.invitation_id].totalPax += Number(r.pax) || 1;
    } else {
      rsvpStatsMap[r.invitation_id].notAttending += 1;
    }
  }

  const wishesCountMap: Record<string, number> = {};
  for (const w of wishesRes.data || []) {
    if (w.is_approved) {
      wishesCountMap[w.invitation_id] = (wishesCountMap[w.invitation_id] || 0) + 1;
    }
  }

  const headers = [
    "invitation_id",
    "couple",
    "slug",
    "total_responses",
    "attending",
    "not_attending",
    "total_pax",
    "public_wishes_count",
  ];

  const rows = invitations.map((inv) => {
    const groom = inv.groom_name?.trim() || "";
    const bride = inv.bride_name?.trim() || "";
    const couple = groom && bride ? `${groom} & ${bride}` : groom || bride || "Pengantin";
    const st = rsvpStatsMap[inv.id] || { total: 0, attending: 0, notAttending: 0, totalPax: 0 };

    return [
      inv.id,
      couple,
      inv.slug || "",
      st.total,
      st.attending,
      st.notAttending,
      st.totalPax,
      wishesCountMap[inv.id] || 0,
    ];
  });

  const csv = generateCsvString(headers, rows);
  const filename = `walimatul-rsvp-summary-${range.fromStr}-to-${range.toStr}.csv`;

  await recordAdminAudit({
    adminId: admin.userId,
    action: "export.rsvp_summary",
    entityType: "report",
    entityId: "rsvp_summary",
    metadata: {
      range: range.preset,
      from: range.fromStr,
      to: range.toStr,
      rowCount: invitations.length,
    },
  });

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
