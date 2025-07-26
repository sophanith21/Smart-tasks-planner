import logo from "../../assets/Logo.jpg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext.jsx";
import {
  isAuthenticated,
  logout,
  setToken,
  getAuthUser,
} from "../../utils/auth.js";
import profile from "../../assets/account.svg";
import { useEffect, useState, useContext } from "react";

export default function Header() {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuth(getAuthUser());
    } else {
      setAuth(null);
    }
  }, []);
  const handleLogout = () => {
    setAuth(null);
    logout();
    navigate("/login");
  };

  return (
    <div className='header'>
      <div className='logo'>
        <img src={logo} alt='Smart Tasks Planner' />
      </div>

      <h1 id='title'>Smart Tasks Planner</h1>

      {isAuthenticated() ? (
        <>
          <div className='flex items-center gap-4 ml-auto justify-end'>
            <span
              onClick={() => navigate("/nav")}
              className='hover:shadow-gray-300 text-white text-[0.85rem] px-4 py-2 rounded-2xl hover:cursor-pointer hover:bg-gray-200 hover:text-black hover:text-shadow-gray-200 transition-transform duration-200'>
              Features
            </span>
            <span
              onClick={() => navigate("/tasks")}
              className='hover:shadow-gray-300 text-white text-[0.85rem] px-4 py-2 rounded-2xl hover:cursor-pointer hover:bg-gray-200 hover:text-black hover:text-shadow-gray-200 transition-transform duration-200'>
              Tasks
            </span>
            <span
              onClick={() => navigate("/schedule")}
              className='hover:shadow-gray-300 text-white text-[0.85rem] px-4 py-2 rounded-2xl hover:cursor-pointer hover:bg-gray-200 hover:text-black hover:text-shadow-gray-200 transition-transform duration-200'>
              Schedule
            </span>
            <span
              onClick={() => navigate("/history")}
              className='hover:shadow-gray-300 text-white text-[0.85rem] px-4 py-2 rounded-2xl hover:cursor-pointer hover:bg-gray-200 hover:text-black hover:text-shadow-gray-200 transition-transform duration-200'>
              History
            </span>
            <div className='flex flex-col items-center p-4 pt-8'>
              <span className='text-[2rem] text-white-600'>{auth?.name}</span>
              <span
                onClick={handleLogout}
                className='hover:shadow-gray-300 text-white text-[0.85rem] px-4 py-2 rounded-3xl hover:cursor-pointer hover:bg-gray-200 hover:text-black hover:text-shadow-gray-200 transition-transform duration-200'>
                Logout
              </span>
            </div>
            <img
              src={profile}
              alt='Profile'
              className='w-[3.5rem] h-[3.5rem] mr-4'
            />
          </div>
        </>
      ) : (
        <div className='flex items-center gap-4 ml-auto justify-end'>
          <button
            onClick={() => navigate("/login")}
            className='bg-white-500 hover:bg-blue-600 text-white px-4 py-2 rounded'>
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className='bg-white-500 hover:bg-green-600 text-white px-4 py-2 rounded'>
            Sign Up
          </button>
        </div>
      )}
    </div>
  );
}
