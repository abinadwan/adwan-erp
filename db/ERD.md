# ER Diagram

```
users --< memberships >-- orgs
roles --< memberships

orgs --< items
orgs --< warehouses --< stocks >-- items
stocks --< stock_moves

orgs --< customers
orgs --< suppliers
customers --< quotes --< sales_orders --< invoices --< receipts
suppliers --< purchase_orders --< bills --< payments

orgs --< chart_of_accounts --< journal_lines >-- journal_entries
orgs --< cost_centers

orgs --< employees --< contracts
employees --< attendance
employees --< leave_requests
orgs --< payroll_runs --< payslips >-- employees

orgs --< crm_leads --< crm_opportunities --< crm_tasks

orgs --< audit_logs
orgs --< attachments
```
