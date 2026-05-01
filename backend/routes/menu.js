const express = require('express');
const router = express.Router();
const menuHandler = require('../handlers/menuHandler');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', menuHandler.getMenuItems);
router.post('/', verifyToken, verifyAdmin, menuHandler.createMenuItem);
router.put('/:id', verifyToken, verifyAdmin, menuHandler.updateMenuItem);
router.delete('/:id', verifyToken, verifyAdmin, menuHandler.deleteMenuItem);

module.exports = router;

