-- Core
CREATE TABLE orgs (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  hashed_password TEXT
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE memberships (
  user_id UUID REFERENCES users(id),
  org_id UUID REFERENCES orgs(id),
  role_id INTEGER REFERENCES roles(id),
  PRIMARY KEY (user_id, org_id)
);

-- Inventory
CREATE TABLE items (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL,
  sku TEXT UNIQUE
);

CREATE TABLE warehouses (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE stocks (
  warehouse_id UUID REFERENCES warehouses(id),
  item_id UUID REFERENCES items(id),
  quantity NUMERIC DEFAULT 0,
  PRIMARY KEY (warehouse_id, item_id)
);

CREATE TABLE stock_moves (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  item_id UUID REFERENCES items(id),
  from_warehouse UUID REFERENCES warehouses(id),
  to_warehouse UUID REFERENCES warehouses(id),
  quantity NUMERIC,
  created_at TIMESTAMP DEFAULT now()
);

-- Sales & Purchasing
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE suppliers (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  name TEXT NOT NULL
);

CREATE TABLE quotes (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  customer_id UUID REFERENCES customers(id),
  total NUMERIC
);

CREATE TABLE sales_orders (
  id UUID PRIMARY KEY,
  quote_id UUID REFERENCES quotes(id),
  status TEXT
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY,
  sales_order_id UUID REFERENCES sales_orders(id),
  invoice_no TEXT,
  discount NUMERIC,
  tax_rate NUMERIC,
  total NUMERIC,
  paid BOOLEAN DEFAULT false
);

CREATE TABLE receipts (
  id UUID PRIMARY KEY,
  invoice_id UUID REFERENCES invoices(id),
  amount NUMERIC,
  received_at TIMESTAMP DEFAULT now()
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  supplier_id UUID REFERENCES suppliers(id),
  total NUMERIC
);

CREATE TABLE bills (
  id UUID PRIMARY KEY,
  purchase_order_id UUID REFERENCES purchase_orders(id),
  total NUMERIC,
  paid BOOLEAN DEFAULT false
);

CREATE TABLE payments (
  id UUID PRIMARY KEY,
  bill_id UUID REFERENCES bills(id),
  amount NUMERIC,
  paid_at TIMESTAMP DEFAULT now()
);

-- Finance
CREATE TABLE chart_of_accounts (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  code TEXT,
  name TEXT
);

CREATE TABLE journal_entries (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  entry_date DATE
);

CREATE TABLE journal_lines (
  id UUID PRIMARY KEY,
  entry_id UUID REFERENCES journal_entries(id),
  account_id UUID REFERENCES chart_of_accounts(id),
  debit NUMERIC DEFAULT 0,
  credit NUMERIC DEFAULT 0
);

CREATE TABLE cost_centers (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  name TEXT
);

-- HR
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  name TEXT
);

CREATE TABLE contracts (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  salary NUMERIC
);

CREATE TABLE attendance (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  day DATE,
  status TEXT
);

CREATE TABLE leave_requests (
  id UUID PRIMARY KEY,
  employee_id UUID REFERENCES employees(id),
  start_date DATE,
  end_date DATE,
  status TEXT
);

CREATE TABLE payroll_runs (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  month TEXT,
  total NUMERIC
);

CREATE TABLE payslips (
  id UUID PRIMARY KEY,
  payroll_run_id UUID REFERENCES payroll_runs(id),
  employee_id UUID REFERENCES employees(id),
  net NUMERIC
);

-- CRM
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  name TEXT
);

CREATE TABLE crm_opportunities (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES crm_leads(id),
  value NUMERIC
);

CREATE TABLE crm_tasks (
  id UUID PRIMARY KEY,
  opportunity_id UUID REFERENCES crm_opportunities(id),
  description TEXT,
  status TEXT
);

-- Audit & Attachments
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  user_id UUID REFERENCES users(id),
  action TEXT,
  entity TEXT,
  entity_id UUID,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE attachments (
  id UUID PRIMARY KEY,
  org_id UUID REFERENCES orgs(id),
  entity TEXT,
  entity_id UUID,
  url TEXT
);
