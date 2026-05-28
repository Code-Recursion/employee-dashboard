import { Prisma } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createEmployeePayload,
  createdEmployeeRecord,
} from "@/test/fixtures/employee";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: {
      create: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import { EmployeeService } from "./employee.service";

const mockCreate = vi.mocked(prisma.employee.create);

describe("EmployeeService.createEmployee", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an employee successfully", async () => {
    mockCreate.mockResolvedValue(createdEmployeeRecord);

    const employee = await EmployeeService.createEmployee(createEmployeePayload);

    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        firstName: "Jane",
        lastName: "Doe",
        fullName: "Jane Doe",
        email: createEmployeePayload.email,
        jobTitle: createEmployeePayload.jobTitle,
        department: createEmployeePayload.department,
        employmentType: createEmployeePayload.employmentType,
        country: createEmployeePayload.country,
        salary: createEmployeePayload.salary,
        joiningDate: createEmployeePayload.joiningDate,
        status: "active",
      },
    });

    expect(employee).toMatchObject({
      id: createdEmployeeRecord.id,
      fullName: "Jane Doe",
      email: createEmployeePayload.email,
      salary: 1_500_000,
      status: "active",
    });
  });

  it("rejects duplicate email from the database", async () => {
    mockCreate.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed on the fields: (`email`)",
        {
          code: "P2002",
          clientVersion: "7.8.0",
          meta: { modelName: "Employee", target: ["email"] },
        },
      ),
    );

    await expect(
      EmployeeService.createEmployee(createEmployeePayload),
    ).rejects.toMatchObject({ code: "P2002" });
  });

  it("rejects invalid payload when names are missing", async () => {
    await expect(
      EmployeeService.createEmployee({
        ...createEmployeePayload,
        firstName: "   ",
        lastName: "",
      }),
    ).rejects.toThrow("firstName and lastName are required.");

    expect(mockCreate).not.toHaveBeenCalled();
  });
});
