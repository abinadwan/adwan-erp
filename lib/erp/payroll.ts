export interface Employee {
  id: string;
  salary: number;
  allowances?: number;
  deductions?: number;
}

export interface Payslip {
  employee_id: string;
  net: number;
  month: string;
}

export interface PayrollRun {
  id: string;
  month: string;
  total: number;
  payslips: Payslip[];
}

export function runPayroll(employees: Employee[], month: string): PayrollRun {
  const payslips = employees.map((e) => {
    const allowance = e.allowances ?? 0;
    const deduction = e.deductions ?? 0;
    const net = e.salary + allowance - deduction;
    return { employee_id: e.id, net, month };
  });
  const total = payslips.reduce((s, p) => s + p.net, 0);
  return { id: `PR-${Date.now()}`, month, total, payslips };
}

export function payslipToPDF(p: Payslip): string {
  return `PDF for payslip ${p.employee_id} ${p.month}`;
}
