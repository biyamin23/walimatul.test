import type { InvitationTemplateData } from "@/templates/types";

export const SAMPLE_PREVIEW_INVITATION_DATA: InvitationTemplateData = {
  id: "preview-sample-id",
  groomName: "Muhammad Syafiq bin Dato' Sulaiman",
  groomShortName: "Syafiq",
  brideName: "Nur Aisyah binti Haji Zainal Abidin",
  brideShortName: "Aisyah",
  weddingDate: "2026-11-28",
  startTime: "11:00 AM",
  endTime: "04:00 PM",
  venueName: "Glasshouse at Seputeh, Kuala Lumpur",
  venueAddress:
    "17, Lorong Syed Putra Kiri, Bukit Seputeh, 50460 Kuala Lumpur, Wilayah Persekutuan",
  googleMapsUrl: "https://maps.google.com",
  wazeUrl: "https://waze.com",
  openingMessage:
    "Dengan penuh rasa kesyukuran ke hadrat Ilahi, kami sekeluarga menjemput Dato' / Datin / Tuan / Puan / Encik / Cik ke majlis perkahwinan putera puteri kami.",
  invitationMessage:
    "Semoga dengan kehadiran dan doa restu para hadirin sekalian akan menyerikan lagi majlis kami.",
  closingMessage:
    "Semoga kehadiran dan doa restu para hadirin sekalian memeriahkan lagi majlis kami serta diberkati Allah SWT.",
  gallery: [],
  rsvpEnabled: true,
  rsvpDeadline: "2026-11-14",
  maxPax: 5,
  allowGuestMessage: true,
  openingCoverEnabled: true,
  countdownEnabled: true,
  guestWishesEnabled: true,
  guestWishes: [
    {
      id: "sample-wish-1",
      guestName: "Haji Ismail & Keluarga",
      message: "Selamat pengantin baru! Semoga mahligai yang dibina kekal hingga ke jannah.",
      createdAt: "2026-08-20T10:00:00Z",
    },
    {
      id: "sample-wish-2",
      guestName: "Datin Faridah & Rakan-rakan",
      message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fi khair.",
      createdAt: "2026-08-20T12:30:00Z",
    },
  ],
  musicEnabled: false,
  musicKey: null,
  musicYoutubeVideoId: null,
  musicLoop: false,
};
