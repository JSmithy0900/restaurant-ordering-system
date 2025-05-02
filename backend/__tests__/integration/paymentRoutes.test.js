const request = require('supertest');
// Mock Stripe package
jest.mock('stripe');
const stripePkg = require('stripe');

// Twilio mock
jest.mock('../../utils/twilioNotifier', () => ({ sendSMS: jest.fn() }));
const { sendSMS } = require('../../utils/twilioNotifier');

// Order model mock
jest.mock('../../models/Orders');
const Order = require('../../models/Orders');

// Silence console.error during tests to avoid noise
beforeAll(() => { jest.spyOn(console, 'error').mockImplementation(() => {}); });

let app;
let paymentIntentsMock;
let stripeClient;

beforeAll(() => {
  // Setup Stripe client mocks
  paymentIntentsMock = { create: jest.fn() };
  stripeClient = { paymentIntents: paymentIntentsMock };
  stripePkg.mockImplementation(() => stripeClient);

  // Load app AFTER mocking Stripe
  app = require('../../app');
});

afterEach(() => {
  // Reset mocks
  paymentIntentsMock.create.mockReset();
  sendSMS.mockReset();
  Order.findByIdAndUpdate.mockReset();
});

describe('Payment API integration', () => {
  it('should create payment intent, update order, and send SMS when payment succeeds', async () => {
    // Arrange
    const fakePI = { id: 'pi_123', status: 'succeeded' };
    paymentIntentsMock.create.mockResolvedValue(fakePI);
    Order.findByIdAndUpdate.mockResolvedValue({ customerInfo: { phone: '07111111111', firstName: 'Cust' } });

    // Act
    const res = await request(app)
      .post('/api/stripe/create-payment-intent')
      .send({ paymentMethodId: 'pm_123', amount: 2000, orderId: 'o1' })
      .expect(200);

    // Assert Stripe called correctly
    expect(paymentIntentsMock.create).toHaveBeenCalledWith(expect.objectContaining({
      payment_method: 'pm_123',
      amount: 2000,
      currency: 'gbp',
      confirm: true
    }));

    // Response contains the PaymentIntent
    expect(res.body.paymentIntent).toEqual(fakePI);

    // Order status updated and SMS sent
    expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
      'o1', { status: 'Pending' }, { new: true }
    );
    expect(sendSMS).toHaveBeenCalledWith(
      '07111111111', expect.stringContaining('payment succeeded')
    );
  });

  it('should return 400 and not send SMS when Stripe errors', async () => {
    // Arrange
    const error = new Error('stripe failure');
    paymentIntentsMock.create.mockRejectedValue(error);

    // Act
    const res = await request(app)
      .post('/api/stripe/create-payment-intent')
      .send({ paymentMethodId: 'pm_123', amount: 2000, orderId: 'o1' })
      .expect(400);

    // Assert error response and no SMS
    expect(res.body).toEqual({ error: 'stripe failure' });
    expect(sendSMS).not.toHaveBeenCalled();
  });
});
