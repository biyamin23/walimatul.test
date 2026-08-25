"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/permissions";
import { recordAdminAudit } from "@/lib/admin/audit";

export interface ExtendExpiryResponse {
  success: boolean;
  newExpiresAt?: string;
  error?: string;
}

/**
 * Server action to extend an invitation's expiration date.
 * Restricted strictly to authenticated Admins.
 */
export async function extendInvitationExpiryAction(payload: {
  invitationId: string;
  extensionMonths?: number;
  customDate?: string;
}): Promise<ExtendExpiryResponse> {
  try {
    // 1. Enforce admin auth guard
    const user = await requireAdmin();

    const { invitationId, extensionMonths, customDate } = payload;
    if (!invitationId) {
      return { success: false, error: "ID Jemputan diperlukan." };
    }

    const supabase = await createClient();

    // 2. Fetch current invitation to determine base expiration
    const { data: invitation, error: fetchError } = await supabase
      .from("invitations")
      .select("id, status, expires_at, published_at, title, slug")
      .eq("id", invitationId)
      .single();

    if (fetchError || !invitation) {
      return { success: false, error: "Jemputan tidak dijumpai." };
    }

    if (!invitation.published_at || invitation.status === "draft") {
      return {
        success: false,
        error: "Jemputan draf atau belum diterbitkan tidak boleh dilanjutkan tempoh sah.",
      };
    }

    // 3. Calculate new expiration date
    let newExpiresDate: Date;

    if (customDate) {
      const parsed = new Date(customDate);
      if (isNaN(parsed.getTime())) {
        return { success: false, error: "Tarikh tersuai tidak sah." };
      }
      newExpiresDate = parsed;
    } else if (extensionMonths && [1, 3, 6, 12].includes(extensionMonths)) {
      // Calculate from existing expires_at if set, otherwise from now
      const baseDate = invitation.expires_at ? new Date(invitation.expires_at) : new Date();
      newExpiresDate = new Date(baseDate);
      newExpiresDate.setMonth(newExpiresDate.getMonth() + extensionMonths);
    } else {
      return { success: false, error: "Pilihan lanjutan tidak sah." };
    }

    // Validation: New expiry must be strictly later than current expiry (or now if no expiry)
    const currentExpiryDate = invitation.expires_at ? new Date(invitation.expires_at) : new Date();
    if (newExpiresDate.getTime() <= currentExpiryDate.getTime()) {
      return {
        success: false,
        error: "Tarikh luput baharu mesti selepas tarikh luput semasa.",
      };
    }

    const newExpiresISO = newExpiresDate.toISOString();

    // 4. Call database RPC
    const { error: rpcError } = await supabase.rpc(
      "admin_extend_invitation_expiry",
      {
        p_invitation_id: invitationId,
        p_new_expires_at: newExpiresISO,
      }
    );

    if (rpcError) {
      console.error("[AdminAudit] admin_extend_invitation_expiry RPC failed:", rpcError.message);
      return {
        success: false,
        error: rpcError.message || "Gagal melanjutkan tarikh luput.",
      };
    }

    // 5. Persistent admin audit log
    await recordAdminAudit({
      adminId: user.userId,
      action: "invitation.expiry_extended",
      entityType: "invitation",
      entityId: invitationId,
      beforeData: {
        expires_at: invitation.expires_at,
        status: invitation.status,
      },
      afterData: {
        expires_at: newExpiresISO,
        status: invitation.status === "expired" ? "published" : invitation.status,
      },
      metadata: {
        extension_months: extensionMonths || null,
        title: invitation.title,
        slug: invitation.slug,
      },
    });

    // 6. Revalidate cache
    revalidatePath(`/admin/invitations/${invitationId}`);
    revalidatePath("/admin/invitations");
    revalidatePath("/admin");

    return {
      success: true,
      newExpiresAt: newExpiresISO,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Ralat pelayan tidak dijangka.";
    console.error("[AdminAudit] extendInvitationExpiryAction error:", message);
    return { success: false, error: message };
  }
}
