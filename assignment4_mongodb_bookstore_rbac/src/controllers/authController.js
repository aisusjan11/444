const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const asyncHandler = require('../middleware/asyncHandler');

const register = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ email, password, role });

  const token = signToken(user);

  return res.status(201).json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid email or password' });

  const token = signToken(user);

  return res.status(200).json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  return res.status(200).json({ user });
});

module.exports = { register, login, me };
