import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourse, updateCourse } from '../../store/slices/courseSlice';
import { fetchCourseQuizzes } from '../../store/slices/quizSlice';
import AIQuizGenerator from './AIQuizGenerator';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { HiPlus, HiTrash } from 'react-icons/hi';

const CourseEditor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentCourse: course, loading } = useSelector((state) => state.courses);
  const { quizzes } = useSelector((state) => state.quizzes);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    dispatch(fetchCourse(id));
    dispatch(fetchCourseQuizzes(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        level: course.level,
        tags: course.tags?.join(', ') || '',
        isPublished: course.isPublished,
        modules: course.modules || [],
      });
    }
  }, [course]);

  const handleSave = async () => {
    try {
      await dispatch(updateCourse({
        id,
        courseData: {
          ...formData,
          tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        },
      })).unwrap();
      toast.success('Course updated!');
    } catch (err) {
      toast.error(err || 'Failed to update');
    }
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [
        ...formData.modules,
        { title: '', description: '', order: formData.modules.length + 1, lessons: [] },
      ],
    });
  };

  const addLesson = (moduleIndex) => {
    const modules = [...formData.modules];
    modules[moduleIndex] = {
      ...modules[moduleIndex],
      lessons: [
        ...modules[moduleIndex].lessons,
        { title: '', description: '', videoUrl: '', duration: 0, order: modules[moduleIndex].lessons.length + 1 },
      ],
    };
    setFormData({ ...formData, modules });
  };

  const updateModule = (index, field, value) => {
    const modules = [...formData.modules];
    modules[index] = { ...modules[index], [field]: value };
    setFormData({ ...formData, modules });
  };

  const updateLesson = (mIdx, lIdx, field, value) => {
    const modules = [...formData.modules];
    const lessons = [...modules[mIdx].lessons];
    lessons[lIdx] = { ...lessons[lIdx], [field]: value };
    modules[mIdx] = { ...modules[mIdx], lessons };
    setFormData({ ...formData, modules });
  };

  const removeModule = (index) => {
    setFormData({
      ...formData,
      modules: formData.modules.filter((_, i) => i !== index),
    });
  };

  const removeLesson = (mIdx, lIdx) => {
    const modules = [...formData.modules];
    modules[mIdx] = {
      ...modules[mIdx],
      lessons: modules[mIdx].lessons.filter((_, i) => i !== lIdx),
    };
    setFormData({ ...formData, modules });
  };

  if (loading || !formData) return <Loader />;

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'quizzes', label: 'Quizzes' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
            className={formData.isPublished ? 'btn-secondary' : 'btn-primary'}
          >
            {formData.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button onClick={handleSave} className="btn-primary">Save Changes</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="card space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="input-field" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input-field h-32 resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="input-field" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                {['Web Development','Mobile Development','Data Science','Machine Learning','DevOps','Design','Business','Other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select className="input-field" value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input className="input-field" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="react, javascript, web" />
          </div>
        </div>
      )}

      {/* Curriculum Tab */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          {formData.modules.map((module, mIdx) => (
            <div key={mIdx} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 mr-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Module {mIdx + 1}</label>
                  <input
                    className="input-field"
                    placeholder="Module title"
                    value={module.title}
                    onChange={(e) => updateModule(mIdx, 'title', e.target.value)}
                  />
                </div>
                <button onClick={() => removeModule(mIdx)} className="text-red-500 hover:text-red-700 mt-6">
                  <HiTrash className="h-5 w-5" />
                </button>
              </div>

              {/* Lessons */}
              <div className="space-y-3 ml-4">
                {module.lessons.map((lesson, lIdx) => (
                  <div key={lIdx} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input className="input-field text-sm" placeholder="Lesson title" value={lesson.title} onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)} />
                      <input className="input-field text-sm" placeholder="Video URL" value={lesson.videoUrl} onChange={(e) => updateLesson(mIdx, lIdx, 'videoUrl', e.target.value)} />
                      <input className="input-field text-sm" type="number" placeholder="Duration (min)" value={lesson.duration} onChange={(e) => updateLesson(mIdx, lIdx, 'duration', Number(e.target.value))} />
                    </div>
                    <button onClick={() => removeLesson(mIdx, lIdx)} className="text-red-400 hover:text-red-600 mt-2">
                      <HiTrash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button onClick={() => addLesson(mIdx)} className="text-sm text-primary-600 font-medium flex items-center gap-1 hover:underline">
                  <HiPlus className="h-4 w-4" /> Add Lesson
                </button>
              </div>
            </div>
          ))}
          <button onClick={addModule} className="btn-secondary w-full flex items-center justify-center gap-2">
            <HiPlus className="h-5 w-5" /> Add Module
          </button>
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <AIQuizGenerator courseId={id} courseName={course?.title} />
          {quizzes.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Existing Quizzes</h3>
              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{quiz.title}</p>
                      <p className="text-sm text-gray-500">{quiz.questions.length} questions &middot; {quiz.generatedBy === 'ai' ? 'AI Generated' : 'Manual'}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      quiz.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {quiz.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseEditor;
