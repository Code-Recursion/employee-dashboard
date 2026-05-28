"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { EmployeePagination } from "@/components/dashboard/EmployeePagination";
import {
  COUNTRIES,
  DEPARTMENTS,
  EMPLOYEE_STATUS,
  EMPLOYMENT_TYPE_LABELS,
  EMPLOYMENT_TYPES,
  JOB_TITLES,
} from "@/constants";
import type {
  Employee,
  EmployeeListQuery,
  PaginationMeta,
} from "@/models/employee.types";

type EmployeeFilters = {
  search: string;
  country: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

const emptyFilters: EmployeeFilters = {
  search: "",
  country: "",
  jobTitle: "",
  department: "",
  employmentType: "",
  status: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};

const filterInputClass =
  "h-8 text-sm bg-white text-neutral-900 placeholder:text-neutral-500";

const filterTriggerClass = `w-full ${filterInputClass} border-neutral-200`;

const SORT_OPTIONS = [
  {
    value: "Recently added",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    value: "Oldest first",
    sortBy: "createdAt",
    sortOrder: "asc",
  },
  {
    value: "Salary (high to low)",
    sortBy: "salary",
    sortOrder: "desc",
  },
  {
    value: "Salary (low to high)",
    sortBy: "salary",
    sortOrder: "asc",
  },
  {
    value: "Name A–Z",
    sortBy: "fullName",
    sortOrder: "asc",
  },
] as const;

const getSortOptionValue = (sortBy: string, sortOrder: string) =>
  SORT_OPTIONS.find(
    (option) => option.sortBy === sortBy && option.sortOrder === sortOrder,
  )?.value ?? SORT_OPTIONS[0].value;

const PAGE_SIZE = 20;

const toListQuery = (
  filters: EmployeeFilters,
  page: number,
): EmployeeListQuery => ({
  page,
  limit: PAGE_SIZE,
  search: filters.search.trim() || undefined,
  country: filters.country.trim() || undefined,
  jobTitle: filters.jobTitle.trim() || undefined,
  department: filters.department.trim() || undefined,
  employmentType:
    (filters.employmentType as EmployeeListQuery["employmentType"]) ||
    undefined,
  status: (filters.status as EmployeeListQuery["status"]) || undefined,
  sortBy: filters.sortBy || undefined,
  sortOrder: filters.sortOrder,
});

const formatDate = (value: string | Date | null | undefined) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
};

