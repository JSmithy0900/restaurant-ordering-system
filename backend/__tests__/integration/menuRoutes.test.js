const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/Users');

let app, mongoServer, adminToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(uri);
  app = require('../../app');
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase();

  const hash = await bcrypt.hash('adminpass', 10);
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: hash,
    phone: '07100000000',
    role: 'admin'
  });

  adminToken = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET || 'yourSecretKeyHere'
  );
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Menu API integration', () => {
  it('GET /api/menu should return empty array initially', async () => {
    const res = await request(app)
      .get('/api/menu')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('POST /api/menu should create a new menu item', async () => {
    const newItem = { name: 'Test Dish', description: 'Tasty', price: 9.99 };
    const res = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newItem)
      .expect(201);
    expect(res.body).toMatchObject(newItem);
    expect(res.body).toHaveProperty('_id');
  });

  it('GET /api/menu should return the created item', async () => {
    const newItem = { name: 'Test Dish', description: 'Tasty', price: 9.99 };
    await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newItem);

    const res = await request(app)
      .get('/api/menu')
      .expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject(newItem);
  });

  it('PUT /api/menu/:id should update the item', async () => {
    const { body } = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Old', description: 'Old desc', price: 5.0 });
    const id = body._id;

    const updated = { name: 'New', description: 'New desc', price: 7.5 };
    const res = await request(app)
      .put(`/api/menu/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(updated)
      .expect(200);
    expect(res.body).toMatchObject(updated);
  });

  it('DELETE /api/menu/:id should remove the item', async () => {
    const { body } = await request(app)
      .post('/api/menu')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ToDelete', description: '', price: 1.0 });
    const id = body._id;

    await request(app)
      .delete(`/api/menu/${id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);

    const res = await request(app)
      .get('/api/menu')
      .expect(200);
    expect(res.body).toHaveLength(0);
  });

  it('POST /api/menu should return 401 without auth', async () => {
    await request(app)
      .post('/api/menu')
      .send({ name: 'Sneaky', description: 'No auth', price: 1.0 })
      .expect(401);
  });
});
