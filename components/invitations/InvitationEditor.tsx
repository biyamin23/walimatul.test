"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { PendingLink } from "@/components/ui/PendingLink";
import { InvitationForm } from "./InvitationForm";
import { SaveStatusIndicator, type SaveStatus } from "./SaveStatusIndicator";
import { getTemplateComponent } from "@/templates/registry";
import { HybridEditorialTemplate } from "@/templates/hybrid-editorial/Template";
import { InvitationExperience } from "./InvitationExperience";
import { updateOwnInvitationAction } from "@/app/actions/invitations";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { InvitationLifecyclePanel } from "./InvitationLifecyclePanel";
import type { InvitationWithTemplate } from "@/types/database";
import type { UpdateInvitationInput } from "@/lib/validation/invitation";
import type { InvitationTemplateData, GalleryItem } from "@/templates/types";
import type { ClientInvitationLifecycle } from "@/types/client-lifecycle";

interface InvitationEditorProps {
  invitation: InvitationWithTemplate;
  initialMode?: "edit" | "preview";
  lifecycle?: ClientInvitationLifecycle;
  supportWhatsappUrl?: string;
}

export function InvitationEditor({
  invitation,
  initialMode = "edit",
  lifecycle,
  supportWhatsappUrl,
}: InvitationEditorProps) {
  // ── Form State ──
  const [formValues, setFormValues] = useState<UpdateInvitationInput>({
    slug: invitation.slug || "",
    groomName: invitation.groom_name || "",
    groomShortName: invitation.groom_short_name || "",
    brideName: invitation.bride_name || "",
    brideShortName: invitation.bride_short_name || "",
    weddingDate: invitation.wedding_date || "",
    startTime: invitation.start_time ? invitation.start_time.slice(0, 5) : "",
    endTime: invitation.end_time ? invitation.end_time.slice(0, 5) : "",
    venueName: invitation.venue_name || "",
    venueAddress: invitation.venue_address || "",
    googleMapsUrl: invitation.google_maps_url || "",
    wazeUrl: invitation.waze_url || "",
    openingMessage: invitation.opening_message || "",
    invitationMessage: invitation.invitation_message || "",
    closingMessage: invitation.closing_message || "",
    rsvpEnabled: invitation.rsvp_enabled ?? true,
    rsvpDeadline: invitation.rsvp_deadline || "",
    maxPax: invitation.max_pax ?? 5,
    allowGuestMessage: invitation.allow_guest_message ?? true,
    openingCoverEnabled: invitation.opening_cover_enabled ?? true,
    countdownEnabled: invitation.countdown_enabled ?? false,
    guestWishesEnabled: invitation.guest_wishes_enabled ?? false,
    musicEnabled: invitation.music_enabled ?? false,
    musicYoutubeUrl: invitation.music_youtube_video_id
      ? `https://www.youtube.com/watch?v=${invitation.music_youtube_video_id}`
      : "",
    musicYoutubeVideoId: invitation.music_youtube_video_id || "",
    musicLoop: invitation.music_loop ?? false,
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() =>
    (invitation.gallery || []).map((g) => ({
      id: g.id,
      storagePath: g.storage_path,
      sortOrder: g.sort_order,
    }))
  );

  const [activeTab, setActiveTab] = useState<"edit" | "preview">(initialMode);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resolvedYoutubeId = formValues.musicYoutubeUrl
    ? extractYouTubeVideoId(formValues.musicYoutubeUrl)
    : formValues.musicYoutubeVideoId || null;

  // ── Live Normalized Template Data for Preview ──
  const liveTemplateData: InvitationTemplateData = {
    id: invitation.id,
    groomName: formValues.groomName || "",
    groomShortName: formValues.groomShortName || formValues.groomName || "",
    brideName: formValues.brideName || "",
    brideShortName: formValues.brideShortName || formValues.brideName || "",
    weddingDate: formValues.weddingDate || null,
    startTime: formValues.startTime || null,
    endTime: formValues.endTime || null,
    venueName: formValues.venueName || null,
    venueAddress: formValues.venueAddress || null,
    googleMapsUrl: formValues.googleMapsUrl || null,
    wazeUrl: formValues.wazeUrl || null,
    openingMessage: formValues.openingMessage || null,
    invitationMessage: formValues.invitationMessage || null,
    closingMessage: formValues.closingMessage || null,
    gallery: galleryItems,
    rsvpEnabled: formValues.rsvpEnabled,
    rsvpDeadline: formValues.rsvpDeadline || null,
    maxPax: formValues.maxPax,
    allowGuestMessage: formValues.allowGuestMessage,
    openingCoverEnabled: formValues.openingCoverEnabled ?? true,
    countdownEnabled: formValues.countdownEnabled ?? false,
    guestWishesEnabled: formValues.guestWishesEnabled ?? false,
    guestWishes: [
      {
        id: "preview-wish-1",
        guestName: "Haji Ismail & Keluarga",
        message: "Selamat pengantin baru! Semoga mahligai yang dibina sentiasa dilimpahi sakinah, mawaddah dan rahmah.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "preview-wish-2",
        guestName: "Zulkifli & Sarah",
        message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fi khair.",
        createdAt: new Date().toISOString(),
      },
    ],
    musicEnabled: formValues.musicEnabled ?? false,
    musicKey: null,
    musicYoutubeVideoId: resolvedYoutubeId,
    musicLoop: formValues.musicLoop ?? false,
  };

  // ── Save Function ──
  const performSave = useCallback(
    async (valuesToSave: UpdateInvitationInput) => {
      setSaveStatus("saving");
      setErrorMessage("");

      const result = await updateOwnInvitationAction(
        invitation.id,
        valuesToSave
      );

      if (result.success) {
        setSaveStatus("saved");
        setErrors({});
        setErrorMessage("");
      } else {
        setSaveStatus("error");
        setErrorMessage(result.error || "Save failed");
        if (result.fieldErrors) {
          setErrors(result.fieldErrors);
        }
      }
    },
    [invitation.id]
  );

  // ── Field Change Handler with Debounced Autosave ──
  function handleFieldChange<K extends keyof UpdateInvitationInput>(
    field: K,
    value: UpdateInvitationInput[K]
  ) {
    const updated = {
      ...formValues,
      [field]: value,
    };
    setFormValues(updated);
    setSaveStatus("unsaved");

    // Debounce save (1200ms)
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      performSave(updated);
    }, 1200);
  }

  // Explicit Save Trigger
  function handleManualSave() {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    performSave(formValues);
  }

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] max-w-full overflow-x-hidden">
      {/* ── Compact Sticky Top Bar ── */}
      <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] px-3 sm:px-4 py-2 sm:py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          {/* Top Row: Navigation, Title & Save Status */}
          <div className="flex items-center justify-between gap-2 min-w-0 w-full">
            {/* Left: Back Link & Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Link
                href="/dashboard/invitations"
                aria-label="Back to My Invitations"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--surface-warm)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] shrink-0"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Link>

              <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
                <h1 className="font-display text-sm sm:text-base font-semibold text-[var(--text)] truncate">
                  {invitation.template?.name || "Blush Garden"}
                </h1>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-ui shrink-0">
                  Draft
                </span>
              </div>
            </div>

            {/* Right: Single Canonical Save Status & Action */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <SaveStatusIndicator
                status={saveStatus}
                errorMessage={errorMessage}
              />

              <button
                type="button"
                onClick={handleManualSave}
                disabled={saveStatus === "saving"}
                aria-busy={saveStatus === "saving"}
                className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] active:scale-95 transition-all shadow-xs disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
              >
                {saveStatus === "saving" ? "Menyimpan..." : "Simpan Draf"}
              </button>
            </div>
          </div>

          {/* Bottom Row on Mobile Only: Segmented Tab Switcher */}
          <div className="flex lg:hidden items-center justify-center w-full pt-0.5">
            <div className="flex items-center bg-[var(--surface-warm)] p-0.5 rounded-full border border-[var(--border)] text-xs font-ui w-full max-w-xs">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`flex-1 py-1.5 rounded-full font-semibold transition-all text-center ${
                  activeTab === "edit"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                Edit Form
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex-1 py-1.5 rounded-full font-semibold transition-all text-center ${
                  activeTab === "preview"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text)]"
                }`}
              >
                Live Preview
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Editor Body ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-3.5 sm:p-6 lg:p-8 min-w-0 box-border">
        {/* Desktop Split View: Form (Left 42%) | Sticky Live Preview (Right 58%) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start min-w-0 w-full">
          {/* Left: Scrollable Form */}
          <div className="lg:col-span-5 min-w-0 space-y-6 pb-24">
            {lifecycle && (
              <InvitationLifecyclePanel
                lifecycle={lifecycle}
                invitationId={invitation.id}
                slug={formValues.slug || invitation.slug}
                supportWhatsappUrl={supportWhatsappUrl}
              />
            )}

            <div className="bg-[var(--surface-warm)] p-4 rounded-xl border border-[var(--border-soft)] text-xs font-ui text-[var(--text-muted)] leading-relaxed">
              <p>
                Perubahan pada borang akan dikemaskini secara langsung pada
                paparan jemputan di sebelah kanan dan disimpan secara automatik.
              </p>
            </div>

            <InvitationForm
              invitationId={invitation.id}
              values={formValues}
              onChange={handleFieldChange}
              initialGallery={galleryItems}
              onGalleryChange={setGalleryItems}
              errors={errors}
            />

            {/* Payment CTA Card */}
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--primary)]/30 shadow-sm space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
                  Langkah Seterusnya
                </span>
                <h3 className="font-display text-base font-bold text-[var(--text)]">
                  Pengaktifan &amp; Pembayaran Jemputan
                </h3>
                <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
                  Selesai mengisi butiran? Teruskan ke pembayaran Touch ’n Go eWallet (RM{invitation.template?.price ?? 49}) untuk mengaktifkan jemputan rasmi anda.
                </p>
              </div>
              <Link
                href={`/dashboard/invitations/${invitation.id}/payment`}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--primary)] text-white font-ui text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-sm"
              >
                <span>Teruskan ke Pembayaran (RM{invitation.template?.price ?? 49})</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: Sticky Live Preview */}
          <div className="lg:col-span-7 min-w-0 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-[var(--border)] shadow-xl bg-[#1A2E26] p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-white text-xs font-ui">
              <span className="font-semibold text-[#F5DDD6]">Live Preview</span>
              <span className="text-[10px] text-white/50">
                Updates instantly as you type
              </span>
            </div>
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
              <InvitationExperience
                data={liveTemplateData}
                mode="editor"
                templateKey={invitation.template?.component_key}
                designConfig={invitation.template?.design_config}
              >
                {React.createElement(
                  getTemplateComponent(invitation.template?.component_key) || HybridEditorialTemplate,
                  {
                    data: liveTemplateData,
                    mode: "editor",
                    designConfig: invitation.template?.design_config,
                  }
                )}
              </InvitationExperience>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Tabbed View */}
        <div className="lg:hidden w-full max-w-full min-w-0">
          {activeTab === "edit" ? (
            <div className="space-y-6 pb-24 w-full max-w-full min-w-0">
              {lifecycle && (
                <InvitationLifecyclePanel
                  lifecycle={lifecycle}
                  invitationId={invitation.id}
                  slug={formValues.slug || invitation.slug}
                  supportWhatsappUrl={supportWhatsappUrl}
                />
              )}
              {/* Note: Duplicate save status indicator removed. Single indicator is in top bar. */}
              <InvitationForm
                invitationId={invitation.id}
                values={formValues}
                onChange={handleFieldChange}
                initialGallery={galleryItems}
                onGalleryChange={setGalleryItems}
                errors={errors}
              />

              {/* Payment CTA Card */}
              <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--primary)]/30 shadow-sm space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--gold)] font-ui block">
                    Langkah Seterusnya
                  </span>
                  <h3 className="font-display text-base font-bold text-[var(--text)]">
                    Pengaktifan &amp; Pembayaran Jemputan
                  </h3>
                  <p className="text-xs font-ui text-[var(--text-muted)] mt-0.5">
                    Selesai mengisi butiran? Teruskan ke pembayaran Touch ’n Go eWallet (RM{invitation.template?.price ?? 49}) untuk mengaktifkan jemputan rasmi anda.
                  </p>
                </div>
                <PendingLink
                  href={`/dashboard/invitations/${invitation.id}/payment`}
                  pendingText="Membuka Pembayaran..."
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-[var(--primary)] text-white font-ui text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-sm"
                >
                  <span>Teruskan ke Pembayaran (RM{invitation.template?.price ?? 49})</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </PendingLink>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-2xl pb-16 w-full max-w-full min-w-0">
              <InvitationExperience
                data={liveTemplateData}
                mode="editor"
                templateKey={invitation.template?.component_key}
                designConfig={invitation.template?.design_config}
              >
                {React.createElement(
                  getTemplateComponent(invitation.template?.component_key) || HybridEditorialTemplate,
                  {
                    data: liveTemplateData,
                    mode: "editor",
                    designConfig: invitation.template?.design_config,
                  }
                )}
              </InvitationExperience>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
