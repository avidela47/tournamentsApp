import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// ✅ Protege rutas: si no hay token, redirige al login
const ProtectedRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
