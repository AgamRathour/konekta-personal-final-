const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Sign up a new user
 * @param {Object} userData - { firstName, lastName, email, phone, dateOfBirth }
 * @returns {Promise} - Returns temporary password
 */
export const signUp = async (firstName, lastName, email, phone, dateOfBirth) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, phone, dateOfBirth }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Signup failed");
    }

    // Store user data
    localStorage.setItem("konekta_user", JSON.stringify(data.user));
    localStorage.setItem("konekta_isLoggedIn", "true");

    return data;
  } catch (error) {
    throw new Error(error.message || "An error occurred during signup");
  }
};

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password (temp or permanent)
 * @returns {Promise}
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

    // Store user data
    localStorage.setItem("konekta_user", JSON.stringify(data.user));
    localStorage.setItem("konekta_isLoggedIn", "true");

    return data;
  } catch (error) {
    throw new Error(error.message || "An error occurred during login");
  }
};

/**
 * Set permanent password
 * @param {string} email - User email
 * @param {string} password - New password
 * @returns {Promise}
 */
export const setPassword = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to set password");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "An error occurred");
  }
};

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise}
 */
export const getUserByEmail = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users/${email}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "User not found");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user");
  }
};

/**
 * Update user profile
 * @param {string} email - User email
 * @param {Object} updates - { username, fullName, bio, profilePic, interests, isNewUser }
 * @returns {Promise}
 */
export const updateUser = async (email, updates) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/users/${email}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Update failed");
    }

    // Update user data in localStorage
    localStorage.setItem("konekta_user", JSON.stringify(data.user));

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to update user");
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem("konekta_user");
  localStorage.removeItem("konekta_isLoggedIn");
};
