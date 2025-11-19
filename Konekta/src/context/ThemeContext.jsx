import { useState, useEffect } from "react";
import ThemeContext from "./themeContext";

const getInitialTheme = () =>
  (typeof window !== "undefined" &&
    localStorage.getItem("konekta_theme") !== "light") ||
  false;

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("konekta_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

