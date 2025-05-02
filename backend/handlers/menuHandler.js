const MenuItem = require('../models/MenuItem');

exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({});
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMenuItem = async (req, res) => {
  const { name, description, price } = req.body;
  const m = new MenuItem({ name, description, price });
  await m.save();
  res.status(201).json(m);
};

exports.updateMenuItem = async (req, res) => {
  const { id } = req.params;
  const updated = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
};

exports.deleteMenuItem = async (req, res) => {
  const { id } = req.params;
  await MenuItem.findByIdAndDelete(id);
  res.status(204).end();
};
