import React from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireClient } from "@/lib/auth/permissions";
import { getOwnInvitationById } from "@/lib/data/invitations";
import { getOwnInvitationPaymentState } from "@/lib/data/payments";
import { getPlatformSettings } from "@/lib/data/platform-settings";
import { BRAND } from "@/lib/constants/brand";
import { deriveClientInvitationLifecycle } from "@/lib/invitations/client-lifecycle";
import { InvitationEditor } from "@/components/invitations/InvitationEditor";

export const metadata: Metadata = {
  title: "Edit Invitation — WALIMATUL",
  description: "Customize your wedding invitation details and see live preview.",
};

interface EditInvitationPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    mode?: string;
  }>;
}

export default async function EditInvitationPage({
  params,
  searchParams,
}: EditInvitationPageProps) {
  await requireClient();

  const { id } = await params;
  const { mode } = await searchParams;

  if (!id) {
    redirect("/dashboard/invitations");
  }

  const [invitation, paymentState, settings] = await Promise.all([
    getOwnInvitationById(id),
    getOwnInvitationPaymentState(id),
    getPlatformSettings(),
  ]);

  if (!invitation) {
    notFound();
  }

  const supportWhatsappUrl = settings.support_whatsapp?.phone
    ? `https://wa.me/${settings.support_whatsapp.phone.replace(/[^0-9]/g, "")}`
    : BRAND.supportWhatsappUrl;

  const lifecycle = deriveClientInvitationLifecycle({
    invitation,
    latestOrder: paymentState?.order || null,
    supportWhatsappUrl,
  });

  return (
    <InvitationEditor
      invitation={invitation}
      initialMode={mode === "preview" ? "preview" : "edit"}
      lifecycle={lifecycle}
      supportWhatsappUrl={supportWhatsappUrl}
    />
  );
}
