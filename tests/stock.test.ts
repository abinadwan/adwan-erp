import { test, strictEqual } from 'node:test';
import { moveStock } from '../lib/stock';

test('stock move transfers quantity', () => {
  const result = moveStock({ itemId: 'i1', fromWarehouse: 'w1', toWarehouse: 'w2', quantity: 5 });
  strictEqual(result['w2']['i1'], 5);
});
