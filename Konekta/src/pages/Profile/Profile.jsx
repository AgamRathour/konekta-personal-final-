import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import * as authService from "../../services/authService";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [postImage, setPostImage] = useState(null);
  const [postCaption, setPostCaption] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Load profile and posts on mount
  useEffect(() => {
    // Get current logged-in user
    const currentUser = JSON.parse(localStorage.getItem("konekta_user"));
    
    if (!currentUser || !currentUser.email) {
      navigate("/login");
      return;
    }

    // Use current user data for profile
    const profileData = {
      email: currentUser.email,
      username: currentUser.username,
      fullName: currentUser.fullName || `${currentUser.firstName} ${currentUser.lastName}`,
      bio: currentUser.bio,
      profileImage: currentUser.profilePic,
      interests: currentUser.interests || [],
    };

    setProfile(profileData);
    setEditFormData(profileData);

    // Load posts for this user (keyed by email)
    const postsKey = `konekta_posts_${currentUser.email}`;
    const savedPosts = localStorage.getItem(postsKey);
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, [navigate]);

  // Check if username exists (excluding current username)
  const isUsernameExists = (username) => {
    if (username === profile?.username) return false;
    const users = JSON.parse(localStorage.getItem("konekta_users") || "[]");
    return users.some(
      (u) => u.username?.toLowerCase() === username.toLowerCase()
    );
  };

  // Handle edit profile image
  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditFormData((prev) => ({
          ...prev,
          profileImage: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate edit form
  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.username?.trim()) {
      newErrors.username = "Username is required";
    } else if (isUsernameExists(editFormData.username)) {
      newErrors.username = "This username already exists. Choose another one.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!validateEditForm()) return;

    setLoading(true);

    try {
      const { user } = await authService.updateUser({
        username: editFormData.username?.trim(),
        fullName: editFormData.fullName?.trim(),
        bio: editFormData.bio?.trim(),
        profilePic: editFormData.profileImage || profile.profileImage,
      });

      const refreshedUser =
        user || JSON.parse(localStorage.getItem("konekta_user"));

      const updatedProfile = {
        ...profile,
        username: refreshedUser?.username || editFormData.username?.trim(),
        fullName: refreshedUser?.fullName || editFormData.fullName?.trim(),
        bio: refreshedUser?.bio ?? editFormData.bio?.trim(),
        profileImage:
          refreshedUser?.profilePic ||
          refreshedUser?.profileImage ||
          editFormData.profileImage ||
          profile.profileImage,
      };

      const currentUserEmail = refreshedUser?.email || profile.email;
      if (currentUserEmail) {
        localStorage.setItem(
          `konekta_user_profile_${currentUserEmail}`,
          JSON.stringify(updatedProfile)
        );
      }

      setProfile(updatedProfile);
      setEditFormData(updatedProfile);
      setShowEditModal(false);
    } catch (error) {
      console.error("Save profile error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle post image upload
  const handlePostImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPostImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create new post
  const handleCreatePost = () => {
    if (!postImage) {
      setErrors({ post: "Please upload an image" });
      return;
    }

    setLoading(true);

    const currentUser = JSON.parse(localStorage.getItem("konekta_user"));

    const newPost = {
      id: Date.now(),
      image: postImage,
      caption: postCaption || "",
    };

    const updatedPosts = [newPost, ...posts];
    
    // Use email-based key for posts isolation
    const postsKey = `konekta_posts_${currentUser.email}`;
    localStorage.setItem(postsKey, JSON.stringify(updatedPosts));
    setPosts(updatedPosts);

    setPostImage(null);
    setPostCaption("");
    setShowPostModal(false);
    setLoading(false);
  };

  // Delete post
  const handleDeletePost = (postId) => {
    const currentUser = JSON.parse(localStorage.getItem("konekta_user"));
    
    const updatedPosts = posts.filter((p) => p.id !== postId);
    
    // Use email-based key for posts isolation
    const postsKey = `konekta_posts_${currentUser.email}`;
    localStorage.setItem(postsKey, JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const sidebarNavItems = [
    {
      label: "Home",
      to: "/",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l9-9 9 9v9a3 3 0 01-3 3H6a3 3 0 01-3-3z"
          />
        </svg>
      ),
    },
    {
      label: "Search",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <line
            x1="21"
            y1="21"
            x2="16.65"
            y2="16.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: "Explore",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="12 2 19 21 12 17 5 21 12 2" />
        </svg>
      ),
    },
    {
      label: "Reels",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="4" width="20" height="16" rx="4" />
          <polygon points="10 10 16 14 10 18 10 10" fill="white" />
        </svg>
      ),
    },
    {
      label: "Messages",
      to: "/messenger",
      badge: "8",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z" />
          <polyline points="3 8 12 13 21 8" />
        </svg>
      ),
    },
    {
      label: "Notifications",
      to: "/notifications",
      active: true,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ),
    },
    {
      label: "Create",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
  ];

  const renderSidebarLink = (item, index) => {
    const content = (
      <>
        {item.icon}
        <span>
          {item.label}
          {item.badge && (
            <span className="sidebar-badge">{item.badge}</span>
          )}
        </span>
      </>
    );

    if (item.to) {
      return (
        <Link
          key={`${item.label}-${index}`}
          to={item.to}
          className={`sidebar-link ${item.active ? "active" : ""}`}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={`${item.label}-${index}`}
        type="button"
        className="sidebar-link"
      >
        {content}
      </button>
    );
  };

  const sidebar = (
    <aside className="profile-sidebar">
      <Link to="/profile" className="sidebar-avatar-link">
        <img
          src="https://randomuser.me/api/portraits/women/44.jpg"
          alt="Profile avatar"
          className="sidebar-avatar"
        />
      </Link>
      <nav className="sidebar-nav">{sidebarNavItems.map(renderSidebarLink)}</nav>
    </aside>
  );

  const loadingView = (
    <div
      className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <p>Loading profile...</p>
    </div>
  );

  const profileView = (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900"
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
        className={`fixed top-8 right-8 z-50 p-3 rounded-full transition-all duration-300 ${
          isDarkMode
            ? "bg-gray-900 hover:bg-gray-800 text-yellow-400"
            : "bg-white hover:bg-gray-100 text-blue-600 shadow-lg"
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-12 sm:py-16">
        {/* Profile Header */}
        <div
          className={`rounded-3xl p-8 sm:p-12 mb-12 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-900/40 border border-purple-500/20"
              : "bg-white/40 border border-purple-300/30"
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div
                className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden transition-all duration-300 ${
                  isDarkMode
                    ? "border-4 border-purple-500/50"
                    : "border-4 border-purple-400"
                }`}
              >
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-300"
                    }`}
                  >
                    <svg
                      className="w-16 h-16 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                  @{profile.username}
                </h1>
                <p
                  className={`text-lg sm:text-xl mt-2 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {profile.fullName}
                </p>
              </div>

              {profile.bio && (
                <p
                  className={`max-w-2xl mb-6 transition-colors duration-300 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {profile.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex gap-8 mb-6">
                <div>
                  <p className="text-2xl font-bold">{posts.length}</p>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Posts
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">1.2K</p>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Followers
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold">456</p>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Following
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-pink-500 to-cyan-400 text-black hover:shadow-lg hover:shadow-pink-500/50 transition-all"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setShowPostModal(true)}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    isDarkMode
                      ? "border border-purple-500 text-purple-400 hover:bg-purple-500/10"
                      : "border border-purple-400 text-purple-600 hover:bg-purple-100"
                  }`}
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Posts</h2>
          {posts.length === 0 ? (
            <div
              className={`text-center py-12 rounded-2xl ${
                isDarkMode
                  ? "bg-gray-900/40 border border-purple-500/20"
                  : "bg-white/40 border border-purple-300/30"
              }`}
            >
              <p
                className={`transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                No posts yet. Create your first post!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative group rounded-2xl overflow-hidden"
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-80 object-cover"
                  />

                  {post.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <p className="text-white text-sm truncate">
                        {post.caption}
                      </p>
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-red-500/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-3xl p-8 max-w-2xl w-full transition-colors duration-300 ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Edit Profile
            </h2>

            {/* Profile Picture Edit */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Profile Picture
              </label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-32 h-32 rounded-full border-2 border-dashed transition-colors overflow-hidden ${
                  isDarkMode
                    ? "border-purple-500/50 hover:border-purple-500"
                    : "border-purple-400 hover:border-purple-600"
                }`}
              >
                {editFormData.profileImage ? (
                  <img
                    src={editFormData.profileImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full flex items-center justify-center ${
                      isDarkMode ? "bg-gray-800" : "bg-gray-200"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                  </div>
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleEditImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* Username Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                value={editFormData.username || ""}
                onChange={(e) => {
                  setEditFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }));
                  if (errors.username) setErrors({});
                }}
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 border border-purple-500/30 focus:border-purple-500 text-white"
                    : "bg-gray-100 border border-purple-400 focus:border-purple-600 text-gray-900"
                } focus:outline-none`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-2">{errors.username}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={editFormData.fullName || ""}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 border border-purple-500/30 focus:border-purple-500 text-white"
                    : "bg-gray-100 border border-purple-400 focus:border-purple-600 text-gray-900"
                } focus:outline-none`}
              />
            </div>

            {/* Bio Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Bio</label>
              <textarea
                value={editFormData.bio || ""}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    bio: e.target.value.slice(0, 150),
                  }))
                }
                maxLength="150"
                rows="3"
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 resize-none ${
                  isDarkMode
                    ? "bg-gray-800 border border-purple-500/30 focus:border-purple-500 text-white"
                    : "bg-gray-100 border border-purple-400 focus:border-purple-600 text-gray-900"
                } focus:outline-none`}
              />
              <p
                className={`text-xs mt-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {(editFormData.bio || "").length}/150
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-cyan-400 text-black hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-3xl p-8 max-w-2xl w-full transition-colors duration-300 ${
              isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Create Post
            </h2>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">
                Upload Image
              </label>
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => handlePostImageUpload(e);
                  input.click();
                }}
                className={`w-full h-40 rounded-xl border-2 border-dashed transition-colors flex items-center justify-center ${
                  isDarkMode
                    ? "border-purple-500/50 hover:border-purple-500 bg-gray-800"
                    : "border-purple-400 hover:border-purple-600 bg-gray-100"
                }`}
              >
                {postImage ? (
                  <img
                    src={postImage}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <svg
                      className="w-8 h-8 mx-auto mb-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                    <p className="text-sm">Click to upload image</p>
                  </div>
                )}
              </button>
            </div>

            {/* Caption */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">
                Caption (Optional)
              </label>
              <textarea
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value.slice(0, 300))}
                maxLength="300"
                rows="3"
                placeholder="Write a caption..."
                className={`w-full px-4 py-3 rounded-xl transition-all duration-300 resize-none ${
                  isDarkMode
                    ? "bg-gray-800 border border-purple-500/30 focus:border-purple-500 text-white placeholder-gray-500"
                    : "bg-gray-100 border border-purple-400 focus:border-purple-600 text-gray-900 placeholder-gray-600"
                } focus:outline-none`}
              />
              <p
                className={`text-xs mt-2 transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {postCaption.length}/300
              </p>
            </div>

            {errors.post && (
              <p className="text-red-500 text-sm mb-4">{errors.post}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleCreatePost}
                disabled={loading || !postImage}
                className="flex-1 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-cyan-400 text-black hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50"
              >
                {loading ? "Posting..." : "Post"}
              </button>
              <button
                onClick={() => {
                  setShowPostModal(false);
                  setPostImage(null);
                  setPostCaption("");
                  setErrors({});
                }}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const mainContent = profile ? profileView : loadingView;

  return (
    <div
      className={`profile-layout ${
        isDarkMode ? "theme-dark" : "theme-light"
      }`}
    >
      {sidebar}
      <div className="profile-main-wrapper">{mainContent}</div>
    </div>
  );
};

export default Profile;
