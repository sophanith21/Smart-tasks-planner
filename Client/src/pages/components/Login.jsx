import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { setToken } from "../../utils/auth";
import { AuthContext } from "../../context/authContext.jsx";
import { jwtDecode } from "jwt-decode";
import api from "../../api/api.js";
import Footer from "./Footer.jsx";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const autoLoginData = location.state;

  const { setAuth } = useContext(AuthContext);

  const [email, setEmail] = useState(autoLoginData?.email || "");
  const [password, setPassword] = useState(autoLoginData?.password || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth) {
      navigate("/tasks");
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (autoLoginData?.email && autoLoginData?.password) {
      handleSubmit(); // auto login
    }
  }, [autoLoginData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      setToken(response.data.token);
      const decodedUser = jwtDecode(response.data.token);
      setAuth(() => {
        return {
          ...decodedUser,
          token: response.data.token,
        };
      });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("login error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth) {
      const redirectPath = location.state?.from?.pathname || "/nav";
      navigate(redirectPath);
    }
  }, [auth]);

  return (
    <>
      <div className="grow m-10 flex items-center justify-center bg-gradient-to-br from-white-50 to-black-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-lg w-full max-w-200 space-y-4"
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Login
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center transition-all">
              {error}
            </p>
          )}

          <label className="text-black text-xl font-bold text-left w-full block ml-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="username@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <label className="text-black text-xl font-bold text-left w-full block ml-1.5">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-gray-600 mt-2">
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="text-sm text-center text-gray-600 mt-2">
            <Link to="/" className="text-blue-600 hover:underline">
              Home
            </Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}
