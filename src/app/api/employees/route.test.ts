import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createEmployeePayload,
  createdEmployeeRecord,
} from "@/test/fixtures/employee";

vi.mock("@/services/employee.service", () => ({
  EmployeeService: {
    createEmployee: vi.fn(),
    getEmployees: vi.fn(),
  },
}));

import { EmployeeService } from "@/services/employee.service";
import { POST } from "./route";

const mockCreateEmployee = vi.mocked(EmployeeService.createEmployee);

const postRequest = (body: unknown) =>
  new Request("http://localhost/api/employees", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("POST /api/employees", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 201 with created employee data", async () => {
    mockCreateEmployee.mockResolvedValue({
      ...createdEmployeeRecord,
      employmentType: "FULL_TIME",
      department: "Engineering",
    });

    const response = await POST(postRequest(createEmployeePayload));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(mockCreateEmployee).toHaveBeenCalledWith(createEmployeePayload);
    expect(body.data).toMatchObject({
      id: createdEmployeeRecord.id,
      email: createEmployeePayload.email,
      fullName: "Jane Doe",
    });
  });

  it("returns 500 when email already exists", async () => {
    mockCreateEmployee.mockRejectedValue(
      new Error("Unique constraint failed on the fields: (`email`)"),
    );

    const response = await POST(postRequest(createEmployeePayload));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toContain("Unique constraint failed");
  });

  it("returns 500 for invalid payload handling", async () => {
    mockCreateEmployee.mockRejectedValue(
      new Error("firstName and lastName are required."),
    );

    const response = await POST(
      postRequest({ ...createEmployeePayload, firstName: "", lastName: "" }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("firstName and lastName are required.");
  });
});
