"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeApi, EmployeeApiError } from "@/lib/api/employees";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "@/lib/validations/employee";
import {
  COUNTRIES,
  DEPARTMENTS,
  EMPLOYEE_STATUS,
  EMPLOYMENT_TYPE_LABELS,
  EMPLOYMENT_TYPES,
  JOB_TITLES,
} from "@/constants";
import type { Employee } from "@/models/employee.types";

type EmployeeFormState = {
  [K in keyof EmployeeFormValues]: K extends
    | "jobTitle"
    | "department"
    | "country"
    ? EmployeeFormValues[K] | ""
    : EmployeeFormValues[K];
};

const emptyForm: EmployeeFormState = {
  firstName: "",
  lastName: "",
  email: "",
  jobTitle: "",
  department: "",
  employmentType: "FULL_TIME",
  country: "",
  salary: 0,
  joiningDate: "",
  status: "active",
};

const toFormValues = (employee: Employee): EmployeeFormState => ({
  firstName: employee.firstName,
  lastName: employee.lastName,
  email: employee.email,
  jobTitle: employee.jobTitle as unknown as EmployeeFormState["jobTitle"],
  department: employee.department as unknown as EmployeeFormState["department"],
  employmentType: employee.employmentType,
  country: employee.country as unknown as EmployeeFormState["country"],
  salary: employee.salary,
  joiningDate: new Date(employee.joiningDate).toISOString().slice(0, 10),
  status: employee.status,
});

interface EmployeeFormDialogProps {
  mode: "create" | "edit";
  employee?: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EmployeeFormDialog({
  mode,
  employee,
  open,
  onOpenChange,
  onSuccess,
}: EmployeeFormDialogProps) {
  const [form, setForm] = useState<EmployeeFormState>(emptyForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof EmployeeFormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(mode === "edit" && employee ? toFormValues(employee) : emptyForm);
  }, [open, mode, employee]);

  const updateField = <K extends keyof EmployeeFormState>(
    key: K,
    value: EmployeeFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = employeeFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof EmployeeFormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof EmployeeFormState;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      toast.error("Please fix the form errors.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...parsed.data,
        joiningDate: new Date(parsed.data.joiningDate).toISOString(),
      };

      if (mode === "create") {
        await EmployeeApi.create(payload);
        toast.success("Employee created successfully.");
      } else if (employee) {
        await EmployeeApi.update(employee.id, payload);
        toast.success("Employee updated successfully.");
      }

      onOpenChange(false);
      onSuccess();
    } catch (err) {
      const message =
        err instanceof EmployeeApiError ? err.message : "Something went wrong.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Employee" : "Edit Employee"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new employee record."
              : "Update employee details."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name *" error={errors.firstName}>
              <Input
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                aria-invalid={!!errors.firstName}
              />
            </Field>
            <Field label="Last name *" error={errors.lastName}>
              <Input
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                aria-invalid={!!errors.lastName}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Email *" error={errors.email}>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                aria-invalid={!!errors.email}
              />
            </Field>

            <Field label="Job title *" error={errors.jobTitle}>
              <Select
                value={form.jobTitle || undefined}
                onValueChange={(value) =>
                  updateField(
                    "jobTitle",
                    (value ?? "") as EmployeeFormValues["jobTitle"],
                  )
                }
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.jobTitle}
                >
                  <SelectValue placeholder="Select job title" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_TITLES.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Department *" error={errors.department}>
              <Select
                value={form.department || undefined}
                onValueChange={(value) =>
                  updateField(
                    "department",
                    (value ?? "") as EmployeeFormValues["department"],
                  )
                }
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.department}
                >
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Employment type *" error={errors.employmentType}>
              <Select
                value={form.employmentType}
                onValueChange={(value) =>
                  updateField(
                    "employmentType",
                    (value ??
                      "FULL_TIME") as EmployeeFormValues["employmentType"],
                  )
                }
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.employmentType}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {EMPLOYMENT_TYPE_LABELS[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Country *" error={errors.country}>
              <Select
                value={form.country || undefined}
                onValueChange={(value) =>
                  updateField(
                    "country",
                    (value ?? "") as EmployeeFormValues["country"],
                  )
                }
              >
                <SelectTrigger
                  className="w-full"
                  aria-invalid={!!errors.country}
                >
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Salary *" error={errors.salary}>
              <Input
                type="number"
                min={0}
                value={form.salary || ""}
                onChange={(e) => updateField("salary", Number(e.target.value))}
                aria-invalid={!!errors.salary}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Joining date *" error={errors.joiningDate}>
              <Input
                type="date"
                value={form.joiningDate}
                onChange={(e) => updateField("joiningDate", e.target.value)}
                aria-invalid={!!errors.joiningDate}
              />
            </Field>

            {mode === "edit" && (
              <Field label="Status *" error={errors.status}>
                <Select
                  value={form.status ?? "active"}
                  onValueChange={(value) =>
                    updateField(
                      "status",
                      (value ?? "active") as EmployeeFormValues["status"],
                    )
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYEE_STATUS.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <label className="text-sm font-medium text-neutral-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
