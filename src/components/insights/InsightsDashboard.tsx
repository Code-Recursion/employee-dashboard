"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, TrendingDown, TrendingUp } from "lucide-react";
import {
  DashboardAnalyticsApi,
  DashboardAnalyticsApiError,
} from "@/lib/api/dashboard-analytics";
import type { DashboardAnalytics } from "@/models/dashboard-analytics.types";

const formatSalary = (value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: 0 });

export function InsightsDashboard() {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const analytics = await DashboardAnalyticsApi.get();
        if (!cancelled) setData(analytics);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof DashboardAnalyticsApiError
              ? err.message
              : "Failed to load analytics.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const overview = data?.overview;

  const stats = overview
    ? [
        {
          title: "Total Employees",
          value: overview.totalEmployees.toLocaleString(),
          icon: Users,
        },
        {
          title: "Average Salary",
          value: formatSalary(overview.averageSalary),
          icon: DollarSign,
        },
        {
          title: "Minimum Salary",
          value: formatSalary(overview.minimumSalary),
          icon: TrendingDown,
        },
        {
          title: "Maximum Salary",
          value: formatSalary(overview.maximumSalary),
          icon: TrendingUp,
        },
      ]
    : [];

  return (
    <>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 h-28 animate-pulse"
              />
            ))
          : stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 flex flex-col"
                >
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <h3 className="tracking-tight text-sm font-medium text-neutral-500">
                      {stat.title}
                    </h3>
                    <Icon className="h-4 w-4 text-neutral-400" />
                  </div>
                  <div className="mt-2">
                    <div className="text-2xl font-bold text-neutral-900">
                      {stat.value}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <InsightListCard
          title="Salary distribution"
          loading={loading}
          empty={!data?.salaryDistribution.length}
          rows={data?.salaryDistribution.map((b) => ({
            label: b.range,
            value: `${b.count.toLocaleString()} employees`,
          }))}
        />
        <InsightListCard
          title="Top paying countries"
          loading={loading}
          empty={!data?.topPayingCountries.length}
          rows={data?.topPayingCountries.map((c) => ({
            label: c.country,
            value: `avg ${formatSalary(c.averageSalary)}`,
          }))}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <InsightListCard
          title="By country"
          loading={loading}
          empty={!data?.countryInsights.length}
          rows={data?.countryInsights.slice(0, 8).map((c) => ({
            label: c.country,
            value: `${c.employeeCount.toLocaleString()} · avg ${formatSalary(c.averageSalary)}`,
          }))}
        />
        <InsightListCard
          title="By job title"
          loading={loading}
          empty={!data?.jobTitleInsights.length}
          rows={data?.jobTitleInsights.slice(0, 8).map((j) => ({
            label: j.jobTitle,
            value: `${j.employeeCount.toLocaleString()} · avg ${formatSalary(j.averageSalary)}`,
          }))}
        />
      </div>
    </>
  );
}

function InsightListCard({
  title,
  loading,
  empty,
  rows = [],
}: {
  title: string;
  loading: boolean;
  empty: boolean;
  rows?: { label: string; value: string }[];
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 min-h-[280px]">
      <h2 className="text-sm font-medium text-neutral-500 mb-4">{title}</h2>
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-neutral-100 rounded animate-pulse" />
          ))}
        </div>
      ) : empty ? (
        <p className="text-neutral-400 text-sm">No data yet.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex justify-between gap-4 text-sm text-neutral-900"
            >
              <span className="font-medium truncate">{row.label}</span>
              <span className="text-neutral-500 shrink-0">{row.value}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
