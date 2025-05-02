const { getMenuItems, createMenuItem } = require('../handlers/menuHandler');
const MenuItem = require('../models/MenuItem');

jest.mock('../models/MenuItem');

describe('menuHandler', () => {
  let req, res;
  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn(), end: jest.fn() };
  });

  it('getMenuItems returns items', async () => {
    const items = [{ name: 'A' }];
    MenuItem.find.mockResolvedValue(items);
    await getMenuItems(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(items);
  });

  it('createMenuItem saves and returns item', async () => {
    req.body = { name: 'A', description: 'D', price: 1 };
    const m = { save: jest.fn(), ...req.body };
    MenuItem.mockImplementation(() => m);
    await createMenuItem(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(m);
  });
});