import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstructorCourses, createCourse } from '../../store/slices/courseSlice';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { HiPlus, HiBookOpen, HiUserGroup, HiEye, HiPencil } from 'react-icons/hi';

const InstructorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { instructorCourses, loading } = useSelector((state) => state.courses);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    tags: '',
  });

  useEffect(() => {
    dispatch(fetchInstructorCourses());
  }, [dispatch]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createCourse({
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      })).unwrap();
      toast.success('Course created!');
      setShowCreateForm(false);
      setFormData({ title: '', description: '', category: 'Web Development', level: 'Beginner', tags: '' });
    } catch (err) {
      toast.error(err || 'Failed to create course');
    }
  };

  const totalStudents = instructorCourses.reduce(
    (sum, c) => sum + (c.enrolledStudents?.length || 0), 0
  );
  const publishedCount = instructorCourses.filter((c) => c.isPublished).length;

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome, {user?.name}</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary flex items-center gap-2">
          <HiPlus className="h-5 w-5" /> New Course
        </button>
      </div>

      {!user?.isApproved && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 font-medium">Your account is pending admin approval. You can create courses but they won't be visible until approved.</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <HiBookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{instructorCourses.length}</p>
            <p className="text-sm text-gray-500">Total Courses</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <HiEye className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{publishedCount}</p>
            <p className="text-sm text-gray-500">Published</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <HiUserGroup className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{totalStudents}</p>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>
        </div>
      </div>

      {/* Create Course Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create New Course</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input className="input-field" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input-field h-24 resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input className="input-field" placeholder="react, javascript, web" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">Create</button>
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Courses</h2>
        {instructorCourses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No courses yet. Create your first course!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 pr-4 font-medium text-gray-600">Course</th>
                  <th className="py-3 pr-4 font-medium text-gray-600">Category</th>
                  <th className="py-3 pr-4 font-medium text-gray-600">Students</th>
                  <th className="py-3 pr-4 font-medium text-gray-600">Status</th>
                  <th className="py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {instructorCourses.map((course) => (
                  <tr key={course._id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{course.title}</td>
                    <td className="py-3 pr-4 text-gray-500">{course.category}</td>
                    <td className="py-3 pr-4">{course.enrolledStudents?.length || 0}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3">
                      <Link to={`/courses/${course._id}`} className="text-primary-600 hover:underline mr-3">View</Link>
                      <Link to={`/instructor/courses/${course._id}/edit`} className="text-gray-600 hover:underline">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
