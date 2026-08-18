import { z } from "zod";
import { templateDesignConfigSchema } from "@/lib/templates/template-design";

export const templateSlugSchema = z
  .string()
  .min(2, "Slug mestilah sekurang-kurangnya 2 aksara.")
  .max(100, "Slug tidak boleh melebihi 100 aksara.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug hanya boleh mengandungi huruf kecil, nombor, dan sempang (cth. royal-gold)."
  );

export const createTemplateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama templat mestilah sekurang-kurangnya 2 aksara.")
    .max(100, "Nama templat tidak boleh melebihi 100 aksara."),
  slug: templateSlugSchema,
  description: z.string().max(500, "Penerangan tidak boleh melebihi 500 aksara.").nullable().optional(),
  category: z.string().max(50).nullable().optional(),
  component_key: z.string().default("hybrid-editorial"),
  price: z.coerce
    .number()
    .min(0, "Harga tidak boleh negatif."),
  validity_months: z.coerce
    .number()
    .int("Tempoh sah mestilah nombor bulat.")
    .min(1, "Tempoh sah mestilah sekurang-kurangnya 1 bulan.")
    .max(60, "Tempoh sah maksimum ialah 60 bulan.")
    .default(6),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  is_featured: z.boolean().default(false),
  thumbnail_url: z.string().nullable().optional(),
  design_config: templateDesignConfigSchema.optional(),
});

export const updateTemplateSchema = createTemplateSchema.extend({
  id: z.string().uuid("ID templat tidak sah."),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
