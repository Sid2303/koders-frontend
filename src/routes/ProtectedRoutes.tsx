import { Route, Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUser } from "../utils/auth";

import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import Admin from "../pages/Admin/Admin";
import NotFound from "../pages/NotFound/NotFound";
import TaskBoard from "../pages/TaskBoard/TaskBoard";

const RequireAuth = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const RequireAdmin = () => {
  const user = getUser();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

const ProtectedRoutes = () => {
  return (
    <>
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<TaskBoard />} />
      </Route>
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </>
  );
};

export default ProtectedRoutes;
