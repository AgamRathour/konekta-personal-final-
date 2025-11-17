import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem("konekta_theme") !== "light";
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("konekta_theme", newMode ? "dark" : "light");
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");
    setErrors({});

    // Simulate login delay
    setTimeout(() => {
      const usersData = localStorage.getItem("konekta_users");

      if (!usersData) {
        // No users exist
        setLoading(false);
        setErrors({ email: "Account not found. Please sign up first." });
        return;
      }

      try {
        const users = JSON.parse(usersData);

        // Check if email exists in users array
        const foundUser = users.find((user) => user.email === formData.email);

        if (!foundUser) {
          setLoading(false);
          setErrors({ email: "Account not found. Please sign up first." });
          return;
        }

        // Simulate password verification (for demo, any password works)
        if (!formData.password) {
          setLoading(false);
          setErrors({ password: "Password is required" });
          return;
        }

        // Success!
        localStorage.setItem("konekta_isLoggedIn", "true");
        localStorage.setItem("konekta_currentUser", JSON.stringify(foundUser));
        localStorage.setItem("konekta_user", JSON.stringify(foundUser));

        setMessage(`✅ Welcome back, ${foundUser.firstName}!`);
        setLoginSuccess(true);
        setErrors({});

        // Auto-redirect after 1.5 seconds
        setTimeout(() => {
          // Check if user has profile setup completed
          const hasProfile = localStorage.getItem("konekta_user_profile");

          if (hasProfile) {
            // Existing user with profile - go straight to profile
            navigate("/profile");
          } else {
            // New user - go to onboarding
            navigate("/onboarding");
          }
        }, 1500);

        setLoading(false);
      } catch (err) {
        console.error("Login error:", err);
        setLoading(false);
        setErrors({ email: "An error occurred. Please try again." });
      }
    }, 1000);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
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

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 transition group ${
          isDarkMode
            ? "text-gray-300 hover:text-white"
            : "text-gray-600 hover:text-black"
        }`}
      >
        <svg
          className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDarkMode
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
                  : "bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
              } bg-clip-text text-transparent`}
            >
              Welcome Back
            </h1>
            <p
              className={`text-base ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Log in to your Konekta account
            </p>
          </div>

          {/* Form Container */}
          <div className="group relative mb-8">
            {/* Gradient Border Glow */}
            <div
              className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
                  : "bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
              }`}
            />

            {/* Card */}
            <div
              className={`relative rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
                isDarkMode
                  ? "bg-gray-900 border-purple-500/30"
                  : "bg-gray-50 border-purple-200"
              }`}
            >
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading || loginSuccess}
                    className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                      errors.email
                        ? "border-red-500"
                        : isDarkMode
                        ? "border-gray-700 focus:border-purple-500"
                        : "border-gray-300 focus:border-purple-400"
                    } ${
                      isDarkMode
                        ? "bg-gray-800 text-white placeholder-gray-500"
                        : "bg-white text-gray-900 placeholder-gray-400"
                    } border focus:outline-none focus:ring-2 ${
                      isDarkMode
                        ? "focus:ring-purple-500/20"
                        : "focus:ring-purple-400/20"
                    } disabled:opacity-50`}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={loading || loginSuccess}
                      className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                        errors.password
                          ? "border-red-500"
                          : isDarkMode
                          ? "border-gray-700 focus:border-purple-500"
                          : "border-gray-300 focus:border-purple-400"
                      } ${
                        isDarkMode
                          ? "bg-gray-800 text-white placeholder-gray-500"
                          : "bg-white text-gray-900 placeholder-gray-400"
                      } border focus:outline-none focus:ring-2 ${
                        isDarkMode
                          ? "focus:ring-purple-500/20"
                          : "focus:ring-purple-400/20"
                      } disabled:opacity-50 pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute right-3 top-3 transition ${
                        isDarkMode
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      disabled={loading || loginSuccess}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Success Message */}
                {message && (
                  <div
                    className={`p-3 rounded-lg border text-sm text-center ${
                      isDarkMode
                        ? "bg-green-900/30 border-green-600 text-green-400"
                        : "bg-green-100 border-green-400 text-green-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || loginSuccess}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50"
                      : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                  }`}
                >
                  {loading
                    ? "Logging in..."
                    : loginSuccess
                    ? "Redirecting..."
                    : "Log In"}
                </button>

                {/* Don't have account */}
                <p
                  className={`text-center text-sm mt-6 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className={`font-semibold transition ${
                      isDarkMode
                        ? "text-pink-500 hover:text-pink-400"
                        : "text-pink-600 hover:text-pink-500"
                    }`}
                    disabled={loading}
                  >
                    Sign Up
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
