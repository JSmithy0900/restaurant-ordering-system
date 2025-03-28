const express = require('express');
const router = express.Router();
const menuHandler = require('../handlers/menuHandler');

router.get('/', menuHandler.getMenuItems);

module.exports = router;

