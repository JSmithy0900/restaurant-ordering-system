const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const User = require('../../models/Users');

let app, mongoServer;

beforeAll(async () => {
  // start in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // ensure no existing connection
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  await mongoose.connect(uri);

  // import the Express app
  app = require('../../app');
});

beforeEach(async () => {
  // reset database
  await mongoose.connection.db.dropDatabase();

  // seed an admin user
  const hash = await bcrypt.hash('adminpass', 10);
  await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    passwordHash: hash,
    phone: '07100000000',
    role: 'admin'
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Admin API integration', () => {
  it('allows admin to create a staff user', async () => {
    // login as admin
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@example.com', password: 'adminpass' })
      .expect(200);
    const token = loginRes.body.token;

    // create a new staff user
    const staffData = {
      name: 'Staff One',
      email: 'staff1@example.com',
      password: 'staffpass',
      phone: '07211111111'
    };

    const res = await request(app)
      .post('/api/admin/create-user')
      .set('Authorization', `Bearer ${token}`)
      .send(staffData)
      .expect(201);

    expect(res.body).toMatchObject({
      email: 'staff1@example.com',
      role: 'staff'
    });
  });

  it('rejects duplicate staff creation', async () => {
    // login as admin
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'admin@example.com', password: 'adminpass' })
      .expect(200);
    const token = loginRes.body.token;

    // create once
    const staffData = {
      name: 'Staff Two',
      email: 'staff2@example.com',
      password: 'staffpass',
      phone: '07222222222'
    };
    await request(app)
      .post('/api/admin/create-user')
      .set('Authorization', `Bearer ${token}`)
      .send(staffData)
      .expect(201);

    // duplicate
    await request(app)
      .post('/api/admin/create-user')
      .set('Authorization', `Bearer ${token}`)
      .send(staffData)
      .expect(400, { error: 'User already exists' });
  });

  it('denies non-admin from creating staff', async () => {
    // register and login as customer
    await request(app)
      .post('/api/users/register')
      .send({ name: 'Cust', email: 'cust@example.com', password: 'custpass', phone: '07333333333' })
      .expect(201);
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: 'cust@example.com', password: 'custpass' })
      .expect(200);
    const token = loginRes.body.token;

    // attempt staff creation
    await request(app)
      .post('/api/admin/create-user')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'ShouldFail', email: 'fail@example.com', password: 'fail', phone: '07444444444' })
      .expect(403, { error: 'Access denied, admin only' });
  });
});
