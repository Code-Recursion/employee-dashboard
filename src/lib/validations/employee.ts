import { z } from "zod";

export const employeeFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  jobTitle: z.string().trim().min(1, "Job title is required"),
  department: z.string().trim().min(1, "Department is required"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "INTERN"], {
    message: "Employment type is required",
  }),
  country: z.string().trim().min(1, "Country is required"),
  salary: z.coerce.number().positive("Salary must be greater than 0"),
  joiningDate: z.string().min(1, "Joining date is required"),
  status: z.enum(["active", "inactive", "terminated"]).optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
