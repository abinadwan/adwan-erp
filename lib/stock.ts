export interface StockMove {
  itemId: string;
  fromWarehouse: string;
  toWarehouse: string;
  quantity: number;
}

// In-memory stock levels
const stock: Record<string, Record<string, number>> = {};

export function moveStock(move: StockMove) {
  stock[move.fromWarehouse] = stock[move.fromWarehouse] || {};
  stock[move.toWarehouse] = stock[move.toWarehouse] || {};
  stock[move.fromWarehouse][move.itemId] =
    (stock[move.fromWarehouse][move.itemId] || 0) - move.quantity;
  stock[move.toWarehouse][move.itemId] =
    (stock[move.toWarehouse][move.itemId] || 0) + move.quantity;
  return stock;
}
