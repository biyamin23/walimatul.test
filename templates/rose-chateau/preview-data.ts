import type { InvitationTemplateData } from "../types";

/**
 * WALIMATUL — Rose Chateau Preview Data
 *
 * Sample preview data used for template preview routes, demonstrations,
 * and visual regression testing.
 */

export const ROSE_CHATEAU_PREVIEW_DATA: InvitationTemplateData = {
  id: "preview-rose-chateau-01",
  groomName: "Tengku Muhammad ‘Aqil bin Tengku Razif",
  groomShortName: "‘Aqil",
  brideName: "Nur ‘Aisyah binti Megat Iskandar",
  brideShortName: "‘Aisyah",
  weddingDate: "2026-12-19",
  startTime: "11:30:00",
  endTime: "16:00:00",
  venueName: "Château de Rose Grand Ballroom",
  venueAddress: "Jalan Bukit Bintang, 55100 Kuala Lumpur, Malaysia",
  googleMapsUrl: "https://maps.google.com/?q=Chateau+de+Rose+Kuala+Lumpur",
  wazeUrl: "https://waze.com/ul?q=Chateau+de+Rose+Kuala+Lumpur",
  openingMessage:
    "“Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”\n(Surah Ar-Rum: 21)",
  invitationMessage:
    "Dengan penuh kesyukuran ke hadrat Ilahi, kami menjemput Dato' / Datin / Tuan / Puan / Encik / Cik sekeluarga hadir ke majlis perkahwinan putera dan puteri kami.",
  closingMessage:
    "Semoga dengan kehadiran dan doa restu para hadirin akan menyerikan lagi majlis kami serta memberkati ikatan perkahwinan ini, Insya-Allah. Terima kasih.",
  gallery: [
    {
      id: "chateau-photo-1",
      storagePath: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
    {
      id: "chateau-photo-2",
      storagePath: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
    {
      id: "chateau-photo-3",
      storagePath: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
  ],
  rsvpEnabled: true,
  rsvpDeadline: "2026-12-05",
  maxPax: 4,
  allowGuestMessage: true,
  openingCoverEnabled: true,
  countdownEnabled: true,
  guestWishesEnabled: true,
  guestWishes: [
    {
      id: "wish-rc-1",
      guestName: "Dato’ Sri Ahmad & Datin Seri Zaleha",
      message: "Barakallahu lakuma wa baraka alaikuma wa jama’a bainakuma fi khair. Tahniah ‘Aqil & ‘Aisyah!",
      createdAt: "2026-09-01T08:00:00Z",
    },
    {
      id: "wish-rc-2",
      guestName: "Dr. Farhan & Dr. Sofea",
      message: "Selamat menempuh alam perkahwinan. Moga berbahagia hingga ke anak cucu dan jannah.",
      createdAt: "2026-09-02T10:30:00Z",
    },
  ],
  musicEnabled: false,
  musicKey: null,
  musicYoutubeVideoId: null,
  musicLoop: true,
};
