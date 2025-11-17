import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const isDark = localStorage.getItem("konekta_theme") !== "light";
    setIsDarkMode(isDark);

    // Get current user
    const currentUser = JSON.parse(localStorage.getItem("konekta_user"));
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("konekta_theme", newMode ? "dark" : "light");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim())
      newErrors.currentPassword = "Current password is required";

    if (!formData.newPassword.trim())
      newErrors.newPassword = "New password is required";
    else if (formData.newPassword.length < 6)
      newErrors.newPassword = "Password must be at least 6 characters";

    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setErrors({});

    try {
      // Call backend to set new password
      console.log("Setting password for:", user.email);
      const response = await authService.setPassword(user.email, formData.newPassword);
      
      console.log("Password set response:", response);

      setMessage("✅ Password changed successfully!");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });

      // Update user in localStorage to set isPasswordSet to true
      const updatedUser = { ...user, isPasswordSet: true };
      localStorage.setItem("konekta_user", JSON.stringify(updatedUser));

      setTimeout(() => {
        console.log("Navigating to onboarding...");
        navigate("/onboarding");
      }, 2000);

      setLoading(false);
    } catch (err) {
      console.error("Change password error:", err);
      setLoading(false);
      setErrors({
        general: err.message || "Failed to change password. Please try again.",
      });
    }
  };

  if (!user) return null;

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
        {isDarkMode ? (
          <span className="text-lg">☀️</span>
        ) : (
          <span className="text-lg">🌙</span>
        )}
      </button>

      <button
        onClick={() => navigate("/profile")}
        className={`fixed top-6 left-6 z-50 px-4 py-2 rounded-lg transition-all ${
          isDarkMode
            ? "bg-gray-800 hover:bg-gray-700 text-white"
            : "bg-gray-200 hover:bg-gray-300 text-gray-800"
        }`}
      >
        ← Back
      </button>

      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className={`w-full max-w-md rounded-3xl p-8 shadow-2xl transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-900 border-2 border-purple-500 shadow-purple-500/20"
              : "bg-white border-2 border-blue-400 shadow-blue-400/20"
          }`}
        >
          <h1
            className={`text-3xl font-bold text-center mb-2 transition-all ${
              isDarkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500" : "text-blue-600"
            }`}
          >
            Change Password
          </h1>

          <p
            className={`text-center mb-6 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Set your new permanent password
          </p>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center text-lg font-semibold ${
                isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}

          {errors.general && (
            <div
              className={`mb-6 p-4 rounded-lg text-center text-lg font-semibold ${
                isDarkMode ? "bg-red-900/30 text-red-400" : "bg-red-100 text-red-700"
              }`}
            >
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 pr-12 ${
                    isDarkMode
                      ? `bg-gray-800 border-2 ${
                          errors.currentPassword ? "border-red-500" : "border-pink-500"
                        } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                      : `bg-gray-100 border-2 ${
                          errors.currentPassword ? "border-red-500" : "border-blue-400"
                        } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("currentPassword")}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-pink-400"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {showPasswords.currentPassword ? (
                    <span className="text-lg">👁️</span>
                  ) : (
                    <span className="text-lg">👁️‍🗨️</span>
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 pr-12 ${
                    isDarkMode
                      ? `bg-gray-800 border-2 ${
                          errors.newPassword ? "border-red-500" : "border-pink-500"
                        } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                      : `bg-gray-100 border-2 ${
                          errors.newPassword ? "border-red-500" : "border-blue-400"
                        } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("newPassword")}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-pink-400"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {showPasswords.newPassword ? (
                    <span className="text-lg">👁️</span>
                  ) : (
                    <span className="text-lg">👁️‍🗨️</span>
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 pr-12 ${
                    isDarkMode
                      ? `bg-gray-800 border-2 ${
                          errors.confirmPassword ? "border-red-500" : "border-pink-500"
                        } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                      : `bg-gray-100 border-2 ${
                          errors.confirmPassword ? "border-red-500" : "border-blue-400"
                        } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                  }`}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isDarkMode
                      ? "text-gray-400 hover:text-pink-400"
                      : "text-gray-500 hover:text-blue-600"
                  }`}
                >
                  {showPasswords.confirmPassword ? (
                    <span className="text-lg">👁️</span>
                  ) : (
                    <span className="text-lg">👁️‍🗨️</span>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-bold text-white transition-all transform ${
                isDarkMode
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/50 disabled:opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50"
              } ${loading ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
