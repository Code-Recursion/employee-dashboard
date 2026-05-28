import { prisma } from "@/lib/prisma";
import type {
  CountryInsight,
  DashboardAnalytics,
  JobTitleInsight,
  SalaryDistributionBucket,
  SalaryOverview,
  TopPayingCountry,
} from "@/models/dashboard-analytics.types";

const TOP_PAYING_LIMIT = 10;

const SALARY_DISTRIBUTION_RANGES = [
  { range: "0-5L", min: 0, max: 500_000 },
  { range: "5L-10L", min: 500_000, max: 1_000_000 },
  { range: "10L-20L", min: 1_000_000, max: 2_000_000 },
  { range: "20L+", min: 2_000_000, max: null },
] as const;

const toNumber = (value: unknown): number => {
  if (value == null) return 0;
  return Number(value);
};

const emptyOverview = (): SalaryOverview => ({
  totalEmployees: 0,
  averageSalary: 0,
  minimumSalary: 0,
  maximumSalary: 0,
});

export const DashboardAnalyticsService = {
  async getAnalytics(): Promise<DashboardAnalytics> {
    const [overviewAgg, countryGroups, jobTitleGroups, salaryRows] =
      await Promise.all([
        prisma.employee.aggregate({
          _count: { _all: true },
          _avg: { salary: true },
          _min: { salary: true },
          _max: { salary: true },
        }),
        prisma.employee.groupBy({
          by: ["country"],
          _count: { _all: true },
          _avg: { salary: true },
          _min: { salary: true },
          _max: { salary: true },
          orderBy: { _count: { country: "desc" } },
        }),
        prisma.employee.groupBy({
          by: ["jobTitle"],
          _count: { _all: true },
          _avg: { salary: true },
          orderBy: { _count: { jobTitle: "desc" } },
        }),
        prisma.$queryRaw<{ range: string; count: bigint }[]>`
          SELECT bucket AS range, COUNT(*)::bigint AS count
          FROM (
            SELECT CASE
              WHEN salary < 500000 THEN '0-5L'
              WHEN salary < 1000000 THEN '5L-10L'
              WHEN salary < 2000000 THEN '10L-20L'
              ELSE '20L+'
            END AS bucket
            FROM employees
          ) AS buckets
          GROUP BY bucket
          ORDER BY MIN(
            CASE bucket
              WHEN '0-5L' THEN 1
              WHEN '5L-10L' THEN 2
              WHEN '10L-20L' THEN 3
              ELSE 4
            END
          )
        `,
      ]);

    const overview: SalaryOverview =
      overviewAgg._count._all === 0
        ? emptyOverview()
        : {
            totalEmployees: overviewAgg._count._all,
            averageSalary: Math.round(toNumber(overviewAgg._avg.salary)),
            minimumSalary: toNumber(overviewAgg._min.salary),
            maximumSalary: toNumber(overviewAgg._max.salary),
          };

    const countryInsights: CountryInsight[] = countryGroups.map((row) => ({
      country: row.country,
      employeeCount: row._count._all,
      averageSalary: Math.round(toNumber(row._avg.salary)),
      minimumSalary: toNumber(row._min.salary),
      maximumSalary: toNumber(row._max.salary),
    }));

    const jobTitleInsights: JobTitleInsight[] = jobTitleGroups.map((row) => ({
      jobTitle: row.jobTitle,
      employeeCount: row._count._all,
      averageSalary: Math.round(toNumber(row._avg.salary)),
    }));

    const distributionByRange = new Map(
      salaryRows.map((row) => [row.range, Number(row.count)]),
    );

    const salaryDistribution: SalaryDistributionBucket[] =
      SALARY_DISTRIBUTION_RANGES.map(({ range }) => ({
        range,
        count: distributionByRange.get(range) ?? 0,
      }));

    const topPayingCountries: TopPayingCountry[] = [...countryInsights]
      .sort((a, b) => b.averageSalary - a.averageSalary)
      .slice(0, TOP_PAYING_LIMIT)
      .map(({ country, averageSalary }) => ({ country, averageSalary }));

    return {
      overview,
      countryInsights,
      jobTitleInsights,
      salaryDistribution,
      topPayingCountries,
    };
  },
};
