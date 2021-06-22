const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create Token
  const token = user.getSignedJwt();

  res.status(200).json({ success: true, token });
});
