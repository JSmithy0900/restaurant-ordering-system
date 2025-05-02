const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');

let app, mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Disconnect any existing connection, then connect to in-memory
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(uri);

  // Import Express app (no auto-connect inside)
  app = require('../../app');
});

beforeEach(async () => {
  // Reset database between tests
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User API integration', () => {
  const userPayload = {
    name:     'Test User',
    email:    'test@example.com',
    password: 'password123',
    phone:    '07123456789'
  };

  it('should reject registration when fields are missing', () => {
    return request(app)
      .post('/api/users/register')
      .send({ email: 'a@b.com' })
      .expect(400)
      .expect(res => {
        expect(res.body.error).toBeDefined();
      });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send(userPayload)
      .expect(201);
    expect(res.body).toHaveProperty('message', 'Registration successful');
  });

  it('should reject duplicate registrations', async () => {
    // First registration
    await request(app)
      .post('/api/users/register')
      .send(userPayload)
      .expect(201);

    // Duplicate attempt
    await request(app)
      .post('/api/users/register')
      .send(userPayload)
      .expect(400, { error: 'User already exists' });
  });

  it('should log in with correct credentials', async () => {
    // Register first
    await request(app)
      .post('/api/users/register')
      .send(userPayload)
      .expect(201);

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: userPayload.email, password: userPayload.password })
      .expect(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    // Register first to ensure user exists
    await request(app)
      .post('/api/users/register')
      .send(userPayload)
      .expect(201);

    // Attempt login with wrong password
    await request(app)
      .post('/api/users/login')
      .send({ email: userPayload.email, password: 'wrongpass' })
      .expect(401, { error: 'Invalid credentials' });
  });

  describe('Protected and role-based routes', () => {
    it('blocks access to orders route without token', () => {
      return request(app)
        .get('/api/orders/all-orders')
        .expect(401, { error: 'Access denied, token missing' });
    });

    it('blocks access with invalid token', () => {
      return request(app)
        .get('/api/orders/all-orders')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(403, { error: 'Token is invalid or expired' });
    });

    it('denies non-staff/non-admin user on orders', async () => {
      // Register and login as customer
      await request(app)
        .post('/api/users/register')
        .send(userPayload)
        .expect(201);
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({ email: userPayload.email, password: userPayload.password })
        .expect(200);
      const token = loginRes.body.token;

      await request(app)
        .get('/api/orders/all-orders')
        .set('Authorization', `Bearer ${token}`)
        .expect(403, { error: 'Access denied. Staff or admin only.' });
    });

    it('denies customer on admin creation route', async () => {
      // Register and login as customer
      await request(app)
        .post('/api/users/register')
        .send(userPayload)
        .expect(201);
      const loginRes = await request(app)
        .post('/api/users/login')
        .send({ email: userPayload.email, password: userPayload.password })
        .expect(200);
      const token = loginRes.body.token;

      return request(app)
        .post('/api/admin/create-user')
        .set('Authorization', `Bearer ${token}`)
        .send({ name:'X', email:'x@x.com', password:'p', phone:'071' })
        .expect(403, { error: 'Access denied, admin only' });
    });
  });
});
