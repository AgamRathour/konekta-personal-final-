// src/router/AppRouter.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importing your pages
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Auth/Login";
import SignIn from "../pages/Auth/SignIn";
import Onboarding from "../pages/Auth/Onboarding";
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
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
