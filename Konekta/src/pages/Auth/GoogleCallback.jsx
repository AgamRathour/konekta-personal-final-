import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processGoogleCallback = async () => {
      try {
        const token = searchParams.get("token");
        const isNewUser = searchParams.get("isNewUser") === "true";
        const errorParam = searchParams.get("error");

        if (errorParam) {
          setError(`Google authentication failed: ${errorParam}`);
          setLoading(false);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        if (!token) {
          setError("No authentication token received");
          setLoading(false);
          setTimeout(() => navigate("/login"), 3000);
          return;
        }

        localStorage.setItem("token", token);

        setTimeout(() => {
          if (isNewUser) {
            navigate("/onboarding", {
              state: { message: "Welcome to Konekta!" },
            });
          } else {
            navigate("/home");
          }
        }, 500);
      } catch (err) {
        console.error("Google callback error:", err);
        setError("An error occurred during authentication");
        setLoading(false);
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    processGoogleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/10 to-black pointer-events-none" />
      <div className="relative z-10 text-center max-w-md">
        {loading && !error && (
          <>
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 border-4 border-purple-500/20 border-t-pink-500 rounded-full animate-spin" />
            </div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">
              Signing you in...
            </h1>
            <p className="text-gray-400">Completing authentication</p>
          </>
        )}
        {error && (
          <>
            <div className="mb-6 text-6xl">⚠️</div>
            <h1 className="text-3xl font-bold mb-4 text-red-400">Failed</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
