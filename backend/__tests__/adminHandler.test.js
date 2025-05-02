jest.resetModules();
// Silence console output during tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// Mock dependencies
jest.mock('bcryptjs', () => ({ hash: jest.fn() }));
jest.mock('../models/Users');

const bcrypt = require('bcryptjs');
const User = require('../models/Users');
const { createStaffUser } = require('../handlers/adminHandler');

describe('createStaffUser', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock response object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Default request body
    req = {
      body: {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'secret',
        phone: '07123456789'
      }
    };
  });

  it('should return 400 if user already exists', async () => {
    // Simulate existing user found
    User.findOne = jest.fn().mockResolvedValue({ _id: 'u1', email: 'alice@example.com' });

    await createStaffUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'alice@example.com' });
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
  });

  it('should create and save new staff user on success', async () => {
    // Simulate no existing user
    User.findOne = jest.fn().mockResolvedValue(null);
    // Stub bcrypt.hash
    bcrypt.hash.mockResolvedValue('hashedpwd');
    // Capture instance created
    let savedInstance;
    User.mockImplementation(function(data) {
      Object.assign(this, data);
      this.save = jest.fn().mockImplementation(() => {
        savedInstance = this;
        return Promise.resolve(this);
      });
    });

    await createStaffUser(req, res);

    // Ensure password hashing
    expect(bcrypt.hash).toHaveBeenCalledWith('secret', expect.any(Number));
    // Ensure new User was constructed with correct fields
    expect(User).toHaveBeenCalledWith({
      name: 'Alice',
      email: 'alice@example.com',
      passwordHash: 'hashedpwd',
      phone: '07123456789',
      role: 'staff'
    });
    // Ensure save() was called
    expect(savedInstance.save).toHaveBeenCalled();
    // Response should be 201 with the new user payload
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(savedInstance);
  });

  it('should handle exceptions and return 400', async () => {
    // Simulate error during findOne
    User.findOne = jest.fn().mockRejectedValue(new Error('oops'));

    await createStaffUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'oops' });
  });
});
