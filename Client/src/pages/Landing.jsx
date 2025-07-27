import { useNavigate } from "react-router-dom";

import task from "../assets/task.svg";
import robot from "../assets/AI.svg";
import history from "../assets/history.svg";
import star from "../assets/star.svg";
import schedule from "../assets/calendar.svg";
import { isAuthenticated } from "../utils/auth";
import Footer from "./components/Footer";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-white text-gray-800 font-sans overflow-x-hidden">
        <main className="pt-[20px] flex flex-col gap-[20px] items-center justify-center">
          {/* Hero Section */}
          <section className="w-full px-6 py-20 md:py-18 text-center bg-black text-white flex flex-col md:flex-row justify-center items-center gap-4">
            <img
              src="../assets/Logo.jpg"
              alt="Smart Tasks Planner"
              className="w-[25rem] h-[25rem] rounded-3xl"
            />
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-white md:text-left">
                Plan Smarter, Not Harder.
                <br />
                Simplify Your To-Do List Today.
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-10 md:text-left">
                Our AI-powered planner offers suggestions to optimize your
                tasks. You can schedules your day, keep track and manage your
                time. Reclaim your time and achieve your goals faster.
              </p>
              {isAuthenticated() ? (
                <div className="flex items-center gap-4 justify-center mt-16">
                  <button
                    onClick={() => navigate("/nav")}
                    className="bg-white hover:bg-black text-black px-6 py-3 rounded"
                    style={{ backgroundColor: "white" }}
                  >
                    Explore
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4 justify-center mt-16">
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-white hover:bg-black text-black px-4 py-2 rounded"
                    style={{ backgroundColor: "white" }}
                  >
                    Login
                  </button>

                  <button
                    onClick={() => navigate("/signup")}
                    className="bg-black hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </section>
          {/* Features Section */}
          <section className="py-20 bg-gray-300 mb-5">
            <div className="mx-auto px-6">
              <div className="text-center mb-16 flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
                  Our Key Features
                </h2>
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                  Have problems managing your tasks?
                  <br />
                  Smart Tasks Planner helps you organize, prioritize, and
                  schedule your tasks with ease. Let our AI assist you in
                  planning your day and achieving your goals efficiently.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full mx-auto mb-4">
                    <img
                      src={task}
                      alt="Setting Tasks"
                      className="h-[2.5rem]"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Setting Tasks
                  </h4>
                  <p className="text-gray-600">
                    Easily set and manage your tasks with our intuitive
                    interface. Add, edit, and delete tasks with just a few
                    clicks.
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full mx-auto mb-4">
                    <img
                      src={star}
                      alt="Task Prioritzation"
                      className="h-[3rem]"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Task Prioritization
                  </h4>
                  <p className="text-gray-600">
                    Prioritize your tasks effectively. Our planner helps you
                    focus on what matters most by allowing you to set task
                    priorities.
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full mx-auto mb-4">
                    <img
                      src={robot}
                      alt="Ai Suggestions"
                      className="h-[2.5rem]"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    AI Suggestions
                  </h4>
                  <p className="text-gray-600">
                    Get AI-powered suggestions for task management. Our planner
                    analyzes your tasks and provides recommendations to optimize
                    your workflow.
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full mx-auto mb-4">
                    <img
                      src={schedule}
                      alt="Schedule Overview"
                      className="h-[2.5rem]"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Schedule Overview
                  </h4>
                  <p className="text-gray-600">
                    View your entire schedule at a glance. Our planner provides
                    a clear overview of your tasks and deadlines, helping you
                    stay organized.
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center h-16 w-16 bg-indigo-100 rounded-full mx-auto mb-4">
                    <img
                      src={history}
                      alt="Task History"
                      className="h-[2.5rem]"
                    />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    Task History
                  </h4>
                  <p className="text-gray-600">
                    Keep track of your completed tasks. Our planner maintains a
                    history of your tasks, allowing you to review your progress
                    and achievements.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer></Footer>
    </>
  );
}
