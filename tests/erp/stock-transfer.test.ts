import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setStock, getStock, transferStock } from '../../lib/erp/inventory';

test('transfers stock and creates journal entry', () => {
  setStock('w1', 'A', 5);
  setStock('w2', 'A', 0);
  const je = transferStock('A', 3, 'w1', 'w2');
  assert.equal(getStock('w1', 'A'), 2);
  assert.equal(getStock('w2', 'A'), 3);
  assert.equal(je.debit, 'Inventory:w2');
  assert.equal(je.credit, 'Inventory:w1');
  assert.equal(je.amount, 3);
});
