import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Protected = ({ children }) => {
  const { auth } = useAuth();

  // ❌ Si no hay token → mandar a login
  if (!auth?.token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Si está logueado → mostrar la página
  return children;
};

export default Protected;

