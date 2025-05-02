const { formatUKPhoneNumber } = require('../utils/twilioNotifier');

describe('formatUKPhoneNumber', () => {
  it('converts 07123… to +447123…', () => {
    expect(formatUKPhoneNumber('07123 456789')).toBe('+447123456789');
  });
  it('leaves already E.164 numbers intact', () => {
    expect(formatUKPhoneNumber('+447123456789')).toBe('+447123456789');
  });
});
