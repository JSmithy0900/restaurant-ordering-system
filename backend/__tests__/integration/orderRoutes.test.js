const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const MenuItem = require('../../models/MenuItem');
const User = require('../../models/Users');

// Mock Twilio so no SMS actually sent
jest.mock('../../utils/twilioNotifier', () => ({ sendSMS: jest.fn() }));
const { sendSMS } = require('../../utils/twilioNotifier');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);
  app = require('../../app');
});

beforeEach(async () => {
  // Reset DB
  await mongoose.connection.db.dropDatabase();

  // Seed customer
  const custHash = await bcrypt.hash('custpass', 10);
  await User.create({ name: 'Cust', email: 'cust@example.com', passwordHash: custHash, phone: '07111111111', role: 'customer' });

  // Seed staff
  const staffHash = await bcrypt.hash('staffpass', 10);
  await User.create({ name: 'Staff', email: 'staff@example.com', passwordHash: staffHash, phone: '07222222222', role: 'staff' });

  // Seed a menu item
  const menu = await MenuItem.create({ name: 'Dish', description: 'Desc', price: 5.0 });
  app.menuId = menu._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Orders API integration', () => {
  it('blocks checkout without token', async () => {
    await request(app)
      .post('/api/orders/checkout')
      .send({})
      .expect(401);
  });

  it('allows customer to place order but does not send SMS at checkout', async () => {
    // Customer login
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'cust@example.com', password: 'custpass' })
      .expect(200);
    const token = loginRes.body.token;

    // Place order
    const orderData = {
      items: [{ _id: app.menuId, quantity: 2, price: 5 }],
      total: 10.0,
      address: 'Some Address',
      customer: { firstName: 'Cust', lastName: 'Test', email: 'cust@example.com', phone: '07111111111', contact: '07111111111' }
    };

    const res = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send(orderData)
      .expect(201);

    expect(res.body).toHaveProperty('order');
    expect(res.body.order.status).toBe('PendingPayment');
    expect(sendSMS).not.toHaveBeenCalled();
    app.orderId = res.body.order._id;
  });

  it('retrieves the placed order', async () => {
    // Place an order first
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'cust@example.com', password: 'custpass' })
      .expect(200);
    const token = loginRes.body.token;
    const orderRes = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ _id: app.menuId, quantity: 1, price: 5 }], total: 5, address: 'Addr', customer: { firstName: 'C', lastName: 'T', email: 'cust@example.com', phone: '07111111111', contact: '07111111111' } })
      .expect(201);
    const orderId = orderRes.body.order._id;

    const res = await request(app)
      .get(`/api/orders/${orderId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.order._id).toBe(orderId);
    expect(res.body.order.items[0].quantity).toBe(1);
  });

  it('allows staff to view all orders', async () => {
    // Login staff
    const staffLogin = await request(app)
      .post('/api/users/login')
      .send({ email: 'staff@example.com', password: 'staffpass' })
      .expect(200);
    const staffToken = staffLogin.body.token;

    // Seed a customer order
    const custLogin = await request(app)
      .post('/api/users/login')
      .send({ email: 'cust@example.com', password: 'custpass' });
    const custToken = custLogin.body.token;
    await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${custToken}`)
      .send({ items: [{ _id: app.menuId, quantity: 1, price: 5 }], total: 5, address: 'Addr', customer: { firstName: 'C', lastName: 'T', email: 'cust@example.com', phone: '07111111111', contact: '07111111111' } });

    const res = await request(app)
      .get('/api/orders/all-orders')
      .set('Authorization', `Bearer ${staffToken}`)
      .expect(200);
    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body.orders.length).toBeGreaterThanOrEqual(1);
  });

  it('disallows staff from advancing PendingPayment', async () => {
    // Login staff
    const staffLogin = await request(app)
      .post('/api/users/login')
      .send({ email: 'staff@example.com', password: 'staffpass' })
      .expect(200);
    const staffToken = staffLogin.body.token;

    // Customer places an order
    const custLogin = await request(app)
      .post('/api/users/login')
      .send({ email: 'cust@example.com', password: 'custpass' });
    const custToken = custLogin.body.token;
    const orderRes = await request(app)
      .post('/api/orders/checkout')
      .set('Authorization', `Bearer ${custToken}`)
      .send({ items: [{ _id: app.menuId, quantity: 1, price: 5 }], total: 5, address: 'Addr', customer: { firstName: 'C', lastName: 'T', email: 'cust@example.com', phone: '07111111111', contact: '07111111111' } });
    const orderId = orderRes.body.order._id;

    await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${staffToken}`)
      .send({ currentStatus: 'PendingPayment' })
      .expect(400);
  });
});
