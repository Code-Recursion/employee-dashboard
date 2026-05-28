import { InsightsDashboard } from "@/components/insights/InsightsDashboard";

export default function InsightsPage() {
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">
          Insights & Analytics
        </h1>
        <p className="text-neutral-500 mt-1">
          Overview of company metrics and performance.
        </p>
      </div>

      <InsightsDashboard />
    </div>
  );
}
