export type ReportRangePreset = "7d" | "30d" | "90d" | "12m" | "all" | "custom";

export interface ParsedReportRange {
  preset: ReportRangePreset;
  startDate: Date;
  endDate: Date;
  priorStartDate: Date | null;
  priorEndDate: Date | null;
  fromStr: string; // YYYY-MM-DD (MYT)
  toStr: string;   // YYYY-MM-DD (MYT)
  label: string;
  grouping: "day" | "week" | "month";
}

export const REPORT_PRESET_LABELS: Record<ReportRangePreset, string> = {
  "7d": "7 Hari",
  "30d": "30 Hari",
  "90d": "90 Hari",
  "12m": "12 Bulan",
  all: "Semua Masa",
  custom: "Tersuai",
};

export interface AdminReportSummary {
  revenue: number;
  revenueDiffPct: number | null;
  paidOrders: number;
  paidOrdersDiffPct: number | null;
  newUsers: number;
  newUsersDiffPct: number | null;
  newInvitations: number;
  newInvitationsDiffPct: number | null;
  publishedInvitations: number;
  publishedInvitationsDiffPct: number | null;
  averageOrderValue: number;
  averageOrderValueDiffPct: number | null;
}

export interface RevenueSeriesPoint {
  label: string;
  dateKey: string;
  revenue: number;
  paidOrders: number;
}

export interface PaymentStatusMetrics {
  paid: number;
  pending_verification: number;
  pending_payment: number;
  payment_rejected: number;
  cancelled: number;
  refunded: number;
  totalOrdersInPeriod: number;
  conversionRate: number;
}

export interface InvitationAnalyticsMetrics {
  series: { label: string; dateKey: string; created: number; published: number }[];
  currentStatus: {
    draft: number;
    published: number;
    expired: number;
    archived: number;
    total: number;
  };
  periodCreated: number;
  periodPublished: number;
}

export interface CustomerAnalyticsMetrics {
  series: { label: string; dateKey: string; count: number }[];
  periodNewUsers: number;
  periodPaidCustomers: number;
  periodRepeatCustomers: number;
  lifetimeTotalClients: number;
  lifetimePaidClients: number;
  lifetimeRepeatClients: number;
}

export interface TemplatePerformanceItem {
  id: string;
  name: string;
  slug: string;
  status: string;
  thumbnail_url: string | null;
  invitationsCount: number;
  paidOrdersCount: number;
  revenue: number;
  revenueShare: number;
  conversionRate: number;
}

export interface AdminReportsPageData {
  range: ParsedReportRange;
  summary: AdminReportSummary;
  revenueSeries: RevenueSeriesPoint[];
  paymentMetrics: PaymentStatusMetrics;
  invitationMetrics: InvitationAnalyticsMetrics;
  customerMetrics: CustomerAnalyticsMetrics;
  templatePerformance: TemplatePerformanceItem[];
}
