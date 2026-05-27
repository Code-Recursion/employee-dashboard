
import { DollarSign, Users, Briefcase, Activity } from "lucide-react";

export default function InsightsPage() {
  const stats = [
    { title: "Total Employees", value: "1,245", change: "+12% from last month", icon: Users },
    { title: "Average Salary", value: "$95,200", change: "+4% from last month", icon: DollarSign },
    { title: "Open Positions", value: "32", change: "-2 from last month", icon: Briefcase },
    { title: "Active Projects", value: "148", change: "+24% from last month", icon: Activity },
  ];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-100">Insights & Analytics</h1>
        <p className="text-neutral-500 mt-1">Overview of company metrics and performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 flex flex-col">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium text-neutral-500">{stat.title}</h3>
                <Icon className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                <p className="text-xs text-neutral-500 mt-1">{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 min-h-[300px] flex items-center justify-center">
          <p className="text-neutral-400 font-medium">Chart Component Placeholder (e.g. Salary Distribution)</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 min-h-[300px] flex items-center justify-center">
          <p className="text-neutral-400 font-medium">Chart Component Placeholder (e.g. Hiring Trends)</p>
        </div>
      </div>
    </div>
  );
}
