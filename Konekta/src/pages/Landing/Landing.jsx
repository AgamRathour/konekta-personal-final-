import { Link } from "react-router-dom";
import { useState } from "react";
import img2 from "../../assets/images/img2.jpeg";

const Landing = () => {
  const getInitialTheme = () =>
    (typeof window !== "undefined" &&
      localStorage.getItem("konekta_theme") !== "light") ||
    false;

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("konekta_theme", newMode ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-800"
    }`}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
          isDarkMode
            ? "bg-gray-800 text-yellow-300 shadow-lg shadow-yellow-300/20"
            : "bg-gray-200 text-blue-600 shadow-lg shadow-blue-600/20"
        }`}
      >
        {isDarkMode ? (
          <div className="flex items-center justify-center w-6 h-6">
            <span className="text-lg">☀️</span>
          </div>
        ) : (
          <div className="flex items-center justify-center w-6 h-6">
            <span className="text-lg">🌙</span>
          </div>
        )}
      </button>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center px-6 py-16 md:py-20 max-w-4xl mx-auto gap-12">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          {/* Main Heading */}
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${
            isDarkMode 
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" 
              : "bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
          } bg-clip-text text-transparent`}>
            Swipe. Share. Spark.
          </h1>

          {/* Description */}
          <p className={`text-base md:text-lg mb-6 max-w-md leading-relaxed ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Connect with like-minded people, share your journey, and spark meaningful connections. 
            Find your community and build lasting relationships.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              to="/login"
              className={`px-6 py-3 text-center font-semibold text-sm transition-all duration-300 transform hover:scale-105 rounded-lg ${
                isDarkMode 
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30" 
                  : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
              }`}
            >
              Log-in to Continue
            </Link>
            <Link
              to="/signup"
              className={`px-6 py-3 text-center font-semibold text-sm transition-all duration-300 transform hover:scale-105 rounded-lg border ${
                isDarkMode
                  ? "border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                  : "border-purple-400 text-purple-600 hover:bg-purple-500 hover:text-white"
              }`}
            >
              Sign in to Get Started
            </Link>
          </div>
        </div>

        {/* Right Hero Image */}
        <div className="flex-1 flex items-center justify-center">
          <img
            src={img2}
            alt="Konekta social platform"
            className={`w-full max-w-xs rounded-2xl transition-all duration-500 ${
              isDarkMode 
                ? "shadow-[0_0_30px_#A200FF]" 
                : "shadow-[0_0_30px_#9333EA]"
            } transform hover:scale-105`}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {/* Stories Card */}
        <div className={`rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 ${
          isDarkMode 
            ? "bg-gray-900 border border-purple-500/30 shadow-lg shadow-purple-500/10" 
            : "bg-gray-50 border border-purple-200 shadow-lg shadow-purple-200/30"
        }`}>
          <div className={`w-10 h-10 mx-auto mb-3 rounded-lg ${
            isDarkMode 
              ? "bg-gradient-to-r from-purple-600 to-pink-600" 
              : "bg-gradient-to-r from-purple-500 to-pink-500"
          } flex items-center justify-center`}>
            <span className="text-white text-sm">✨</span>
          </div>
          <h2 className={`text-lg font-semibold mb-3 ${
            isDarkMode 
              ? "bg-gradient-to-r from-purple-400 to-pink-400" 
              : "bg-gradient-to-r from-purple-600 to-pink-600"
          } bg-clip-text text-transparent`}>
            Stories
          </h2>
          <p className={`text-sm leading-relaxed ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Instantly share moments with scrollable stories, neon flair, and engaging updates.
          </p>
        </div>

        {/* Swipe Cards */}
        <div className={`rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 ${
          isDarkMode 
            ? "bg-gray-900 border border-pink-500/30 shadow-lg shadow-pink-500/10" 
            : "bg-gray-50 border border-pink-200 shadow-lg shadow-pink-200/30"
        }`}>
          <div className={`w-10 h-10 mx-auto mb-3 rounded-lg ${
            isDarkMode 
              ? "bg-gradient-to-r from-pink-600 to-rose-600" 
              : "bg-gradient-to-r from-pink-500 to-rose-500"
          } flex items-center justify-center`}>
            <span className="text-white text-sm">💫</span>
          </div>
          <h2 className={`text-lg font-semibold mb-3 ${
            isDarkMode 
              ? "bg-gradient-to-r from-pink-400 to-rose-400" 
              : "bg-gradient-to-r from-pink-600 to-rose-600"
          } bg-clip-text text-transparent`}>
            Swipe Cards
          </h2>
          <p className={`text-sm leading-relaxed ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Find new connections with swipe cards focused on real people and interests.
          </p>
        </div>

        {/* Chats Card */}
        <div className={`rounded-xl p-6 text-center transition-all duration-300 transform hover:-translate-y-1 ${
          isDarkMode 
            ? "bg-gray-900 border border-cyan-500/30 shadow-lg shadow-cyan-500/10" 
            : "bg-gray-50 border border-cyan-200 shadow-lg shadow-cyan-200/30"
        }`}>
          <div className={`w-10 h-10 mx-auto mb-3 rounded-lg ${
            isDarkMode 
              ? "bg-gradient-to-r from-cyan-600 to-blue-600" 
              : "bg-gradient-to-r from-cyan-500 to-blue-500"
          } flex items-center justify-center`}>
            <span className="text-white text-sm">💬</span>
          </div>
          <h2 className={`text-lg font-semibold mb-3 ${
            isDarkMode 
              ? "bg-gradient-to-r from-cyan-400 to-blue-400" 
              : "bg-gradient-to-r from-cyan-600 to-blue-600"
          } bg-clip-text text-transparent`}>
            Chats
          </h2>
          <p className={`text-sm leading-relaxed ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Start conversations and build your crew in a smooth, colorful chat interface.
          </p>
        </div>
      </section>

      {/* Brand Section */}
      <section className={`py-12 px-6 ${
        isDarkMode ? "bg-gray-900/50" : "bg-gray-200"
      }`}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`text-2xl font-bold mb-4 ${
            isDarkMode 
              ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" 
              : "bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
          } bg-clip-text text-transparent`}>
            Konekta
          </h2>
          <p className={`text-lg mb-2 ${
            isDarkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Swipe. Share. Spark.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 px-6 ${
        isDarkMode ? "bg-black" : "bg-gray-100"
      }`}>
        <div className="max-w-md mx-auto text-center">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkMode 
              ? "bg-gradient-to-r from-pink-500 to-cyan-400" 
              : "bg-gradient-to-r from-pink-600 to-cyan-600"
          } bg-clip-text text-transparent`}>
            Ready to Spark Connections?
          </h2>
          <p className={`text-sm mb-8 leading-relaxed ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Join thousands of people building genuine connections and creating meaningful relationships.
          </p>
          <Link
            to="/signup"
            className={`inline-block px-8 py-3 font-semibold text-sm transition-all duration-300 transform hover:scale-105 rounded-lg ${
              isDarkMode
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30"
                : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
            }`}
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 text-center border-t ${
        isDarkMode 
          ? "text-gray-500 border-gray-800" 
          : "text-gray-500 border-gray-300"
      }`}>
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-xs">
            &copy; 2025 Konekta. Connecting people through shared experiences.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 