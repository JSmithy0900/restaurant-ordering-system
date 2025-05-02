const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

let app, mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(uri);

  // Import Express app
  app = require('../../app');
});

beforeEach(async () => {
  // Reset database before each test
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Menu API integration', () => {
  let createdItem;

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
      .send(newItem)
      .expect(201);
    expect(res.body).toMatchObject(newItem);
    expect(res.body).toHaveProperty('_id');
    createdItem = res.body;
  });

  it('GET /api/menu should return the created item', async () => {
    // First create
    const newItem = { name: 'Test Dish', description: 'Tasty', price: 9.99 };
    await request(app).post('/api/menu').send(newItem);

    const res = await request(app)
      .get('/api/menu')
      .expect(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject(newItem);
  });

  it('PUT /api/menu/:id should update the item', async () => {
    // Create then update
    const { body } = await request(app)
      .post('/api/menu')
      .send({ name: 'Old', description: 'Old desc', price: 5.0 });
    const id = body._id;

    const updated = { name: 'New', description: 'New desc', price: 7.5 };
    const res = await request(app)
      .put(`/api/menu/${id}`)
      .send(updated)
      .expect(200);
    expect(res.body).toMatchObject(updated);
  });

  it('DELETE /api/menu/:id should remove the item', async () => {
    // Create then delete
    const { body } = await request(app)
      .post('/api/menu')
      .send({ name: 'ToDelete', description: '', price: 1.0 });
    const id = body._id;

    await request(app)
      .delete(`/api/menu/${id}`)
      .expect(204);

    // Now GET returns empty
    const res = await request(app)
      .get('/api/menu')
      .expect(200);
    expect(res.body).toHaveLength(0);
  });
});