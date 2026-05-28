import { describe, expect, it } from "vitest";
import {
  calculateAverageSalary,
  calculateMaxSalary,
  calculateMinSalary,
  type EmployeeWithSalary,
} from "./salary";

const employee = (salary: number): EmployeeWithSalary => ({ salary });

describe("calculateAverageSalary", () => {
  it("returns the average for multiple employees", () => {
    const employees = [employee(100_000), employee(200_000), employee(300_000)];

    expect(calculateAverageSalary(employees)).toBe(200_000);
  });

  it("returns 0 for an empty array", () => {
    expect(calculateAverageSalary([])).toBe(0);
  });

  it("returns the salary for a single employee", () => {
    expect(calculateAverageSalary([employee(750_000)])).toBe(750_000);
  });

  it("handles decimal salaries", () => {
    const employees = [employee(100.25), employee(200.75)];

    expect(calculateAverageSalary(employees)).toBeCloseTo(150.5);
  });
});

describe("calculateMinSalary", () => {
  it("returns the minimum for multiple employees", () => {
    const employees = [employee(500_000), employee(300_000), employee(800_000)];

    expect(calculateMinSalary(employees)).toBe(300_000);
  });

  it("returns 0 for an empty array", () => {
    expect(calculateMinSalary([])).toBe(0);
  });

  it("returns the salary for a single employee", () => {
    expect(calculateMinSalary([employee(420_000)])).toBe(420_000);
  });

  it("handles decimal salaries", () => {
    const employees = [employee(99.99), employee(150.5), employee(200.1)];

    expect(calculateMinSalary(employees)).toBe(99.99);
  });
});

describe("calculateMaxSalary", () => {
  it("returns the maximum for multiple employees", () => {
    const employees = [employee(500_000), employee(300_000), employee(800_000)];

    expect(calculateMaxSalary(employees)).toBe(800_000);
  });

  it("returns 0 for an empty array", () => {
    expect(calculateMaxSalary([])).toBe(0);
  });

  it("returns the salary for a single employee", () => {
    expect(calculateMaxSalary([employee(420_000)])).toBe(420_000);
  });

  it("handles decimal salaries", () => {
    const employees = [employee(99.99), employee(150.5), employee(200.1)];

    expect(calculateMaxSalary(employees)).toBe(200.1);
  });
});
