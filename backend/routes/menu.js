const express = require('express');
const router = express.Router();
const menuHandler = require('../handlers/menuHandler');

router.get('/', menuHandler.getMenuItems);
router.post('/', menuHandler.createMenuItem);
router.put('/:id', menuHandler.updateMenuItem);
router.delete('/:id', menuHandler.deleteMenuItem);

module.exports = router;

