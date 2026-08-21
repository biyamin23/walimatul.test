import { z } from "zod";
import { isReservedSlug } from "@/lib/constants/reserved-slugs";

/**
 * WALIMATUL — Invitation Validation Schemas
 */

/**
 * Slug syntax validation
 * - 3 to 60 characters
 * - lowercase alphanumeric and single hyphens
 * - cannot start or end with a hyphen
 * - cannot contain consecutive hyphens
 * - cannot be a reserved route or brand term
 */
export const slugSchema = z
  .string()
  .min(3, "Invitation URL must be at least 3 characters")
  .max(60, "Invitation URL cannot exceed 60 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "URL can only contain lowercase letters, numbers, and single hyphens (e.g. abu-dan-hana)"
  )
  .refine((slug) => !isReservedSlug(slug), {
    message: "This URL is reserved and cannot be used",
  });

/**
 * Optional / nullable slug schema (drafts may have empty slug)
 */
export const optionalSlugSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? null : val.toLowerCase()))
  .nullable()
  .refine(
    (val) => {
      if (val === null) return true;
      const result = slugSchema.safeParse(val);
      return result.success;
    },
    {
      message:
        "URL must be 3-60 lowercase characters, numbers, and hyphens without consecutive hyphens",
    }
  );

/**
 * Optional URL schema allowing Google Maps / Waze share links
 */
const optionalHttpUrlSchema = z
  .string()
  .trim()
  .transform((val) => (val === "" ? null : val))
  .nullable()
  .refine(
    (val) => {
      if (val === null) return true;
      try {
        const url = new URL(val);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    },
    { message: "Please enter a valid web URL starting with https://" }
  );

/**
 * Schema for updating invitation details in the editor
 */
export const updateInvitationSchema = z
  .object({
    slug: optionalSlugSchema,
    groomName: z.string().max(120, "Name is too long").trim().nullable().optional(),
    groomShortName: z.string().max(50, "Short name is too long").trim().nullable().optional(),
    brideName: z.string().max(120, "Name is too long").trim().nullable().optional(),
    brideShortName: z.string().max(50, "Short name is too long").trim().nullable().optional(),
    weddingDate: z
      .string()
      .trim()
      .nullable()
      .optional()
      .refine(
        (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Invalid date format (expected YYYY-MM-DD)"
      ),
    startTime: z.string().trim().nullable().optional(),
    endTime: z.string().trim().nullable().optional(),
    venueName: z.string().max(200, "Venue name is too long").trim().nullable().optional(),
    venueAddress: z.string().max(500, "Venue address is too long").trim().nullable().optional(),
    googleMapsUrl: optionalHttpUrlSchema.optional(),
    wazeUrl: optionalHttpUrlSchema.optional(),
    openingMessage: z.string().max(2000, "Message is too long").trim().nullable().optional(),
    invitationMessage: z.string().max(2000, "Message is too long").trim().nullable().optional(),
    closingMessage: z.string().max(2000, "Message is too long").trim().nullable().optional(),
    rsvpEnabled: z.boolean().default(true),
    rsvpDeadline: z
      .string()
      .trim()
      .nullable()
      .optional()
      .refine(
        (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Invalid date format (expected YYYY-MM-DD)"
      ),
    maxPax: z.coerce.number().int().min(1, "Max pax must be at least 1").max(20, "Max pax cannot exceed 20").default(5),
    allowGuestMessage: z.boolean().default(true),
    countdownEnabled: z.boolean().default(false),
    guestWishesEnabled: z.boolean().default(false),
    musicEnabled: z.boolean().default(false),
    musicYoutubeUrl: z.string().trim().nullable().optional(),
    musicYoutubeVideoId: z.string().trim().nullable().optional(),
    musicLoop: z.boolean().default(false),
  })
  .refine(
    (data) => {
      // Validate start & end times if both provided on same day
      if (data.startTime && data.endTime && data.startTime.length >= 5 && data.endTime.length >= 5) {
        return data.startTime <= data.endTime;
      }
      return true;
    },
    {
      message: "End time cannot be earlier than start time",
      path: ["endTime"],
    }
  );

export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
