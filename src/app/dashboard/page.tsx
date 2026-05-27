import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function DashboardPage() {
  const sampleData = [
    { id: "1", name: "Alice Johnson", role: "Software Engineer", salary: "$120,000", status: "Active" },
    { id: "2", name: "Bob Smith", role: "Product Manager", salary: "$135,000", status: "Active" },
    { id: "3", name: "Charlie Brown", role: "UX Designer", salary: "$110,000", status: "On Leave" },
    { id: "4", name: "Diana Prince", role: "Data Scientist", salary: "$145,000", status: "Active" },
    { id: "5", name: "Evan Wright", role: "Marketing Lead", salary: "$105,000", status: "Inactive" },
  ];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-300">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Manage and view employee salary information.</p>
        </div>
        <Button>Add Employee</Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input placeholder="Search employees by name or role..." className="pl-9 w-full" />
          </div>
          <Button variant="secondary" className="shrink-0">Search</Button>
        </div>

        <div className="rounded-md border border-neutral-200">
          <Table>
            <TableHeader className="bg-black">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium text-neutral-900">{employee.name}</TableCell>
                  <TableCell className="text-neutral-600">{employee.role}</TableCell>
                  <TableCell className="text-neutral-600">{employee.salary}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="default" size="sm">View</Button>
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
