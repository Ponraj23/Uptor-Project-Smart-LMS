const Progress = require('../models/Progress');
const Course = require('../models/Course');
const QuizAttempt = require('../models/QuizAttempt');
const User = require('../models/User');
const { generateRecommendations, analyzePerformance } = require('../services/aiService');

// @desc    Update lesson progress
// @route   POST /api/progress/lesson-complete
exports.completeLesson = async (req, res, next) => {
  try {
    const { courseId, lessonId, timeSpent } = req.body;

    let progress = await Progress.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (!progress) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if lesson already completed
    const alreadyCompleted = progress.completedLessons.some(
      (l) => l.lessonId.toString() === lessonId
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({ lessonId });
    }

    if (timeSpent) {
      progress.timeSpent += timeSpent;
    }

    // Calculate overall progress
    const course = await Course.findById(courseId);
    const totalLessons = course.modules.reduce(
      (total, mod) => total + mod.lessons.length,
      0
    );
    progress.overallProgress = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );

    if (progress.overallProgress >= 100) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    }

    await progress.save();

    // Emit real-time update if socket available
    if (req.io) {
      req.io.to(`user_${req.user._id}`).emit('progress_update', {
        courseId,
        progress: progress.overallProgress,
      });
    }

    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Get progress for a course
// @route   GET /api/progress/course/:courseId
exports.getCourseProgress = async (req, res, next) => {
  try {
    const progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all progress for student
// @route   GET /api/progress/my
exports.getMyProgress = async (req, res, next) => {
  try {
    const progressRecords = await Progress.find({ student: req.user._id })
      .populate('course', 'title thumbnail category');

    res.json({ success: true, progress: progressRecords });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI learning recommendations
// @route   GET /api/progress/recommendations
exports.getRecommendations = async (req, res, next) => {
  try {
    const progressRecords = await Progress.find({
      student: req.user._id,
      isCompleted: true,
    }).populate('course', 'title category');

    const quizAttempts = await QuizAttempt.find({ student: req.user._id });
    const avgScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((sum, a) => sum + a.percentage, 0) /
              quizAttempts.length
          )
        : 0;

    const user = await User.findById(req.user._id);

    const studentProfile = {
      completedCourses: progressRecords.map((p) => p.course.title),
      quizScores: avgScore,
      preferredTopics: user.learningPreferences?.preferredTopics || [],
      currentLevel: avgScore > 80 ? 'Advanced' : avgScore > 50 ? 'Intermediate' : 'Beginner',
    };

    const recommendations = await generateRecommendations(studentProfile);
    res.json({ success: true, recommendations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AI performance analysis
// @route   GET /api/progress/analysis
exports.getPerformanceAnalysis = async (req, res, next) => {
  try {
    const allProgress = await Progress.find({ student: req.user._id });
    const quizAttempts = await QuizAttempt.find({ student: req.user._id }).populate(
      'course',
      'category'
    );

    const avgScore =
      quizAttempts.length > 0
        ? Math.round(
            quizAttempts.reduce((sum, a) => sum + a.percentage, 0) /
              quizAttempts.length
          )
        : 0;

    // Find weak and strong areas based on quiz performance by category
    const categoryScores = {};
    quizAttempts.forEach((attempt) => {
      const cat = attempt.course?.category || 'General';
      if (!categoryScores[cat]) categoryScores[cat] = [];
      categoryScores[cat].push(attempt.percentage);
    });

    const weakAreas = [];
    const strongAreas = [];
    Object.entries(categoryScores).forEach(([cat, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg < 60) weakAreas.push(cat);
      else if (avg >= 80) strongAreas.push(cat);
    });

    const performanceData = {
      coursesEnrolled: allProgress.length,
      coursesCompleted: allProgress.filter((p) => p.isCompleted).length,
      avgQuizScore: avgScore,
      totalTimeSpent: allProgress.reduce((sum, p) => sum + p.timeSpent, 0),
      weakAreas,
      strongAreas,
    };

    const analysis = await analyzePerformance(performanceData);
    res.json({ success: true, analysis, performanceData });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student analytics (for instructor)
// @route   GET /api/progress/course/:courseId/students
exports.getCourseStudentProgress = async (req, res, next) => {
  try {
    const progressRecords = await Progress.find({
      course: req.params.courseId,
    }).populate('student', 'name email avatar');

    res.json({ success: true, progress: progressRecords });
  } catch (error) {
    next(error);
  }
};
