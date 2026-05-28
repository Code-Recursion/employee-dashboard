export const EMPLOYMENT_TYPES = [
  "FULL_TIME",
  "PART_TIME",
  "INTERN",
] as const;

export const EMPLOYEE_STATUS = [
  "active",
  "inactive",
  "terminated",
] as const;

export const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "HR",
  "Finance",
  "Operations",
  "Marketing",
  "Sales",
  "Customer Support",
] as const;

export const JOB_TITLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "Engineering Manager",
  "QA Engineer",
  "DevOps Engineer",
  "Product Designer",
  "Product Manager",
  "Data Analyst",
  "HR Manager",
  "Sales Executive",
  "Marketing Specialist",
] as const;

export const COUNTRIES = [
  "India",
  "USA",
  "Canada",
  "Germany",
  "UK",
  "Australia",
  "Singapore",
] as const;

export const EMPLOYMENT_TYPE_LABELS: Record<
  (typeof EMPLOYMENT_TYPES)[number],
  string
> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  INTERN: "Intern",
};

export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];
export type EmployeeStatus = (typeof EMPLOYEE_STATUS)[number];
export type Department = (typeof DEPARTMENTS)[number];
export type JobTitle = (typeof JOB_TITLES)[number];
export type Country = (typeof COUNTRIES)[number];
