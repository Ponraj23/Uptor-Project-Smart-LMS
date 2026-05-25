import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse, enrollInCourse } from '../../store/slices/courseSlice';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { HiClock, HiBookOpen, HiUserGroup, HiStar, HiPlay } from 'react-icons/hi';

const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentCourse: course, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCourse(id));
  }, [dispatch, id]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await dispatch(enrollInCourse(id)).unwrap();
      toast.success('Enrolled successfully!');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err);
    }
  };

  if (loading || !course) return <Loader />;

  const isEnrolled = course.enrolledStudents?.includes(user?.id);
  const isOwner = course.instructor?._id === user?.id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <span className="text-sm font-medium text-primary-600 uppercase tracking-wide">
            {course.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{course.title}</h1>
          <p className="text-lg text-gray-600 mt-4 leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 mt-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <HiBookOpen className="h-5 w-5 text-gray-400" />
              <span>{course.totalLessons} Lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiClock className="h-5 w-5 text-gray-400" />
              <span>{course.totalDuration} min</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiUserGroup className="h-5 w-5 text-gray-400" />
              <span>{course.enrolledStudents?.length || 0} Students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiStar className="h-5 w-5 text-yellow-400" />
              <span>{course.rating?.average?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-primary-700">
                {course.instructor?.name?.[0]}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{course.instructor?.name}</p>
              <p className="text-sm text-gray-500">Instructor</p>
            </div>
          </div>

          {/* Tags */}
          {course.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {course.tags.map((tag, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <img
              src={course.thumbnail || 'https://via.placeholder.com/400x225?text=Course'}
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Level</span>
                <span className="font-medium">{course.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Modules</span>
                <span className="font-medium">{course.modules?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Lessons</span>
                <span className="font-medium">{course.totalLessons}</span>
              </div>
            </div>
            {user?.role === 'student' && !isEnrolled && (
              <button onClick={handleEnroll} className="btn-primary w-full">
                Enroll Now
              </button>
            )}
            {isEnrolled && (
              <button
                onClick={() => navigate(`/courses/${id}/learn`)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <HiPlay className="h-5 w-5" /> Continue Learning
              </button>
            )}
            {isOwner && (
              <button
                onClick={() => navigate(`/instructor/courses/${id}/edit`)}
                className="btn-secondary w-full"
              >
                Edit Course
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
        <div className="space-y-4">
          {course.modules?.map((module, mIdx) => (
            <div key={mIdx} className="card">
              <h3 className="font-semibold text-lg text-gray-900">
                Module {mIdx + 1}: {module.title}
              </h3>
              {module.description && (
                <p className="text-sm text-gray-500 mt-1">{module.description}</p>
              )}
              <div className="mt-4 space-y-2">
                {module.lessons?.map((lesson, lIdx) => (
                  <div
                    key={lIdx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">{lIdx + 1}</span>
                      </div>
                      <span className="text-gray-700">{lesson.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">{lesson.duration} min</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {(!course.modules || course.modules.length === 0) && (
            <p className="text-gray-500 text-center py-8">No modules added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
