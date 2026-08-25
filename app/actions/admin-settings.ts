"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { recordAdminAudit } from "@/lib/admin/audit";
import { getAdminPlatformSettings } from "@/lib/data/admin-settings";

export interface SettingsActionResponse {
  success: boolean;
  error?: string;
}

const updateSupportSchema = z.object({
  phone: z.string().min(8, "Nombor telefon WhatsApp tidak sah").max(20),
  display: z.string().min(8, "Format paparan nombor tidak sah").max(25),
});

const updateInvitationsSchema = z.object({
  validityMonths: z.coerce.number().int().min(1, "Minimum 1 bulan").max(36, "Maksimum 36 bulan"),
});

const updateGallerySchema = z.object({
  maxPhotos: z.coerce.number().int().min(1, "Minimum 1 keping").max(50, "Maksimum 50 keping"),
});

const updatePaymentSchema = z.object({
  instructionsText: z.string().min(5, "Arahan pembayaran terlalu pendek").max(500, "Maksimum 500 aksara"),
});

const updateMaintenanceSchema = z.object({
  enabled: z.boolean(),
  text: z.string().max(300, "Maksimum 300 aksara").optional(),
});

export async function updateSupportSettingsAction(
  input: z.infer<typeof updateSupportSchema>
): Promise<SettingsActionResponse> {
  try {
    const user = await requireAdmin();
    const parsed = updateSupportSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak sah." };
    }

    const current = await getAdminPlatformSettings();
    const supabase = await createClient();

    const newValue = {
      phone: parsed.data.phone.replace(/[^0-9]/g, ""),
      display: parsed.data.display.trim(),
    };

    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        key: "support_whatsapp",
        value: newValue,
        updated_by: user.userId,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    await recordAdminAudit({
      adminId: user.userId,
      action: "settings.updated",
      entityType: "settings",
      entityId: "support_whatsapp",
      beforeData: current.support_whatsapp,
      afterData: newValue,
      metadata: { section: "support" },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ralat tidak dijangka.";
    return { success: false, error: msg };
  }
}

export async function updateInvitationSettingsAction(
  input: z.infer<typeof updateInvitationsSchema>
): Promise<SettingsActionResponse> {
  try {
    const user = await requireAdmin();
    const parsed = updateInvitationsSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak sah." };
    }

    const current = await getAdminPlatformSettings();
    const supabase = await createClient();

    const newValue = parsed.data.validityMonths;

    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        key: "default_invitation_validity_months",
        value: newValue,
        updated_by: user.userId,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    await recordAdminAudit({
      adminId: user.userId,
      action: "settings.updated",
      entityType: "settings",
      entityId: "default_invitation_validity_months",
      beforeData: { validity_months: current.default_invitation_validity_months },
      afterData: { validity_months: newValue },
      metadata: { section: "invitations" },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ralat tidak dijangka.";
    return { success: false, error: msg };
  }
}

export async function updateGallerySettingsAction(
  input: z.infer<typeof updateGallerySchema>
): Promise<SettingsActionResponse> {
  try {
    const user = await requireAdmin();
    const parsed = updateGallerySchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak sah." };
    }

    const current = await getAdminPlatformSettings();
    const supabase = await createClient();

    const newValue = parsed.data.maxPhotos;

    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        key: "max_gallery_photos",
        value: newValue,
        updated_by: user.userId,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    await recordAdminAudit({
      adminId: user.userId,
      action: "settings.updated",
      entityType: "settings",
      entityId: "max_gallery_photos",
      beforeData: { max_photos: current.max_gallery_photos },
      afterData: { max_photos: newValue },
      metadata: { section: "gallery" },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ralat tidak dijangka.";
    return { success: false, error: msg };
  }
}

export async function updatePaymentSettingsAction(
  input: z.infer<typeof updatePaymentSchema>
): Promise<SettingsActionResponse> {
  try {
    const user = await requireAdmin();
    const parsed = updatePaymentSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak sah." };
    }

    const current = await getAdminPlatformSettings();
    const supabase = await createClient();

    const newValue = { text: parsed.data.instructionsText.trim() };

    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        key: "manual_payment_instructions",
        value: newValue,
        updated_by: user.userId,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    await recordAdminAudit({
      adminId: user.userId,
      action: "settings.updated",
      entityType: "settings",
      entityId: "manual_payment_instructions",
      beforeData: current.manual_payment_instructions,
      afterData: newValue,
      metadata: { section: "payment" },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ralat tidak dijangka.";
    return { success: false, error: msg };
  }
}

export async function updateMaintenanceSettingsAction(
  input: z.infer<typeof updateMaintenanceSchema>
): Promise<SettingsActionResponse> {
  try {
    const user = await requireAdmin();
    const parsed = updateMaintenanceSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Input tidak sah." };
    }

    const current = await getAdminPlatformSettings();
    const supabase = await createClient();

    const newValue = {
      enabled: parsed.data.enabled,
      text: (parsed.data.text || "").trim(),
    };

    const { error } = await supabase
      .from("platform_settings")
      .upsert({
        key: "maintenance_notice",
        value: newValue,
        updated_by: user.userId,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, error: error.message };
    }

    await recordAdminAudit({
      adminId: user.userId,
      action: "settings.updated",
      entityType: "settings",
      entityId: "maintenance_notice",
      beforeData: current.maintenance_notice,
      afterData: newValue,
      metadata: { section: "maintenance" },
    });

    revalidatePath("/admin/settings");
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Ralat tidak dijangka.";
    return { success: false, error: msg };
  }
}
