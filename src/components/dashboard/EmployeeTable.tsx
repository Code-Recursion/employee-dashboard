"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
import { Search, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeApi, EmployeeApiError } from "@/lib/api/employees";
import { EmployeeFormDialog } from "@/components/dashboard/EmployeeFormDialog";
import type { Employee, PaginationMeta } from "@/models/employee.types";

const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
};

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = useCallback(async (searchTerm?: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await EmployeeApi.list({
        page: 1,
        limit: 20,
        search: searchTerm?.trim() || undefined,
        sortBy: "createdAt",
        sortOrder: "desc",
      });

      setEmployees(result.data);
      setPagination(result.pagination);
    } catch (err) {
      const message =
        err instanceof EmployeeApiError
          ? err.message
          : "Failed to load employees.";
      setError(message);
      setEmployees([]);
      setPagination(null);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = () => {
    fetchEmployees(search);
  };

  const openCreate = () => {
    setFormMode("create");
    setSelectedEmployee(null);
    setFormOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setFormMode("edit");
    setSelectedEmployee(employee);
    setFormOpen(true);
  };

  const openDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    setDeleting(true);
    try {
      await EmployeeApi.remove(employeeToDelete.id);
      toast.success(`${employeeToDelete.fullName} deleted successfully.`);
      setDeleteOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees(search);
    } catch (err) {
      const message =
        err instanceof EmployeeApiError ? err.message : "Failed to delete employee.";
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-300">
            Dashboard
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage and view employee salary information.
          </p>
        </div>
        <Button onClick={openCreate}>Add Employee</Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search employees by name..."
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button
            variant="secondary"
            className="shrink-0"
            onClick={handleSearch}
            disabled={loading}
          >
            Search
          </Button>
        </div>

        {error && (
          <p className="text-sm text-red-600 mb-4">{error}</p>
        )}

        {pagination && !error && (
          <p className="text-sm text-neutral-500 mb-4">
            Showing {employees.length} of {pagination.total} employees
            (page {pagination.page} of {pagination.totalPages || 1})
          </p>
        )}

        <div className="rounded-md border border-neutral-200">
          <Table>
            <TableHeader className="bg-black">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-neutral-500 py-8">
                    Loading employees...
                  </TableCell>
                </TableRow>
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-neutral-500 py-8">
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium text-neutral-900">
                      {employee.fullName}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {employee.email}
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
                    <TableCell className="text-neutral-600 capitalize">
                      {employee.status}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {formatDate(employee.joiningDate)}
                    </TableCell>
                    <TableCell className="text-neutral-600">
                      {employee.salary.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEdit(employee)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDelete(employee)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <EmployeeFormDialog
        mode={formMode}
        employee={selectedEmployee}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => fetchEmployees(search)}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <strong>{employeeToDelete?.fullName}</strong> from the system. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
