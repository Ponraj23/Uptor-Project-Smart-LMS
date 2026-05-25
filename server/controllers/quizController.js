const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Course = require('../models/Course');
const { generateQuizQuestions } = require('../services/aiService');

// @desc    Create quiz manually
// @route   POST /api/quizzes
exports.createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate AI quiz
// @route   POST /api/quizzes/generate
exports.generateAIQuiz = async (req, res, next) => {
  try {
    const { courseId, topic, numberOfQuestions, difficulty } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const questions = await generateQuizQuestions(
      topic || course.title,
      numberOfQuestions || 5,
      difficulty || 'intermediate'
    );

    const quiz = await Quiz.create({
      title: `AI Quiz: ${topic || course.title}`,
      course: courseId,
      generatedBy: 'ai',
      questions,
      isPublished: true,
    });

    res.status(201).json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quizzes for a course
// @route   GET /api/quizzes/course/:courseId
exports.getCourseQuizzes = async (req, res, next) => {
  try {
    const quizzes = await Quiz.find({
      course: req.params.courseId,
      isPublished: true,
    });
    res.json({ success: true, quizzes });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ success: true, quiz });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit quiz attempt
// @route   POST /api/quizzes/:id/submit
exports.submitQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const { answers, timeTaken } = req.body;
    let score = 0;
    const processedAnswers = answers.map((answer, index) => {
      const isCorrect = quiz.questions[index].correctAnswer === answer.selectedAnswer;
      if (isCorrect) score++;
      return {
        questionIndex: index,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    const attempt = await QuizAttempt.create({
      student: req.user._id,
      quiz: quiz._id,
      course: quiz.course,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      percentage,
      passed: percentage >= quiz.passingScore,
      timeTaken: timeTaken || 0,
    });

    res.status(201).json({
      success: true,
      attempt,
      results: {
        score,
        totalQuestions: quiz.questions.length,
        percentage,
        passed: percentage >= quiz.passingScore,
        answers: processedAnswers.map((a, i) => ({
          ...a,
          correctAnswer: quiz.questions[i].correctAnswer,
          explanation: quiz.questions[i].explanation,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get quiz attempts for student
// @route   GET /api/quizzes/attempts/my
exports.getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await QuizAttempt.find({ student: req.user._id })
      .populate('quiz', 'title')
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, attempts });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
exports.deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    await quiz.deleteOne();
    res.json({ success: true, message: 'Quiz deleted' });
  } catch (error) {
    next(error);
  }
};
