import { NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";
import type { UpdateEmployeePayload } from "@/models/employee.types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const payload = (await request.json()) as UpdateEmployeePayload;
    const employee = await EmployeeService.updateEmployee(id, payload);

    return NextResponse.json({ data: employee }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update employee.";
    const status = message === "Employee not found" ? 404 : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
