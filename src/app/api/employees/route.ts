import { NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";
import type { CreateEmployeePayload } from "@/models/employee.types";

export async function GET() {
  try {
    const employees = await EmployeeService.getEmployees();
    return NextResponse.json({ data: employees }, { status: 200 });
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
