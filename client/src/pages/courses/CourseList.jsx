import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../store/slices/courseSlice';
import CourseCard from '../../components/common/CourseCard';
import Loader from '../../components/common/Loader';
import { HiSearch } from 'react-icons/hi';

const categories = [
  'All',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Design',
  'Business',
  'Other',
];

const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const CourseList = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const dispatch = useDispatch();
  const { courses, loading, pagination } = useSelector((state) => state.courses);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    if (level !== 'All') params.level = level;
    dispatch(fetchCourses(params));
  }, [dispatch, category, level]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = { search };
    if (category !== 'All') params.category = category;
    if (level !== 'All') params.level = level;
    dispatch(fetchCourses(params));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
        <p className="mt-2 text-gray-600">Discover your next learning adventure</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field md:w-48"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="input-field md:w-40"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <Loader />
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No courses found. Try different filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => dispatch(fetchCourses({ page: i + 1, category: category !== 'All' ? category : undefined, level: level !== 'All' ? level : undefined, search }))}
                  className={`px-4 py-2 rounded-lg ${pagination.page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;
