export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('en-US').format(new Date(date));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}
