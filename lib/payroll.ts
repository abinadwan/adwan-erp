export interface Employee {
  id: string;
  salary: number;
  allowances?: number;
  deductions?: number;
}

export interface Payslip {
  employeeId: string;
  total: number;
}

export function runPayroll(employees: Employee[]): Payslip[] {
  return employees.map(e => {
    const total = (e.salary + (e.allowances || 0)) - (e.deductions || 0);
    return { employeeId: e.id, total };
  });
}
