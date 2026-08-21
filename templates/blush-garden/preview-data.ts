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
  countdownEnabled: true,
  guestWishesEnabled: true,
  guestWishes: [
    {
      id: "wish-1",
      guestName: "Ustaz Hamdan & Keluarga",
      message: "Tahniah dan selamat pengantin baru buat kedua mempelai.",
      createdAt: "2026-08-20T08:00:00Z",
    },
  ],
  musicEnabled: false,
  musicKey: null,
  musicYoutubeVideoId: null,
  musicLoop: false,
};

/**
 * Long-name & extended content test case
 * Used to verify responsive typography wrapping without horizontal overflow.
 */
export const LONG_CONTENT_PREVIEW_DATA: InvitationTemplateData = {
  id: "preview-blush-garden-long",
  groomName: "Y.M. Raja Muhammad Danial Asyraf bin Raja Dato' Seri Kamarulzaman Al-Haj",
  groomShortName: "Danial Asyraf",
  brideName: "Dayang Nur Siti Nurhaliza binti Orang Kaya Mahawangsa Haji Zainuddin",
  brideShortName: "Siti Nurhaliza",
  weddingDate: "2026-12-19",
  startTime: "11:30:00",
  endTime: "16:30:00",
  venueName:
    "Grand Ballroom, Mandarin Oriental Kuala Lumpur, Kuala Lumpur City Centre, 50088 Kuala Lumpur",
  venueAddress:
    "Mandarin Oriental, Kuala Lumpur City Centre, P.O. Box 10905, 50088 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur, Malaysia",
  googleMapsUrl: "https://maps.google.com/?q=Mandarin+Oriental+Kuala+Lumpur",
  wazeUrl: "https://waze.com/ul/hw283ft4p7",
  openingMessage:
    "“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”\n(Surah Ar-Rum: 21)",
  invitationMessage:
    "Dengan penuh rasa kesyukuran ke hadrat Ilahi serta menjunjung setinggi-tinggi hormat dan takzim, kami sekeluarga dengan berbesar hati mempersilakan Y.Bhg. Tan Sri / Puan Sri / Dato' Seri / Datin Seri / Dato' / Datin / Tuan / Puan / Encik / Cik seisi keluarga hadir bagi meraikan dan menyerikan lagi Majlis Walimatulurus putera dan puteri kami.",
  closingMessage:
    "Semoga dengan kehadiran dan untaian doa restu para hadirin yang budiman akan melimpahkan lagi keberkatan dan kerahmatan ke atas ikatan perkahwinan suci yang termeterai ini, Insya-Allah.\n\nSekalung penghargaan dan terima kasih kami ucapkan.",
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
  countdownEnabled: true,
  guestWishesEnabled: false,
  guestWishes: [],
  musicEnabled: false,
  musicKey: null,
  musicYoutubeVideoId: null,
  musicLoop: false,
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
  countdownEnabled: false,
  guestWishesEnabled: false,
  guestWishes: [],
  musicEnabled: false,
  musicKey: null,
  musicYoutubeVideoId: null,
  musicLoop: false,
};
