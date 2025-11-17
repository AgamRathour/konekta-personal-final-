// src/router/AppRouter.jsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Importing your pages
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import SignIn from "../pages/Auth/SignIn";
import Onboarding from "../pages/Auth/Onboarding";
import ProfileSetup from "../pages/ProfileSetup/ProfileSetup";
import Profile from "../pages/Profile/Profile";
import GoogleCallback from "../pages/Auth/GoogleCallback";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignIn />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Main Pages */}
        <Route path="/profile" element={<Profile />} />

        {/* Catch all - redirect to home or landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
