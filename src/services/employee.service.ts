import { Employee, CreateEmployeePayload, UpdateEmployeePayload } from '../models/employee.types';
import { supabaseServer } from "@/lib/supabase/server";

/**
 * Service for Employee CRUD operations.
 * Note: Replace implementation with actual DB client (e.g., Supabase) when ready.
 */
export const EmployeeService = {
  
  async getEmployees(): Promise<Employee[]> {
    const { data, error } = await supabaseServer
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch employees: ${error.message}`);
    }

    return (data ?? []) as Employee[];
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    const { data, error } = await supabaseServer
      .from("employees")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch employee: ${error.message}`);
    }

    return data as Employee | null;
  },

  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const { data, error } = await supabaseServer
      .from("employees")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Failed to create employee: ${error.message}`);
    }

    return data as Employee;
  },

  async updateEmployee(id: string, payload: UpdateEmployeePayload): Promise<Employee> {
    const { data, error } = await supabaseServer
      .from("employees")
      .update(payload)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update employee: ${error.message}`);
    }

    if (!data) {
      throw new Error("Employee not found");
    }

    return data as Employee;
  },

  async deleteEmployee(id: string): Promise<void> {
    const { error } = await supabaseServer
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete employee: ${error.message}`);
    }
  }

};
