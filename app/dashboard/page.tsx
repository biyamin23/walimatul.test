import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — WALIMATUL",
  description: "Manage your digital wedding invitations from your WALIMATUL dashboard.",
};

export default function DashboardPage() {
  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="rounded-[var(--radius-xl)] p-6 mb-8"
        style={{
          background:
            "linear-gradient(135deg, var(--primary-soft) 0%, var(--bg-blush) 100%)",
          border: "1px solid var(--border)",
        }}
      >
        <h1 className="font-display text-2xl text-[var(--primary)] mb-1">
          Welcome to WALIMATUL ✨
        </h1>
        <p className="text-sm text-[var(--text-muted)] font-ui">
          Your dashboard is ready. Once you select a template and create your
          invitation, it will appear here.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <QuickActionCard
          icon="💌"
          title="Create Invitation"
          description="Choose a beautiful template to get started"
          href="/templates"
          cta="Browse Templates"
        />
        <QuickActionCard
          icon="📋"
          title="My Invitations"
          description="View and manage your invitations and drafts"
          href="/dashboard/invitations"
          cta="View Invitations"
        />
        <QuickActionCard
          icon="📊"
          title="RSVP Tracker"
          description="See who's attending your event"
          href="/dashboard/rsvp"
          cta="Coming Soon"
          disabled
        />
      </div>

      {/* Help Section */}
      <div
        className="rounded-[var(--radius-lg)] p-5 border border-dashed border-[var(--border)]"
        style={{ background: "var(--surface)" }}
      >
        <h2 className="font-display text-lg text-[var(--text)] mb-3">
          Need help?
        </h2>
        <p className="text-sm text-[var(--text-muted)] font-ui mb-4 leading-relaxed">
          Our team is available via WhatsApp to help you set up your invitation,
          answer questions about features, or assist with any issues.
        </p>
        <a
          id="link-whatsapp-support"
          href="https://wa.me/60148412018"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius)] bg-[#25D366] text-white text-sm font-semibold font-ui hover:bg-[#20bb5a] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  cta,
  disabled = false,
}: {
  icon: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  disabled?: boolean;
}) {
  const content = (
    <div
      className={`rounded-[var(--radius-lg)] p-5 border transition-all h-full flex flex-col ${
        disabled
          ? "border-[var(--border)] bg-[var(--surface)] opacity-60 cursor-not-allowed"
          : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)] hover:shadow-md cursor-pointer"
      }`}
    >
      <span className="text-3xl mb-3 block" aria-hidden="true">
        {icon}
      </span>
      <h3 className="font-display text-base text-[var(--text)] mb-1">{title}</h3>
      <p className="text-xs text-[var(--text-muted)] font-ui flex-1 leading-relaxed mb-3">
        {description}
      </p>
      <span
        className={`text-xs font-semibold font-ui ${
          disabled
            ? "text-[var(--text-subtle)]"
            : "text-[var(--primary)]"
        }`}
      >
        {cta} →
      </span>
    </div>
  );

  if (disabled) return <div>{content}</div>;

  return (
    <a href={href} className="block" id={`quick-action-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      {content}
    </a>
  );
}
