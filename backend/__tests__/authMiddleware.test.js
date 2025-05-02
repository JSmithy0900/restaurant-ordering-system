const { verifyToken, verifyAdmin, verifyStaffOrAdmin } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('authMiddleware', () => {
  let req, res, next;
  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jwt.verify.mockImplementation((token, secret, cb) => cb(null, { role: 'admin', id: '1' }));
  });

  it('verifyToken calls next when valid', () => {
    req.headers.authorization = 'Bearer tok';
    verifyToken(req, res, next);
    expect(req.user).toEqual({ role: 'admin', id: '1' });
    expect(next).toHaveBeenCalled();
  });

  it('verifyAdmin denies non-admin', () => {
    req.user = { role: 'customer' };
    verifyAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('verifyStaffOrAdmin allows staff', () => {
    req.user = { role: 'staff' };
    verifyStaffOrAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});