export function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [appliedFilters, setAppliedFilters] =
    useState<EmployeeFilters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = useCallback(
    async (queryFilters: EmployeeFilters, pageNumber: number) => {
      setLoading(true);
      setError(null);

      try {
        const result = await EmployeeApi.list(
          toListQuery(queryFilters, pageNumber),
        );

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
    },
    [],
  );

  useEffect(() => {
    fetchEmployees(emptyFilters, 1);
  }, [fetchEmployees]);

  const handleApplyFilters = useCallback(
    (nextFilters: EmployeeFilters) => {
      setAppliedFilters(nextFilters);
      setPage(1);
      fetchEmployees(nextFilters, 1);
    },
    [fetchEmployees],
  );

  const handleClearFilters = useCallback(() => {
    setAppliedFilters(emptyFilters);
    setPage(1);
    fetchEmployees(emptyFilters, 1);
  }, [fetchEmployees]);

  const handlePageChange = useCallback(
    (nextPage: number) => {
      setPage(nextPage);
      fetchEmployees(appliedFilters, nextPage);
    },
    [appliedFilters, fetchEmployees],
  );

  const openCreate = useCallback(() => {
    setFormMode("create");
    setSelectedEmployee(null);
    setFormOpen(true);
  }, []);

  const openEdit = useCallback((employee: Employee) => {
    setFormMode("edit");
    setSelectedEmployee(employee);
    setFormOpen(true);
  }, []);

  const openDelete = useCallback((employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteOpen(true);
  }, []);

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    setDeleting(true);
    try {
      await EmployeeApi.remove(employeeToDelete.id);
      toast.success(`${employeeToDelete.fullName} deleted successfully.`);
      setDeleteOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees(appliedFilters, page);
    } catch (err) {
      const message =
        err instanceof EmployeeApiError
          ? err.message
          : "Failed to delete employee.";
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
          <p className="text-neutral-300 mt-1">
            Manage and view employee salary information.
          </p>
        </div>
        <Button onClick={openCreate}>Add Employee</Button>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 mb-8">
        <EmployeeFiltersPanel
          loading={loading}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
        />

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <EmployeeDataTable
          employees={employees}
          loading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        {pagination && !error && (
          <EmployeePagination
            pagination={pagination}
            onPageChange={handlePageChange}
            disabled={loading}
          />
        )}
      </div>

      <EmployeeFormDialog
        mode={formMode}
        employee={selectedEmployee}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={() => fetchEmployees(appliedFilters, page)}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <strong>{employeeToDelete?.fullName}</strong> from the system.
              This action cannot be undone.
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

function EmployeeFiltersPanel({
  loading,
  onApply,
  onClear,
}: {
  loading: boolean;
  onApply: (filters: EmployeeFilters) => void;
  onClear: () => void;
}) {
  const [searchDraft, setSearchDraft] = useState("");
  const [filters, setFilters] = useState<EmployeeFilters>(emptyFilters);

  const updateFilter = <K extends keyof EmployeeFilters>(
    key: K,
    value: EmployeeFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply({ ...filters, search: searchDraft });
  };

  const handleClear = () => {
    setSearchDraft("");
    setFilters(emptyFilters);
    onClear();
  };

  return (
    <div className="space-y-3 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search by name or email..."
            className={`pl-9 w-full ${filterInputClass}`}
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="secondary" onClick={handleApply} disabled={loading}>
            Apply
          </Button>
          <Button
            className="bg-orange-200"
            onClick={handleClear}
            disabled={loading}
          >
            Clear
          </Button>
        </div>
      </div>

      <label className="text-zinc-800">Fitlers </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <FilterSelect
          value={filters.country}
          onChange={(value) => updateFilter("country", value)}
          placeholder="All countries"
          options={COUNTRIES}
        />
        <FilterSelect
          value={filters.jobTitle}
          onChange={(value) => updateFilter("jobTitle", value)}
          placeholder="All job titles"
          options={JOB_TITLES}
        />
        <FilterSelect
          value={filters.department}
          onChange={(value) => updateFilter("department", value)}
          placeholder="All departments"
          options={DEPARTMENTS}
        />
        <FilterSelect
          value={filters.employmentType}
          onChange={(value) => updateFilter("employmentType", value)}
          placeholder="All types"
          options={EMPLOYMENT_TYPES}
          getLabel={(value) =>
            EMPLOYMENT_TYPE_LABELS[
              value as keyof typeof EMPLOYMENT_TYPE_LABELS
            ] ?? value
          }
        />
        <FilterSelect
          value={filters.status}
          onChange={(value) => updateFilter("status", value)}
          placeholder="All status"
          options={EMPLOYEE_STATUS}
          getLabel={(value) =>
            value.charAt(0).toUpperCase() + value.slice(1)
          }
        />
        <Select
          value={getSortOptionValue(filters.sortBy, filters.sortOrder)}
          onValueChange={(next) => {
            const option = SORT_OPTIONS.find((item) => item.value === next);
            if (!option) return;
            updateFilter("sortBy", option.sortBy);
            updateFilter("sortOrder", option.sortOrder);
          }}
        >
          <SelectTrigger size="sm" className={filterTriggerClass}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

const EmployeeDataTable = memo(function EmployeeDataTable({
  employees,
  loading,
  onEdit,
  onDelete,
}: {
  employees: Employee[];
  loading: boolean;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}) {
  return (
    <div className="rounded-md border border-neutral-200">
      <Table>
        <TableHeader className="bg-black">
          <TableRow className="hover:bg-black">
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
              <TableCell
                colSpan={10}
                className="text-center text-neutral-500 py-8"
              >
                Loading employees...
              </TableCell>
            </TableRow>
          ) : employees.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-neutral-500 py-8"
              >
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
                      variant="secondary"
                      size="sm"
                      onClick={() => onEdit(employee)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(employee)}
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
  );
});

function FilterSelect<T extends string>({
  value,
  onChange,
  placeholder,
  options,
  getLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: readonly T[];
  getLabel?: (value: T) => string;
}) {
  return (
    <Select
      value={value || placeholder}
      onValueChange={(next) =>
        onChange(next === placeholder ? "" : (next ?? ""))
      }
    >
      <SelectTrigger size="sm" className={filterTriggerClass}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={placeholder}>{placeholder}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {getLabel ? getLabel(option) : option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
