-- Core tables
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE memberships (
  user_id UUID REFERENCES users(id),
  org_id UUID REFERENCES orgs(id),
  role TEXT NOT NULL,
  PRIMARY KEY (user_id, org_id)
);

-- Inventory
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE stocks (
  item_id UUID REFERENCES items(id),
  warehouse_id UUID REFERENCES warehouses(id),
  quantity NUMERIC DEFAULT 0,
  PRIMARY KEY (item_id, warehouse_id)
);

CREATE TABLE stock_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id),
  from_warehouse UUID REFERENCES warehouses(id),
  to_warehouse UUID REFERENCES warehouses(id),
  quantity NUMERIC NOT NULL,
  moved_at TIMESTAMPTZ DEFAULT now()
);

-- Sales
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  customer_id UUID REFERENCES customers(id),
  total NUMERIC,
  status TEXT
);

CREATE TABLE sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(id),
  org_id UUID REFERENCES orgs(id),
  status TEXT
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_order_id UUID REFERENCES sales_orders(id),
  org_id UUID REFERENCES orgs(id),
  total NUMERIC,
  vat NUMERIC,
  discount NUMERIC,
  status TEXT,
  issued_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  amount NUMERIC,
  received_at TIMESTAMPTZ DEFAULT now()
);

-- Purchasing
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  supplier_id UUID REFERENCES suppliers(id),
  status TEXT
);

CREATE TABLE bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id),
  total NUMERIC,
  status TEXT
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id),
  amount NUMERIC,
  paid_at TIMESTAMPTZ DEFAULT now()
);

-- Finance / GL
CREATE TABLE chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL,
  code TEXT UNIQUE
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  memo TEXT,
  posted_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES journal_entries(id),
  account_id UUID REFERENCES chart_of_accounts(id),
  debit NUMERIC DEFAULT 0,
  credit NUMERIC DEFAULT 0,
  cost_center_id UUID
);

CREATE TABLE cost_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

-- HR
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id),
  salary NUMERIC,
  start_date DATE,
  end_date DATE
);

CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id),
  attended_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES employees(id),
  start_date DATE,
  end_date DATE,
  status TEXT
);

CREATE TABLE payroll_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  month DATE,
  status TEXT
);

CREATE TABLE payslips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID REFERENCES payroll_runs(id),
  employee_id UUID REFERENCES employees(id),
  amount NUMERIC
);

-- CRM
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE crm_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES crm_leads(id),
  value NUMERIC,
  stage TEXT
);

CREATE TABLE crm_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES crm_opportunities(id),
  description TEXT,
  due_date DATE
);

-- Audit & Attachments
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  user_id UUID REFERENCES users(id),
  action TEXT,
  table_name TEXT,
  record_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id),
  file_path TEXT,
  linked_table TEXT,
  linked_id UUID
);
