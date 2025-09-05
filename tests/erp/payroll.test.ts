import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPayroll } from '../../lib/erp/payroll';

test('calculates payroll run totals', () => {
  const employees = [
    { id: 'e1', salary: 1000, allowances: 100, deductions: 50 },
    { id: 'e2', salary: 800 },
  ];
  const run = runPayroll(employees, '2024-01');
  assert.equal(run.total, 1850);
  assert.equal(run.payslips.length, 2);
});
