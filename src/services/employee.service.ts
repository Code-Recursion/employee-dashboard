import { Employee, CreateEmployeePayload, UpdateEmployeePayload } from '../models/employee.types';

/**
 * Service for Employee CRUD operations.
 * Note: Replace implementation with actual DB client (e.g., Supabase) when ready.
 */
export const EmployeeService = {
  
  async getEmployees(): Promise<Employee[]> {
    // TODO: Implement fetching all employees from DB
    return [];
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    // TODO: Implement fetching a single employee by ID
    return null;
  },

  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    // TODO: Implement inserting a new employee into DB
    throw new Error('Not implemented');
  },

  async updateEmployee(id: string, payload: UpdateEmployeePayload): Promise<Employee> {
    // TODO: Implement updating an existing employee in DB
    throw new Error('Not implemented');
  },

  async deleteEmployee(id: string): Promise<void> {
    // TODO: Implement deleting (or soft-deleting) an employee from DB
    throw new Error('Not implemented');
  }

};
