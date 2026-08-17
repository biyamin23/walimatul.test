"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { InvitationForm } from "./InvitationForm";
import { SaveStatusIndicator, type SaveStatus } from "./SaveStatusIndicator";
import { BlushGardenTemplate } from "@/templates/blush-garden/Template";
import { updateOwnInvitationAction } from "@/app/actions/invitations";
import type { InvitationWithTemplate } from "@/types/database";
import type { UpdateInvitationInput } from "@/lib/validation/invitation";
import type { InvitationTemplateData } from "@/templates/types";

interface InvitationEditorProps {
  invitation: InvitationWithTemplate;
  initialMode?: "edit" | "preview";
}

export function InvitationEditor({
  invitation,
  initialMode = "edit",
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
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">(initialMode);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    gallery: [],
    rsvpEnabled: formValues.rsvpEnabled,
    rsvpDeadline: formValues.rsvpDeadline || null,
    maxPax: formValues.maxPax,
    allowGuestMessage: formValues.allowGuestMessage,
    musicEnabled: false,
    musicKey: null,
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
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      {/* ── Sticky Top Bar ── */}
      <header className="sticky top-0 z-40 bg-[var(--surface)] border-b border-[var(--border)] px-4 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Back Link & Title */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/dashboard/invitations"
              aria-label="Back to My Invitations"
              className="inline-flex items-center gap-1.5 text-xs font-semibold font-ui text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded py-1 px-1.5 -ml-1.5"
            >
              <svg
                width="16"
                height="16"
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
              <span className="hidden sm:inline">My Invitations</span>
            </Link>

            <span className="text-[var(--border)] hidden sm:inline">|</span>

            <div className="flex items-center gap-2 truncate">
              <h1 className="font-display text-sm sm:text-base font-semibold text-[var(--text)] truncate">
                {invitation.template?.name || "Blush Garden"}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-ui shrink-0">
                Draft
              </span>
            </div>
          </div>

          {/* Center on Mobile: Edit / Preview Tab Switcher */}
          <div className="flex lg:hidden items-center bg-[var(--surface-warm)] p-1 rounded-full border border-[var(--border)] text-xs font-ui">
            <button
              type="button"
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
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
              className={`px-4 py-1.5 rounded-full font-semibold transition-all ${
                activeTab === "preview"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              }`}
            >
              Live Preview
            </button>
          </div>

          {/* Right: Save Status & Manual Save Button */}
          <div className="flex items-center gap-3 shrink-0">
            <SaveStatusIndicator
              status={saveStatus}
              errorMessage={errorMessage}
              className="hidden sm:inline-flex"
            />

            <button
              type="button"
              onClick={handleManualSave}
              disabled={saveStatus === "saving"}
              className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[var(--primary)] text-white text-xs font-semibold font-ui hover:bg-[var(--primary-hover)] active:scale-95 transition-all shadow-xs disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
            >
              {saveStatus === "saving" ? "Saving..." : "Save Draft"}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Editor Body ── */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8">
        {/* Desktop Split View: Form (Left 42%) | Sticky Live Preview (Right 58%) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Scrollable Form */}
          <div className="lg:col-span-5 space-y-6 pb-24">
            <div className="bg-[var(--surface-warm)] p-4 rounded-xl border border-[var(--border-soft)] text-xs font-ui text-[var(--text-muted)]">
              <p>
                Perubahan pada borang akan dikemaskini secara langsung pada
                paparan jemputan di sebelah kanan dan disimpan secara automatik.
              </p>
            </div>

            <InvitationForm
              invitationId={invitation.id}
              values={formValues}
              onChange={handleFieldChange}
              errors={errors}
            />
          </div>

          {/* Right: Sticky Live Preview */}
          <div className="lg:col-span-7 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl border border-[var(--border)] shadow-xl bg-[#1A2E26] p-4 flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-white text-xs font-ui">
              <span className="font-semibold text-[#F5DDD6]">Live Preview</span>
              <span className="text-[10px] text-white/50">
                Updates instantly as you type
              </span>
            </div>
            <div className="w-full rounded-2xl overflow-hidden shadow-2xl">
              <BlushGardenTemplate data={liveTemplateData} mode="editor" />
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Tabbed View */}
        <div className="lg:hidden">
          {activeTab === "edit" ? (
            <div className="space-y-6 pb-24">
              <div className="flex items-center justify-between px-1">
                <SaveStatusIndicator
                  status={saveStatus}
                  errorMessage={errorMessage}
                />
              </div>

              <InvitationForm
                invitationId={invitation.id}
                values={formValues}
                onChange={handleFieldChange}
                errors={errors}
              />
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-2xl pb-16">
              <BlushGardenTemplate data={liveTemplateData} mode="editor" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
