import { z } from "zod";

/**
 * WALIMATUL — Guest RSVP Validation Schema
 *
 * Enforces client and server side validation for guest RSVP submissions.
 */
export const guestRsvpSchema = z
  .object({
    invitationId: z
      .string()
      .uuid({ message: "ID jemputan tidak sah." }),
    guestName: z
      .string()
      .trim()
      .min(2, { message: "Sila masukkan nama anda (minimum 2 aksara)." })
      .max(120, { message: "Nama tidak boleh melebihi 120 aksara." }),
    attendance: z.enum(["attending", "not_attending"], {
      message: "Sila pilih status kehadiran anda.",
    }),
    pax: z
      .number()
      .int({ message: "Jumlah pax mestilah nombor bulat." })
      .min(0, { message: "Jumlah pax tidak boleh kurang daripada 0." })
      .max(20, { message: "Jumlah pax maksimum adalah 20." }),
    message: z
      .string()
      .trim()
      .max(500, { message: "Ucapan tidak boleh melebihi 500 aksara." })
      .optional()
      .nullable(),
  })
  .refine(
    (data) => {
      if (data.attendance === "not_attending") {
        return data.pax === 0;
      }
      return data.pax >= 1;
    },
    {
      message: "Sila nyatakan sekurang-kurangnya 1 pax jika anda hadir.",
      path: ["pax"],
    }
  );

export type GuestRsvpInput = z.infer<typeof guestRsvpSchema>;
