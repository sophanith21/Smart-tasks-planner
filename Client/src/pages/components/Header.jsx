import { useState } from "react";
import logo from "../../assets/Logo.jpg";
import { getAuthUser, logout } from "../../utils/auth";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext.jsx";
import api from "../../api/api.js";

export default function Header() {
  const [user, setUser] = useState(getAuthUser());
  const [isAccountClick, setIsAccountClick] = useState(false);
  const userAuth = useContext(AuthContext);

  const handleLogOut = () => {
    logout();
    setIsAccountClick(false);
    userAuth.setAuth(null);
  };

  const handleDeleteAccount = async () => {
    try {
      const result = await api.delete("/user");
      console.log(result);
      handleLogOut();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="header">
      <div className="flex items-center gap-5">
        <div className="logo">
          <img src={logo} alt="Smart Tasks Planner" />
        </div>
        <h1 className="text-2xl">Smart Tasks Planner</h1>
      </div>
      <div className="flex items-center gap-5 relative ">
        {isAccountClick && (
          <div className="absolute z-10 top-[120%] left-0 bg-amber-50 rounded-[0.5rem] flex flex-col w-fit p-2">
            <button
              className=" text-black pl-3 pr-3 pt-2 pb-2 hover:bg-amber-100  active:scale-95"
              onClick={() => {
                handleLogOut();
              }}
            >
              Log out
            </button>
            <button
              className=" text-black pl-3 pr-3 pt-2 pb-2 hover:bg-amber-100 active:scale-95"
              onClick={() => {
                handleDeleteAccount();
              }}
            >
              Delete Account
            </button>
          </div>
        )}
        <h1 className="text-2xl">{user.name}</h1>
        <button
          className="cursor-pointer active:scale-95"
          onClick={() => setIsAccountClick(!isAccountClick)}
        >
          <svg
            width="70"
            height="70"
            viewBox="0 0 79 79"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M39.5 78C60.763 78 78 60.763 78 39.5C78 18.237 60.763 1 39.5 1C18.237 1 1 18.237 1 39.5C1 60.763 18.237 78 39.5 78Z"
              stroke="white"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linejoin="round"
            />
            <path
              d="M65.1666 67.7333C65.1666 53.5576 53.6756 42.0667 39.4999 42.0667C25.3242 42.0667 13.8333 53.5576 13.8333 67.7333"
              stroke="white"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linejoin="round"
            />
            <path
              d="M39.5 42.0666C48.0052 42.0666 54.9 35.1718 54.9 26.6666C54.9 18.1614 48.0052 11.2666 39.5 11.2666C30.9948 11.2666 24.1 18.1614 24.1 26.6666C24.1 35.1718 30.9948 42.0666 39.5 42.0666Z"
              stroke="white"
              stroke-width="2"
              stroke-miterlimit="10"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
