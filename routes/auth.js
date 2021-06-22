const router = require('express').Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:resetToken', resetPassword);
router.put('/updateDetails', protect, updateDetails);
router.put('/updatePassword', protect, updatePassword);

module.exports = router;
