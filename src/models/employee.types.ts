import { Department, EmployeeStatus } from '../constants';

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  job_title: string;
  department: Department | string;
  country: string;
  salary: number;
  joining_date: string; // ISO date string or Date object depending on DB client
  status: EmployeeStatus;
  created_at?: string;
  updated_at?: string;
}

export type CreateEmployeePayload = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;
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
