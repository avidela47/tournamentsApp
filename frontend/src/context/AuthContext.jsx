import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    name: null,
    email: null,
  });

  // ✅ Cargar sesión desde localStorage al montar
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  // ✅ Guardar sesión en localStorage
  useEffect(() => {
    if (auth?.token) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth");
    }
  }, [auth]);

  // ✅ Login
  const login = (data) => {
    setAuth(data);
  };

  // ✅ Logout
  const logout = () => {
    setAuth({ token: null, role: null, name: null, email: null });
    localStorage.removeItem("auth");
  };

  // ✅ Borrar sesión al cerrar pestaña
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem("auth");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
