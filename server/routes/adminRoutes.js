const express = require('express');
const {
  getAllUsers,
  approveInstructor,
  deleteUser,
  getPlatformAnalytics,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.put('/users/:id/approve', approveInstructor);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getPlatformAnalytics);

module.exports = router;
