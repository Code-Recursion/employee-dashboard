import { describe, expect, it } from "vitest";
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from "./employee";

const validPayload: EmployeeFormValues = {
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

describe("employeeFormSchema", () => {
  it("accepts a valid payload", () => {
    const result = employeeFormSchema.safeParse(validPayload);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validPayload);
    }
  });

  it.each([
    ["firstName", { firstName: "" }],
    ["lastName", { lastName: "   " }],
    ["email", { email: "" }],
    ["jobTitle", { jobTitle: "" }],
    ["department", { department: "" }],
    ["country", { country: "" }],
    ["joiningDate", { joiningDate: "" }],
  ] as const)("rejects missing required field: %s", (_field, override) => {
    const result = employeeFormSchema.safeParse({
      ...validPayload,
      ...override,
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = employeeFormSchema.safeParse({
      ...validPayload,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "email")).toBe(
        true,
      );
    }
  });

  it.each([-500, 0])("rejects non-positive salary: %s", (salary) => {
    const result = employeeFormSchema.safeParse({
      ...validPayload,
      salary,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path[0] === "salary")).toBe(
        true,
      );
    }
  });

  it("rejects an invalid employment type", () => {
    const result = employeeFormSchema.safeParse({
      ...validPayload,
      employmentType: "CONTRACT",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((issue) => issue.path[0] === "employmentType"),
      ).toBe(true);
    }
  });

  it("coerces string salary input", () => {
    const result = employeeFormSchema.safeParse({
      ...validPayload,
      salary: "2500000",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.salary).toBe(2_500_000);
    }
  });
});
