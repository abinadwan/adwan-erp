# ER Diagram (ASCII)

```
[orgs] 1--n [memberships] n--1 [users]
[orgs] 1--n [items] 1--n [stocks] n--1 [warehouses]
[quotes] 1--1 [sales_orders] 1--n [invoices] 1--n [receipts]
[purchase_orders] 1--n [bills] 1--n [payments]
[chart_of_accounts] 1--n [journal_lines] n--1 [journal_entries]
[employees] 1--n [contracts]
[payroll_runs] 1--n [payslips]
[crm_leads] 1--n [crm_opportunities] 1--n [crm_tasks]
```
