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
import "./App.css";
import PublicRoute from "./Component/PublicProtectedRoute/PublicRoute";
import JoinEvent from "./Component/Profile/JoinEvent";
import { useAuth } from "./Component/Context/AuthContext";
import AdminLayout from "./Admin/AdminLayout/AdminLayout";
import AEvents from "./Admin/AdminComponent/Pages/AdminEvents/AEvents";
import AUsers from "./Admin/AdminComponent/Pages/AdminUsers/AUsers";
import ACreateEvent from "./Admin/AdminComponent/Pages/AdminCreateEvent/ACreateEvent";
import AdminViewEvent from "./Admin/AdminComponent/Pages/AdminViewEvent/AdminViewEvent";

export default function App() {
  const { authUserData } = useAuth();

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
      {authUserData?.role === "ADMIN" && (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<AEvents />} />
            <Route path="/users" element={<AUsers />} />
            <Route path="/createevent" element={<ACreateEvent />} />
            <Route path="/viewevent/:viewId" element={<AdminViewEvent />} />
          </Route>
        </>
      )}
      {authUserData?.role === "USER" && (
        <>
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
            <Route path="/joinedevent" element={<JoinEvent />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/chat/:chatId" element={<ChatDetails />} />
          </Route>
        </>
      )}
    </Routes>
  );
}
