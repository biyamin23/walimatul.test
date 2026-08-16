import { requireClient } from "@/lib/auth/permissions";
import ProfileForm from "@/components/dashboard/ProfileForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile — WALIMATUL",
  description: "Update your WALIMATUL profile information.",
};

export default async function ProfilePage() {
  const user = await requireClient("/dashboard/profile");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl text-[var(--text)] mb-1">My Profile</h1>
        <p className="text-sm text-[var(--text-muted)] font-ui">
          Update your personal details. Your email cannot be changed here.
        </p>
      </div>

      {/* Profile card */}
      <div
        className="rounded-[var(--radius-xl)] p-6 mb-6"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        {/* Avatar row */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold font-display shrink-0"
            style={{ background: "var(--primary-soft)", color: "var(--primary)" }}
            aria-hidden="true"
          >
            {(user.profile?.full_name ?? user.email)
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
          <div>
            <p className="font-display text-lg text-[var(--text)]">
              {user.profile?.full_name || "—"}
            </p>
            <p className="text-sm text-[var(--text-muted)] font-ui">{user.email}</p>
            <span
              className="inline-block mt-1 text-[10px] font-medium font-ui uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: "var(--primary-soft)",
                color: "var(--primary)",
              }}
            >
              {user.profile?.role ?? "client"}
            </span>
          </div>
        </div>

        <ProfileForm profile={user.profile} email={user.email} />
      </div>
    </div>
  );
}
