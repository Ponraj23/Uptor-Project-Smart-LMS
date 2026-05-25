import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnrolledCourses } from '../../store/slices/courseSlice';
import { fetchMyProgress, fetchRecommendations } from '../../store/slices/progressSlice';
import { fetchMyAttempts } from '../../store/slices/quizSlice';
import CourseCard from '../../components/common/CourseCard';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import { HiBookOpen, HiClock, HiLightningBolt, HiTrendingUp } from 'react-icons/hi';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { enrolledCourses, loading } = useSelector((state) => state.courses);
  const { progressRecords, recommendations } = useSelector((state) => state.progress);
  const { attempts } = useSelector((state) => state.quizzes);

  useEffect(() => {
    dispatch(fetchEnrolledCourses());
    dispatch(fetchMyProgress());
    dispatch(fetchMyAttempts());
    dispatch(fetchRecommendations());
  }, [dispatch]);

  const totalTimeSpent = progressRecords.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const completedCourses = progressRecords.filter((p) => p.isCompleted).length;
  const avgQuizScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
    : 0;

  const stats = [
    { label: 'Enrolled Courses', value: enrolledCourses.length, icon: HiBookOpen, color: 'bg-blue-100 text-blue-600' },
    { label: 'Completed', value: completedCourses, icon: HiTrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Quiz Avg Score', value: `${avgQuizScore}%`, icon: HiLightningBolt, color: 'bg-purple-100 text-purple-600' },
    { label: 'Time Spent', value: `${totalTimeSpent}m`, icon: HiClock, color: 'bg-amber-100 text-amber-600' },
  ];

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-1">Here's your learning overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="card flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* My Courses */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">My Courses</h2>
          <Link to="/courses" className="text-primary-600 font-medium text-sm hover:underline">
            Browse More
          </Link>
        </div>
        {enrolledCourses.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
            <Link to="/courses" className="btn-primary mt-4 inline-block">Explore Courses</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Quiz Attempts */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Quiz Results</h2>
        {attempts.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-500">No quiz attempts yet.</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 pr-4 font-medium text-gray-600">Quiz</th>
                  <th className="py-3 pr-4 font-medium text-gray-600">Course</th>
                  <th className="py-3 pr-4 font-medium text-gray-600">Score</th>
                  <th className="py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 5).map((attempt) => (
                  <tr key={attempt._id} className="border-b last:border-0">
                    <td className="py-3 pr-4">{attempt.quiz?.title}</td>
                    <td className="py-3 pr-4 text-gray-500">{attempt.course?.title}</td>
                    <td className="py-3 pr-4 font-medium">{attempt.percentage}%</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        attempt.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {attempt.passed ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            <HiLightningBolt className="inline h-6 w-6 text-primary-600 mr-1" />
            AI Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="card border-l-4 border-l-primary-500">
                <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{rec.suggestedTopic}</span>
                  <span className={`text-xs font-medium ${
                    rec.priority === 'high' ? 'text-red-600' : rec.priority === 'medium' ? 'text-amber-600' : 'text-green-600'
                  }`}>
                    {rec.priority} priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
