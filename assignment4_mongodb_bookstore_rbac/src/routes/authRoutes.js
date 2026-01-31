const express = require('express');
const router = express.Router();

const { register, login, me } = require('../controllers/authController');
const { validateBody } = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../middleware/authValidation');
const { requireAuth } = require('../middleware/authMiddleware');

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', requireAuth, me);

module.exports = router;
