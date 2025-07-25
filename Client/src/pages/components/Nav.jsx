import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Nav({ current }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <button
        type="button"
        className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl active:scale-95"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg
          width="30"
          height="31"
          viewBox="0 0 30 31"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75 15.5H26.25M3.75 8H26.25M3.75 23H26.25"
            stroke="#F3F3F3"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <h1>Home</h1>
      </button>
      {isOpen && (
        <div className="absolute bottom-full mb-2 ml-5 w-48 bg-white rounded-md shadow-lg">
          <ul className=" flex flex-col p-3">
            <li
              className={
                current == "tasks"
                  ? "flex justify-start text-black p-3 !rounded-[0.5rem] font-bold"
                  : "flex justify-start text-black p-3 !rounded-[0.5rem]"
              }
              onClick={() => {
                navigate("/tasks");
              }}
            >
              Tasks
            </li>
            <li
              className={
                current == "weekly-schedule"
                  ? "flex justify-start text-black p-3 !rounded-[0.5rem] font-bold"
                  : "flex justify-start text-black p-3 !rounded-[0.5rem]"
              }
              onClick={() => {
                navigate("/weekly-schedule");
              }}
            >
              Weekly Schedule
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
