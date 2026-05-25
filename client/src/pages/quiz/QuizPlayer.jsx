import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuiz, submitQuiz, clearQuizResult } from '../../store/slices/quizSlice';
import Loader from '../../components/common/Loader';
import { HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi';

const QuizPlayer = () => {
  const { quizId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuiz: quiz, quizResult, loading } = useSelector((state) => state.quizzes);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    dispatch(clearQuizResult());
    dispatch(fetchQuiz(quizId));
  }, [dispatch, quizId]);

  useEffect(() => {
    if (quiz) {
      setAnswers(quiz.questions.map(() => ({ selectedAnswer: -1 })));
      setTimeLeft(quiz.timeLimit * 60);
      startTimeRef.current = Date.now();
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft <= 0 || quizResult) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quizResult]);

  const handleAnswer = (optionIndex) => {
    const updated = [...answers];
    updated[currentQuestion] = { selectedAnswer: optionIndex };
    setAnswers(updated);
  };

  const handleSubmit = () => {
    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    dispatch(submitQuiz({ quizId, answers, timeTaken }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading && !quiz) return <Loader />;
  if (!quiz) return <div className="text-center py-16 text-gray-500">Quiz not found</div>;

  // Show results
  if (quizResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card text-center mb-8">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 ${
            quizResult.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {quizResult.passed ? (
              <HiCheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <HiXCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {quizResult.passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>
          <p className="text-5xl font-bold mt-4 text-gray-900">{quizResult.percentage}%</p>
          <p className="text-gray-500 mt-2">
            {quizResult.score} / {quizResult.totalQuestions} correct
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <button onClick={() => navigate(-1)} className="btn-secondary">Back to Course</button>
            <button onClick={() => { dispatch(clearQuizResult()); setCurrentQuestion(0); }} className="btn-primary">Retry</button>
          </div>
        </div>

        {/* Answer Review */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Answer Review</h3>
          {quizResult.answers.map((answer, idx) => (
            <div key={idx} className={`card border-l-4 ${answer.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <p className="font-medium text-gray-900 mb-2">
                {idx + 1}. {quiz.questions[idx].question}
              </p>
              <div className="space-y-1.5">
                {quiz.questions[idx].options.map((opt, oIdx) => (
                  <div key={oIdx} className={`p-2 rounded text-sm ${
                    oIdx === answer.correctAnswer ? 'bg-green-100 text-green-800 font-medium' :
                    oIdx === answer.selectedAnswer && !answer.isCorrect ? 'bg-red-100 text-red-800' :
                    'text-gray-600'
                  }`}>
                    {opt}
                  </div>
                ))}
              </div>
              {answer.explanation && (
                <p className="text-sm text-gray-500 mt-2 italic">{answer.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
          <p className="text-sm text-gray-500">Question {currentQuestion + 1} of {quiz.questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
          timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
        }`}>
          <HiClock className="h-5 w-5" />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">{question.question}</h2>
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                answers[currentQuestion]?.selectedAnswer === idx
                  ? 'border-primary-500 bg-primary-50 text-primary-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium mr-3">{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="btn-secondary disabled:opacity-50"
        >
          Previous
        </button>
        {currentQuestion < quiz.questions.length - 1 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            className="btn-primary"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>

      {/* Question Navigator */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {quiz.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentQuestion(idx)}
            className={`w-10 h-10 rounded-lg text-sm font-medium ${
              idx === currentQuestion ? 'bg-primary-600 text-white'
              : answers[idx]?.selectedAnswer >= 0 ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizPlayer;
