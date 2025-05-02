jest.resetModules();
// Silence console.log calls in handler
beforeAll(() => jest.spyOn(console, 'log').mockImplementation(() => {}));

// Mock dependencies
jest.mock('../models/Orders');
jest.mock('../utils/twilioNotifier');

const { createOrder, getOrder, getAllOrders, updateOrderStatus } = require('../handlers/ordersHandler');
const Order = require('../models/Orders');
const { sendSMS } = require('../utils/twilioNotifier');

describe('ordersHandler', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn()
    };
  });

  describe('createOrder', () => {
    it('returns 400 if cart is empty', async () => {
      req = { body: { items: [], address: 'Addr', total: 0, customer: {} }, user: { id: 'u1' } };
      await createOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Cart is empty.' });
    });

    it('saves order and returns success', async () => {
      const items = [{ _id: 'm1', quantity: 2, price: 5 }];
      req = {
        body: {
          items,
          address: 'Addr',
          total: 10,
          customer: { firstName: 'Jane', lastName: 'Doe', email: 'j@d.com', phone: '07111', contact: '07111' }
        },
        user: { id: 'u1' }
      };
      // Mock Order constructor to attach save()
      Order.mockImplementation(function(data) {
        Object.assign(this, data);
        this.save = jest.fn().mockResolvedValue(this);
      });

      await createOrder(req, res);

      // save() should have been called on the new Order instance
      expect(Order.mock.instances[0].save).toHaveBeenCalled();
      // Response should indicate success
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Order placed successfully' }));
    });

    it('handles save errors', async () => {
      const items = [{ _id: 'm1', quantity: 1, price: 5 }];
      req = {
        body: {
          items,
          address: 'Addr',
          total: 5,
          customer: { firstName: 'X', lastName: 'Y', email: '', phone: '', contact: '' }
        },
        user: { id: 'u1' }
      };
      // Mock save() to reject
      Order.mockImplementation(function() {
        this.save = jest.fn().mockRejectedValue(new Error('fail'));
      });

      await createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'fail' });
    });
  });

  describe('getOrder', () => {
    it('returns 404 if order not found', async () => {
      req = { params: { id: 'o1' } };
      Order.findById = jest.fn().mockReturnValue({ populate: () => Promise.resolve(null) });

      await getOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Order not found' });
    });

    it('returns 200 and the order if found', async () => {
      const mockOrder = { _id: 'o1', items: [] };
      req = { params: { id: 'o1' } };
      Order.findById = jest.fn().mockReturnValue({ populate: () => Promise.resolve(mockOrder) });

      await getOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ order: mockOrder });
    });
  });

  describe('getAllOrders', () => {
    it('returns list of orders', async () => {
      const orders = [{ _id: '1' }, { _id: '2' }];
      // Mock find().sort().populate() chain
      Order.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(orders)
        })
      });

      await getAllOrders({}, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ orders });
    });

    it('returns 500 on error', async () => {
      Order.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('oops'))
        })
      });

      await getAllOrders({}, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'oops' });
    });
  });

  describe('updateOrderStatus', () => {
    it('returns 400 for invalid status', async () => {
      req = { params: { orderId: 'o1' }, body: { currentStatus: 'Nope' } };
      await updateOrderStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('returns 400 if already final stage', async () => {
      req = { params: { orderId: 'o1' }, body: { currentStatus: 'Delivered' } };
      await updateOrderStatus(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('advances status and sends SMS when delivered', async () => {
      req = { params: { orderId: 'o1' }, body: { currentStatus: 'Preparing' } };
      const updated = { _id: 'o1', status: 'Delivered', customerInfo: { firstName: 'Z', phone: '07222' } };
      Order.findByIdAndUpdate = jest.fn().mockResolvedValue(updated);

      await updateOrderStatus(req, res);
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        'o1',
        { status: 'Delivered' },
        { new: true }
      );
      expect(sendSMS).toHaveBeenCalledWith(
        '07222',
        expect.stringContaining('your order has been delivered')
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Order updated successfully', order: updated });
    });
  });
});
