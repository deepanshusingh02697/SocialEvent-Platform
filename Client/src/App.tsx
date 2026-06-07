import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./Component/PublicProtectedRoute/ProtectedRoute";
import Login from "./Component/AuthComp/Login";
import Signup from "./Component/AuthComp/Signup";
import AuthLayout from "./Component/Layout/AuthLayout";
import MainLayout from "./Component/Layout/MainLayout";
import Profile from "./Component/Profile/Profile";
import EventDetails from "./Pages/EventDetails/EventDetails";
import ChatDetails from "./Component/ChatComp/ChatDetails";
import HomeEvent from "./Pages/HomeEvent";
import './App.css'
import PublicRoute from "./Component/PublicProtectedRoute/PublicRoute";

export default function App() {
  return (
    <Routes>
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
      </Route>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomeEvent />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/chat/:chatId" element={<ChatDetails />} />
      </Route>
    </Routes>
  );
}
