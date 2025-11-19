import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

const SignUp = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
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
      }, 1500);
    } catch (err) {
      console.error("SignUp error:", err);
      setLoading(false);
      setErrors({ email: err.message || "Signup failed. Please try again." });
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
          isDarkMode
            ? "bg-gray-800 text-yellow-300 shadow-lg shadow-yellow-300/20"
            : "bg-gray-200 text-blue-600 shadow-lg shadow-blue-600/20"
        }`}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      <button
        onClick={() => navigate("/")}
        className={`fixed top-6 left-6 z-50 px-4 py-2 rounded-lg transition-all ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
        }`}
      >
        ← Back
      </button>

      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div
          className={`w-full max-w-md rounded-3xl p-8 shadow-2xl transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900 border-2 border-purple-500 shadow-purple-500/20"
              : "bg-white border-2 border-blue-400 shadow-blue-400/20"
          }`}
        >
          <h1
            className={`text-4xl font-bold text-center mb-8 transition-all ${
              isDarkMode
                ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
                : "text-blue-600"
            }`}
          >
            Sign Up
          </h1>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                isDarkMode
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Your first name"
                className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? `bg-gray-800 border-2 ${
                        errors.firstName ? "border-red-500" : "border-pink-500"
                      } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                    : `bg-gray-100 border-2 ${
                        errors.firstName ? "border-red-500" : "border-blue-400"
                      } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Your last name"
                className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? `bg-gray-800 border-2 ${
                        errors.lastName ? "border-red-500" : "border-pink-500"
                      } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                    : `bg-gray-100 border-2 ${
                        errors.lastName ? "border-red-500" : "border-blue-400"
                      } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Email address
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? `bg-gray-800 border-2 ${
                        errors.email ? "border-red-500" : "border-pink-500"
                      } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                    : `bg-gray-100 border-2 ${
                        errors.email ? "border-red-500" : "border-blue-400"
                      } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="At least 8 characters"
                className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? `bg-gray-800 border-2 ${
                        errors.password ? "border-red-500" : "border-pink-500"
                      } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                    : `bg-gray-100 border-2 ${
                        errors.password ? "border-red-500" : "border-blue-400"
                      } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter password"
                className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? `bg-gray-800 border-2 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-pink-500"
                      } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                    : `bg-gray-100 border-2 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-blue-400"
                      } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-bold text-white transition-all transform mt-6 ${
                isDarkMode
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/50 disabled:opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50"
              } ${loading ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-6">
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className={`font-bold transition-colors ${
                  isDarkMode
                    ? "text-pink-400 hover:text-pink-300"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
