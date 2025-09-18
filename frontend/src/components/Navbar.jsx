import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo o título */}
        <Link to="/" className="font-bold text-lg">
          Tournaments App
        </Link>

        {/* Menú */}
        <div className="flex items-center space-x-4">
          {auth?.token ? (
            <>
              {/* Menú privado → visible para cualquier usuario logueado */}
              <Link to="/" className="hover:underline">
                Inicio
              </Link>
              <Link to="/teams" className="hover:underline">
                Equipos
              </Link>
              <Link to="/players" className="hover:underline">
                Jugadores
              </Link>
              <Link to="/matches" className="hover:underline">
                Partidos
              </Link>
              <Link to="/tournaments" className="hover:underline">
                Torneos
              </Link>
              <Link to="/standings" className="hover:underline">
                Tabla
              </Link>

              {/* Mostrar rol + Logout */}
              <span className="bg-gray-700 px-3 py-1 rounded text-sm">
                {auth.role === "admin" ? "Administrador" : "Usuario"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              {/* Menú público */}
              <Link to="/login" className="hover:underline">
                Ingresar
              </Link>
              <Link to="/register" className="hover:underline">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



