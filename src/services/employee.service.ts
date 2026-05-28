import { Employee, CreateEmployeePayload, UpdateEmployeePayload, EmploymentType } from '../models/employee.types';
import { EmployeeStatus } from '../constants';
import { prisma } from "@/lib/prisma";

const buildFullName = (firstName: string, lastName: string): string =>
  `${firstName.trim()} ${lastName.trim()}`.trim();

const toEmployee = (record: {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  jobTitle: string;
  department: string;
  employmentType: string;
  country: string;
  salary: number | { toString(): string };
  joiningDate: Date;
  status: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}): Employee => ({
  id: record.id,
  firstName: record.firstName,
  lastName: record.lastName,
  fullName: record.fullName,
  email: record.email,
  jobTitle: record.jobTitle,
  department: record.department,
  employmentType: record.employmentType as EmploymentType,
  country: record.country,
  salary: Number(record.salary),
  joiningDate: record.joiningDate,
  status: record.status as EmployeeStatus,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

export const EmployeeService = {
  async getEmployees(): Promise<Employee[]> {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: "desc" },
    });
    return employees.map(toEmployee);
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) return null;
    return toEmployee(employee);
  },

  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const firstName = payload.firstName?.trim();
    const lastName = payload.lastName?.trim();

    if (!firstName || !lastName) {
      throw new Error("firstName and lastName are required.");
    }

    const employee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        fullName: buildFullName(firstName, lastName),
        email: payload.email,
        jobTitle: payload.jobTitle,
        department: payload.department,
        employmentType: payload.employmentType,
        country: payload.country,
        salary: payload.salary,
        joiningDate: payload.joiningDate,
        status: payload.status ?? "active",
      },
    });

    return toEmployee(employee);
  },

  async updateEmployee(id: string, payload: UpdateEmployeePayload): Promise<Employee> {
    const existing = await prisma.employee.findUnique({ where: { id } });
    if (!existing) {
      throw new Error("Employee not found");
    }

    const firstName = payload.firstName?.trim() ?? existing.firstName;
    const lastName = payload.lastName?.trim() ?? existing.lastName;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        firstName,
        lastName,
        fullName: buildFullName(firstName, lastName),
        ...(payload.email !== undefined ? { email: payload.email } : {}),
        ...(payload.jobTitle !== undefined ? { jobTitle: payload.jobTitle } : {}),
        ...(payload.department !== undefined ? { department: payload.department } : {}),
        ...(payload.employmentType !== undefined
          ? { employmentType: payload.employmentType }
          : {}),
        ...(payload.country !== undefined ? { country: payload.country } : {}),
        ...(payload.salary !== undefined ? { salary: payload.salary } : {}),
        ...(payload.joiningDate !== undefined ? { joiningDate: payload.joiningDate } : {}),
        ...(payload.status !== undefined ? { status: payload.status } : {}),
      },
    });

    return toEmployee(employee);
  },

  async deleteEmployee(id: string): Promise<void> {
    await prisma.employee.delete({ where: { id } });
  },
};
