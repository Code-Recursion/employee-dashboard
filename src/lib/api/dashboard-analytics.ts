import type { DashboardAnalytics } from "@/models/dashboard-analytics.types";

const BASE_URL = "/api/dashboard/analytics";

export class DashboardAnalyticsApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DashboardAnalyticsApiError";
    this.status = status;
  }
}

type ApiErrorBody = { error?: string };

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json()) as T & ApiErrorBody;

  if (!response.ok) {
    throw new DashboardAnalyticsApiError(
      body.error ?? "Request failed",
      response.status,
    );
  }

  return body;
};

export const DashboardAnalyticsApi = {
  /** GET /api/dashboard/analytics — salary insights and aggregates */
  get(): Promise<DashboardAnalytics> {
    return request<DashboardAnalytics>(BASE_URL);
  },
};
