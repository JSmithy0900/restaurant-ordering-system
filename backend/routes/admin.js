// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../handlers/adminHandler');
console.log('adminController:', adminController);
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/create-user', verifyToken, verifyAdmin, adminController.createStaffUser);

module.exports = router;

