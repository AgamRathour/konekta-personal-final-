import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import * as authService from "../../services/authService";

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Check if username already exists
  const isUsernameExists = (name) => {
    const users = JSON.parse(localStorage.getItem("konekta_users") || "[]");
    const profiles = users.some(
      (user) => user.username?.toLowerCase() === name.toLowerCase()
    );
    return profiles;
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate fields
  const validateFields = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (isUsernameExists(username)) {
      newErrors.username = "Username already taken";
    } else {
      // Username is valid
    }

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle continue
  const handleContinue = async () => {
    if (!validateFields()) return;

    setLoading(true);

    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("konekta_user"));

      if (!currentUser || !currentUser.email) {
        throw new Error("User not found. Please log in again.");
      }

      // Call backend to update profile and mark as not new user
      await authService.updateUser(currentUser.email, {
        username: username.trim(),
        fullName: fullName.trim(),
        bio: bio.trim(),
        profilePic: profileImage || null,
        isNewUser: false, // Mark as existing user now that setup is complete
      });

      // Save profile to localStorage
      const userProfile = {
        username: username.trim(),
        fullName: fullName.trim(),
        bio: bio.trim(),
        profileImage: profileImage || null,
        completedAt: new Date().toISOString(),
      };

      // Update localStorage with complete user data
      const updatedUser = {
        ...currentUser,
        username: username.trim(),
        fullName: fullName.trim(),
        bio: bio.trim(),
        profilePic: profileImage || null,
        isNewUser: false,
      };

      localStorage.setItem("konekta_user", JSON.stringify(updatedUser));
      localStorage.setItem("konekta_user_profile", JSON.stringify(userProfile));
      localStorage.setItem("konekta_profile_setup_done", "true");

      setLoading(false);
      navigate("/profile");
    } catch (error) {
      console.error("Profile setup error:", error);
      setLoading(false);
      // Still navigate even if backend fails (use localStorage as fallback)
      navigate("/profile");
    }
  };

  // Handle skip
  const handleSkip = async () => {
    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem("konekta_user"));

      if (!currentUser || !currentUser.email) {
        throw new Error("User not found. Please log in again.");
      }

      const defaultUsername = `user_${Date.now()}`;

      // Call backend to update with default profile and mark as not new user
      await authService.updateUser(currentUser.email, {
        username: defaultUsername,
        fullName: currentUser.firstName || "User",
        bio: "",
        isNewUser: false,
      });

      const defaultProfile = {
        username: defaultUsername,
        fullName: currentUser.firstName || "User",
        bio: "",
        profileImage: null,
        completedAt: new Date().toISOString(),
      };

      // Update localStorage
      const updatedUser = {
        ...currentUser,
        username: defaultUsername,
        fullName: currentUser.firstName || "User",
        bio: "",
        isNewUser: false,
      };

      localStorage.setItem("konekta_user", JSON.stringify(updatedUser));
      localStorage.setItem(
        "konekta_user_profile",
        JSON.stringify(defaultProfile)
      );
      localStorage.setItem("konekta_profile_setup_done", "true");

      setLoading(false);
      navigate("/profile");
    } catch (error) {
      console.error("Skip profile setup error:", error);
      setLoading(false);
      navigate("/profile");
    }
  };

  const isFormValid = username.trim() && fullName.trim() && !errors.username;

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      } overflow-hidden`}
    >
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-black via-purple-900/20 to-black"
            : "bg-gradient-to-br from-white via-purple-100/20 to-white"
        }`}
      />

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-8 right-8 z-20 p-3 rounded-full transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-900 hover:bg-gray-800 text-yellow-400"
            : "bg-white hover:bg-gray-100 text-blue-600 shadow-lg"
        }`}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
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
        onClick={() => navigate("/onboarding")}
        className={`absolute top-8 left-8 z-20 flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
          isDarkMode
            ? "text-gray-300 hover:text-white hover:bg-gray-900"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-12 sm:mb-16 text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent font-poppins">
              Complete Your Profile
            </h1>
            <p
              className={`text-lg sm:text-xl transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Let's set up your profile to get started.
            </p>
          </div>

          {/* Profile Setup Form */}
          <div className="space-y-8 sm:space-y-10">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative group mb-4"
              >
                <div
                  className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDarkMode
                      ? "bg-gray-900 border-2 border-purple-500/50 hover:border-purple-500"
                      : "bg-white border-2 border-purple-400 hover:border-purple-600"
                  } overflow-hidden relative`}
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className={`w-12 h-12 sm:w-16 sm:h-16 ${
                        isDarkMode ? "text-gray-600" : "text-gray-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}

                  {/* Glow overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-full blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10`}
                  />

                  {/* Upload indicator */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-full transition-all duration-300 flex items-center justify-center">
                    <span
                      className={`text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        isDarkMode ? "text-white" : "text-gray-800"
                      }`}
                    >
                      Upload
                    </span>
                  </div>
                </div>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              <p
                className={`text-xs sm:text-sm transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Click to upload profile picture
              </p>
            </div>

            {/* Username Field */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors({ ...errors, username: "" });
                }}
                placeholder="Enter your username"
                className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-900 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    : "bg-white border border-purple-300 text-gray-900 placeholder-gray-400 focus:border-purple-600 focus:outline-none"
                } ${
                  errors.username
                    ? isDarkMode
                      ? "border-red-500/50"
                      : "border-red-400"
                    : ""
                }`}
              />
              {errors.username && (
                <p className="text-red-500 text-xs sm:text-sm mt-2">
                  {errors.username}
                </p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors({ ...errors, fullName: "" });
                }}
                placeholder="Enter your full name"
                className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-900 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    : "bg-white border border-purple-300 text-gray-900 placeholder-gray-400 focus:border-purple-600 focus:outline-none"
                } ${
                  errors.fullName
                    ? isDarkMode
                      ? "border-red-500/50"
                      : "border-red-400"
                    : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs sm:text-sm mt-2">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Bio Field */}
            <div>
              <label
                className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Short Bio (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value.slice(0, 150))}
                placeholder="Tell us about yourself (max 150 characters)"
                maxLength="150"
                rows="3"
                className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-2xl transition-all duration-300 resize-none ${
                  isDarkMode
                    ? "bg-gray-900 border border-purple-500/30 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
                    : "bg-white border border-purple-300 text-gray-900 placeholder-gray-400 focus:border-purple-600 focus:outline-none"
                }`}
              />
              <p
                className={`text-xs mt-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {bio.length}/150
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 sm:pt-8">
              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!isFormValid || loading}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform whitespace-nowrap ${
                  !isFormValid || loading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-pink-500 to-cyan-400 text-black hover:shadow-2xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? "Saving..." : "Continue"}
              </button>

              {/* Skip Button */}
              <button
                onClick={handleSkip}
                disabled={loading}
                className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 whitespace-nowrap ${
                  isDarkMode
                    ? "text-gray-400 hover:text-white hover:bg-gray-900/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/50"
                } disabled:opacity-50`}
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
