import { describe, expect, it } from 'vitest';

import { isRTL } from '../../lib/utils/rtl';

describe('utils/rtl', () => {
  it('detects RTL locales', () => {
    expect(isRTL('ar')).toBe(true);
    expect(isRTL('ar-EG')).toBe(true);
    expect(isRTL('fa')).toBe(true);
    expect(isRTL('fa-IR')).toBe(true);
    expect(isRTL('en')).toBe(false);
  });
});
