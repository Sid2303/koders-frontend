import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-linear-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4 sm:mb-6 inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-semibold">
              🎉 Welcome to the Future of Development
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight px-4">
              Build Better,
              <span className="block bg-linear-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                Ship Faster
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 opacity-95 leading-relaxed px-4">
              Join thousands of developers building modern applications with our
              powerful platform. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-12 px-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl text-center"
              >
                Get Started Free →
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-blue-600 transition-all text-center"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-2xl mx-auto px-4">
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  10K+
                </div>
                <div className="text-xs sm:text-sm opacity-80 mt-1">
                  Active Users
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  50K+
                </div>
                <div className="text-xs sm:text-sm opacity-80 mt-1">
                  Projects Built
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                  99.9%
                </div>
                <div className="text-xs sm:text-sm opacity-80 mt-1">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-20 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 px-4">
              Why Choose Koders?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Everything you need to build, deploy, and scale your applications
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🚀</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                Lightning Fast
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Build and deploy your applications in minutes, not hours. Our
                optimized infrastructure ensures peak performance.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🔒</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                Enterprise Security
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Bank-level encryption and security measures to protect your data
                and your users' privacy at all times.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">📊</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                Real-time Analytics
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Get insights into your application's performance with our
                powerful analytics and monitoring tools.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">⚡</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                Easy Integration
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Seamlessly integrate with your favorite tools and services with
                our extensive API and SDK support.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🌍</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                Global Scale
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Deploy to multiple regions worldwide with automatic scaling and
                load balancing built-in.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">💬</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">
                24/7 Support
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our dedicated support team is always ready to help you succeed
                with world-class customer service.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 py-16 sm:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg sm:text-xl text-white opacity-90 mb-8 sm:mb-10 px-4">
              Join our community of developers and start building amazing things
              today.
            </p>
            <Link
              to="/register"
              className="inline-block bg-white text-blue-600 px-10 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
            >
              Start Free Trial →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
