const { registerUser, loginUser } = require('../handlers/usersHandler');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/Users');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('usersHandler', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 201 on success', async () => {
      req.body = { name: 'A', email: 'a@b.com', password: 'pw', phone: '07123' };
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashed');
      User.prototype.save = jest.fn().mockResolvedValue();

      await registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Registration successful' }));
    });

    it('should 400 if user exists', async () => {
      req.body = { email: 'a@b.com' };
      User.findOne.mockResolvedValue({});
      await registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'User already exists' });
    });
  });

  describe('loginUser', () => {
    it('should 200 and return token on valid credentials', async () => {
      req.body = { email: 'a@b.com', password: 'pw' };
      const user = { _id: 'id', name: 'A', email: 'a@b.com', phone: '07123', role: 'customer', passwordHash: 'hash' };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token');

      await loginUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'token' }));
    });

    it('should 401 on invalid password', async () => {
      req.body = { email: 'a@b.com', password: 'pw' };
      User.findOne.mockResolvedValue({ passwordHash: 'hash' });
      bcrypt.compare.mockResolvedValue(false);

      await loginUser(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});