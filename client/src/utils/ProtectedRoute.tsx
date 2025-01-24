import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ReactNode, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("jwt");
  const { login } = useAuth();

  let decodedToken: { email: string; password: string } | null = null;

  if (token) {
    try {
      decodedToken = jwtDecode<{ email: string; password: string }>(token);
    } catch (error) {
      console.error("Invalid Token");
      localStorage.removeItem("jwt");
    }
  }

  useEffect(() => {
    const fetchUser = async (email: string, password: string) => {
      try {
        await axios.post(
          "https://blog-app-cf.hemilpatel3534.workers.dev/api/v1/user/signin",
          { email, password }
        );
        login();
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
    };

    if (decodedToken) {
      fetchUser(decodedToken.email, decodedToken.password);
    }
  }, [decodedToken]);

  if (!token || !decodedToken) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
