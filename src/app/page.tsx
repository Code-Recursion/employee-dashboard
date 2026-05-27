import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BarChart3, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white p-6 md:p-12">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900">
          Simplify your <span className="text-neutral-500">Salary Management</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          The all-in-one platform to manage employee compensation, analyze salary trends, and gain actionable insights for your organization.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/dashboard">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/insights">
            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
              View Insights <BarChart3 className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 pt-16">
          <div className="flex flex-col items-center p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-neutral-200">
              <Users className="h-6 w-6 text-neutral-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Employee Database</h3>
            <p className="text-neutral-500 text-sm">Easily track and manage all employee information in one secure location.</p>
          </div>
          <div className="flex flex-col items-center p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-neutral-200">
              <BarChart3 className="h-6 w-6 text-neutral-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analytics & Reporting</h3>
            <p className="text-neutral-500 text-sm">Generate comprehensive reports and visualize salary distributions effortlessly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
