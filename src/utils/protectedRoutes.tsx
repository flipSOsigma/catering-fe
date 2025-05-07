import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  // const token = localStorage.getItem("token");
  const token = true
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;