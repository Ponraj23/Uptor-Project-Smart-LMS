const jwt = require('jsonwebtoken');

const setupSocket = (io) => {
  // Authentication middleware for socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user-specific room for targeted updates
    socket.join(`user_${socket.userId}`);

    // Join course room when viewing a course
    socket.on('join_course', (courseId) => {
      socket.join(`course_${courseId}`);
      console.log(`User ${socket.userId} joined course ${courseId}`);
    });

    socket.on('leave_course', (courseId) => {
      socket.leave(`course_${courseId}`);
    });

    // Real-time progress update notification
    socket.on('lesson_completed', (data) => {
      io.to(`course_${data.courseId}`).emit('student_progress', {
        studentId: socket.userId,
        courseId: data.courseId,
        lessonId: data.lessonId,
        progress: data.progress,
      });
    });

    // Quiz completed notification
    socket.on('quiz_completed', (data) => {
      io.to(`course_${data.courseId}`).emit('quiz_result', {
        studentId: socket.userId,
        quizId: data.quizId,
        score: data.score,
      });
    });

    // Instructor analytics live updates
    socket.on('join_analytics', (courseId) => {
      socket.join(`analytics_${courseId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

module.exports = setupSocket;
