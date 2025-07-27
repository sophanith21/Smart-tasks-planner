import History from "./pages/History";
import Tasks from "./pages/Tasks";
import WeeklySchedule from "./pages/WeeklySchedule";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/weekly-schedule" element={<WeeklySchedule />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </>
  );
}

export default App;
