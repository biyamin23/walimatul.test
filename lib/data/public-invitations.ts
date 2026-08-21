import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { isReservedSlug } from "@/lib/constants/reserved-slugs";
import { mapInvitationToTemplateData } from "@/lib/templates/map-invitation";
import type { InvitationTemplateData, GuestWish } from "@/templates/types";
import type { Invitation, Template } from "@/types/database";

export interface PublishedInvitationResult {
  invitation: Invitation;
  templateData: InvitationTemplateData;
  template: Pick<Template, "id" | "name" | "slug" | "component_key"> & {
    design_config?: Record<string, unknown>;
  };
}

/**
 * Fetch a published, non-expired invitation by its unique slug.
 *
 * Rules:
 * - Read-only public query (guest safe).
 * - Only matches status = 'published' AND non-expired.
 * - Reserved slugs and invalid slug formats are rejected immediately.
 * - Memoized per-request using React cache() to share between generateMetadata and Page.
 * - Never returns draft, archived, or expired data.
 */
export const getPublishedInvitationBySlug = cache(
  async (rawSlug: string): Promise<PublishedInvitationResult | null> => {
    const slug = rawSlug.trim().toLowerCase();

    // 1. Rejection checks
    if (!slug || isReservedSlug(slug)) {
      return null;
    }

    // Slug format guard (alphanumeric + single hyphens, min 3, max 60)
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length < 3 || slug.length > 60) {
      return null;
    }

    const supabase = await createClient();

    // 2. Query published invitation with template and gallery
    const { data, error } = await supabase
      .from("invitations")
      .select(`
        *,
        template:templates (
          id,
          name,
          slug,
          component_key,
          is_active,
          design_config
        ),
        gallery:invitation_gallery (
          id,
          storage_path,
          sort_order
        )
      `)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error(`[WALIMATUL] Public invitation lookup error for slug "${slug}":`, error.message);
      }
      return null;
    }

    // 3. Expiry verification
    if (data.expires_at && new Date(data.expires_at) <= new Date()) {
      return null;
    }

    // 4. Template validation
    // Supabase can return joined relation as object or single-item array
    const templateRaw = Array.isArray(data.template) ? data.template[0] : data.template;
    if (!templateRaw || !templateRaw.is_active) {
      return null;
    }

    const galleryRaw = Array.isArray(data.gallery) ? data.gallery : [];

    // 5. Fetch approved guest wishes if enabled (Strict Privacy: only id, guest_name, message, created_at)
    let guestWishes: GuestWish[] = [];
    if (data.guest_wishes_enabled) {
      const { data: wishesData, error: wishesError } = await supabase
        .from("rsvps")
        .select("id, guest_name, message, created_at")
        .eq("invitation_id", data.id)
        .eq("show_on_invitation", true)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!wishesError && wishesData) {
        guestWishes = wishesData
          .filter((w) => Boolean(w.message && w.message.trim()))
          .map((w) => ({
            id: w.id,
            guestName: w.guest_name ? w.guest_name.trim() : "Tetamu",
            message: w.message!.trim(),
            createdAt: w.created_at,
          }));
      } else if (wishesError) {
        console.error(`[WALIMATUL] Public guest wishes lookup error for invitation "${data.id}":`, wishesError.message);
      }
    }

    const templateData = mapInvitationToTemplateData(data, galleryRaw, guestWishes);

    return {
      invitation: data,
      templateData,
      template: {
        id: templateRaw.id,
        name: templateRaw.name,
        slug: templateRaw.slug,
        component_key: templateRaw.component_key,
        design_config: templateRaw.design_config,
      },
    };
  }
);
