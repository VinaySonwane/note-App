import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
  // Check if the auth token exists in local storage
  const token = localStorage.getItem("authToken");

  // If token exists, allow access to the nested routes (e.g., Dashboard)
  // Otherwise, redirect to the sign-in page
  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
