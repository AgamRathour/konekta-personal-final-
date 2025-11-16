const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Sign up a new user with email
 * @param {Object} userData - { firstName, lastName, email, password, phone, dateOfBirth }
 * @returns {Promise} - { success, user, token, message }
 */
export const signIn = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    // Store token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during signup",
    };
  }
};

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - { success, user, token, message }
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Store token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
};

/**
 * Google OAuth authentication
 * @returns {Promise} - { success, user, token, isNewUser, message }
 */
export const googleAuth = async () => {
  try {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Google authentication failed",
    };
  }
};

/**
 * Handle Google OAuth callback
 * @param {string} code - Authorization code from Google
 * @returns {Promise} - { success, user, token, isNewUser, message }
 */
export const handleGoogleCallback = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Google authentication failed");
    }

    // Store token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Google authentication failed",
    };
  }
};

/**
 * Send OTP to email
 * @param {string} email - User email
 * @returns {Promise} - { success, message }
 */
export const sendOTP = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send OTP");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to send OTP",
    };
  }
};

/**
 * Verify OTP
 * @param {string} email - User email
 * @param {string} otp - OTP code
 * @returns {Promise} - { success, user, token, message }
 */
export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "OTP verification failed");
    }

    // Store token
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "OTP verification failed",
    };
  }
};

/**
 * Verify email with token
 * @param {string} token - Verification token
 * @returns {Promise} - { success, message }
 */
export const verifyEmail = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Email verification failed");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Email verification failed",
    };
  }
};

/**
 * Get current user
 * @returns {Promise} - { success, user }
 */
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to fetch user",
    };
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
