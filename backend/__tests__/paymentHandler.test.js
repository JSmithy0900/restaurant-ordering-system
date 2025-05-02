jest.resetModules();

// Mock stripe module
jest.mock('stripe', () => {
  const client = {
    paymentIntents: {
      create: jest.fn().mockResolvedValue({ status: 'succeeded', id: 'pi_123' })
    }
  };
  const stripe = jest.fn(() => client);
  stripe.client = client;
  return stripe;
});
// Mock Order model and Twilio notifier
jest.mock('../models/Orders');
jest.mock('../utils/twilioNotifier');

const stripeImport = require('stripe');
const { createPaymentIntent } = require('../handlers/paymentHandler');
const Order = require('../models/Orders');
const { sendSMS } = require('../utils/twilioNotifier');

// Suppress console.error from handler during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('createPaymentIntent handler', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { body: { paymentMethodId: 'pm_123', amount: 2000, orderId: 'order123' } };
    res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    Order.findByIdAndUpdate.mockResolvedValue({ customerInfo: { phone: '07123456789', firstName: 'Test' } });
    sendSMS.mockResolvedValue();
  });

  it('should call Stripe and send SMS on success', async () => {
    // Act
    await createPaymentIntent(req, res);

    // Retrieve the mocked client
    const client = stripeImport.client;

    // Assert Stripe paymentIntents.create called with correct args
    expect(client.paymentIntents.create).toHaveBeenCalledWith({
      amount: 2000,
      currency: 'gbp',
      payment_method: 'pm_123',
      confirmation_method: 'manual',
      confirm: true,
      metadata: { orderId: 'order123' },
      return_url: expect.any(String)
    });

    // Assert SMS sent with correct message
    expect(sendSMS).toHaveBeenCalledWith(
      '07123456789',
      expect.stringContaining('payment succeeded')
    );

    // Assert response json contains paymentIntent
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ paymentIntent: expect.objectContaining({ status: 'succeeded', id: 'pi_123' }) })
    );
  });

  it('should handle errors and not send SMS', async () => {
    // Arrange: make Stripe throw
    const client = stripeImport.client;
    client.paymentIntents.create.mockRejectedValue(new Error('stripe error'));

    // Act
    await createPaymentIntent(req, res);

    // Assert: no sendSMS, and proper error response
    expect(sendSMS).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'stripe error' });
  });
});
