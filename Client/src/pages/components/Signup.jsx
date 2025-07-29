import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setToken } from "../../utils/auth.js";
import { AuthContext } from "../../context/authContext.jsx";
import { jwtDecode } from "jwt-decode";
import api from "../../api/api.js";
import Footer from "./Footer.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassowrd, setConfirmedPassword] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    if (password === confirmedPassowrd) {
      try {
        const response = await api.post("/signup", {
          name,
          email,
          password,
        });

        if (response.data.token) {
          const token = response.data.token;
          setToken(token);

          const decoded = jwtDecode(token);
          setAuth({
            ...decoded,
            token,
          });

          navigate("/nav");
        } else {
          navigate("/login", { state: { email } });
        }
      } catch (err) {
        console.error("Registration error:", err);
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    } else {
      setError("Confirmed password does not match. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grow flex m-10 items-center justify-center bg-gradient-to-br from-white-50 to-black-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-200 space-y-4"
        >
          <h2 className="text-3xl font-semibold text-center text-gray-800">
            Sign Up
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center transition-all">
              {error}
            </p>
          )}

          <label className="text-black text-xl font-bold text-left w-full block ml-1.5">
            Name
          </label>
          <input
            type="text"
            placeholder="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

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

          <label className="text-black text-xl font-bold text-left w-full block ml-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="password"
            value={confirmedPassowrd}
            onChange={(e) => setConfirmedPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <p className="text-sm text-center text-gray-600 mt-2">
            <Link to="/login" className="text-blue-600 hover:underline">
              Already have an account?
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
