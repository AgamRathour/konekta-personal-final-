import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/home", icon: "home" },
    { label: "Search", path: "/search", icon: "search" },
    { label: "Explore", path: "/explore", icon: "explore" },
    { label: "Messages", path: "/messages", icon: "messages" },
    { label: "Notifications", path: "/notifications", icon: "notifications" },
    { label: "Settings", path: "/settings", icon: "settings" },
    { label: "Profile", path: "/profile", icon: "profile" },
  ];

  const isActive = (path) => location.pathname === path;

  const getIcon = (iconType) => {
    const iconProps = "w-6 h-6";
    switch (iconType) {
      case "home":
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        );
      case "search":
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "explore":
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M10.5 1.5H4.75A3.25 3.25 0 001.5 4.75v10.5A3.25 3.25 0 004.75 18.5h10.5a3.25 3.25 0 003.25-3.25V9.5M10.5 1.5V9.5M10.5 1.5h6.75m-6.75 8v9m6.75-9v9M1.5 9.5h17"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
            />
          </svg>
        );
      case "messages":
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
          </svg>
        );
      case "notifications":
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 100 12A6 6 0 0010 2zM9 9a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        );
      case "settings":
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "profile":
        return (
          <svg className={iconProps} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden p-2 rounded-lg bg-black text-white"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-black text-white transition-transform duration-300 ease-in-out z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Close Button (Mobile) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:hidden text-white"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Logo/Brand */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
            Konekta
          </h1>
        </div>

        {/* Menu Items */}
        <nav className="mt-8 space-y-4 px-4">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-pink-500/20 to-cyan-400/20 border border-pink-500/50 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-900"
                }`}
              >
                {getIcon(item.icon)}
                <span className="font-semibold">{item.label}</span>
                {active && (
                  <div className="ml-auto w-1 h-6 bg-gradient-to-b from-pink-500 to-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={() => {
              localStorage.removeItem("konekta_isLoggedIn");
              localStorage.removeItem("konekta_user");
              navigate("/");
            }}
            className="w-full px-4 py-3 rounded-lg bg-red-600/10 border border-red-600/50 text-red-500 hover:bg-red-600/20 transition-all font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
