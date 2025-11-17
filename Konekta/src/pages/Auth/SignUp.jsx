import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../../services/authService";

const SignUp = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    return email.includes("@") && email.length > 5;
  };

  const validatePhone = (phone) => {
    return phone.replace(/\D/g, "").length === 10;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email)) newErrors.email = "Invalid email";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.dateOfBirth.trim())
      newErrors.dateOfBirth = "Date of birth is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await authService.signUp(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.dateOfBirth
      );

      if (response.tempPassword) {
        setTempPassword(response.tempPassword);
        setTimeout(() => {
          alert(`✅ Account created! Your temporary password is: ${response.tempPassword}`);
          navigate("/login");
        }, 2000);
      } else {
        navigate("/login");
      }

      setLoading(false);
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
        {isDarkMode ? (
          <span className="text-lg">☀️</span>
        ) : (
          <span className="text-lg">🌙</span>
        )}
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
              isDarkMode ? "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500" : "text-blue-600"
            }`}
          >
            Sign Up
          </h1>

          {tempPassword && (
            <div
              className={`mb-6 p-4 rounded-lg text-center ${
                isDarkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"
              }`}
            >
              <p className="font-bold mb-2">Account Created!</p>
              <p>Temp Password: {tempPassword}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
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

            {/* Last Name */}
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

            {/* Date of Birth */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? `bg-gray-800 border-2 ${
                        errors.dateOfBirth ? "border-red-500" : "border-pink-500"
                      } text-white focus:border-pink-400 focus:ring-pink-500/30`
                    : `bg-gray-100 border-2 ${
                        errors.dateOfBirth ? "border-red-500" : "border-blue-400"
                      } text-gray-800 focus:border-blue-400 focus:ring-blue-400/30`
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                className={`w-full px-4 py-3 rounded-full transition-all focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? `bg-gray-800 border-2 ${
                        errors.phone ? "border-red-500" : "border-pink-500"
                      } text-white placeholder-gray-500 focus:border-pink-400 focus:ring-pink-500/30`
                    : `bg-gray-100 border-2 ${
                        errors.phone ? "border-red-500" : "border-blue-400"
                      } text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400/30`
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 ${
                  isDarkMode ? "text-pink-400" : "text-blue-600"
                }`}
              >
                Email (for 2FA)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@gmail.com"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-full font-bold text-white transition-all transform mt-6 ${
                isDarkMode
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:shadow-lg hover:shadow-pink-500/50 disabled:opacity-50"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-50"
              } ${loading ? "cursor-not-allowed" : "cursor-pointer hover:scale-105"}`}
            >
              {loading ? "Creating Account..." : "Sign In"}
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
