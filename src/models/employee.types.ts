import { Department, EmployeeStatus } from '../constants';

export type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'INTERN';

export interface EmployeeSeedRecord {
  id: number;
  fullName: string;
  email: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  jobTitle: string;
  country: string;
  joiningDate: string;
  department: string;
  employmentType: EmploymentType;
  salary: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: Department | string;
  employmentType: EmploymentType;
  country: string;
  salary: number;
  joiningDate: Date;
  status: EmployeeStatus;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface CreateEmployeePayload {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  department: Department | string;
  employmentType: EmploymentType;
  country: string;
  salary: number;
  joiningDate: string | Date;
  status?: EmployeeStatus;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;

// Metrics Types
export interface CountrySalaryMetrics {
  country: string;
  min_salary: number;
  max_salary: number;
  avg_salary: number;
  employee_count: number;
  total_payroll: number;
}

export interface JobTitleSalaryMetrics {
  job_title: string;
  country: string;
  avg_salary: number;
  employee_count: number;
}
