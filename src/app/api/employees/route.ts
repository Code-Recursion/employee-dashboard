import { NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";
import type { CreateEmployeePayload, EmployeeListQuery } from "@/models/employee.types";

const parseListQuery = (searchParams: URLSearchParams): EmployeeListQuery => {
  const page = Number(searchParams.get("page"));
  const limit = Number(searchParams.get("limit"));
  const sortOrder = searchParams.get("sortOrder");

  return {
    page: Number.isFinite(page) && page > 0 ? page : undefined,
    limit: Number.isFinite(limit) && limit > 0 ? limit : undefined,
    search: searchParams.get("search") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    jobTitle: searchParams.get("jobTitle") ?? undefined,
    sortBy: searchParams.get("sortBy") ?? undefined,
    sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
  };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = await EmployeeService.getEmployees(parseListQuery(searchParams));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list employees." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateEmployeePayload;
    const employee = await EmployeeService.createEmployee(payload);

    return NextResponse.json({ data: employee }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create employee." },
      { status: 500 }
    );
  }
}
