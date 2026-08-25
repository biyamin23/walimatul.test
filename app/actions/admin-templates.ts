"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { recordAdminAudit } from "@/lib/admin/audit";
import {
  createTemplateSchema,
  updateTemplateSchema,
  type CreateTemplateInput,
  type UpdateTemplateInput,
} from "@/lib/validation/template";
import { normalizeTemplateDesignConfig } from "@/lib/templates/template-design";

export interface AdminTemplateActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

/**
 * Verify caller is an authenticated Admin.
 */
async function requireAdminAuth(): Promise<{ userId: string } | null> {
  const supabase = await createClient();
  const { data: claimsData, error } = await supabase.auth.getClaims();
  if (error || !claimsData?.claims?.sub) {
    return null;
  }

  const userId = claimsData.claims.sub;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (!profile || profile.role !== "admin") {
    return null;
  }

  return { userId };
}

/**
 * Admin action to create a new template.
 */
export async function createTemplateAction(
  rawInput: CreateTemplateInput
): Promise<AdminTemplateActionResponse<{ id: string; slug: string }>> {
  const admin = await requireAdminAuth();
  if (!admin) {
    return {
      success: false,
      error: "Akses dinafikan: Hanya pentadbir boleh mencipta templat.",
    };
  }

  const parsed = createTemplateSchema.safeParse(rawInput);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [field, errors] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      if (errors && errors.length > 0) {
        fieldErrors[field] = errors;
      }
    }
    return {
      success: false,
      error: "Sila semak maklumat templat yang dimasukkan.",
      fieldErrors,
    };
  }

  const supabase = await createClient();

  // Check unique slug
  const { data: existing } = await supabase
    .from("templates")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      error: "Slug templat ini telah digunakan. Sila pilih slug yang lain.",
      fieldErrors: { slug: ["Slug telah digunakan."] },
    };
  }

  const normalizedDesignConfig = normalizeTemplateDesignConfig(
    parsed.data.design_config
  );

  const { data: template, error: insertError } = await supabase
    .from("templates")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      category: parsed.data.category || "General",
      component_key: parsed.data.component_key || "hybrid-editorial",
      price: parsed.data.price,
      validity_months: parsed.data.validity_months,
      status: parsed.data.status,
      is_active: parsed.data.status === "active",
      is_featured: parsed.data.is_featured,
      thumbnail_url: parsed.data.thumbnail_url || null,
      design_config: normalizedDesignConfig,
      updated_by: admin.userId,
    })
    .select("id, slug")
    .single();

  if (insertError || !template) {
    console.error("[WALIMATUL] createTemplateAction error:", insertError?.message);
    return {
      success: false,
      error: insertError?.message || "Gagal mencipta templat baharu.",
    };
  }

  // Persistent admin audit log
  await recordAdminAudit({
    adminId: admin.userId,
    action: "template.created",
    entityType: "template",
    entityId: template.id,
    afterData: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      status: parsed.data.status,
      price: parsed.data.price,
      validity_months: parsed.data.validity_months,
      component_key: parsed.data.component_key,
    },
    metadata: { name: parsed.data.name, slug: parsed.data.slug },
  });

  revalidatePath("/admin/templates");
  revalidatePath("/templates");

  return {
    success: true,
    data: { id: template.id, slug: template.slug },
  };
}

/**
 * Admin action to update an existing template.
 */
