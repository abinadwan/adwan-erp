import { test, strictEqual } from 'node:test';
import { createInvoiceFromQuote } from '../lib/invoice';

test('invoice totals include VAT', () => {
  const invoice = createInvoiceFromQuote({
    id: 'q1',
    customerId: 'c1',
    items: [{ price: 100, quantity: 1 }],
    discount: 0
  });
  strictEqual(invoice.total, 115);
});
