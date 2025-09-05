export interface QuoteItem {
  sku: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Quote {
  id: string;
  org_id: string;
  customer_id: string;
  items: QuoteItem[];
}

export interface Invoice extends Quote {
  invoice_no: string;
  discount: number;
  tax_rate: number;
  paid: boolean;
  total: number;
}

export function createInvoiceFromQuote(
  quote: Quote,
  { discount = 0, taxRate = 0.15 }: { discount?: number; taxRate?: number },
): Invoice {
  const subtotal = quote.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discounted = subtotal - discount;
  const tax = discounted * taxRate;
  const total = discounted + tax;
  return {
    ...quote,
    invoice_no: `INV-${Date.now()}`,
    discount,
    tax_rate: taxRate,
    paid: false,
    total,
  };
}

export function invoiceToPDF(invoice: Invoice): string {
  return `PDF for invoice ${invoice.invoice_no}`;
}
