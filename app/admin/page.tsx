import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — WALIMATUL",
};

export default function AdminPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-[var(--text)] mb-2">
        Admin Dashboard
      </h1>
      <p className="text-sm text-[var(--text-muted)] font-ui mb-8">
        Admin features will be expanded in future phases. Currently you have
        full database access via the Supabase dashboard.
      </p>

      {/* Placeholder panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: "—", icon: "👥" },
          { label: "Active Invitations", value: "—", icon: "💌" },
          { label: "Revenue (MYR)", value: "—", icon: "💳" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-[var(--radius-lg)] p-6"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="text-3xl mb-3" aria-hidden="true">
              {stat.icon}
            </div>
            <p className="text-2xl font-display text-[var(--primary)] mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-[var(--text-muted)] font-ui">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-[var(--radius-lg)] p-5 border border-dashed border-[var(--border)]"
        style={{ background: "var(--surface)" }}
      >
        <h2 className="font-display text-base text-[var(--text)] mb-2">
          Supabase Dashboard
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-ui mb-3">
          Manage users, profiles, invitations and RLS policies directly in
          Supabase.
        </p>
        <a
          id="admin-link-supabase"
          href="https://supabase.com/dashboard/project/xjaclwiilmmzjiftnnob"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[var(--primary)] text-white text-sm font-semibold font-ui hover:bg-[var(--primary-hover)] transition-colors"
        >
          Open Supabase →
        </a>
      </div>
    </div>
  );
}
