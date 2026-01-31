const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Unauthorized: missing Bearer token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, iat, exp }
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: invalid or expired token' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole };
