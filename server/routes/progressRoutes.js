const express = require('express');
const {
  completeLesson,
  getCourseProgress,
  getMyProgress,
  getRecommendations,
  getPerformanceAnalysis,
  getCourseStudentProgress,
} = require('../controllers/progressController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/lesson-complete', protect, authorize('student'), completeLesson);
router.get('/my', protect, getMyProgress);
router.get('/recommendations', protect, authorize('student'), getRecommendations);
router.get('/analysis', protect, authorize('student'), getPerformanceAnalysis);
router.get(
  '/course/:courseId/students',
  protect,
  authorize('instructor', 'admin'),
  getCourseStudentProgress
);
router.get('/course/:courseId', protect, getCourseProgress);

module.exports = router;
