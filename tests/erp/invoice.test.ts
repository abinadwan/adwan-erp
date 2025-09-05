import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createInvoiceFromQuote } from '../../lib/erp/sales';

test('creates invoice with tax and discount', () => {
  const quote = {
    id: 'q1',
    org_id: 'o1',
    customer_id: 'c1',
    items: [{ sku: 'A', description: 'item', quantity: 2, price: 50 }],
  };
  const invoice = createInvoiceFromQuote(quote, { discount: 10, taxRate: 0.15 });
  assert.equal(invoice.total, 103.5); // (2*50-10)*1.15 = 103.5
  assert.equal(invoice.paid, false);
});
