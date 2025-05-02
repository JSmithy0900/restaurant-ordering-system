const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const axios = require('axios');
jest.mock('axios');

let app, mongoServer;

// Silence console.error during tests to keep output clean
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

beforeAll(async () => {
  // Start in-memory MongoDB (if needed by app)
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);

  // Import the Express app
  app = require('../../app');
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Delivery (checkout) API integration - checkDelivery', () => {
  it('should return 400 if userAddress is missing', async () => {
    const res = await request(app)
      .post('/api/delivery/check-delivery')
      .send({})
      .expect(400);
    expect(res.body).toEqual({ error: 'User address is required' });
  });

  it('should return 400 when Google API returns non-OK status', async () => {
    axios.get.mockResolvedValue({
      data: { rows: [{ elements: [{ status: 'NOT_FOUND' }] }] }
    });

    const res = await request(app)
      .post('/api/delivery/check-delivery')
      .send({ userAddress: 'Invalid Postcode' })
      .expect(400);

    expect(res.body).toEqual({ error: 'Invalid address or no route found' });
    expect(axios.get).toHaveBeenCalled();
  });

  it('should return 200 and ETA details for valid address', async () => {
    // Mock successful Google API response
    axios.get.mockResolvedValue({
      data: {
        rows: [{
          elements: [{
            status: 'OK',
            distance: { value: 10000 },
            duration: { text: '30 mins' }
          }]
        }]
      }
    });

    const res = await request(app)
      .post('/api/delivery/check-delivery')
      .send({ userAddress: 'SW1A 1AA' })
      .expect(200);

    expect(res.body.distance).toBe(10000);
    expect(res.body.travelDuration).toBe('30 mins');
    expect(res.body.prepTime).toMatch(/20 mins/);
    expect(res.body.totalETA).toMatch(/\d+ mins/);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('distancematrix'));
  });

  it('should handle axios errors and return 500', async () => {
    axios.get.mockRejectedValue(new Error('network failure'));

    const res = await request(app)
      .post('/api/delivery/check-delivery')
      .send({ userAddress: 'SW1A 2AA' })
      .expect(500);

    expect(res.body).toEqual({ error: 'network failure' });
  });
});
