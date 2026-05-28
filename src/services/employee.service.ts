import {
  Employee,
  CreateEmployeePayload,
  UpdateEmployeePayload,
  EmploymentType,
  EmployeeListQuery,
  PaginatedEmployeesResponse,
} from '../models/employee.types';
import { EmployeeStatus } from '../constants';
import { prisma } from "@/lib/prisma";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const SORTABLE_FIELDS = {
  salary: "salary",
  joiningDate: "joiningDate",
  fullName: "fullName",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  country: "country",
  jobTitle: "jobTitle",
  department: "department",
} as const;

type SortableField = keyof typeof SORTABLE_FIELDS;

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
  async getEmployees(query: EmployeeListQuery = {}): Promise<PaginatedEmployeesResponse> {
    const page = Math.max(1, query.page ?? DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, query.limit ?? DEFAULT_LIMIT));
    const skip = (page - 1) * limit;

    const searchTerm = query.search?.trim();

    const where = {
      ...(query.country
        ? { country: { contains: query.country, mode: "insensitive" as const } }
        : {}),
      ...(query.jobTitle
        ? { jobTitle: { contains: query.jobTitle, mode: "insensitive" as const } }
        : {}),
      ...(query.department
        ? { department: { contains: query.department, mode: "insensitive" as const } }
        : {}),
      ...(query.employmentType ? { employmentType: query.employmentType } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(searchTerm
        ? {
            OR: [
              { fullName: { contains: searchTerm, mode: "insensitive" as const } },
              { email: { contains: searchTerm, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const sortField =
      query.sortBy && query.sortBy in SORTABLE_FIELDS
        ? SORTABLE_FIELDS[query.sortBy as SortableField]
        : "createdAt";

    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip,
        take: limit,
      }),
      prisma.employee.count({ where }),
    ]);

    return {
      data: employees.map(toEmployee),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
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
