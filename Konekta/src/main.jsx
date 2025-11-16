import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Initialize localStorage with test accounts on app load
if (!localStorage.getItem("konekta_users")) {
  const testUsers = [
    {
      firstName: "Agamjot",
      lastName: "Kaur",
      email: "agamjot@test.com",
      phone: "9876543210",
      dob: "2000-01-15",
      createdAt: new Date().toISOString(),
    },
    {
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      phone: "9123456789",
      dob: "1995-05-20",
      createdAt: new Date().toISOString(),
    },
  ];
  localStorage.setItem("konekta_users", JSON.stringify(testUsers));
  // Also set the first user as the default stored user for backwards compatibility
  localStorage.setItem("konekta_user", JSON.stringify(testUsers[0]));
  console.log("✅ Test accounts initialized in localStorage");
} else {
  console.log(
    "✅ Existing users found in localStorage:",
    localStorage.getItem("konekta_users")
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
