import robot from "../assets/robot.svg";
import calendar from "../assets/calendar.svg";
import { useNavigate } from "react-router-dom";
import api from "../api/api.js";
import { useEffect, useState } from "react";
import * as Body from "./components/Tasks-body.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

export default function Nav() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  // Sort tasks by deadline
  const getSortedTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      // Handle tasks with no deadline (push them to the end)
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;

      // Compare deadlines (closest first)
      return new Date(a.deadline) - new Date(b.deadline);
    });
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found, user not authenticated.");
          return;
        }
        setTasks([]);
        const res = await api.get("/tasks");
        // Sort the tasks immediately after fetching
        const sortedTasks = getSortedTasks(res.data);
        setTasks(sortedTasks);
        console.log("Tasks fetched and sorted:", sortedTasks);
      } catch (error) {
        console.error("Error in fetch data:", error);
      }
    };
    fetchTasks();
  }, []);

  const updateTaskSuggestTime = async (taskId, newDate) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, suggested_time: newDate } : task
      )
    );
    try {
      let updateField = { deadline: newDate };
      const result = await api.patch(`/tasks/${taskId}`, { updateField });
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Update a task field (e.g., title, description, importance)
  const handleTaskUpdate = async (taskId, updateField) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updateField } : task
      )
    );
    try {
      const result = await api.patch(`/tasks/${taskId}`, { updateField });

      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Update the deadline for a specific task
  const updateTaskDeadline = async (taskId, newDate) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, deadline: newDate } : task
      )
    );
    try {
      let updateField = { deadline: newDate };
      const result = await api.patch(`/tasks/${taskId}`, { updateField });
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove a task from the list and reassing IDs
  const removeTask = async (taskId) => {
    setTasks(
      (prevTasks) => prevTasks.filter((item) => item.id !== taskId) // Remove the task
      // Reassign sequential IDs
    );
    try {
      const result = await api.delete(`/tasks/${taskId}`);
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <Header></Header>
      <div className="h-fit flex flex-col gap-8 p-8  grow items-center justify-start  bg-gradient-to-br from-white-50 to-black-100">
        <div className="bg-[#EDEDED] p-8 rounded-2xl w-[78vw] min-w-173 h-fit overflow-hidden flex flex-col items-center justify-between">
          <h2
            className=" text-[2.25rem] font-bold  text-gray-800 text-left w-full hover:cursor-pointer hover:text-shadow-lg hover:text-shadow-white transition-transform duration-200 hover:text-gray-400"
            onClick={() => navigate("/tasks")}
          >
            Tasks Highlight
          </h2>
          <div className="bg-transparent h-[80%] overflow-y-auto flex flex-col gap-4 p-4 w-[120%]">
            {tasks.map((task) => (
              <Body.Task
                key={task.id}
                data={task}
                onEdit={handleTaskUpdate}
                updateDeadline={updateTaskDeadline}
                onRemove={removeTask}
                updateTaskSuggestTime={updateTaskSuggestTime}
              />
            ))}
          </div>
        </div>
        <div className="bg-transparent gap-8 rounded-lg w-[78vw] min-w-173 h-full flex items-center justify-center">
          <div
            className="bg-[#EDEDED]  p-8 rounded-2xl w-1/2   flex items-center justify-between hover:cursor-pointer hover:shadow-lg hover:shadow-gray-300 transition-transform duration-200 hover:scale-102"
            onClick={() => navigate("/weekly-schedule")}
          >
            <img src={calendar} alt="Schedule" className="w-[7rem] h-full " />
            <h2 className="text-3xl font-bold text-center text-gray-800 ">
              Weekly Schedule
            </h2>
          </div>
          <div
            className="bg-[#EDEDED] p-8 rounded-2xl w-1/2  flex items-center justify-between hover:cursor-pointer hover:shadow-lg hover:shadow-gray-300 transition-transform duration-200 hover:scale-102"
            onClick={() => navigate("/history")}
          >
            <img
              src={robot}
              alt="AI Suggestion History"
              className="w-[7rem] h-full"
            />
            <h2 className="text-3xl font-bold text-center text-gray-800 ">
              AI Suggestion History
            </h2>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}
