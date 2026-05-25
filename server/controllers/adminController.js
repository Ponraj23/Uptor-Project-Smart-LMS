const User = require('../models/User');
const Course = require('../models/Course');
const QuizAttempt = require('../models/QuizAttempt');
const Progress = require('../models/Progress');

// @desc    Get all users (admin)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      users,
      pagination: { page: Number(page), limit: Number(limit), total },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve instructor
// @route   PUT /api/admin/users/:id/approve
exports.approveInstructor = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'instructor') {
      return res.status(400).json({ message: 'User is not an instructor' });
    }

    user.isApproved = true;
    await user.save();

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.deleteOne();
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
exports.getPlatformAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const pendingInstructors = await User.countDocuments({
      role: 'instructor',
      isApproved: false,
    });
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ isPublished: true });
    const totalQuizAttempts = await QuizAttempt.countDocuments();

    // Enrollment trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentEnrollments = await Progress.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const completionRate = await Progress.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$isCompleted', 1, 0] } },
        },
      },
    ]);

    const avgQuizScore = await QuizAttempt.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$percentage' } } },
    ]);

    // Top courses by enrollment
    const topCourses = await Course.find({ isPublished: true })
      .sort({ 'enrolledStudents': -1 })
      .limit(5)
      .select('title enrolledStudents category')
      .populate('instructor', 'name');

    res.json({
      success: true,
      analytics: {
        users: { total: totalUsers, students: totalStudents, instructors: totalInstructors, pendingInstructors },
        courses: { total: totalCourses, published: publishedCourses },
        engagement: {
          recentEnrollments,
          totalQuizAttempts,
          completionRate: completionRate[0]
            ? Math.round((completionRate[0].completed / completionRate[0].total) * 100)
            : 0,
          avgQuizScore: avgQuizScore[0] ? Math.round(avgQuizScore[0].avgScore) : 0,
        },
        topCourses: topCourses.map((c) => ({
          title: c.title,
          category: c.category,
          instructor: c.instructor?.name,
          enrollments: c.enrolledStudents.length,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
