import { Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import Admin from "../pages/Admin/Admin";
import NotFound from "../pages/NotFound/NotFound";
import TaskBoard from "../pages/TaskBoard/TaskBoard";

const ProtectedRoutes = () => {
  return (
    <>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/tasks" element={<TaskBoard />} />
    </>
  );
};

export default ProtectedRoutes;
