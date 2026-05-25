import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiAcademicCap, HiLightningBolt, HiChartBar, HiShieldCheck } from 'react-icons/hi';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: HiLightningBolt,
      title: 'AI-Powered Quizzes',
      description: 'Automatically generate intelligent quizzes from course content using advanced AI.',
    },
    {
      icon: HiAcademicCap,
      title: 'Adaptive Learning',
      description: 'Personalized learning paths that adapt to your pace and preferences.',
    },
    {
      icon: HiChartBar,
      title: 'Real-Time Analytics',
      description: 'Track your progress with live dashboards and performance insights.',
    },
    {
      icon: HiShieldCheck,
      title: 'Expert Content',
      description: 'Curated courses from approved instructors with quality assurance.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Learn Smarter with
              <span className="text-primary-200"> AI-Powered</span> Education
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100 leading-relaxed">
              Experience adaptive learning, intelligent quiz generation, and real-time analytics 
              on our cutting-edge learning management platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/courses" className="bg-white text-primary-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-center">
                Browse Courses
              </Link>
              {!user && (
                <Link to="/register" className="border-2 border-white text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white/10 transition-colors text-center">
                  Get Started Free
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Why Choose SmartLMS?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform transforms the way you learn, with features designed
            to maximize your potential.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Learning?</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
            Join thousands of learners already using SmartLMS to advance their skills.
          </p>
          <Link to="/register" className="inline-block mt-8 btn-primary px-10 py-3.5 text-lg">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
