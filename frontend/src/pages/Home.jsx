import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGuest = () => {
    setLoading(true);
    setTimeout(() => {
      // Proceed to Lab as guest
      navigate("/lab", { state: { guest: true } });
    }, 300);
  };

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      // Here you would normally show login/auth, for now just navigate
      navigate("/lab", { state: { guest: false } });
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Synthra Lab!</h1>
      <p className="text-lg mb-8">Choose how you want to start your experience:</p>

      <div className="flex flex-col sm:flex-row gap-6">
        <button
          onClick={handleGuest}
          className="bg-gray-300 text-gray-800 px-8 py-4 rounded hover:bg-gray-400"
        >
          Continue as Guest
        </button>
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-8 py-4 rounded hover:bg-blue-700"
        >
          Log In / Existing User
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
    </div>
  );
}