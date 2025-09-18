import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-600 text-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-lg">
          Tournaments App
        </Link>

        {/* Botón hamburguesa (solo visible en móviles) */}
        <button
          className="md:hidden flex items-center px-3 py-2 border rounded text-white border-white hover:bg-blue-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Menú principal */}
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } w-full md:flex md:items-center md:w-auto`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 mt-4 md:mt-0">
            {auth?.token ? (
              <>
                <Link
                  to="/"
                  className="hover:underline py-2 px-2 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  to="/teams"
                  className="hover:underline py-2 px-2 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Equipos
                </Link>
                <Link
                  to="/players"
                  className="hover:underline py-2 px-2 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Jugadores
                </Link>
                <Link
                  to="/matches"
                  className="hover:underline py-2 px-2 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Partidos
                </Link>
                <Link
                  to="/tournaments"
                  className="hover:underline py-2 px-2 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Torneos
                </Link>
                <Link
                  to="/standings"
                  className="hover:underline py-2 px-2 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Tabla
                </Link>

                {/* Botón Logout */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 mt-2 md:mt-0"
                >
                  Logout ({auth?.role === "admin" ? "Administrador" : "User"})
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:underline py-2 px-2 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:underline py-2 px-2 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
