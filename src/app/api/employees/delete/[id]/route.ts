import { NextResponse } from "next/server";
import { EmployeeService } from "@/services/employee.service";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await EmployeeService.deleteEmployee(id);

    return NextResponse.json({ message: "Employee deleted successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete employee." },
      { status: 500 }
    );
  }
}
