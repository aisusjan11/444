const jwt = require('jsonwebtoken');

function signToken(user) {
  const payload = { id: user._id.toString(), role: user.role };
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
}

module.exports = { signToken };
