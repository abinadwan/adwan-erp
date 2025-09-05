interface StockKey {
  warehouseId: string;
  sku: string;
}

function key(k: StockKey) {
  return `${k.warehouseId}:${k.sku}`;
}

const stock = new Map<string, number>();

export interface JournalEntry {
  debit: string;
  credit: string;
  amount: number;
}

export function setStock(warehouseId: string, sku: string, quantity: number) {
  stock.set(key({ warehouseId, sku }), quantity);
}

export function getStock(warehouseId: string, sku: string) {
  return stock.get(key({ warehouseId, sku })) || 0;
}

export function transferStock(
  sku: string,
  quantity: number,
  from: string,
  to: string,
): JournalEntry {
  const fromQty = getStock(from, sku);
  if (fromQty < quantity) throw new Error('insufficient stock');
  stock.set(key({ warehouseId: from, sku }), fromQty - quantity);
  const toQty = getStock(to, sku);
  stock.set(key({ warehouseId: to, sku }), toQty + quantity);
  return { debit: `Inventory:${to}`, credit: `Inventory:${from}`, amount: quantity };
}
