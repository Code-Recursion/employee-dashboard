import type { EmployeeApiRecord, EmployeeListItem } from '@/types/employee';

const parseDate = (value: string): Date => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid date value: ${value}`);
  }

  return parsed;
};

export const parseEmployee = (record: EmployeeApiRecord): EmployeeListItem => ({
  id: record.id,
  fullName: record.full_name,
  email: record.email,
  gender: record.gender,
  createdAt: parseDate(record.createdAt),
  updatedAt: parseDate(record.updatedAt),
  jobTitle: record.jobTitle,
  country: record.country,
  joiningDate: parseDate(record.joiningDate),
  department: record.department,
  employmentType: record.employmentType,
  salary: record.salary,
});

export const parseEmployees = (records: EmployeeApiRecord[]): EmployeeListItem[] =>
  records.map(parseEmployee);
