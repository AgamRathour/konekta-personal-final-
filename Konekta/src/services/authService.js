const USERS_KEY = "konekta_users";
const SESSION_KEY = "konekta_user";
const SESSION_FLAG = "konekta_isLoggedIn";
const CURRENT_USER_KEY = "konekta_currentUser";

const getInitialUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

const createSession = (user) => {
  const safeUser = sanitizeUser(user);
  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  localStorage.setItem(SESSION_FLAG, "true");
  return safeUser;
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(SESSION_FLAG);
};

const updateStoredUser = (email, updates = {}) => {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  const users = getInitialUsers();
  const index = users.findIndex((u) => u.email === normalizedEmail);

  if (index === -1) {
    throw new Error("User not found");
  }

  const updatedUser = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  users[index] = updatedUser;
  saveUsers(users);

  return sanitizeUser(updatedUser);
};

const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36);
};

export const signUp = async ({
  firstName = "",
  lastName = "",
  email = "",
  password = "",
} = {}) => {

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    throw new Error("Email is required");
  }

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const users = getInitialUsers();
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error("An account already exists for this email");
  }

  const newUser = {
    id: generateId(),
    firstName: firstName?.trim() || "New",
    lastName: lastName?.trim() || "User",
    email: normalizedEmail,
    password,
    username: "",
    bio: "",
    profilePic: null,
    interests: [],
    isNewUser: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { user: sanitizeUser(newUser) };
};

export const login = async (email, password) => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !password) {
    throw new Error("Email and password are required");
  }

  const users = getInitialUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  const safeUser = createSession(user);
  return { user: safeUser };
};

export const setPassword = async (email, password) => {
  const normalizedEmail = normalizeEmail(email);

  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  const updatedUser = updateStoredUser(normalizedEmail, {
    password,
    isPasswordSet: true,
  });

  // If the session belongs to this user, refresh it
  const currentSession = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");
  if (currentSession.email === normalizedEmail) {
    createSession({ ...currentSession, ...updatedUser });
  }

  return { user: updatedUser };
};

export const getUserByEmail = async (email) => {
  const normalizedEmail = normalizeEmail(email);
  const users = getInitialUsers();
  const user = users.find((u) => u.email === normalizedEmail);

  if (!user) {
    throw new Error("User not found");
  }

  return { user: sanitizeUser(user) };
};

export const updateUser = async (updates = {}) => {
  const currentUser = JSON.parse(localStorage.getItem(SESSION_KEY) || "{}");

  if (!currentUser.email) {
    throw new Error("You must be logged in to update your profile");
  }

  const updatedUser = updateStoredUser(currentUser.email, updates);
  createSession({ ...currentUser, ...updatedUser });

  return { user: updatedUser };
};

export const logout = () => {
  clearSession();
};
