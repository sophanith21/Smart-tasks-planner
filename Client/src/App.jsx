import "./App.css";
import Header from "./pages/components/Header";
import Body from "./pages/components/Body";
import Footer from "./pages/components/Footer";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/components/login.jsx";
import Signup from "./pages/components/Signup.jsx";
import Task from "./pages/Task.jsx";
import Nav from "./pages/Nav.jsx";
import ProtectedRoute from "./pages/components/ProtectedRoute.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route
        path='/nav'
        element={
          <ProtectedRoute>
            <Nav />
          </ProtectedRoute>
        }
      />
      <Route
        path='/tasks'
        element={
          <ProtectedRoute>
            <Task />
          </ProtectedRoute>
        }
      />
      <Route
        path='/schedule'
        element={<ProtectedRoute>{/* <Schedule /> */}</ProtectedRoute>}
      />
      \
      <Route
        path='/history'
        element={<ProtectedRoute>{/* <History /> */}</ProtectedRoute>}
      />
    </Routes>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <AppRoutes />
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
