import type { InvitationTemplateData } from "../types";

/**
 * WALIMATUL — Blush Garden Preview Data
 *
 * Realistic preview data used for template preview routes, demonstrations,
 * and visual regression testing.
 *
 * The template component is pure and does NOT depend on these values directly.
 */

export const BLUSH_GARDEN_PREVIEW_DATA: InvitationTemplateData = {
  id: "preview-blush-garden-01",
  groomName: "Abu Bakar bin Abdullah",
  groomShortName: "Abu",
  brideName: "Siti Hana binti Roslan",
  brideShortName: "Hana",
  weddingDate: "2026-11-24",
  startTime: "11:00:00",
  endTime: "16:00:00",
  venueName: "Dewan Seri Melati",
  venueAddress: "Jalan Tuanku Abdul Rahman, 50100 Kuala Lumpur, Malaysia",
  googleMapsUrl: "https://maps.google.com/?q=Dewan+Seri+Melati+Kuala+Lumpur",
  wazeUrl: "https://waze.com/ul?q=Dewan+Seri+Melati+Kuala+Lumpur",
  openingMessage:
    "“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”\n(Surah Ar-Rum: 21)",
  invitationMessage:
    "Dengan penuh kesyukuran ke hadrat Ilahi, kami menjemput Dato' / Datin / Tuan / Puan / Encik / Cik sekeluarga hadir ke majlis perkahwinan putera dan puteri kami.",
  closingMessage:
    "Semoga dengan kehadiran dan doa restu para hadirin akan menyerikan lagi majlis kami serta memberkati ikatan perkahwinan ini, Insya-Allah. Terima kasih.",
  gallery: [
    {
      id: "preview-photo-1",
      storagePath: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
    {
      id: "preview-photo-2",
      storagePath: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
    {
      id: "preview-photo-3",
      storagePath: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
  ],
  rsvpEnabled: true,
  rsvpDeadline: "2026-11-10",
  maxPax: 5,
  allowGuestMessage: true,
  musicEnabled: false,
  musicKey: null,
};

/**
 * Long-name & extended content test case
 * Used to verify responsive typography wrapping without horizontal overflow.
 */
export const LONG_CONTENT_PREVIEW_DATA: InvitationTemplateData = {
  id: "preview-blush-garden-long",
  groomName: "Muhammad Syafiq bin Haji Abdul Rahman",
  groomShortName: "Muhammad Syafiq",
  brideName: "Nur Aisyah Humaira binti Dato' Seri Ahmad Faris",
  brideShortName: "Nur Aisyah",
  weddingDate: "2026-12-15",
  startTime: "12:00:00",
  endTime: "17:30:00",
  venueName: "Grand Ballroom, Hotel Royale Chulan Damansara",
  venueAddress: "No. 2, Jalan PJU 7/3, Mutiara Damansara, 47810 Petaling Jaya, Selangor Darul Ehsan, Malaysia",
  googleMapsUrl: "https://maps.google.com/?q=Royale+Chulan+Damansara",
  wazeUrl: "https://waze.com/ul?q=Royale+Chulan+Damansara",
  openingMessage:
    "Segala puji bagi Allah, Tuhan sekalian alam yang telah mempertemukan jodoh kami berdua dalam ikatan yang suci dan penuh keberkatan.",
  invitationMessage:
    "Kami dengan sukacitanya menjemput sanak saudara, sahabat handai serta para tetamu yang dihormati untuk bersama-sama meraikan dan mendoakan kebahagiaan mempelai.",
  closingMessage:
    "Kehadiran dan doa anda amat bermakna buat kami sekeluarga dalam menyempurnakan hari yang penuh bersejarah ini. Jazakumullahu Khairan Kathira.",
  gallery: [
    {
      id: "long-photo-1",
      storagePath: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
    {
      id: "long-photo-2",
      storagePath: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
  ],
  rsvpEnabled: true,
  rsvpDeadline: "2026-12-01",
  maxPax: 6,
  allowGuestMessage: true,
  musicEnabled: false,
  musicKey: null,
};

/**
 * Minimal content test case
 * Used to verify clean collapsing of omitted optional fields.
 */
export const MINIMAL_PREVIEW_DATA: InvitationTemplateData = {
  id: "preview-blush-garden-minimal",
  groomName: "Abu",
  groomShortName: "Abu",
  brideName: "Hana",
  brideShortName: "Hana",
  weddingDate: "2026-11-24",
  startTime: null,
  endTime: null,
  venueName: "Dewan Seri Melati",
  venueAddress: "Kuala Lumpur",
  googleMapsUrl: null,
  wazeUrl: null,
  openingMessage: null,
  invitationMessage: null,
  closingMessage: null,
  gallery: [],
  rsvpEnabled: false,
  rsvpDeadline: null,
  maxPax: 2,
  allowGuestMessage: false,
  musicEnabled: false,
  musicKey: null,
};
