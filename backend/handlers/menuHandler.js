// handlers/menuHandler.js
const MenuItem = require('../models/MenuItem');

exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({});
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
