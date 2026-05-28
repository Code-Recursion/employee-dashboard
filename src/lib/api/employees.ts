import type {
  CreateEmployeePayload,
  EmployeeListQuery,
  PaginatedEmployeesResponse,
  UpdateEmployeePayload,
} from "@/models/employee.types";

const BASE_URL = "/api/employees";

export class EmployeeApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "EmployeeApiError";
    this.status = status;
  }
}

type ApiErrorBody = { error?: string };
type CreateEmployeeResponse = { data: PaginatedEmployeesResponse["data"][number] };
type UpdateEmployeeResponse = { data: PaginatedEmployeesResponse["data"][number] };
type DeleteEmployeeResponse = { message: string };

const buildQueryString = (query: EmployeeListQuery = {}): string => {
  const params = new URLSearchParams();

  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.search) params.set("search", query.search);
  if (query.country) params.set("country", query.country);
  if (query.jobTitle) params.set("jobTitle", query.jobTitle);
  if (query.department) params.set("department", query.department);
  if (query.employmentType) params.set("employmentType", query.employmentType);
  if (query.status) params.set("status", query.status);
  if (query.sortBy) params.set("sortBy", query.sortBy);
  if (query.sortOrder) params.set("sortOrder", query.sortOrder);

  const qs = params.toString();
  return qs ? `?${qs}` : "";
};

const request = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const body = (await response.json()) as T & ApiErrorBody;

  if (!response.ok) {
    throw new EmployeeApiError(body.error ?? "Request failed", response.status);
  }

  return body;
};

export const EmployeeApi = {
  /** GET /api/employees — list with pagination, search, filters, sort */
  list(query: EmployeeListQuery = {}): Promise<PaginatedEmployeesResponse> {
    return request<PaginatedEmployeesResponse>(`${BASE_URL}${buildQueryString(query)}`);
  },

  /** POST /api/employees — create employee */
  create(payload: CreateEmployeePayload): Promise<CreateEmployeeResponse> {
    return request<CreateEmployeeResponse>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /** PATCH /api/employees/:id — update employee */
  update(id: string, payload: UpdateEmployeePayload): Promise<UpdateEmployeeResponse> {
    return request<UpdateEmployeeResponse>(`${BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },

  /** DELETE /api/employees/delete/:id — delete employee */
  remove(id: string): Promise<DeleteEmployeeResponse> {
    return request<DeleteEmployeeResponse>(`${BASE_URL}/delete/${id}`, {
      method: "DELETE",
    });
  },
};
