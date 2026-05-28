import { EmployeeTable } from "@/components/dashboard/EmployeeTable";

export default function DashboardPage() {
  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
      <EmployeeTable />
    </div>
  );
}
