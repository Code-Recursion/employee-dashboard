export type EmployeeWithSalary = {
  salary: number;
};

export function calculateAverageSalary(
  employees: EmployeeWithSalary[],
): number {
  if (employees.length === 0) return 0;

  const total = employees.reduce((sum, employee) => sum + employee.salary, 0);
  return total / employees.length;
}

export function calculateMinSalary(employees: EmployeeWithSalary[]): number {
  if (employees.length === 0) return 0;

  return Math.min(...employees.map((employee) => employee.salary));
}

export function calculateMaxSalary(employees: EmployeeWithSalary[]): number {
  if (employees.length === 0) return 0;

  return Math.max(...employees.map((employee) => employee.salary));
}
