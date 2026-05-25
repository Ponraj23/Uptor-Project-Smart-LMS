import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <Link to={`/courses/${course._id}`} className="card hover:shadow-md transition-shadow group">
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={course.thumbnail || 'https://via.placeholder.com/400x225?text=Course'}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2.5 py-1 rounded-full">
          {course.level}
        </span>
      </div>
      <div>
        <span className="text-xs font-medium text-primary-600 uppercase tracking-wide">
          {course.category}
        </span>
        <h3 className="text-lg font-semibold text-gray-900 mt-1 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-primary-700">
                {course.instructor?.name?.[0] || 'I'}
              </span>
            </div>
            <span className="text-sm text-gray-600">{course.instructor?.name || 'Instructor'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span>{course.totalLessons || 0} lessons</span>
            {course.progress !== undefined && (
              <span className="text-primary-600 font-medium">{course.progress}%</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
