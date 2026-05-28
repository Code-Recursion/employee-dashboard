import type { EmployeeSeedRecord, EmploymentType } from '@/models/employee.types';

export type EmployeeApiRecord = EmployeeSeedRecord;

export interface EmployeeListItem {
  id: number;
  fullName: string;
  email: string;
  gender: string;
  createdAt: Date;
  updatedAt: Date;
  jobTitle: string;
  country: string;
  joiningDate: Date;
  department: string;
  employmentType: EmploymentType;
  salary: number;
}
