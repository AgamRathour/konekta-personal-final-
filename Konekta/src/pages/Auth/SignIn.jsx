import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('konekta_theme') !== 'light';
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('konekta_theme', newMode ? 'dark' : 'light');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ""));
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
    if (!formData.phone) newErrors.phone = "Phone is required";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Phone must be 10 digits";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.dob) newErrors.dob = "Date of birth is required";

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

    // Check if email already exists
    const usersData = localStorage.getItem("konekta_users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const emailExists = users.some((user) => user.email === formData.email);
      if (emailExists) {
        setLoading(false);
        setErrors({ email: "Account already exists. Please log in." });
        return;
      }
    }

    // Simulate email verification
    setTimeout(() => {
      // Store user data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        createdAt: new Date().toISOString(),
      };

      // Add to users array
      const usersData = localStorage.getItem("konekta_users");
      const users = usersData ? JSON.parse(usersData) : [];
      users.push(userData);
      localStorage.setItem("konekta_users", JSON.stringify(users));

      // Also set as current user for backwards compatibility
      localStorage.setItem("konekta_user", JSON.stringify(userData));

      setMessage("✅ Verification email sent! Redirecting to login...");
      setVerificationSent(true);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      setLoading(false);
    }, 1500);
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
            <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
              isDarkMode 
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" 
                : "bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
            } bg-clip-text text-transparent`}>
              Join Konekta
            </h1>
            <p className={`text-base ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              Create your account and start connecting
            </p>
          </div>

          {/* Form Container */}
          <div className="group relative mb-8">
            {/* Gradient Border Glow */}
            <div className={`absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
              isDarkMode 
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" 
                : "bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600"
            }`} />

            {/* Card */}
            <div className={`relative rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 ${
              isDarkMode 
                ? "bg-gray-900 border-purple-500/30" 
                : "bg-gray-50 border-purple-200"
            }`}>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={verificationSent || loading}
                      className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                        errors.firstName
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
                      disabled={verificationSent || loading}
                      className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                        errors.lastName
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
                    disabled={verificationSent || loading}
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

                {/* Phone */}
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone (10 digits)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={verificationSent || loading}
                    className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                      errors.phone
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
                  {errors.phone && (
                    <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    disabled={verificationSent || loading}
                    className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                      errors.dob
                        ? "border-red-500"
                        : isDarkMode 
                          ? "border-gray-700 focus:border-purple-500" 
                          : "border-gray-300 focus:border-purple-400"
                    } ${
                      isDarkMode 
                        ? "bg-gray-800 text-white" 
                        : "bg-white text-gray-900"
                    } border focus:outline-none focus:ring-2 ${
                      isDarkMode 
                        ? "focus:ring-purple-500/20" 
                        : "focus:ring-purple-400/20"
                    } disabled:opacity-50`}
                  />
                  {errors.dob && (
                    <p className="text-red-400 text-xs mt-1">{errors.dob}</p>
                  )}
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={verificationSent || loading}
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
                      isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                    }`}
                    disabled={verificationSent || loading}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    disabled={verificationSent || loading}
                    className={`w-full px-4 py-3 rounded-lg text-sm transition-all ${
                      errors.confirmPassword
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-3 transition ${
                      isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
                    }`}
                    disabled={verificationSent || loading}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Success Message */}
                {message && (
                  <div className={`p-3 rounded-lg border text-sm text-center ${
                    isDarkMode 
                      ? "bg-green-900/30 border-green-600 text-green-400" 
                      : "bg-green-100 border-green-400 text-green-700"
                  }`}>
                    {message}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || verificationSent}
                  className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed mt-4 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 hover:shadow-pink-600/50"
                      : "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                  }`}
                >
                  {loading
                    ? "Verifying Email..."
                    : verificationSent
                    ? "Redirecting..."
                    : "Sign Up"}
                </button>

                {/* Already have account */}
                <p className={`text-center text-sm mt-6 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
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
    </div>
  );
};

export default SignIn;