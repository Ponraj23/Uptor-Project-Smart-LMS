import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateAIQuiz } from '../../store/slices/quizSlice';
import toast from 'react-hot-toast';
import { HiLightningBolt } from 'react-icons/hi';

const AIQuizGenerator = ({ courseId, courseName }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.quizzes);
  const [formData, setFormData] = useState({
    topic: courseName || '',
    numberOfQuestions: 5,
    difficulty: 'intermediate',
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      await dispatch(generateAIQuiz({ courseId, ...formData })).unwrap();
      toast.success('AI Quiz generated successfully!');
    } catch (err) {
      toast.error(err || 'Failed to generate quiz');
    }
  };

  return (
    <div className="card border-2 border-dashed border-primary-200 bg-primary-50/50">
      <div className="flex items-center gap-2 mb-4">
        <HiLightningBolt className="h-6 w-6 text-primary-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Quiz Generator</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Generate intelligent quiz questions automatically using AI based on any topic.
      </p>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <input
            className="input-field"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="e.g., React Hooks, Node.js Streams"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
            <select
              className="input-field"
              value={formData.numberOfQuestions}
              onChange={(e) => setFormData({ ...formData, numberOfQuestions: Number(e.target.value) })}
            >
              {[3, 5, 8, 10, 15].map((n) => (
                <option key={n} value={n}>{n} questions</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              className="input-field"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          <HiLightningBolt className="h-5 w-5" />
          {loading ? 'Generating...' : 'Generate AI Quiz'}
        </button>
      </form>
    </div>
  );
};

export default AIQuizGenerator;
