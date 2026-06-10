import { Route, Routes } from "react-router-dom";

import Login from "./Component/AuthComp/Login";
import Signup from "./Component/AuthComp/Signup";

import AuthLayout from "./Component/Layout/AuthLayout";
import MainLayout from "./Component/Layout/MainLayout";

import Profile from "./Component/Profile/Profile";
import JoinEvent from "./Component/Profile/JoinEvent";
import EventDetails from "./Pages/EventDetails/EventDetails";
import ChatDetails from "./Component/ChatComp/ChatDetails";
import HomeEvent from "./Pages/HomeEvent";

import PublicRoute from "./Component/PublicProtectedRoute/PublicRoute";
import ProtectedRoute from "./Component/PublicProtectedRoute/ProtectedRoute";

import AdminLayout from "./Admin/AdminLayout/AdminLayout";
import AEvents from "./Admin/AdminComponent/Pages/AdminEvents/AEvents";
import AUsers from "./Admin/AdminComponent/Pages/AdminUsers/AUsers";
import ACreateEvent from "./Admin/AdminComponent/Pages/AdminCreateEvent/ACreateEvent";
import AdminViewEvent from "./Admin/AdminComponent/Pages/AdminViewEvent/AdminViewEvent";

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
          <ProtectedRoute allowedRole="USER">
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeEvent />} />
        <Route path="profile" element={<Profile />} />
        <Route path="joinedevent" element={<JoinEvent />} />
        <Route path="event/:eventId" element={<EventDetails />} />
        <Route path="chat/:chatId" element={<ChatDetails />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AEvents />} />
        <Route path="users" element={<AUsers />} />
        <Route path="createevent" element={<ACreateEvent />} />
        <Route path="viewevent/:viewId" element={<AdminViewEvent />} />
      </Route>
    </Routes>
  );
}
