-- db/schema.sql

-- Enable UUID extension if not already enabled (Supabase has this by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(120) NOT NULL,
    last_name VARCHAR(120) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'INTERN')),
    country VARCHAR(100) NOT NULL,
    salary DECIMAL(12, 2) NOT NULL CHECK (salary >= 0),
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes to optimize analytical queries for the Salary Insights dashboard
CREATE INDEX idx_employees_full_name ON employees(full_name);
CREATE INDEX idx_employees_country ON employees(country);
CREATE INDEX idx_employees_job_title ON employees(job_title);
CREATE INDEX idx_employees_department ON employees(department);
