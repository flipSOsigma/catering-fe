import { Outlet, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

const ProtectedRoutes = () => {
  const token = Cookies.get("token");
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_API_ROUTE}/auth/${token}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setIsAuthorized(data.status === 200);
      } catch (err) {
        console.error("Auth check failed", err);
        setIsAuthorized(false);
      }
    };

    checkAuth();
  }, [token]);

  if (isAuthorized === null) {
    return (
      <div>
        <Loading  />
      </div>
    )
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
