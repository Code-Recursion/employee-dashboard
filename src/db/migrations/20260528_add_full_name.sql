-- Run once on existing Supabase DB if employees table already exists without full_name

ALTER TABLE employees
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

UPDATE employees
SET full_name = trim(first_name || ' ' || last_name)
WHERE full_name IS NULL OR full_name = '';

ALTER TABLE employees
ALTER COLUMN full_name SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_employees_full_name ON employees(full_name);
