import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../../services/authService.js";

const SignIn = () => {
  const navigate = useNavigate();
  const getInitialTheme = () =>
    (typeof window !== "undefined" &&
      localStorage.getItem("konekta_theme") !== "light") ||
    false;

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

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

    try {
      await authService.signUp({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      setMessage("✅ Account created! Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
      setErrors({ email: err.message });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Background Gradient */}
      <div
        className={`fixed inset-0 pointer-events-none transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-black via-purple-900/20 to-black"
            : "bg-gradient-to-br from-white via-purple-100/20 to-white"
        }`}
      />

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
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.536a1 1 0 10-1.414-1.414l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414zm2.828-2.828a1 1 0 10-1.414-1.414l-1.414 1.414a1 1 0 001.414 1.414l1.414-1.414zM13 11a1 1 0 110 2h-2a1 1 0 110-2h2zm-2-4a1 1 0 100-2h-2a1 1 0 000 2h2z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className={`fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 transition group ${
          isDarkMode
            ? "text-gray-300 hover:text-white hover:bg-gray-900"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
        } rounded-lg`}
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
              className={`text-4xl md:text-5xl font-bold mb-4 ${
                isDarkMode
                  ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400"
                  : "bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
              } bg-clip-text text-transparent`}
            >
              Join Konekta
            </h1>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Create your account
            </p>
          </div>

          {/* Form */}
          <div
            className={`rounded-2xl p-8 border transition-all duration-300 ${
              isDarkMode
                ? "bg-gray-900 border-purple-500/30 hover:border-purple-500/60"
                : "bg-white border-purple-300 hover:border-purple-500"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                      errors.firstName
                        ? "border-red-500"
                        : isDarkMode
                        ? "border-gray-700 focus:border-purple-500"
                        : "border-gray-300 focus:border-purple-400"
                    } ${
                      isDarkMode
                        ? "bg-gray-800 text-white placeholder-gray-500"
                        : "bg-gray-50 text-gray-900 placeholder-gray-400"
                    } border focus:outline-none disabled:opacity-50`}
                  />
                  {errors.firstName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                      errors.lastName
                        ? "border-red-500"
                        : isDarkMode
                        ? "border-gray-700 focus:border-purple-500"
                        : "border-gray-300 focus:border-purple-400"
                    } ${
                      isDarkMode
                        ? "bg-gray-800 text-white placeholder-gray-500"
                        : "bg-gray-50 text-gray-900 placeholder-gray-400"
                    } border focus:outline-none disabled:opacity-50`}
                  />
                  {errors.lastName && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                    errors.email
                      ? "border-red-500"
                      : isDarkMode
                      ? "border-gray-700 focus:border-purple-500"
                      : "border-gray-300 focus:border-purple-400"
                  } ${
                    isDarkMode
                      ? "bg-gray-800 text-white placeholder-gray-500"
                      : "bg-gray-50 text-gray-900 placeholder-gray-400"
                  } border focus:outline-none disabled:opacity-50`}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                    errors.password
                      ? "border-red-500"
                      : isDarkMode
                      ? "border-gray-700 focus:border-purple-500"
                      : "border-gray-300 focus:border-purple-400"
                  } ${
                    isDarkMode
                      ? "bg-gray-800 text-white placeholder-gray-500"
                      : "bg-gray-50 text-gray-900 placeholder-gray-400"
                  } border focus:outline-none disabled:opacity-50`}
                />
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : isDarkMode
                      ? "border-gray-700 focus:border-purple-500"
                      : "border-gray-300 focus:border-purple-400"
                  } ${
                    isDarkMode
                      ? "bg-gray-800 text-white placeholder-gray-500"
                      : "bg-gray-50 text-gray-900 placeholder-gray-400"
                  } border focus:outline-none disabled:opacity-50`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.confirmPassword}
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
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDarkMode
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50"
                    : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                }`}
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>

              {/* Login Link */}
              <p
                className={`text-center text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className={`font-semibold transition ${
                    isDarkMode
                      ? "text-pink-500 hover:text-pink-400"
                      : "text-pink-600 hover:text-pink-500"
                  }`}
                  disabled={loading}
                >
                  Log In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
