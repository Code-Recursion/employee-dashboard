import { z } from "zod";
import {
  COUNTRIES,
  DEPARTMENTS,
  EMPLOYEE_STATUS,
  EMPLOYMENT_TYPES,
  JOB_TITLES,
} from "@/constants";

export const employeeFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email address"),
  jobTitle: z.enum(JOB_TITLES, { message: "Job title is required" }),
  department: z.enum(DEPARTMENTS, { message: "Department is required" }),
  employmentType: z.enum(EMPLOYMENT_TYPES, {
    message: "Employment type is required",
  }),
  country: z.enum(COUNTRIES, { message: "Country is required" }),
  salary: z.coerce.number().positive("Salary must be greater than 0"),
  joiningDate: z.string().min(1, "Joining date is required"),
  status: z.enum(EMPLOYEE_STATUS).optional(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
