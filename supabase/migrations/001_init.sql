-- Departments
create table departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text,
  created_at timestamptz default now()
);

-- Jobs
create table jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department_id uuid references departments(id),
  grade text,
  created_at timestamptz default now()
);

-- Employees
create table employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  employee_code text unique,
  first_name text not null,
  last_name text not null,
  national_id text,
  email text,
  phone text,
  department_id uuid references departments(id),
  job_id uuid references jobs(id),
  hire_date date,
  salary_base numeric,
  status text,
  avatar_url text,
  cv_url text,
  created_at timestamptz default now()
);

-- Attendance
create table attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id),
  date date,
  check_in timestamptz,
  check_out timestamptz,
  notes text
);

-- Leave Requests
create table leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id),
  type text,
  start_date date,
  end_date date,
  days int,
  status text,
  approver_id uuid references employees(id),
  reason text,
  created_at timestamptz default now()
);

-- Payroll Items
create table payroll_items (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid references employees(id),
  month int,
  year int,
  type text,
  label text,
  amount numeric,
  created_at timestamptz default now()
);

-- Payroll Runs
create table payroll_runs (
  id uuid primary key default gen_random_uuid(),
  period_month int,
  period_year int,
  status text,
  generated_by uuid references employees(id),
  created_at timestamptz default now()
);

-- Roles
create table roles (
  id serial primary key,
  name text unique
);
insert into roles (name) values ('Admin'), ('HRManager'), ('Manager'), ('Employee');

-- Permissions
create table permissions (
  id serial primary key,
  key text unique
);

-- Role permissions
create table role_permissions (
  role_id int references roles(id),
  permission_id int references permissions(id)
);

-- User roles
create table user_roles (
  user_id uuid,
  role_id int references roles(id)
);

-- Settings
create table settings (
  id int primary key default 1,
  company_name text,
  locale_default text,
  timezone text
);

-- Views
create view v_headcount_by_department as
select d.name as department, count(e.id) as count
from departments d
left join employees e on e.department_id = d.id
group by d.name;
