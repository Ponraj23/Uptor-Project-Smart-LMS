const express = require('express');
const {
  createQuiz,
  generateAIQuiz,
  getCourseQuizzes,
  getQuiz,
  submitQuiz,
  getMyAttempts,
  deleteQuiz,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('instructor', 'admin'), createQuiz);
router.post('/generate', protect, authorize('instructor', 'admin'), generateAIQuiz);
router.get('/attempts/my', protect, getMyAttempts);
router.get('/course/:courseId', protect, getCourseQuizzes);
router.post('/:id/submit', protect, authorize('student'), submitQuiz);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteQuiz);
router.get('/:id', protect, getQuiz);

module.exports = router;
