import { test, strictEqual } from 'node:test';
import { runPayroll } from '../lib/payroll';

test('payroll calculates total', () => {
  const slips = runPayroll([{ id: 'e1', salary: 1000, allowances: 100, deductions: 50 }]);
  strictEqual(slips[0].total, 1050);
});