export async function updateTemplateAction(
  rawInput: UpdateTemplateInput
): Promise<AdminTemplateActionResponse<{ id: string; slug: string }>> {
  const admin = await requireAdminAuth();
  if (!admin) {
    return {
      success: false,
      error: "Akses dinafikan: Hanya pentadbir boleh mengemaskini templat.",
    };
  }

  const parsed = updateTemplateSchema.safeParse(rawInput);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [field, errors] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      if (errors && errors.length > 0) {
        fieldErrors[field] = errors;
      }
    }
    return {
      success: false,
      error: "Sila semak maklumat templat yang dimasukkan.",
      fieldErrors,
    };
  }

  const supabase = await createClient();

  // Check unique slug against other templates
  const { data: existing } = await supabase
    .from("templates")
    .select("id")
    .eq("slug", parsed.data.slug)
    .neq("id", parsed.data.id)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      error: "Slug templat ini telah digunakan oleh templat lain.",
      fieldErrors: { slug: ["Slug telah digunakan."] },
    };
  }

  const normalizedDesignConfig = normalizeTemplateDesignConfig(
    parsed.data.design_config
  );

  const { error: updateError } = await supabase
    .from("templates")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.description || null,
      category: parsed.data.category || "General",
      component_key: parsed.data.component_key || "hybrid-editorial",
      price: parsed.data.price,
      validity_months: parsed.data.validity_months,
      status: parsed.data.status,
      is_active: parsed.data.status === "active",
      is_featured: parsed.data.is_featured,
      thumbnail_url: parsed.data.thumbnail_url || null,
      design_config: normalizedDesignConfig,
      updated_by: admin.userId,
    })
    .eq("id", parsed.data.id);

  if (updateError) {
    console.error("[WALIMATUL] updateTemplateAction error:", updateError.message);
    return {
      success: false,
      error: updateError.message || "Gagal mengemaskini templat.",
    };
  }

  // Persistent admin audit log
  await recordAdminAudit({
    adminId: admin.userId,
    action: "template.updated",
    entityType: "template",
    entityId: parsed.data.id,
    afterData: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      status: parsed.data.status,
      price: parsed.data.price,
      validity_months: parsed.data.validity_months,
      component_key: parsed.data.component_key,
    },
    metadata: { name: parsed.data.name, slug: parsed.data.slug },
  });

  revalidatePath("/admin/templates");
  revalidatePath(`/admin/templates/${parsed.data.id}/edit`);
  revalidatePath(`/admin/templates/${parsed.data.id}/preview`);
  revalidatePath("/templates");
  revalidatePath(`/templates/${parsed.data.slug}/preview`);

  return {
    success: true,
    data: { id: parsed.data.id, slug: parsed.data.slug },
  };
}

/**
 * Admin action to toggle status (activate / draft / archive).
 */
export async function setTemplateStatusAction(
  id: string,
  newStatus: "draft" | "active" | "archived"
): Promise<AdminTemplateActionResponse> {
  const admin = await requireAdminAuth();
  if (!admin) {
    return {
      success: false,
      error: "Akses dinafikan: Hanya pentadbir boleh menukar status templat.",
    };
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("templates")
    .update({
      status: newStatus,
      is_active: newStatus === "active",
      updated_by: admin.userId,
    })
    .eq("id", id);

  if (error) {
    console.error("[WALIMATUL] setTemplateStatusAction error:", error.message);
    return {
      success: false,
      error: "Gagal menukar status templat.",
    };
  }

  // Persistent admin audit log
  await recordAdminAudit({
    adminId: admin.userId,
    action: newStatus === "archived" ? "template.archived" : "template.updated",
    entityType: "template",
    entityId: id,
    afterData: { status: newStatus },
    metadata: { new_status: newStatus },
  });

  revalidatePath("/admin/templates");
  revalidatePath(`/admin/templates/${id}/edit`);
  revalidatePath("/templates");

  return { success: true };
}

/**
 * Admin action for safe template deletion.
 * Rejects if referenced by invitations or orders.
 */
export async function deleteTemplateAction(
  id: string
): Promise<AdminTemplateActionResponse> {
  const admin = await requireAdminAuth();
  if (!admin) {
    return {
      success: false,
      error: "Akses dinafikan: Hanya pentadbir boleh memadam templat.",
    };
  }

  const supabase = await createClient();

  // 1. Check invitation references
  const { count: invCount } = await supabase
    .from("invitations")
    .select("*", { count: "exact", head: true })
    .eq("template_id", id);

  if (invCount && invCount > 0) {
    return {
      success: false,
      error: `Templat ini sedang digunakan oleh ${invCount} jemputan sedia ada dan tidak boleh dipadam. Sila gunakan fungsi 'Arkib' (Archive) sebagai ganti.`,
    };
  }

  // 2. Check order references
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("template_id", id);

  if (orderCount && orderCount > 0) {
    return {
      success: false,
      error: `Templat ini mempunyai rekod pesanan sejarah (${orderCount} pesanan) dan tidak boleh dipadam demi integriti kewangan. Sila gunakan fungsi 'Arkib'.`,
    };
  }

  // 3. Delete template
  const { error: delError } = await supabase
    .from("templates")
    .delete()
    .eq("id", id);

  if (delError) {
    console.error("[WALIMATUL] deleteTemplateAction error:", delError.message);
    return {
      success: false,
      error: "Gagal memadam templat.",
    };
  }

  revalidatePath("/admin/templates");
  revalidatePath("/templates");

  return { success: true };
}
