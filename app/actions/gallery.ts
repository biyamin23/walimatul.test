"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const MAX_GALLERY_PHOTOS = 12;

async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) {
    return null;
  }
  return data.claims.sub;
}

/**
 * Add a new photo to the invitation's gallery.
 * Enforces:
 * - Ownership via invitations.user_id = auth.uid()
 * - Hard limit: 12 photos maximum per invitation
 */
export async function addGalleryPhotoAction(
  invitationId: string,
  storagePath: string
): Promise<ActionResponse<{ id: string; sortOrder: number; storagePath: string }>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: "Sila log masuk untuk memuat naik gambar." };
  }

  const supabase = await createClient();

  // 1. Verify ownership of the parent invitation
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("id")
    .eq("id", invitationId)
    .eq("user_id", userId)
    .single();

  if (invError || !invitation) {
    return { success: false, error: "Jemputan tidak dijumpai atau tiada akses." };
  }

  // 2. Count existing photos to enforce 12 limit
  const { data: existingPhotos, error: countError } = await supabase
    .from("invitation_gallery")
    .select("id, sort_order")
    .eq("invitation_id", invitationId)
    .order("sort_order", { ascending: true });

  if (countError) {
    return { success: false, error: "Gagal menyemak bilangan gambar galeri." };
  }

  if (existingPhotos && existingPhotos.length >= MAX_GALLERY_PHOTOS) {
    return {
      success: false,
      error: `Had maksimum ${MAX_GALLERY_PHOTOS} gambar telah dicapai. Sila padam gambar sedia ada terlebih dahulu.`,
    };
  }

  const nextSortOrder =
    existingPhotos && existingPhotos.length > 0
      ? Math.max(...existingPhotos.map((p) => p.sort_order)) + 1
      : 0;

  // 3. Insert new gallery item
  const { data: inserted, error: insertError } = await supabase
    .from("invitation_gallery")
    .insert({
      invitation_id: invitationId,
      storage_path: storagePath,
      sort_order: nextSortOrder,
    })
    .select("id, storage_path, sort_order")
    .single();

  if (insertError || !inserted) {
    console.error("[WALIMATUL] addGalleryPhotoAction error:", insertError?.message);
    return { success: false, error: "Gagal menyimpan gambar ke galeri." };
  }

  revalidatePath(`/dashboard/invitations/${invitationId}/edit`);
  return {
    success: true,
    data: {
      id: inserted.id,
      storagePath: inserted.storage_path,
      sortOrder: inserted.sort_order,
    },
  };
}

/**
 * Delete a photo from the invitation's gallery and remove the storage asset.
 */
export async function deleteGalleryPhotoAction(
  invitationId: string,
  photoId: string
): Promise<ActionResponse> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: "Sila log masuk." };
  }

  const supabase = await createClient();

  // 1. Verify ownership & fetch storage path
  const { data: photo, error: fetchError } = await supabase
    .from("invitation_gallery")
    .select(`
      id,
      storage_path,
      invitations!inner(id, user_id)
    `)
    .eq("id", photoId)
    .eq("invitation_id", invitationId)
    .eq("invitations.user_id", userId)
    .single();

  if (fetchError || !photo) {
    return { success: false, error: "Gambar tidak dijumpai atau tiada akses." };
  }

  // 2. Delete database row first
  const { error: deleteRowError } = await supabase
    .from("invitation_gallery")
    .delete()
    .eq("id", photoId)
    .eq("invitation_id", invitationId);

  if (deleteRowError) {
    console.error("[WALIMATUL] deleteGalleryPhotoAction row delete error:", deleteRowError.message);
    return { success: false, error: "Gagal memadam rekod gambar." };
  }

  // 3. Remove storage asset safely
  if (photo.storage_path) {
    try {
      // Extract relative object path if full URL is given or use path directly
      let relativePath = photo.storage_path;
      if (relativePath.includes("/invitation-gallery/")) {
        relativePath = relativePath.split("/invitation-gallery/")[1];
      }
      await supabase.storage.from("invitation-gallery").remove([relativePath]);
    } catch (storageErr) {
      console.warn("[WALIMATUL] Storage cleanup warning:", storageErr);
    }
  }

  revalidatePath(`/dashboard/invitations/${invitationId}/edit`);
  return { success: true };
}

/**
 * Reorder gallery photos by updating sort_order for all given IDs.
 */
export async function reorderGalleryAction(
  invitationId: string,
  orderedIds: string[]
): Promise<ActionResponse> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: "Sila log masuk." };
  }

  const supabase = await createClient();

  // Verify ownership
  const { data: invitation, error: invError } = await supabase
    .from("invitations")
    .select("id")
    .eq("id", invitationId)
    .eq("user_id", userId)
    .single();

  if (invError || !invitation) {
    return { success: false, error: "Jemputan tidak dijumpai atau tiada akses." };
  }

  // Update sort_order for each item
  const updatePromises = orderedIds.map((id, index) =>
    supabase
      .from("invitation_gallery")
      .update({ sort_order: index })
      .eq("id", id)
      .eq("invitation_id", invitationId)
  );

  const results = await Promise.all(updatePromises);
  const hasError = results.some((r) => r.error);

  if (hasError) {
    return { success: false, error: "Gagal mengemaskini susunan gambar." };
  }

  revalidatePath(`/dashboard/invitations/${invitationId}/edit`);
  return { success: true };
}

/**
 * Replace a gallery photo with a new storage asset, cleaning up the old asset.
 */
export async function replaceGalleryPhotoAction(
  invitationId: string,
  photoId: string,
  newStoragePath: string
): Promise<ActionResponse<{ storagePath: string }>> {
  const userId = await getAuthUserId();
  if (!userId) {
    return { success: false, error: "Sila log masuk." };
  }

  const supabase = await createClient();

  // 1. Verify ownership & get old path
  const { data: oldPhoto, error: fetchError } = await supabase
    .from("invitation_gallery")
    .select(`
      id,
      storage_path,
      invitations!inner(id, user_id)
    `)
    .eq("id", photoId)
    .eq("invitation_id", invitationId)
    .eq("invitations.user_id", userId)
    .single();

  if (fetchError || !oldPhoto) {
    return { success: false, error: "Gambar tidak dijumpai atau tiada akses." };
  }

  // 2. Update to new storage path
  const { error: updateError } = await supabase
    .from("invitation_gallery")
    .update({ storage_path: newStoragePath })
    .eq("id", photoId)
    .eq("invitation_id", invitationId);

  if (updateError) {
    return { success: false, error: "Gagal mengemaskini gambar." };
  }

  // 3. Clean up old asset if path changed
  if (oldPhoto.storage_path && oldPhoto.storage_path !== newStoragePath) {
    try {
      let relativePath = oldPhoto.storage_path;
      if (relativePath.includes("/invitation-gallery/")) {
        relativePath = relativePath.split("/invitation-gallery/")[1];
      }
      await supabase.storage.from("invitation-gallery").remove([relativePath]);
    } catch (e) {
      console.warn("[WALIMATUL] Failed to delete replaced image asset:", e);
    }
  }

  revalidatePath(`/dashboard/invitations/${invitationId}/edit`);
  return { success: true, data: { storagePath: newStoragePath } };
}
