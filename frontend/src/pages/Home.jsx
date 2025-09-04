import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login with:', { email });
      const response = await login({ email, password });
      console.log('Login response:', response);
      
      if (!response.token) {
        throw new Error('No token received');
      }

      // Store token
      localStorage.setItem('token', response.token);
      console.log('Token stored successfully');

      // Navigate to lab
      navigate("/lab", { state: { guest: false } });
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error details:", err.response?.data);
      alert(err.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-6">Welcome to Synthra Lab!</h1>
      <p className="text-lg mb-8">Choose how you want to start your experience:</p>

      {!showLogin ? (
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={handleGuest}
            className="bg-gray-300 text-gray-800 px-8 py-4 rounded hover:bg-gray-400"
          >
            Continue as Guest
          </button>
          <button
            onClick={() => setShowLogin(true)}
            className="bg-blue-600 text-white px-8 py-4 rounded hover:bg-blue-700"
          >
            Log In / Existing User
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Back
            </button>
          </div>
        </div>
      )}

      {loading && <p className="mt-4 text-gray-500">Loading...</p>}
    </div>
  );
}