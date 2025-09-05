import { describe, expect, it } from 'vitest';

import { formatCurrency, formatDate } from '../../lib/utils/format';

describe('utils/format', () => {
  it('formats dates', () => {
    expect(formatDate('2023-01-01')).toBe('1/1/2023');
  });

  it('formats currency', () => {
    expect(formatCurrency(10)).toBe('$10.00');
  });
});
