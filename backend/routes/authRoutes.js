const express = require('express');
const router = express.Router();
const { login, verifyToken } = require('../controllers/authController');
const { authenticateJWT } = require('../middleware/auth');

router.post('/login', login);
router.get('/verify', authenticateJWT, verifyToken);

module.exports = router;
