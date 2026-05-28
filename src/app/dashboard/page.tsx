import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { SAMPLE_DATA } from "@/lib/seed/sample_data";
import { parseEmployees } from "@/lib/parsers/employee";

export default function DashboardPage() {
  const sampleData = parseEmployees(SAMPLE_DATA).slice(0, 10);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-300">
            Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage and view employee salary information.
          </p>
        </div>
        <Button>Add Employee</Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search employees by name or role..."
              className="pl-9 w-full"
            />
          </div>
          <Button variant="secondary" className="shrink-0">
            Search
          </Button>
        </div>

        <div className="rounded-md border border-neutral-200">
          <Table>
            <TableHeader className="bg-black">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="text-neutral-600">{employee.id}</TableCell>
                  <TableCell className="font-medium text-neutral-900">
                    {employee.fullName}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.email}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.gender}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.jobTitle}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.country}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.department}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{employee.employmentType}</Badge>
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.joiningDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.updatedAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-neutral-600">
                    {employee.salary.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="default" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
