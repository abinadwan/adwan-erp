export interface QuoteItem {
  price: number;
  quantity: number;
}

export interface Quote {
  id: string;
  customerId: string;
  items: QuoteItem[];
  discount?: number;
}

export interface Invoice {
  quoteId: string;
  customerId: string;
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  status: 'unpaid' | 'paid';
}

// Create invoice from quote with 15% VAT
export function createInvoiceFromQuote(quote: Quote): Invoice {
  const subtotal = quote.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = quote.discount ?? 0;
  const taxable = subtotal - discount;
  const vat = taxable * 0.15;
  const total = taxable + vat;
  return {
    quoteId: quote.id,
    customerId: quote.customerId,
    subtotal,
    discount,
    vat,
    total,
    status: 'unpaid'
  };
}

// Placeholder for PDF generation
export function generateInvoicePdf(invoice: Invoice): Buffer {
  return Buffer.from(`Invoice ${invoice.quoteId} total ${invoice.total}`);
}
