import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import * as authService from "../../services/authService";

const Onboarding = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    bio: "",
    frequency: "regular",
  });

  const interests = [
    "Music",
    "Sports",
    "Coding",
    "Gaming",
    "Movies",
    "Fitness",
    "Photography",
    "Art",
    "Travel",
    "Reading",
    "Dance",
    "Fashion",
    "Tech",
    "Anime",
    "Nature",
    "Cooking",
    "Design",
    "Business",
    "Science",
    "Memes",
  ];

  const frequencyOptions = [
    { value: "casual", label: "Casual User" },
    { value: "regular", label: "Regular User" },
    { value: "active", label: "Very Active" },
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0 && currentStep === 1) return;
    if (currentStep < 3) {
      handleNext();
      return;
    }

    setLoading(true);

    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("konekta_user"));

      if (!currentUser || !currentUser.email) {
        throw new Error("User not found. Please log in again.");
      }

      // Call backend to update interests
      await authService.updateUser(currentUser.email, {
        interests: selectedInterests,
      });

      // Update localStorage
      const userProfile = {
        ...currentUser,
        interests: selectedInterests,
        ...userData,
        onboarded: true,
      };

      localStorage.setItem("konekta_user", JSON.stringify(userProfile));
      localStorage.setItem(
        "konekta_interests",
        JSON.stringify(selectedInterests)
      );

      setLoading(false);
      navigate("/profile-setup");
    } catch (error) {
      console.error("Onboarding error:", error);
      setLoading(false);
      // Still navigate even if backend fails (use localStorage as fallback)
      navigate("/profile-setup");
    }
  };

  const handleSkip = () => {
    navigate("/profile-setup");
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "What are you interested in?";
      case 2:
        return "Tell us about yourself";
      case 3:
        return "How will you use Konekta?";
      default:
        return "Welcome to Konekta!";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Choose topics that interest you most.";
      case 2:
        return "Help others get to know you better.";
      case 3:
        return "We'll customize your experience accordingly.";
      default:
        return "Tell us what you like.";
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-6 right-6 z-20 p-2 rounded-full transition-all hover:scale-110 ${
          isDarkMode
            ? "bg-gray-900 text-yellow-400 hover:bg-gray-800"
            : "bg-white text-blue-600 shadow-md hover:shadow-lg"
        }`}
      >
        {isDarkMode ? "🌙" : "☀️"}
      </button>

      {/* Back Button */}
      <button
        onClick={currentStep === 1 ? () => navigate("/login") : handleBack}
        className={`absolute top-6 left-6 z-20 px-3 py-2 rounded-lg transition-all hover:scale-105 ${
          isDarkMode
            ? "text-gray-300 hover:text-white hover:bg-gray-900"
            : "text-gray-600 hover:text-black hover:bg-gray-200"
        }`}
      >
        ← Back
      </button>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-1 mb-8">
        <div
          className="h-1 bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        ></div>
      </div>

      {/* CONTENT WRAPPER */}
      <div className="flex flex-col items-center px-4 py-8 sm:py-10 md:py-12">
        {/* Animated Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center items-center space-x-2 mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  step === currentStep
                    ? "bg-gradient-to-r from-pink-500 to-cyan-400 scale-125"
                    : step < currentStep
                    ? "bg-green-500"
                    : isDarkMode
                    ? "bg-gray-700"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-pulse-slow">
            {getStepTitle()}
          </h1>
          <p
            className={`text-base mt-3 max-w-md mx-auto ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {getStepDescription()}
          </p>
        </div>

        {/* STEP 1: Interests */}
        {currentStep === 1 && (
          <div className="w-full max-w-4xl mb-8 animate-slide-up">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {interests.map((interest, index) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-black shadow-lg scale-105"
                        : isDarkMode
                        ? "bg-gray-900 border border-gray-700 hover:border-purple-500 hover:shadow-purple-500/20"
                        : "bg-white border border-gray-200 hover:border-purple-400 hover:shadow-lg"
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: Profile Info */}
        {currentStep === 2 && (
          <div className="w-full max-w-md space-y-6 mb-8 animate-slide-up">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Username
              </label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    : "bg-white border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                }`}
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Bio
              </label>
              <textarea
                value={userData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                  isDarkMode
                    ? "bg-gray-900 border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    : "bg-white border-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                }`}
                placeholder="Tell us something about yourself..."
              />
            </div>
          </div>
        )}

        {/* STEP 3: Usage Frequency */}
        {currentStep === 3 && (
          <div className="w-full max-w-md space-y-4 mb-8 animate-slide-up">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleInputChange("frequency", option.value)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-102 ${
                  userData.frequency === option.value
                    ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-black shadow-lg scale-102"
                    : isDarkMode
                    ? "bg-gray-900 border border-gray-700 hover:border-purple-500"
                    : "bg-white border border-gray-200 hover:border-purple-400"
                }`}
              >
                <div className="font-semibold">{option.label}</div>
                <div
                  className={`text-sm mt-1 ${
                    userData.frequency === option.value
                      ? "text-gray-800"
                      : isDarkMode
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {option.value === "casual" && "Check in occasionally"}
                  {option.value === "regular" && "Use a few times per week"}
                  {option.value === "active" && "Very active - daily user"}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* GUIDE TEXT */}
        <p
          className={`text-sm mb-6 animate-fade-in ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {currentStep === 1 &&
            (selectedInterests.length === 0
              ? "Select at least one interest to continue"
              : `${selectedInterests.length} interest${
                  selectedInterests.length !== 1 ? "s" : ""
                } selected`)}
          {currentStep === 2 && "Complete your profile information"}
          {currentStep === 3 && "Choose how you plan to use Konekta"}
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleContinue}
            disabled={
              (currentStep === 1 && selectedInterests.length === 0) || loading
            }
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              (currentStep === 1 && selectedInterests.length === 0) || loading
                ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-pink-500 to-cyan-400 text-black hover:scale-105 hover:shadow-lg transform"
            }`}
          >
            {loading
              ? "Saving..."
              : currentStep === 3
              ? "Get Started"
              : "Continue"}
          </button>

          <button
            onClick={handleSkip}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              isDarkMode
                ? "text-gray-300 hover:text-white hover:bg-gray-900 hover:scale-105"
                : "text-gray-700 hover:text-black hover:bg-gray-200 hover:scale-105"
            }`}
          >
            Skip
          </button>
        </div>
      </div>

      {/* Add these styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        .hover-scale-102:hover {
          transform: scale(1.02);
        }
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;
