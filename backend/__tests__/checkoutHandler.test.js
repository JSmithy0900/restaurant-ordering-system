const { checkDelivery } = require('../handlers/deliveryHandler');
const axios = require('axios');

jest.mock('axios');

describe('deliveryHandler', () => {
  let req, res;
  beforeEach(() => {
    req = { body: { userAddress: '123' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  it('returns 400 if no address', async () => {
    req.body = {};
    await checkDelivery(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});