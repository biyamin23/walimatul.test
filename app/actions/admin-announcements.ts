"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { recordAdminAudit } from "@/lib/admin/audit";
import { getAdminAnnouncementById } from "@/lib/data/admin-announcements";

export interface AnnouncementActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

const announcementSchema = z
  .object({
    title: z.string().min(3, "Tajuk pengumuman sekurang-kurangnya 3 aksara").max(100, "Maksimum 100 aksara"),
    message: z.string().min(5, "Mesej pengumuman sekurang-kurangnya 5 aksara").max(1000, "Maksimum 1000 aksara"),
    status: z.enum(["draft", "active", "archived"]),
    startsAt: z.string().nullable().optional(),
    endsAt: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.startsAt && data.endsAt) {
        return new Date(data.endsAt) > new Date(data.startsAt);
      }
      return true;
    },
    {
      message: "Tarikh tamat mesti selepas tarikh mula.",
      path: ["endsAt"],
    }
  );

export type AnnouncementInput = z.infer<typeof announcementSchema>;

/**
 * Create a new announcement.
 */
export async function createAnnouncementAction(
  input: AnnouncementInput
): Promise<AnnouncementActionResponse<{ id: string }>> {
  try {
    const user = await requireAdmin();
    const parsed = announcementSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak sah.", fieldErrors };
    }

    const supabase = await createClient();

    const newRecord = {
      title: parsed.data.title.trim(),
      message: parsed.data.message.trim(),
      status: parsed.data.status,
      audience: "clients" as const,
      starts_at: parsed.data.startsAt ? new Date(parsed.data.startsAt).toISOString() : null,
      ends_at: parsed.data.endsAt ? new Date(parsed.data.endsAt).toISOString() : null,
      created_by: user.userId,
      updated_by: user.userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("announcements")
      .insert(newRecord)
      .select("id")
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Gagal mencipta pengumuman." };
    }

    await recordAdminAudit({
      adminId: user.userId,
      action: "announcement.created",
      entityType: "announcement",
      entityId: data.id,
      afterData: newRecord,
      metadata: { status: parsed.data.status },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/dashboard");

    return { success: true, data: { id: data.id } };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ralat tidak dijangka.";
    return { success: false, error: msg };
  }
}

/**
 * Update an existing announcement.
 */
export async function updateAnnouncementAction(
  id: string,
  input: AnnouncementInput
): Promise<AnnouncementActionResponse<{ id: string }>> {
  try {
    const user = await requireAdmin();
    const parsed = announcementSchema.safeParse(input);
    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak sah.", fieldErrors };
    }

    const current = await getAdminAnnouncementById(id);
    if (!current) {
      return { success: false, error: "Pengumuman tidak dijumpai." };
    }

    const supabase = await createClient();

    const updatedData = {
      title: parsed.data.title.trim(),
      message: parsed.data.message.trim(),
      status: parsed.data.status,
      starts_at: parsed.data.startsAt ? new Date(parsed.data.startsAt).toISOString() : null,
      ends_at: parsed.data.endsAt ? new Date(parsed.data.endsAt).toISOString() : null,
      updated_by: user.userId,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("announcements")
      .update(updatedData)
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    await recordAdminAudit({
      adminId: user.userId,
      action: "announcement.updated",
      entityType: "announcement",
      entityId: id,
      beforeData: {
        title: current.title,
        status: current.status,
        starts_at: current.starts_at,
        ends_at: current.ends_at,
      },
      afterData: updatedData,
    });

    revalidatePath("/admin/announcements");
    revalidatePath(`/admin/announcements/${id}/edit`);
    revalidatePath("/dashboard");

    return { success: true, data: { id } };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ralat tidak dijangka.";
    return { success: false, error: msg };
  }
}

/**
 * Archive an announcement.
 */
export async function archiveAnnouncementAction(
  id: string
): Promise<AnnouncementActionResponse> {
  try {
    const user = await requireAdmin();
    const current = await getAdminAnnouncementById(id);
    if (!current) {
      return { success: false, error: "Pengumuman tidak dijumpai." };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("announcements")
      .update({
        status: "archived",
        updated_by: user.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    await recordAdminAudit({
      adminId: user.userId,
      action: "announcement.archived",
      entityType: "announcement",
      entityId: id,
      beforeData: { status: current.status },
      afterData: { status: "archived" },
    });

    revalidatePath("/admin/announcements");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ralat tidak dijangka.";
    return { success: false, error: msg };
  }
}
