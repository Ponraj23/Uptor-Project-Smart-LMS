import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse } from '../../store/slices/courseSlice';
import { completeLesson } from '../../store/slices/progressSlice';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { HiCheck, HiPlay, HiChevronDown, HiChevronUp } from 'react-icons/hi';

const CoursePlayer = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCourse: course, loading } = useSelector((state) => state.courses);
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [expandedModules, setExpandedModules] = useState({ 0: true });
  const [completedLessons, setCompletedLessons] = useState(new Set());

  useEffect(() => {
    dispatch(fetchCourse(id));
  }, [dispatch, id]);

  const currentLesson = course?.modules?.[activeModule]?.lessons?.[activeLesson];

  const handleLessonComplete = async () => {
    if (!currentLesson) return;
    try {
      await dispatch(
        completeLesson({
          courseId: id,
          lessonId: currentLesson._id,
          timeSpent: currentLesson.duration || 5,
        })
      ).unwrap();
      setCompletedLessons((prev) => new Set([...prev, currentLesson._id]));
      toast.success('Lesson completed!');

      // Auto-advance to next lesson
      const mod = course.modules[activeModule];
      if (activeLesson < mod.lessons.length - 1) {
        setActiveLesson(activeLesson + 1);
      } else if (activeModule < course.modules.length - 1) {
        setActiveModule(activeModule + 1);
        setActiveLesson(0);
        setExpandedModules((prev) => ({ ...prev, [activeModule + 1]: true }));
      }
    } catch (err) {
      toast.error(err || 'Failed to mark complete');
    }
  };

  const toggleModule = (idx) => {
    setExpandedModules((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading || !course) return <Loader />;

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* Video / Content Area */}
      <div className="flex-1 bg-gray-900">
        <div className="aspect-video bg-black flex items-center justify-center">
          {currentLesson?.videoUrl ? (
            <video
              key={currentLesson.videoUrl}
              src={currentLesson.videoUrl}
              controls
              className="w-full h-full"
            />
          ) : (
            <div className="text-center text-gray-400">
              <HiPlay className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg">No video available for this lesson</p>
            </div>
          )}
        </div>
        <div className="p-6 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{currentLesson?.title || 'Select a lesson'}</h2>
          <p className="text-gray-600 mt-2">{currentLesson?.description}</p>
          {currentLesson && (
            <button
              onClick={handleLessonComplete}
              disabled={completedLessons.has(currentLesson._id)}
              className="btn-primary mt-4 flex items-center gap-2"
            >
              <HiCheck className="h-5 w-5" />
              {completedLessons.has(currentLesson._id) ? 'Completed' : 'Mark as Complete'}
            </button>
          )}
        </div>
      </div>

      {/* Sidebar - Curriculum */}
      <div className="w-full lg:w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Course Content</h3>
          <p className="text-sm text-gray-500">
            {completedLessons.size} / {course.totalLessons} lessons completed
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all"
              style={{ width: `${course.totalLessons ? (completedLessons.size / course.totalLessons) * 100 : 0}%` }}
            />
          </div>
        </div>
        {course.modules?.map((module, mIdx) => (
          <div key={mIdx} className="border-b">
            <button
              onClick={() => toggleModule(mIdx)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">Module {mIdx + 1}: {module.title}</p>
                <p className="text-xs text-gray-500">{module.lessons.length} lessons</p>
              </div>
              {expandedModules[mIdx] ? <HiChevronUp className="h-5 w-5 text-gray-400" /> : <HiChevronDown className="h-5 w-5 text-gray-400" />}
            </button>
            {expandedModules[mIdx] && (
              <div className="pb-2">
                {module.lessons.map((lesson, lIdx) => (
                  <button
                    key={lIdx}
                    onClick={() => { setActiveModule(mIdx); setActiveLesson(lIdx); }}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm hover:bg-primary-50 transition-colors ${
                      activeModule === mIdx && activeLesson === lIdx ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      completedLessons.has(lesson._id) ? 'bg-green-500 text-white' : 'bg-gray-200'
                    }`}>
                      {completedLessons.has(lesson._id) ? <HiCheck className="h-4 w-4" /> : <span className="text-xs">{lIdx + 1}</span>}
                    </div>
                    <span className="text-left truncate">{lesson.title}</span>
                    <span className="text-xs text-gray-400 ml-auto">{lesson.duration}m</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursePlayer;
