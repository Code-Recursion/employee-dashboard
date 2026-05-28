import type { CreateEmployeePayload } from "@/models/employee.types";

export const createEmployeePayload: CreateEmployeePayload = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.doe@example.com",
  jobTitle: "Frontend Engineer",
  department: "Engineering",
  employmentType: "FULL_TIME",
  country: "India",
  salary: 1_500_000,
  joiningDate: "2024-01-15",
};

export const createdEmployeeRecord = {
  id: "emp-123",
  firstName: "Jane",
  lastName: "Doe",
  fullName: "Jane Doe",
  email: "jane.doe@example.com",
  jobTitle: "Frontend Engineer",
  department: "Engineering",
  employmentType: "FULL_TIME",
  country: "India",
  salary: 1_500_000,
  joiningDate: new Date("2024-01-15"),
  status: "active",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};
