import { Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard/Dashboard";
import Profile from "../pages/Profile/Profile";
import Admin from "../pages/Admin/Admin";

const ProtectedRoutes = () => {
  return (
    <>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
    </>
  );
};

export default ProtectedRoutes;
