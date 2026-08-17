import React from "react";
import { notFound, redirect } from "next/navigation";
import { requireClient } from "@/lib/auth/permissions";
import { getOwnInvitationById } from "@/lib/data/invitations";
import { InvitationEditor } from "@/components/invitations/InvitationEditor";
import type { Metadata } from "next";

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

  const invitation = await getOwnInvitationById(id);

  if (!invitation) {
    notFound();
  }

  return (
    <InvitationEditor
      invitation={invitation}
      initialMode={mode === "preview" ? "preview" : "edit"}
    />
  );
}
