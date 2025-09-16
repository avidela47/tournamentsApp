import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [show, setShow] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 50) {
        setShow(false);
      } else {
        setShow(true);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  return (
    <nav
      className={`bg-blue-600 shadow-md fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <Link
            to="/"
            className="text-white font-bold text-lg hover:text-gray-200"
            onClick={() => setMenuOpen(false)}
          >
            🏆 Tournaments App
          </Link>

          <button
            className="text-white md:hidden text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✖" : "☰"}
          </button>

          <div className="hidden md:flex space-x-6">
            <Link to="/teams" className="text-white hover:text-gray-200">
              Equipos
            </Link>
            <Link to="/players" className="text-white hover:text-gray-200">
              Jugadores
            </Link>
            <Link to="/matches" className="text-white hover:text-gray-200">
              Partidos
            </Link>
            <Link to="/tournaments" className="text-white hover:text-gray-200">
              Torneos
            </Link>
            <Link to="/standings" className="text-white hover:text-gray-200">
              Posiciones
            </Link>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-blue-700 shadow-lg">
          <div className="flex flex-col space-y-2 px-4 py-3">
            <Link to="/teams" className="text-white" onClick={() => setMenuOpen(false)}>Equipos</Link>
            <Link to="/players" className="text-white" onClick={() => setMenuOpen(false)}>Jugadores</Link>
            <Link to="/matches" className="text-white" onClick={() => setMenuOpen(false)}>Partidos</Link>
            <Link to="/tournaments" className="text-white" onClick={() => setMenuOpen(false)}>Torneos</Link>
            <Link to="/standings" className="text-white" onClick={() => setMenuOpen(false)}>Posiciones</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


