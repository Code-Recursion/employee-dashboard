export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
] as const;

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  TERMINATED: 'terminated',
} as const;

export type Department = typeof DEPARTMENTS[number];
export type EmployeeStatus = typeof EMPLOYEE_STATUS[keyof typeof EMPLOYEE_STATUS];
