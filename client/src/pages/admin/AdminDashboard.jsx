import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, approveInstructor, fetchPlatformAnalytics } from '../../store/slices/adminSlice';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';
import { HiUsers, HiBookOpen, HiChartBar, HiCheckCircle, HiClock, HiAcademicCap } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, analytics, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchPlatformAnalytics());
  }, [dispatch]);

  const handleApprove = async (userId) => {
    try {
      await dispatch(approveInstructor(userId)).unwrap();
      toast.success('Instructor approved!');
    } catch (err) {
      toast.error(err || 'Failed to approve');
    }
  };

  if (loading || !analytics) return <Loader />;

  const pendingInstructors = users.filter(
    (u) => u.role === 'instructor' && !u.isApproved
  );

  const userDistribution = [
    { name: 'Students', value: analytics.users.students },
    { name: 'Instructors', value: analytics.users.instructors },
  ];

  const topCoursesData = analytics.topCourses?.map((c) => ({
    name: c.title.length > 20 ? c.title.substring(0, 20) + '...' : c.title,
    enrollments: c.enrollments,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <HiUsers className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{analytics.users.total}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <HiBookOpen className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{analytics.courses.published}</p>
            <p className="text-sm text-gray-500">Published Courses</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <HiChartBar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{analytics.engagement.completionRate}%</p>
            <p className="text-sm text-gray-500">Completion Rate</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
            <HiAcademicCap className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold">{analytics.engagement.avgQuizScore}%</p>
            <p className="text-sm text-gray-500">Avg Quiz Score</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Top Courses by Enrollment</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCoursesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enrollments" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userDistribution} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {userDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Instructors */}
      <div className="card mb-8">
        <div className="flex items-center gap-2 mb-4">
          <HiClock className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-gray-900">Pending Instructor Approvals ({pendingInstructors.length})</h3>
        </div>
        {pendingInstructors.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No pending approvals</p>
        ) : (
          <div className="space-y-3">
            {pendingInstructors.map((user) => (
              <div key={user._id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button onClick={() => handleApprove(user._id)} className="btn-primary text-sm py-2 flex items-center gap-1">
                  <HiCheckCircle className="h-4 w-4" /> Approve
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Users */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">All Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-3 pr-4 font-medium text-gray-600">Name</th>
                <th className="py-3 pr-4 font-medium text-gray-600">Email</th>
                <th className="py-3 pr-4 font-medium text-gray-600">Role</th>
                <th className="py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 20).map((user) => (
                <tr key={user._id} className="border-b last:border-0">
                  <td className="py-3 pr-4 font-medium">{user.name}</td>
                  <td className="py-3 pr-4 text-gray-500">{user.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700'
                      : user.role === 'instructor' ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {user.isApproved ? 'Active' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
