import History from "./pages/History";
import Landing from "./pages/Landing";
import Nav from "./pages/Nav";
import Login from "./pages/components/Login";
import Signup from "./pages/components/Signup";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./pages/components/ProtectedRoute";
import WeeklySchedule from "./pages/WeeklySchedule";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/nav"
          element={
            <ProtectedRoute>
              <Nav />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/weekly-schedule"
          element={
            <ProtectedRoute>
              <WeeklySchedule />
            </ProtectedRoute>
          }
        />
        \
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
